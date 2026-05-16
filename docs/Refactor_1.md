# Refactor Sprint 1 — Long-term Improvement Plan

**Date:** 2026-05-16
**Status:** Pending review
**Author:** Claude Code (reviewed with codebase as of current state)

---

## Codebase Health Snapshot

| Metric | Count | Status |
|---|---|---|
| Page routes | 87 | Fine |
| Server action files | 30 | Fine |
| API routes | 35 | Fine |
| DB query files | 46 | Fine |
| `schema.ts` lines | 931 | Too large — needs splitting |
| Server actions without error handling | 26 / 30 | Critical gap |
| `console.log` calls in app code | 56 | Noisy — needs cleanup |
| View files over 900 lines | 4 | Needs splitting |
| Test files | 0 | No test infrastructure |

---

## Sprint 1 — Safety & Data Integrity

> Do these before adding any new feature. These are correctness issues, not style issues.

### 1.1 — Switch `db:push` to versioned migrations

**Risk:** HIGH
**Effort:** Medium
**File:** `apps/web/package.json`, `apps/web/drizzle.config.ts`

**Problem:**
`drizzle-kit push` applies schema changes directly to the database with no migration file, no history, and no rollback. Renaming a column silently drops and recreates it (data lost). Any failed mid-migration leaves the DB in a partial state with no recovery path.

**Solution:**
Switch to the `generate` + `migrate` workflow. Migration files live in `apps/web/drizzle/` and are committed to git before being applied.

```bash
# Add to package.json scripts:
"db:generate": "dotenv -e .env.local -- drizzle-kit generate"
"db:migrate":  "dotenv -e .env.local -- drizzle-kit migrate"
```

Migration path:
1. Run `db:generate` once on current schema — creates a baseline SQL file
2. All future schema changes: `db:generate` → review → `db:migrate`
3. Keep `db:push` as `db:push:dev` for local scratch databases only, clearly marked unsafe for production

---

### 1.2 — Add `userId` to `projects` and `ticket_completions`

**Risk:** HIGH
**Effort:** Small
**Files:** `lib/db/schema.ts`, all project-related DB query files

**Problem:**
The `projects`, `tickets`, `sprints`, and `ticket_completions` tables have no `userId` column. All rows are globally shared — any authenticated user can see and modify any project board, any ticket, any sprint. This is invisible today because the app has one active user. It will silently expose data the moment a second real user signs in.

**Solution:**

```ts
// schema.ts — add to projects table
userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })

// ticket_completions — unique constraint changes from (ticketId, completedDate)
// to (userId, ticketId, completedDate)
```

Once `projects.userId` exists, all downstream queries (`getSprints`, `getTickets`, board pages) filter through the project, so tickets and sprints are implicitly user-scoped without additional columns.

`key` uniqueness: change global unique constraint on `key` to `(userId, key)`.

**Migration note:** Backfill existing rows with admin user id before enforcing NOT NULL.

---

### 1.3 — Derive `plan-phases.ts` dates from DB sprint data

**Risk:** HIGH
**Effort:** Small
**Files:** `lib/ielts/plan-phases.ts`, `app/(dashboard)/learning-plan/learning-plan-view.tsx`

**Problem:**
`lib/ielts/plan-phases.ts` hardcodes study plan phase dates as static constants:

```ts
export const PLAN_START = new Date('2026-05-11')
export const TRIP_START  = new Date('2026-07-05')
```

These same dates also exist as `startDate` / `endDate` on sprint rows in the database. The two sources will silently diverge the moment a sprint date is updated through the Projects UI — the Today's Focus card will show the wrong phase and wrong tasks.

**Solution:**
Remove date constants from `plan-phases.ts`. The `/learning-plan` page already fetches from DB — extend it to also fetch IELTS project sprints and derive phase logic dynamically. The `PHASES` array (task lists, focus text, alert level) can remain as static content keyed by sprint name — only the dates need to come from the DB.

---

### 1.4 — Add `userId` to `ai_generated_content` and `connected_speech_analyses`

