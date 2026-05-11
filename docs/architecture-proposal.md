# Architecture Proposal — English Learning App

**Date**: 2026-05-11
**Author**: Claude Code (reviewed with codebase as of commit 44bf010+)
**Status**: Pending review

This document captures architectural issues observed as the application grows in
complexity and recommends concrete changes. Items are ordered by risk severity.

---

## Context

Current scale:
- **~50 database tables** in a single 917-line `schema.ts`
- **30 DB query files** (~4 000 lines total)
- **28 server action files** (~1 264 lines total)
- **`drizzle-kit push`** used for all schema changes (no migration files)
- Primarily single-user today; multi-user role system in backlog

---

## Issue 1 — Replace `db:push` with versioned migrations

**Risk**: HIGH
**Effort**: Medium (one-time switch)

### Problem

`drizzle-kit push` applies schema changes directly to the database with no
migration file, no history, and no rollback path. Certain operations are
silently destructive:

- Renaming a column = drop the old column + create a new one (data lost)
- Changing a column type that requires a cast = potential silent truncation
- Any failed mid-migration leaves the DB in a partial state with no recovery

Every production deploy is currently a one-way operation with no audit trail.

### Recommendation

Switch to the `generate` + `migrate` workflow:

```bash
# Generate a SQL migration file from schema diff (committed to git)
pnpm db:generate

# Apply pending migrations deterministically
pnpm db:migrate
```

Migration files live under `apps/web/drizzle/` and are reviewed in pull
requests before being applied. This gives:

- Full history of every schema change
- Rollback by writing a down-migration
- CI can apply migrations before deploying, catching failures before they hit
  production traffic

### Package.json changes required

```json
{
  "db:generate": "dotenv -e .env.local -- drizzle-kit generate",
  "db:migrate":  "dotenv -e .env.local -- drizzle-kit migrate"
}
```

Remove `db:push` from scripts once the team is aligned on the new workflow.

### Migration path

1. Run `db:generate` once on the current schema — this creates a baseline SQL
   file that reflects the existing database state.
2. All future schema changes go through `db:generate` → review → `db:migrate`.
3. Keep `db:push` available under `db:push:dev` for local scratch databases
   only, clearly documented as unsafe for production.

---

## Issue 2 — Add `userId` to `projects`, and audit `ticket_completions`

**Risk**: HIGH
**Effort**: Small

### Problem

The project management tables (`projects`, `tickets`, `sprints`) have no
`userId` column. All rows are globally shared — any authenticated user can see
and modify any project board, any ticket, any sprint.

`ticket_completions` (added 2026-05-11) inherits this gap: completions are
scoped to a ticket but not to the user who logged them.

```
projects          -- no userId
tickets           -- userId not present (inherits from project, but no filter)
ticket_completions -- no userId
```

This is invisible today because the app has one active user. It will silently
expose data the moment a second real user logs in.

### Recommendation

**`projects` table**: add `userId integer NOT NULL` FK to `users`.

```ts
// schema.ts
export const projects = pgTable('projects', {
  id:        serial('id').primaryKey(),
  userId:    integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:      text('name').notNull(),
  key:       text('key').notNull(),          // unique per user, not globally
  // ...
})
```

Once `projects.userId` exists, all downstream queries (`getSprints`,
`getTickets`, `getCurrentSprint`, board pages) filter through the project,
so tickets and sprints are implicitly user-scoped without additional columns.

**`ticket_completions` table**: add `userId integer NOT NULL` FK. The unique
constraint changes from `(ticketId, completedDate)` to
`(userId, ticketId, completedDate)`.

**`key` uniqueness**: the `key` column (e.g. `IELTS`) is currently globally
unique. After adding `userId`, the unique constraint should be
`(userId, key)`.

### Migration note

This is a breaking schema change. Run with `db:migrate` (see Issue 1). Existing
rows should be backfilled with the admin user's id before the NOT NULL
constraint is enforced — include a data migration step in the migration file.

---

## Issue 3 — Derive `plan-phases.ts` dates from DB sprint data

**Risk**: HIGH
**Effort**: Small

### Problem

`lib/ielts/plan-phases.ts` hardcodes the study plan phase dates as static
constants:

```ts
export const PLAN_START = new Date('2026-05-11')
export const TRIP_START  = new Date('2026-07-05')
// ...
```

The same dates also exist as `startDate` / `endDate` on sprint rows in the
database. These two sources will silently diverge the moment a sprint date is
updated through the Projects UI — the `Today's Focus` card will show the wrong
phase, wrong tasks, and wrong countdown.

### Recommendation

Remove `plan-phases.ts` static date constants. The `/learning-plan` page
already fetches data from the DB — extend it to also fetch the IELTS project
sprints, then derive phase logic dynamically:

