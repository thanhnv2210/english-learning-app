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

- [x] **2.1 — STT (Web Speech API)**: `useSpeechInput` hook (`lib/ielts/timer/use-speech-input.ts`) wraps Chrome's native Web Speech API; `MicInput` component (mic toggle + interim transcript preview) replaces plain text input in Part 1, Part 2, and unified session
- [x] **2.2 — Filler Detector**: `lib/ielts/feedback/filler-detector.ts` — regex scan for `um`, `uh`, `ah`, `er`, `like`, `you know`, `basically`, `literally`, `right`; `detectFillers()` returns per-word counts; shown as amber badge panel with discourse marker suggestions at session end
- [x] **2.3 — Unified Speaking Session**: `SpeakingSession` state machine at `/speaking/session` (`idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended`); `IELTS_PART3_EXAMINER_PROMPT` added; `/api/chat` handles `mode=part3`; nav updated with "Speaking (Full)" link; existing `/speaking` and `/speaking/part2` routes preserved
- [x] **2.4 — Vocabulary Builder**: `VocabularyDrawer` integrated post-session in all speaking routes; `/api/vocabulary/lookup` surfaces informal→academic word swaps; non-blocking collapsible panel

---

## Phase 3 — Complete the 4 Skills + Analytics

*Goal: Full IELTS skill coverage — Reading and Listening added, progress visible, target switchable.*

- [ ] **3.1 — Progress Analytics**: `/analytics` page — query `mockExams` with feedback, compute rolling band average per skill per criterion (last 5 sessions), render summary cards + per-criterion gap table (green/amber/red badges); session count + last-practice date per skill
- [ ] **3.2 — Target Switcher UI**: `/settings` page — `IELTS_6.5` / `IELTS_7.5` / `Business_Fluent` selector; server action updates `users.targetProfile`; `Business_Fluent` gets a new feedback prompt that drops band-score language; sidebar footer target badge reads live DB value
- [ ] **3.3 — Reading Module**: `/reading` + `POST /api/reading/passage` — AI generates 700–900 word tech passage + 10–13 questions (T/F/NG, matching headings, short answer); 20-min timer; auto-score on submit; band estimate; save as `skill: 'reading'`
- [ ] **3.4 — Listening Simulator**: `/listening` + `POST /api/listening/script` — AI generates 2-person tech conversation with 8–10 note-completion gaps; browser TTS (`SpeechSynthesis`, 2 voices) reads it aloud; play/pause/replay (2 plays max); user fills blanks; auto-score; save as `skill: 'listening'`

---

## Phase 4 — Release & Community

- [ ] **Peer Review Mode**: Allow other users to review and comment on practice essays
- [ ] **Official mock integration**: Connect to IDP / British Council resources for final-stage testing