**Risk:** MEDIUM
**Effort:** Small
**Files:** `lib/db/schema.ts`, `lib/db/engagement.ts`

**Problem:**
Both tables store AI-generated content with no user attribution. Consequences:
- The engagement dashboard excludes both tables from per-user tracking
- Cannot show a user their own Essay Builder or Connected Speech history
- Cannot implement per-user quotas on expensive AI calls for these features

**Solution:**
Add `userId integer REFERENCES users(id) ON DELETE CASCADE` to both tables. Nullable initially (existing rows stay valid), backfill with admin user id, then enforce NOT NULL.

Update `getEngagementData()` and `getActivityEvents()` in `lib/db/engagement.ts` to include these tables in the cost-tier breakdown.

---

## Sprint 2 — Code Quality & Reliability

### 2.1 — Add error handling to 26 server actions

**Risk:** MEDIUM
**Effort:** Medium
**Files:** All files in `app/actions/` except `feedback.ts`, `partner-inquiry.ts`, `favourite-pages.ts`, `admin.ts`

**Problem:**
26 out of 30 server action files have no try/catch. When a DB call or external service fails, the error propagates as an unhandled exception. The client component receives no structured signal — it either crashes or shows a blank state with no explanation.

**Solution:**
Define a shared result type in `lib/actions.ts`:

```ts
export type ActionResult<T = void> =
  | { ok: true;  data: T }
  | { ok: false; error: string }
```

Adopt gradually — new actions use `ActionResult` from day one. Existing actions are migrated when they are next touched, not all at once. Do not refactor all 26 files in a single PR.

---

### 2.2 — Split `schema.ts` into domain files

**Risk:** MEDIUM
**Effort:** Medium
**Files:** `lib/db/schema.ts` (931 lines) → split into `lib/db/schema/` directory

**Problem:**
`schema.ts` covers 50+ tables across unrelated domains in a single 931-line file. Every new feature touches one file — merge conflicts are guaranteed. Relations defined at the bottom reference tables at the top, creating implicit ordering requirements.

**Solution:**
Split by domain. Drizzle supports importing table definitions from multiple files.

```
lib/db/schema/
  auth.ts        — users, sessions, feedbackResults
  content.ts     — vocabulary, collocations, reading, listening, writing
  practice.ts    — mockExams, drillResults, wrongDecisionLogs, connectedSpeech
  projects.ts    — projects, sprints, tickets, ticketComments, ticketCompletions
  user-data.ts   — userVocabulary, officialIeltsResults, sentencePractice, SRS
  admin.ts       — pageConfigs, userUsage, campaignConfigs, feedbacks, partnerInquiries
  index.ts       — re-exports all tables
```

`lib/db/index.ts` stays unchanged externally:
```ts
import * as schema from './schema/index'
export const db = drizzle(client, { schema })
```

All existing `import { users, mockExams } from '@/lib/db/schema'` imports continue to work.

**Do in a single PR with no logic changes — purely moving declarations. Run `pnpm exec tsc --noEmit` after to verify nothing broke.**

---

### 2.3 — Scope `revalidatePath` correctly

**Risk:** MEDIUM
**Effort:** Small
**Files:** `app/actions/admin.ts`, `app/actions/user.ts`

**Problem:**
5 server actions call `revalidatePath('/', 'layout')`. Only 3 actually change layout-level data (nav sidebar). The other 2 over-invalidate — forcing Next.js to re-render the full layout tree on the next request for every user hitting those actions.

**Actions that legitimately need `('/', 'layout')`:**
- `toggleFavouritePageAction` — changes nav sidebar favourites
- `updateTargetProfileAction` — changes nav sidebar target badge
- `completeOnboardingAction` — changes middleware gate + nav

**Actions that should use a narrower path:**
- `activateUserAction` in `admin.ts` — should use `revalidatePath('/admin/users')`
- `updateUserTierAction` in `admin.ts` — should use `revalidatePath('/admin/users')`