```ts
// page.tsx (server component)
const [results, ieltsSprints] = await Promise.all([
  getOfficialResults(user.id),
  getSprintsForProject('IELTS', user.id),   // keyed lookup
])
```

Pass `ieltsSprints` to `LearningPlanView`. The `TodayFocusCard` matches
`new Date()` against sprint `startDate` / `endDate` rows instead of hardcoded
constants.

The `PHASES` array in `plan-phases.ts` (task lists, focus text, alert level)
can remain as static content keyed by sprint name — only the _dates_ need to
come from the DB.

---

## Issue 4 — Split `schema.ts` into domain files

**Risk**: MEDIUM
**Effort**: Medium

### Problem

`schema.ts` is 917 lines covering 50+ tables across unrelated domains
(authentication, vocabulary, projects, AI content, analytics, ...). Symptoms
that will worsen:

- Every new feature touches one file — merge conflicts are guaranteed
- Navigating to a specific table definition requires scrolling or search
- Relations defined at the bottom of the file reference tables defined at the
  top, creating implicit ordering requirements
- The file will exceed 1 200 lines within 3–4 more features

### Recommendation

Split by domain. Drizzle supports importing table definitions from multiple
files as long as they are all passed into the `drizzle()` call via a merged
schema object.

```
lib/db/schema/
  auth.ts          -- users, sessions, feedbackResults
  content.ts       -- vocabulary, collocations, reading, listening, writing
  practice.ts      -- mockExams, drillResults, wrongDecisionLogs, connectedSpeech
  projects.ts      -- projects, sprints, tickets, ticketComments, ticketCompletions
  user-data.ts     -- userVocabulary, officialIeltsResults, sentencePractice, SRS
  admin.ts         -- pageConfigs, userUsage, campaignConfigs, feedbacks
  index.ts         -- re-exports all tables; this is what lib/db/index.ts imports
```

`lib/db/index.ts` stays unchanged externally:

```ts
import * as schema from './schema/index'
export const db = drizzle(client, { schema })
```

All existing `import { users, mockExams } from '@/lib/db/schema'` imports
continue to work because `schema/index.ts` re-exports everything.

### Suggested order

Do this in a single PR with no logic changes — purely moving declarations.
Run `pnpm exec tsc --noEmit` and `pnpm db:generate` (which should produce an
empty diff) to verify nothing broke.

---

## Issue 5 — Scope `revalidatePath` calls correctly

**Risk**: MEDIUM
**Effort**: Small

### Problem

22 server actions call `revalidatePath('/', 'layout')`. This invalidates the
entire application layout cache on every mutation — favourites toggle,
vocabulary save, collocation search, ticket update, etc.

Only a small number of actions actually change layout-level data:

| Action | Changes layout data? |
|--------|---------------------|
| `toggleFavouritePageAction` | Yes — nav sidebar favourites section |
| `updateTargetProfileAction` | Yes — nav sidebar target badge |
| `completeOnboardingAction` | Yes — middleware gate + nav |
| Everything else | No |

Over-broad invalidation is cheap today but becomes a performance bottleneck
under concurrent users because Next.js must re-render the full layout tree on
the next request.

### Recommendation

Replace `revalidatePath('/', 'layout')` with the minimum necessary path in
every action that does not actually modify nav data:

```ts
// Before (in e.g. saveOfficialResultAction)
revalidatePath('/', 'layout')

// After
revalidatePath('/learning-plan')
```

Actions that genuinely affect the nav sidebar (`toggleFavouritePageAction`,
`updateTargetProfileAction`) keep `revalidatePath('/', 'layout')`.

A simple grep will identify every call site:

```bash
grep -rn "revalidatePath" apps/web/src/app/actions/
```

---

## Issue 6 — Add `userId` to `ai_generated_content` and `connected_speech_analyses`

**Risk**: MEDIUM
**Effort**: Small
**Note**: Already flagged in CLAUDE.md as a known gap

### Problem

These two tables store AI-generated content with no user attribution:

```ts
export const aiGeneratedContent = pgTable('ai_generated_content', {
  id:        serial('id').primaryKey(),
  // no userId
  domain:    text('domain').notNull(),
  // ...
})

export const connectedSpeechAnalyses = pgTable('connected_speech_analyses', {
  id:           serial('id').primaryKey(),
  // no userId
  originalText: text('original_text').notNull(),
  // ...
})
```

Consequences:
- The engagement dashboard excludes both tables from per-user tracking
- Cannot show a user their own Essay Builder or Connected Speech history
- Cannot implement per-user quotas on expensive AI calls for these features

### Recommendation

