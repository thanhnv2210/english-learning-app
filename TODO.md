# TODO — IELTS 6.5 Accelerator

> Design specs: [Discussion.md](./Discussion.md) | Sprint breakdown: [RoadMap.md](./RoadMap.md) | ADRs: [docs/adr/](./docs/adr/)

---

## Setup

- [x] Choose tech stack — Next.js 15, Tailwind CSS, Vercel AI SDK, PostgreSQL/Docker (see [ADR-0001](./docs/adr/0001-local-dev-environment-and-tech-stack.md))
- [x] Define repo strategy — pnpm monorepo, BFF pattern via Next.js API routes (see [ADR-0002](./docs/adr/0002-monorepo-single-repository.md))
- [x] Initialize pnpm workspace (`package.json` at root with `apps/*`, `packages/*`)
- [x] Scaffold `apps/web` — Next.js 15, TypeScript, Tailwind v4, App Router, Turbopack
- [x] Configure `apps/web/package.json` dev script to use `next dev --turbo`
- [x] Scaffold `packages/shared` — `package.json` + barrel export
- [x] Install Vercel AI SDK in `apps/web` (`ai` v4)
- [x] PostgreSQL — using local instance (ThanhNguyen@localhost:5432/ielts_dev); Docker mapped to 5433 to avoid conflict
- [x] Connect `apps/web/src/lib/db/` to local PostgreSQL via Drizzle ORM; schema pushed (users, sessions, feedbackResults)
- [x] Configure `.env.local` in `apps/web` (Claude API key, `DATABASE_URL`)
- [x] Set up ESLint (flat config) + Prettier across workspaces

---

## Phase 1 — IELTS Scorer MVP

*Goal: A working feedback loop graded against IELTS 6.5 criteria.*

- [ ] **1.1 — IELTS_Examiner prompt**: System prompt that enforces strict examiner protocol (no helping, enforced transitions, no feedback during session)
- [ ] **1.2 — TimerService**: Force part transitions; enforce 2-minute hard cutoff for Part 2
- [ ] **1.3 — FeedbackGenerator**: Post-session Band 6.5 vs 7.0 gap analysis across all four criteria
- [ ] **1.4 — Topic Injector**: Inject dev-friendly cue cards into Part 2 (e.g., "Describe a complex bug you solved")
- [ ] **Writing Task 2 interface**: Input for essays on tech topics with auto-scoring via the evaluation engine
- [ ] **Target Profile System**: `user_config.json` storing current goal (hardcoded to `IELTS_6.5` for now); schema must support `IELTS_7.5` and `Business_Fluent` later

---

## Phase 1.5 — Writing Auditor

*Goal: Precise writing feedback with band-level granularity.*

- [ ] **1.5 — Band delta prompt**: Prompt template that pinpoints exactly what must change to move from Band 6.5 → 7.0
- [ ] **1.6 — Vocabulary Replacer**: Detect dev-slang / informal language and suggest formal academic equivalents (AWL-aligned)
- [ ] **1.7 — Drafting Mode**: Outline critique flow — AI critiques structure/logic before the user writes the full essay
- [ ] **Multi-pass grading pipeline**:
  - Pass 1: Structural Audit (word count, paragraph count, task fulfillment)
  - Pass 2: Linguistic Analysis (simple vs academic vocabulary)
  - Pass 3: Scoring & Gap Analysis (per-criterion band scores)
- [ ] **JSON schema enforcement**: Standardize feedback output — `{ "criterion": "...", "score": 6.5, "suggestions": [...] }`

---

## Phase 2 — Speaking & Fluency

*Goal: Master the speaking interview with voice feedback.*

- [ ] **Speaking state machine**: `PART_1` → `PART_2_PREP` → `PART_2_SPEAK` → `PART_3` transitions with latency < 500ms for Parts 1 & 3
- [ ] **Whisper STT integration**: Transcribe responses and flag hesitation fillers (`um`, `ah`)
- [ ] **Per-turn evaluation**: Score Fluency (FC), Lexical Resource (LR), Grammatical Range (GRA) after each response
- [ ] **Vocabulary Builder**: Integrate Academic Word List (AWL) into chat sessions — real-time suggestions for technical discussions

---

## Phase 3 — Target Switcher

*Goal: Support different learning goals beyond IELTS 6.5.*

- [ ] **Dynamic scoring profiles**: Refactor evaluator to load prompt templates from `TargetProfile` (`IELTS_6.5`, `IELTS_7.5`, `Business_Fluent`)
- [ ] **Reading module**: Technical whitepaper passages with IELTS-style comprehension questions
- [ ] **Listening module**: Dev podcast audio clips with IELTS-style questions
- [ ] **Progress Analytics dashboard**: "Distance to 6.5" view across all four IELTS skills

---

## Phase 4 — Release & Community

- [ ] **Peer Review Mode**: Allow other users to review and comment on practice essays
- [ ] **Official mock integration**: Connect to IDP / British Council resources for final-stage testing
