# TODO — IELTS 6.5 Accelerator

> Design specs: [Discussion.md](./Discussion.md) | Sprint breakdown: [RoadMap.md](./RoadMap.md) | ADRs: [docs/adr/](./docs/adr/) | PDRs: [docs/pdr/](./docs/pdr/)

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

- [x] **1.1 — IELTS_Examiner prompt**: `src/lib/ielts/examiner/prompt.ts` — strict Part 1 protocol; `part2-prompt.ts` — Part 2 + cue card generation + feedback system prompt
- [x] **1.2 — TimerService**: `src/lib/ielts/timer/use-timer.ts` — hook with start/stop/addTime/toggleEnabled; `TimerControl` (live display + toggle); `TimerAlertModal` (fires at 0 → "Add 2 min" or "Move to Part 3")
- [x] **1.3 — FeedbackGenerator**: `POST /api/feedback` — post-session band scores (numbers) + keyPoints per criterion vs target profile; inline on same page (overrides previous); popup modal from History "View Feedback" button
- [x] **1.4 — Topic Injector / Part 2 Simulator**: `generateAndSaveCueCard` server action — AI generates tech-themed cue card, saves to `cue_cards` table; separate `/speaking/part2` route with 1-min prep + 2-min speak timer
- [x] **Writing Task 2 interface**: Domain selector → AI-generated essay topic → textarea → streaming evaluation (band scores via `POST /api/writing/evaluate`); saved to history
- [x] **Target Profile System**: `users.targetProfile` in DB (upserted via `getDefaultUser()`); `parseTargetBand()` parses `IELTS_6.5` → `6.5`; `targetBand` flows into Speaking Pt 1, Pt 2, and Writing feedback

---

## Phase 1.5 — Writing Auditor

*Goal: Precise writing feedback with visible multi-pass grading, vocabulary coaching, and outline critique.*

- [x] **1.5 — Band delta**: `POST /api/writing/gap` — on-demand streaming call after scoring; "Show Gap Analysis" button; per-criterion "to move from X → Y you need to…" streamed JSON rendered as `GapPanel`
- [x] **1.6 — Vocabulary Replacer**: Pass 2 (`POST /api/writing/vocabulary`) always runs on submit; returns `{ informalWords: {word, suggestion, reason}[] }`; rendered as `VocabPanel` with red→green word badges
- [x] **1.7 — Drafting Mode**: Toggle on domain selector screen; structured outline fields (intro thesis · body 1 · body 2 · conclusion); `POST /api/writing/outline` streams critique; essay textarea unlocks after critique
- [x] **Multi-pass pipeline** (replaces single-pass evaluate in UI):
  - `POST /api/writing/audit` — Pass 1: structural check → `AuditResult` JSON; rendered as `AuditPanel`
  - `POST /api/writing/vocabulary` — Pass 2: vocabulary analysis → `VocabResult` JSON; rendered as `VocabPanel`
  - `POST /api/writing/score` — Pass 3: band scoring → streaming `FeedbackResult`; rendered as `FeedbackView`
  - UI shows `PassRow` progress indicators (waiting → running → ✓) as each pass completes

---

## Phase 2 — Speaking & Fluency

*Goal: Voice-first practice loop — speak instead of type, detect fillers, surface academic vocabulary alternatives.*

- [ ] **2.1 — STT (Whisper)**: `POST /api/stt` — receives audio blob, runs Whisper transcription, returns `{ text: string }`; browser uses MediaRecorder (WebM/opus); speaking UI swaps keyboard input for a mic button + waveform indicator
- [ ] **2.2 — Filler Detector**: Post-transcription regex scan for `um`, `ah`, `uh`, `like`, `you know`; annotate each turn with filler count; surface in per-turn badge + session-end summary ("3 fillers detected — try 'In addition' or 'What I mean is'")
- [ ] **2.3 — Unified Speaking Session**: Single `SpeakingSession` state machine (`PART_1` → `PART_2_PREP` → `PART_2_SPEAK` → `PART_3` → `ENDED`); timer fires trigger automatic transitions; existing Part 1 + Part 2 routes become entry points into the unified flow
- [ ] **2.4 — Vocabulary Builder**: Embedded AWL wordlist (`src/lib/ielts/vocabulary/awl.ts`); after each transcribed response, diff against AWL to find informal words and suggest 2–3 academic replacements; shown in a collapsible sidebar panel — never blocks the examiner response

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
