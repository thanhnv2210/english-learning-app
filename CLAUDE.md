# CLAUDE.md

## Project Overview

**IELTS Accelerator** — AI-powered app helping professionals achieve their IELTS band target by leveraging their existing domain knowledge. Primary beachhead segment: software engineers (tech-domain content). Platform is domain-adaptive and designed to extend to healthcare, finance, education, and other professional segments. Evaluation engine uses Claude as a strict IELTS examiner grading against four criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Repo | pnpm monorepo (`apps/*`, `packages/*`) |
| Frontend + API | Next.js 15 App Router — `apps/web` |
| Styling | Tailwind CSS |
| AI/Streaming | Vercel AI SDK (`ai` package) |
| Database | PostgreSQL via Docker |

## Repository Structure

```
apps/web/src/
├── app/
│   ├── (auth)/
│   ├── (auth)/
│   ├── onboarding/               # first-login purpose/profile/skills collector
│   ├── (dashboard)/
│   │   ├── speaking/             # Part 1 topic selector; part2/; session/; drill/
│   │   ├── writing/              # Writing Task 2
│   │   ├── reading/
│   │   ├── listening/
│   │   ├── vocabulary/           # AWL browser; [id]/sentences/ for sentence library
│   │   ├── collocations/
│   │   ├── word-pairs/           # word pair browser + drill/
│   │   ├── analytics/
│   │   ├── essay-builder/        # generate + analyse + history
│   │   ├── wrong-decisions/      # mistake journal + AI analysis
│   │   ├── paraphrase/           # static guide, 4 skills × 3 levels
│   │   ├── history/              # exam + drill history; filter tabs per skill
│   │   ├── how-to-answer/        # static guides; listening/ subdirectory
│   │   └── projects/             # project list; [projectId]/ board · backlog · sprints; tickets/[key]/
│   ├── actions/                  # server actions (exam, reading, writing, projects, etc.)
│   └── api/                      # thin route handlers → lib/ielts/
├── components/
│   ├── projects/                 # kanban-board, ticket-form, ticket-badge
│   ├── admin/                    # activity-section (engagement dashboard)
│   └── games/                   # fill-blank-game, multiple-choice-game, flashcard-game
├── lib/
│   ├── ai-client.ts              # centralised Ollama client
│   ├── db/                       # PostgreSQL query helpers per feature
│   │   └── seeds/                # seed scripts (vocabulary, projects, etc.)
│   ├── guides/                   # static content (listening, reading, writing, speaking, paraphrase)
│   ├── ielts/                    # core domain logic (prompts, scoring, types)
│   ├── onboarding/               # suggestions.ts — suggested pages by profile + skill
│   └── projects/                 # constants.ts, epic-colors.ts, epics-context.tsx
└── types/
packages/shared/src/types/        # TargetProfile, FeedbackSchema
```

## Key Rules

**Route handlers** must be thin: validate input → call `lib/ielts/` → return response. No business logic in route files.

**AI client**: Never import `createOllama` directly. Always import from `@/lib/ai-client` and guard with `if (!OLLAMA_ENABLED) return ollamaDisabledResponse()` (routes) or `throw new Error(...)` (server actions).

**`'use server'` files** may only export async functions — no plain `const`, objects, or types. Move shared constants/types to a separate non-server file.

**`useOptimistic` + `revalidatePath`**: any mutation that must persist after optimistic state reverts **must** call `revalidatePath` in its server action.

**Server actions mutating layout data** (e.g. nav sidebar) **must** call `revalidatePath('/', 'layout')`.

**Delimiter-based AI output for long text**: routes generating 150+ word bodies use `---SECTION---` delimiters instead of JSON — small 7B models truncate or corrupt JSON at this length.

## Commands

