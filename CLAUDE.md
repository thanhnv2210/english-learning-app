# CLAUDE.md

## Project Overview

**IELTS 6.5 Accelerator for Software Engineers** — AI-powered app helping senior engineers achieve IELTS Band 6.5 using technical topics. Evaluation engine uses Claude as a strict IELTS examiner grading against four criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

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
│   ├── (dashboard)/
│   │   ├── speaking/             # Part 1 topic selector; part2/; session/
│   │   ├── writing/              # Writing Task 2
│   │   ├── reading/
│   │   ├── listening/
│   │   ├── vocabulary/           # AWL browser
│   │   ├── collocations/
│   │   ├── analytics/
│   │   ├── essay-builder/        # generate + analyse + history
│   │   ├── wrong-decisions/      # mistake journal + AI analysis
│   │   ├── paraphrase/           # static guide, 4 skills × 3 levels
│   │   ├── history/
│   │   └── how-to-answer/        # static guides; listening/ subdirectory
│   ├── actions/                  # server actions (exam, reading, writing, etc.)
│   └── api/                      # thin route handlers → lib/ielts/
├── components/                   # shared React components
├── lib/
│   ├── ai-client.ts              # centralised Ollama client
│   ├── db/                       # PostgreSQL query helpers per feature
│   ├── guides/                   # static content (listening, reading, writing, speaking, paraphrase)
│   └── ielts/                    # core domain logic (prompts, scoring, types)
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

# Kill stale port and restart
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null
PORT=3000 pnpm dev:clean
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_BASE_URL` | `http://localhost:11434/api` | Ollama API endpoint |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b` | Model name |
| `NEXT_PUBLIC_OLLAMA_ENABLED` | `true` | Set `false` to disable AI routes; shows amber banner |
| `OLLAMA_DEBUG` | `false` | Set `true` to log full raw Ollama response |
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

### Collocations (`/collocations`)
- `POST /api/collocations/search`: by-word (up to 8) or by-phrase (single card)
- `collocation_entries` table: `id`, `phrase` (unique, lowercase), `type`, `skills` (jsonb), `examples` (jsonb), `rank`
- Phrase always lowercased before AI prompt and DB ops

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

### Static Guides
- **How to Answer** (`/how-to-answer`): all 4 skills; content in `lib/guides/<skill>.ts`
- **Paraphrase** (`/paraphrase`): 4 skills × 3 levels; content in `lib/guides/paraphrase.ts`
- **Topic Ideas** (`/topic-ideas`): 10 topics, static content in `lib/topic-ideas/index.ts`
- **AI Prompt Library** (`/prompt-library`): 5 prompts × 4 skills × 3 platforms; profile-aware interpolation

### Target Profile & Nav
- `updateTargetProfileAction` updates DB + `revalidatePath('/', 'layout')`
- `DashboardLayout` is `async` — fetches `getDefaultUser()`, passes `targetProfile` and `favouritePages` to `NavSidebar`
- Nav groups: **Practice** · **Tools** · **Guides** · standalone top (Dashboard) · standalone bottom (Analytics, Wrong Decisions, History, Settings)

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

### Shared Patterns
- `rank` column (1–5, default varies, CHECK constraint) on all library tables; sort: `rank DESC, createdAt DESC`
- `OLLAMA_DEBUG=true` → logs full raw model output; first diagnostic for `generateText` parse failures
- Safe colour getter: always look up AI-returned strings through a getter with fallback, never direct object indexing

## Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| 1 | Done | IELTS Scorer MVP |
| 1.5 | Done | Writing Auditor, multi-pass pipeline |
| 2 | Done | Speaking simulator, STT, filler detection |
| 3 | Done | Reading, Listening, Vocab Search, Writing Topics, How to Answer, Topic Ideas, Connected Speech, Collocations, Nav, Target Switcher, AI Prompts, Essay Builder, Analytics |
| 4 | In progress | Wrong Decision Log ✅ · Paraphrase Guide ✅ · Dark Mode ✅ · Favourite Pages ✅ · Question Anatomy · Peer Review · Mock Integration |