---

### 2.4 — Remove `console.log` from app and lib code

**Risk:** LOW
**Effort:** Small
**Files:** Various across `app/`, `lib/`

**Problem:**
56 `console.log` calls found in app code. Seeds are fine (intentional progress output). App and lib files log internal state to production logs, adding noise and potentially leaking sensitive data.

**Solution:**
- Seeds (`lib/db/seeds/`): keep as-is — intentional progress output
- App/lib: remove or replace with a no-op logger that respects `NODE_ENV`
- Keep `ollamaDebug()` wrapper which already gates on `OLLAMA_DEBUG=true`

---

## Sprint 3 — Large File Splitting

> These are not bugs — they are maintainability debt. Do after Sprint 1 and 2.

| File | Lines | Proposed sub-components |
|---|---|---|
| `essay-builder/essay-builder-view.tsx` | 1,309 | `EssayControls`, `EssayHighlighter`, `VocabPanel`, `ScorePanel` |
| `wrong-decisions/wrong-decisions-view.tsx` | 1,078 | `LogForm`, `LogEntry`, `AnalysisPanel` |
| `writing/writing-task.tsx` | 985 | `AuditPanel`, `VocabSuggestions`, `ScoreDisplay` |
| `speaking/drill/drill-view.tsx` | 929 | `DrillPlayer`, `DrillTranscript`, `DrillScore`, `CsAnalysis` |

**Rule:** One component per file. A file over 500 lines is a signal it is doing too much. Extract sub-components into a `components/` subfolder next to the page, not into the global `components/` directory unless they are reused elsewhere.

---

## Sprint 4 — Testing & Observability

> Do before multi-user public launch.

### 4.1 — Add `vitest` and test core domain logic

**Risk:** LOW now, HIGH after launch
**Effort:** Medium

No test infrastructure exists. The highest-risk code — IELTS scoring, band calculation, filler detection — has zero coverage. Regressions in scoring are invisible until a user notices a wrong band.

Start with pure functions in `lib/ielts/` — no DB or network dependencies, no mocks needed:

```
lib/ielts/plan-phases.test.ts
lib/ielts/filler-detector.test.ts
lib/ielts/examiner/*.test.ts
```

Add vitest:
```bash
pnpm add -D vitest @vitest/ui -w
```

Add to `package.json`:
```json
"test": "vitest run",
"test:ui": "vitest --ui"
```

### 4.2 — Switch DB connection driver to Neon serverless

**Risk:** LOW (current host), MEDIUM (if Vercel)
**Effort:** Small
**File:** `lib/db/index.ts`

**Problem:**
Current driver uses `postgres` (TCP). On Vercel serverless, each lambda invocation may open a new TCP connection — can exhaust PostgreSQL `max_connections`.

**Solution:**
```ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

No change needed if continuing to self-host on a persistent Docker server.

---

## Recommended Execution Order

```
Sprint 1 (all 4 items)
  → Sprint 2.1 (error handling)
    → Sprint 2.2 (schema split)
      → Sprint 2.3 + 2.4 (quick wins)
        → Sprint 3 (large file splits)
          → Sprint 4 (tests + DB driver)
```

Sprint 1 items are safety-critical — a second real user today exposes a data privacy issue.
Sprint 2.1 directly affects UX — silent server failures are invisible to users and developers.
Sprint 2.2 is a prerequisite for keeping future migrations manageable.

---

## What is NOT Changing

The following decisions are working well and should not be touched:

- Next.js App Router + server components — RSC model is correct; server/client boundary is consistently enforced
- Drizzle ORM — correct tool; query files are thin and readable
- Server actions as the mutation layer — clean, no separate API routes needed for internal mutations
- `lib/db/*` separation from client components — the `Module not found: fs` guard is documented and followed
- AI provider priority chain (Anthropic → OpenRouter → Ollama) — flexible and easy to extend
- Tailwind semantic token system (`text-foreground`, `bg-card`, etc.) — dark mode is consistent