```bash
# From repo root
pnpm install

# From apps/web/
pnpm dev                    # next dev --turbo
pnpm dev:clean              # rm -rf .next && next dev --turbo  ← use when cache is stale
PORT=3000 pnpm dev:clean    # always use this form to guarantee correct port
pnpm build
pnpm lint

# Schema & seeds
pnpm db:push
pnpm db:seed:domains
pnpm db:seed:vocabulary
pnpm db:seed:speaking-topics
pnpm db:seed:projects          # 22 IELTS Academic template tickets (idempotent)

# Kill stale port and restart
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null
PORT=3000 pnpm dev:clean
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | — | Anthropic API key; highest priority provider |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5-20251001` | Fast model for vocab/gen tasks |
| `ANTHROPIC_SCORING_MODEL` | `claude-sonnet-4-6` | Quality model for IELTS scoring/evaluation |
| `OPENROUTER_API_KEY` | — | OpenRouter key; used if no Anthropic key |
| `OPENROUTER_MODEL` | `google/gemma-3-12b-it:free` | OpenRouter model name |
| `OLLAMA_BASE_URL` | `http://localhost:11434/api` | Ollama endpoint (local dev fallback) |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b` | Ollama model name (local dev fallback) |
| `NEXT_PUBLIC_OLLAMA_ENABLED` | `true` | Set `false` to disable AI routes; shows amber banner |
| `OLLAMA_DEBUG` | `false` | Set `true` to log full raw AI response |
| `DATABASE_URL` | — | PostgreSQL connection string |

## Stale Data

| Cause | Fix |
|-------|-----|
| Stale `.next` cache | `pnpm dev:clean` |
| Missing `revalidatePath` in server action | Add `revalidatePath('/', 'layout')` after DB mutation |
| RSC fetch cache | Add `export const dynamic = 'force-dynamic'` or `noStore()` |

## Architecture

### IELTS Evaluation Engine
- System prompt: `IELTS_Examiner` — strict examiner, no helping, enforces transitions
- Prompts: `IELTS_PART1_EXAMINER_PROMPT(topic?)`, `IELTS_PART2_EXAMINER_PROMPT`, `IELTS_PART3_EXAMINER_PROMPT` in `lib/ielts/examiner/`
- `TargetProfile`: `IELTS_6.5` | `IELTS_7.5` | `Business_Fluent`

### Speaking (`/speaking`, `/speaking/part2`, `/speaking/session`)
- State machine: `idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended`
- STT: Chrome Web Speech API; filler detection post-session (`filler-detector.ts`)
- Topic selector: pinned chips + `···` dropdown; topic passed via `useChat body`

### Read-Aloud Drill (`/speaking/drill`)
- `drill_results` table: `id`, `userId`, `passageId`, `wordsSpoken` (jsonb), `accuracy`, `wpm`, `csAnalysis` (jsonb `DrillCsAnalysis | null`), `createdAt`
- `DrillCsAnalysis` type inline in `schema.ts`: `{ transformedText, instances: DrillCsInstance[] }`
- **Auto-save**: fires once on `handleStop()` when not in `practiceOnly` mode; no manual button; status shown as `Saving… → ✓ Saved`
- History view: `components/drill-history-view.tsx` — expandable cards with annotated transcript (orange=wrong, red=skipped), top mistakes + CS tips, full CS analysis

### Writing (`/writing`)
- Pass 1: `POST /api/writing/audit` · Pass 2: `POST /api/writing/vocabulary` · Pass 3: `POST /api/writing/score` (streaming)
- On-demand: `POST /api/writing/gap` · Drafting: `POST /api/writing/outline`
- Topic library: `writing_topics` table (`id`, `domain`, `prompt`, `taskType`, `rank`, `createdAt`)

### Reading (`/reading`)
- API: `POST /api/reading/passage` (uses `generateText`, not streaming)
- `reading_passages` table: `id`, `title`, `domain`, `passage`, `questions` (jsonb), `rank`
- 6 T/F/NG + 4 short-answer; side-by-side layout; global char offsets for highlights

### Listening (`/listening`)
- API: `POST /api/listening/script` (uses `generateText`)
- `listening_scripts` table: `id`, `domain`, `title`, `transcript` (jsonb `ListeningTurn[]`), `questions` (jsonb), `rank`
- Browser TTS; max 2 plays; note-completion form

### Vocabulary (`/vocabulary`)
- AWL browser; `POST /api/vocabulary/lookup` (informal→academic) · `POST /api/vocabulary/search`
- `vocabulary_words` table with `pronunciation` jsonb; pronunciation source: Free Dictionary API → AI fallback
- `user_skill_topics` table for pinned domain chips (lazy default seeding)
- UI toggles: Show descriptions · Show rank (default on); client-side `useState` — no server round-trip
- Pagination: `PaginationBar` component; page size 20; `components/pagination-bar.tsx`

### Collocations (`/collocations`)
- `POST /api/collocations/search`: by-word (up to 8) or by-phrase (single card)
- `collocation_entries` table: `id`, `phrase` (unique, lowercase), `type`, `skills` (jsonb), `examples` (jsonb), `rank`
- Phrase always lowercased before AI prompt and DB ops
- UI toggles: Show rank · Show skills (default on); pagination via `PaginationBar`

### Essay Builder (`/essay-builder`)
- Three tabs: Builder · History · Analyse
- AI output: delimiter format (`---TOPIC---` / `---TEXT---`)
- `ai_generated_content` table; `essay_builder_configs` table for selection persistence (composite PK: userId+domain+skill)
- 4-tier highlight: selected vocab (purple) · selected colloc (blue) · bonus vocab (green) · bonus colloc (amber)
- Writing Evaluator integration: runs full audit+score pipeline inline

### Connected Speech (`/connected-speech`)
- `POST /api/connected-speech/analyse` (uses `generateText`)
- Detects 7 phenomena; `getPhenomenonColor(p)` safe getter with gray fallback
- `connected_speech_analyses` table: `id`, `originalText`, `transformedText`, `instances` (jsonb), `phenomena` (jsonb)

### Wrong Decision Log (`/wrong-decisions`)
- `POST /api/wrong-decisions/analyse` → analytic + solution + question roles (delimiter format)
- `wrong_decision_logs` table: `id`, `userId`, `skill`, `sourceText`, `question`, `myThought`, `actualAnswer`, `analytic`, `solution`, `questionRoles` (jsonb), `createdAt`
- Question roles: `question-word`, `category`, `exclusion`, `hedge`, `relationship`, `target`, `time`

### Analytics (`/analytics`)
- Data: `mock_exams` where `feedback IS NOT NULL`; no new table
- `SkillStats`: `{ skill, sessionCount, avgBand, targetBand, gap, criteriaStats, recentSessions }`

### History (`/history`)
- Filter tabs: All · ★ Favorites · Speaking · Speaking_part2 · Writing · Read-Aloud Drill
- **All tab**: fetches both mock exams and drill records in parallel; displays `HistoryView` + labelled `DrillHistoryView` section
- **Drill tab** (`?skill=drill`): shows only `DrillHistoryView`
- Subtitle shows combined counts: `"N sessions · M drill results"` on All tab

### Word Pairs (`/word-pairs`, `/word-pairs/drill`)
- `word_pairs` table; browser at `/word-pairs` with Add form
- **Drill** (`/word-pairs/drill`): queue-based flashcard — front shows word A / word B + category badge; flip reveals explanation + examples
  - "Got it ✓" advances queue; "Review again ↩" re-queues at end, adds to `missedIds`
  - Summary screen: score %, missed chips, "Drill missed (N)" + "Restart all" buttons
  - `shuffle<T>()` helper; `DrillStage = 'drilling' | 'summary'`

### Onboarding (`/onboarding`)
- First-login flow gated by `middleware.ts` — redirects new users before dashboard access
- Collects: target profile (6.5 / 7.5 / Business), weak skills (multi-select), study reason
- `completeOnboardingAction` saves choices + marks `onboardingComplete = true` on user; redirects to dashboard
- `getSuggestedPages()` in `lib/onboarding/suggestions.ts` — returns relevant pages by profile + skill selection
- Schema: `onboardingComplete boolean` column on `users` table

### Static Guides
- **How to Answer** (`/how-to-answer`): all 4 skills; content in `lib/guides/<skill>.ts`
- **Paraphrase** (`/paraphrase`): 4 skills × 3 levels; content in `lib/guides/paraphrase.ts`
- **Topic Ideas** (`/topic-ideas`): 10 topics, static content in `lib/topic-ideas/index.ts`
- **AI Prompt Library** (`/prompt-library`): 5 prompts × 4 skills × 3 platforms; profile-aware interpolation

### Project Management (`/projects`, `/projects/[projectId]`)
Multi-project kanban tracker. Tables: `projects`, `project_epics`, `sprints`, `tickets`, `ticket_comments`.

- **Project list** (`/projects`): `project-list-client.tsx` — lists all projects, create new, switch active project, delete
- **Per-project routes** under `/projects/[projectId]/`:
  - **Board** (`/projects/[projectId]`): uses `getCurrentSprint` — shows active sprint, or falls back to most recent planning sprint with yellow banner. Sprint info bar shows name, goal, date range, color-coded countdown pill (blue→orange→red / overdue).
  - **Backlog** (`/projects/[projectId]/backlog`): backlog tickets + template tickets grouped by epic. Filter toggle: All / Custom. "Clone → Backlog" returns cloned ticket for instant optimistic append. System templates (isSystem=true) show no delete button.
  - **Sprints** (`/projects/[projectId]/sprints`): create (name, goal, start date, end date), edit inline, start (inline date confirm), complete (moves remaining tickets to next sprint or backlog), delete. Cards grouped: Active · Planning · Completed (collapsed).
- **Ticket detail** (`/projects/tickets/[key]`): inline edit title/description, field selectors for status/priority/type/epic/sprint, comments with optimistic add/delete.

**Custom Epics**: user-created epics stored in `project_epics` table. `EpicsProvider` context in `lib/projects/epics-context.tsx` merges system epics (`EPICS` from constants) + user epics; `useEpics()` hook for client components. `lib/projects/epic-colors.ts`: 8 color palette (`rose`, `cyan`, `teal`, etc.), `getEpicColor()` safe getter, `nextColorKey()` cycle helper.

**Key schema fields on `tickets`:**
- `epic`: system value (`writing | reading | listening | speaking | cross-skill`) or user-created epic slug
- `isTemplate`: clone-per-sprint reuse pattern (no junction table)
- `isSystem`: protected seed data — `deleteTicket()` skips rows where `isSystem = true`

**Client-safe constants** in `lib/projects/constants.ts`: `STATUSES`, `PRIORITIES`, `TYPES`, `EPICS` (each with label + color tokens). Never import from `lib/db/projects` in client components.

**All project actions** call `revalidatePath('/projects', 'layout')`. `createSprintAction` and `cloneTemplateAction` return the created record for optimistic UI.

**Seed**: `pnpm db:seed:projects` — 22 IELTS Academic templates tagged by epic. Idempotent: inserts new, patches `epic` on existing system records missing it.

### Target Profile & Nav
- `updateTargetProfileAction` updates DB + `revalidatePath('/', 'layout')`
- `DashboardLayout` is `async` — fetches `getDefaultUser()`, passes `targetProfile` and `favouritePages` to `NavSidebar`
- Nav groups: **Practice** · **Tools** · **Guides** · **Progress** (Projects, Analytics, Wrong Decisions, History) · Settings pinned at bottom

### Favourite Pages
- `favouritePages jsonb` column on `users` table (`string[]`, default `[]`)
- `toggleFavouritePage(userId, href)` in `lib/db/user.ts` — reads current array, toggles href, writes back
- `toggleFavouritePageAction(href)` in `app/actions/favourite-pages.ts` — server action; calls DB helper + `revalidatePath('/', 'layout')`
- `NavSidebar` accepts `favouritePages?: string[]` prop; uses `useState` for optimistic local toggle (immediate UI update, server action fires in background)
- **Expanded sidebar**: "★ Favourites" section at very top (amber label + divider) when any items are starred; each `NavLink` shows ☆ on hover → ★ amber when starred (absolute-positioned button, `group`/`group-hover` pattern)
- **Collapsed icon rail**: starred items shown first above a thin amber divider, then remaining items
- `ALL_NAV_ITEMS` flat array used to map `href → NavItem` for the Favourites section

### Dark Mode (Semantic Token System)
- All dashboard pages use semantic CSS tokens instead of hardcoded `gray-*` Tailwind classes
- Token mapping: `text-foreground`, `text-muted-foreground`, `text-faint`, `bg-card`, `bg-muted`, `bg-subtle`, `border-border`, `bg-input`
- Applied across: `listening-task.tsx`, `reading-task.tsx`, `speaking-chat.tsx`, `speaking-session.tsx`, `part2-chat.tsx`, `writing-task.tsx`, `question-anatomy-guide.tsx`, `wrong-decisions-view.tsx`, and all static guide/dashboard pages
- Exception: toggle knob stays `bg-white` (intentional — not a background surface)

### Vocabulary Sentence Library (`/vocabulary/[id]/sentences`)
- `word_sentences` table: `id`, `wordId`, `sentence`, `context` (speaking/writing/news/book/podcast/other), `createdAt`
- `sentence_practice_sessions` + `sentence_practice_results` for game tracking
- `SENTENCE_CONTEXTS` constant lives in `lib/ielts/vocabulary/sentence-contexts.ts` (client-safe); re-exported from `lib/db/word-sentences.ts`
- Shared `PracticeItem` type in `lib/ielts/vocabulary/practice-types.ts` — used by all 3 game components

### Practice Games (`/vocabulary/practice`, `/collocations/practice`)
- Three game modes: Fill-in-the-blank · Multiple Choice · Flashcard
- All games accept `PracticeItem[]` — source-agnostic (vocabulary sentences or collocation examples)
- Wrong answer tracking: most recent result per sentence; self-clearing when answered correctly
- Wrong answers practice hub at `/vocabulary/practice/wrong-answers?mode=<game>`

### Shared Patterns
- `rank` column (1–5, default varies, CHECK constraint) on all library tables; sort: `rank DESC, createdAt DESC`
- `OLLAMA_DEBUG=true` → logs full raw model output; first diagnostic for `generateText` parse failures
- Safe colour getter: always look up AI-returned strings through a getter with fallback, never direct object indexing
- Client/server separation: never import `lib/db/*` in client components — extract constants/types to a dedicated client-safe file under `lib/ielts/` or `lib/projects/`
- **`Module not found: Can't resolve 'fs'`** — means a `'use client'` component imports (directly or transitively) from `lib/db/*`, which pulls in `postgres` (a Node.js-only module). Fix: move the constants/types the client needs into a separate `lib/ielts/<feature>/constants.ts` file with no DB imports, then import from there in the client component. The DB file can re-export from the constants file for server-side convenience.

### Admin Activity Tracking (`/admin/engagement`)
- `getEngagementData()` in `lib/db/engagement.ts`: queries users + `sentencePracticeSessions` + `wrongDecisionLogs` for engagement tiers
- `getActivityEvents()`: returns flat `ActivityEvent[]` from 10 tables (speaking/writing exams, drills, practices, wrong decisions, reading/listening generated, vocab/colloc saved, word pairs)
- **Cost tier classification** for AI cost awareness:
  - `free` — no AI: `sentence_practice_sessions`
  - `low` — Haiku (~$0.001/call): `drill_results`, `user_vocabulary`, `user_collocations`, `word_pairs` (userId not null), `reading_passages` (isSystem=false), `listening_scripts` (isSystem=false)
  - `high` — Sonnet (~$0.01+/call): `mock_exams`, `wrong_decision_logs`
- **Not trackable per-user**: `ai_generated_content` (no userId), `connected_speech_analyses` (no userId) — future: add userId column
- `ActivitySection` (`components/admin/activity-section.tsx`): period toggle (week/month), cost tier summary cards, stacked bar chart (last 8 weeks / 6 months), action type horizontal bar breakdown, per-user expandable table with mini chart + action type pills
- `userUsage` table currently only tracks `writingScores` per month — could be extended to track all high-cost actions for billing/quota enforcement

## Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| 1 | Done | IELTS Scorer MVP |
| 1.5 | Done | Writing Auditor, multi-pass pipeline |
| 2 | Done | Speaking simulator, STT, filler detection |
| 3 | Done | Reading, Listening, Vocab Search, Writing Topics, How to Answer, Topic Ideas, Connected Speech, Collocations, Nav, Target Switcher, AI Prompts, Essay Builder, Analytics |
| 4 | Done | Wrong Decision Log ✅ · Paraphrase Guide ✅ · Dark Mode ✅ · Favourite Pages ✅ · Question Anatomy ✅ · Sentence Library ✅ · Practice Games ✅ · Project Management ✅ |
| 5 | Done | Multi-project support ✅ · Custom epics ✅ · Sprint completion ✅ · Word Pairs drill ✅ · Drill auto-save + CS analysis history ✅ · Vocabulary/Collocation rank+skill toggles + pagination ✅ · Onboarding flow ✅ · Admin activity tracking ✅ |
| 6 | Pending | Peer Review · Mock Integration · Epic filter on board · userId on ai_generated_content + connected_speech_analyses |