Add `userId integer REFERENCES users(id) ON DELETE CASCADE` to both tables.
Nullable initially (existing rows stay valid), then backfill with the admin
user id, then enforce NOT NULL.

Update `getEngagementData()` and `getActivityEvents()` in
`lib/db/engagement.ts` to include these tables in the cost-tier breakdown.

---

## Issue 7 — Standardise server action return types

**Risk**: LOW–MEDIUM
**Effort**: Small

### Problem

Server actions currently have three different return conventions:

```ts
// Pattern A: returns void, throws on error
export async function saveOfficialResultAction(formData: FormData) {
  // throws if invalid
}

// Pattern B: returns data directly
export async function toggleTicketCompletionAction(...): Promise<string[]> {
  return updated
}

// Pattern C: implicit void, no error signal to client
export async function deleteOfficialResultAction(id: number) {
  await deleteOfficialResult(id)
  revalidatePath('/learning-plan')
}
```

Client components cannot distinguish a successful void from a failed void.
Error boundaries catch thrown errors but give no structured message.

### Recommendation

Define a shared result type in `lib/actions.ts`:

```ts
export type ActionResult<T = void> =
  | { ok: true;  data: T }
  | { ok: false; error: string }
```

Adopt gradually — start with new actions and migrate existing ones when
they are next touched. Do not refactor all 28 action files at once.

---

## Issue 8 — Add test coverage for core domain logic

**Risk**: LOW (now), HIGH (later)
**Effort**: Medium

### Problem

There is no test infrastructure. The highest-risk code — IELTS scoring,
band calculation, phase date logic, filler detection — has zero test coverage.
Regressions in scoring are invisible until a user notices a wrong band.

### Recommendation

Start with pure functions in `lib/ielts/` — they have no DB or network
dependencies and can be tested without mocking:

```
lib/ielts/plan-phases.test.ts    -- getCurrentPhaseStatus edge cases
lib/ielts/filler-detector.test.ts
lib/ielts/examiner/*.test.ts     -- prompt construction
```

Add `vitest` (compatible with the existing TypeScript setup, no Babel needed):

```bash
pnpm add -D vitest @vitest/ui -w
```

A CI step running `pnpm test` before deploy catches regressions before they
ship.

---

## Issue 9 — DB connection driver for serverless

**Risk**: LOW (current host), MEDIUM (if moving to Vercel/serverless)
**Effort**: Small

### Problem

`lib/db/index.ts` uses `postgres` (node-postgres compatible TCP driver) with
a dev-mode singleton to avoid connection exhaustion during HMR. This is
correct for a long-running Node.js server.

On Vercel serverless or edge functions, each lambda invocation may open a new
TCP connection. With ~50 tables and active use, this can exhaust PostgreSQL's
`max_connections` (default 100 on many managed hosts).

### Recommendation

If hosting moves to Vercel + Neon (already likely given the `DATABASE_URL` in
`.env.local`), switch to Neon's HTTP driver for serverless routes:

```ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

Alternatively, use Neon's connection pooling endpoint (append `?pgbouncer=true`
to the connection string) which routes through PgBouncer without changing the
driver.

No change needed if self-hosting on a persistent server (Docker + PostgreSQL),
as the current singleton pattern is optimal for that environment.

---

## Decision matrix

| # | Issue | Risk | Effort | Do before next feature? |
|---|-------|------|--------|------------------------|
| 1 | db:push → migrations | HIGH | Medium | Yes |
| 2 | Add userId to projects/completions | HIGH | Small | Yes |
| 3 | plan-phases.ts → derive from DB | HIGH | Small | Yes |
| 4 | Split schema.ts by domain | MEDIUM | Medium | Next refactor window |
| 5 | Scope revalidatePath correctly | MEDIUM | Small | Next refactor window |
| 6 | Add userId to AI content tables | MEDIUM | Small | Before multi-user launch |
| 7 | Standardise action return types | LOW-MED | Small | Adopt on next new action |
| 8 | Add test coverage | LOW now | Medium | Before multi-user launch |
| 9 | Serverless DB driver | LOW now | Small | Before moving to Vercel |

---

## What is NOT changing

The following decisions are working well and should not be changed:

- **Next.js App Router + server components** — the RSC model is the right fit;
  the server/client boundary is consistently enforced
- **Drizzle ORM** — correct tool; the query files are thin and readable
- **Server actions as the mutation layer** — clean, no separate API routes
  needed for internal mutations
- **`lib/db/*` separation from client components** — the `Module not found: fs`
  guard is documented and followed
- **AI provider priority chain** (Anthropic → OpenRouter → Ollama) — flexible
  and easy to extend
- **Tailwind semantic token system** (`text-foreground`, `bg-card`, etc.) —
  dark mode is consistent
