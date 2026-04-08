# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IELTS 6.5 Accelerator for Software Engineers** — an AI-powered app that helps senior engineers achieve IELTS Band 6.5 using technical topics (System Design, AI ethics, Remote Work) as training content. The evaluation engine uses Claude as an IELTS examiner with strict grading against four official criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

## Current State

Phase 1, 2, and majority of Phase 3 complete. Done in Phase 3: Reading Module (library, highlight system, paragraph formatting), Speaking Part 1 topic selector, Listening Simulator, and Vocabulary Search. Still pending: Target Switcher UI, Progress Analytics. See `Discussion.md` for the full project vision, `RoadMap.md` for the sprint breakdown, `docs/adr/` for architecture decision records, and `docs/pdr/` for product decision records.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Repo | pnpm monorepo (`apps/*`, `packages/*`) |
| Frontend + API | Next.js 15 App Router — `apps/web` |
| Styling | Tailwind CSS |
| AI/Streaming | Vercel AI SDK (`ai` package) |
| Database | PostgreSQL via Docker (`docker/docker-compose.yml`) |

- [ADR-0001](./docs/adr/0001-local-dev-environment-and-tech-stack.md) — local dev environment rationale
- [ADR-0002](./docs/adr/0002-monorepo-single-repository.md) — monorepo & BFF pattern rationale

## Repository Structure

```
english-learning-app/
├── apps/
│   └── web/src/
│       ├── app/
│       │   ├── (auth)/                   # Sign-in / sign-up pages
│       │   ├── (dashboard)/
│       │   │   ├── speaking/             # Part 1 standalone (topic selector + chat)
│       │   │   │   └── part2/            # Part 2 standalone
│       │   │   │   └── session/          # Unified full session (Phase 2)
│       │   │   ├── writing/              # Writing Task 2
│       │   │   ├── reading/              # Reading module (Phase 3)
│       │   │   ├── vocabulary/           # AWL browser
│       │   │   └── history/              # Session history
│       │   ├── actions/
│       │   │   ├── exam.ts               # saveExam, saveFeedback server actions
│       │   │   ├── reading.ts            # savePassageToLibrary, pickRandomPassage
│       │   │   ├── listening.ts          # saveScriptToLibrary, pickRandomScript
│       │   │   └── vocabulary.ts         # addWordToLibrary
│       │   └── api/                      # Backend API routes (BFF)
│       │       ├── chat/                 # POST — examiner streaming (Part 1/2/3 + topic)
│       │       ├── feedback/             # POST — post-session band scoring
│       │       ├── reading/passage/      # POST — generate IELTS reading passage (JSON)
│       │       ├── listening/script/     # POST — generate listening transcript + questions (JSON)
│       │       ├── vocabulary/lookup/    # POST — informal→academic word swaps
│       │       ├── vocabulary/search/    # POST — search/generate full vocabulary card
│       │       └── writing/             # POST — multi-pass auditor (6 routes)
│       ├── components/                   # Shared React components
│       │   ├── mic-input.tsx             # Mic button + interim transcript (Phase 2)
│       │   ├── vocabulary-drawer.tsx     # AWL word-swap sidebar
│       │   ├── timer-control.tsx         # Live countdown + toggle
│       │   ├── timer-alert-modal.tsx     # Fires at timer=0
│       │   └── feedback-view.tsx         # Per-criterion band score display
│       ├── lib/
│       │   ├── db/                       # PostgreSQL client & query helpers
│       │   │   ├── reading.ts            # saveReadingPassage, getRandomPassageByDomain, getLibraryCounts
│       │   │   ├── listening.ts          # saveListeningScript, getRandomScriptByDomain, getListeningLibraryCounts
│       │   │   ├── speaking.ts           # getAllSpeakingTopics
│       │   │   └── vocabulary.ts         # findWord, saveVocabularyWord
│       │   └── ielts/                    # Core domain logic (no Next.js imports)
│       │       ├── examiner/             # Part 1 (fn+topic), Part 2, Part 3 prompts + feedback
│       │       ├── feedback/             # filler-detector.ts (Phase 2)
│       │       ├── reading/              # prompts.ts — passage prompt, scoreReading, estimateBand
│       │       ├── listening/            # prompts.ts — LISTENING_SCRIPT_PROMPT, scoreListening, estimateBand
│       │       ├── timer/               # use-timer.ts, use-speech-input.ts (Phase 2)
│       │       └── vocabulary/          # AWL prompts, DB queries, VOCAB_SEARCH_PROMPT
│       └── types/                        # App-local TypeScript types
├── packages/
│   └── shared/src/types/                 # TargetProfile, FeedbackSchema (cross-workspace)
├── docs/adr/
└── docker/docker-compose.yml
```

**Key rule:** `app/api/` route handlers must be thin — validate input → call `lib/ielts/` → return response. No business logic inside route files.

## Commands

```bash
# From repo root
pnpm install                          # install all workspaces

# From apps/web/
pnpm dev                              # next dev --turbo (configured in apps/web/package.json)
pnpm dev:clean                        # rm -rf .next && next dev --turbo  ← use when cache is stale
pnpm build                            # production build
pnpm lint                             # ESLint

# Schema
pnpm db:push                          # push schema changes to ielts_dev

# Seeds
pnpm db:seed:domains                  # writing_domains (50 rows)
pnpm db:seed:vocabulary               # vocabulary_words
pnpm db:seed:speaking-topics          # speaking_topics (10 rows)

# Docker (PostgreSQL — not used; app uses local Homebrew instance)
docker compose -f docker/docker-compose.yml up -d
```

> `next dev` without `--turbo` must not be used for local development (M1 memory constraint).
> If you see "Internal Server Error" on first page load, run `pnpm dev:clean` to clear the stale `.next` cache.

## Architecture

### Core Modules

**IELTS Evaluation Engine** (`IELTS_Examiner` system prompt)
- Acts as a strict examiner (no helping the user, enforces transitions)
- Grades against four criteria; targets "controlled complexity" at Band 6.5 (encourages complex structures even with minor errors)
- Prompts: `IELTS_PART1_EXAMINER_PROMPT(topic?)`, `IELTS_PART2_EXAMINER_PROMPT(cueCard)`, `IELTS_PART3_EXAMINER_PROMPT(cueCard)` — all in `lib/ielts/examiner/`
- `IELTS_PART1_EXAMINER_PROMPT` is a function; optional `topic` arg focuses the examiner on a specific subject with example questions; no arg = mixed topics
- `TargetProfile` schema supports switching between `IELTS_6.5`, `IELTS_7.5`, `Business_Fluent` (Phase 3)

**Speaking Simulator** (Phase 1 + 2 complete; Phase 3 topic selector added)
- Unified session at `/speaking/session`: state machine `idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended`
- STT via Chrome Web Speech API (`useSpeechInput` hook) — no API key required
- Filler detection (`filler-detector.ts`): regex scan post-session, shown as amber badges with discourse marker tips
- Standalone `/speaking` (Part 1) shows a topic selector grid before session start; 10 topics from `speaking_topics` DB table ordered by rank; toggle-select (deselect = mixed session); preview shows example questions; topic passed via `useChat body` → server prompt rebuilt per request
- Standalone `/speaking/part2` preserved for focused Part 2 practice
- Evaluation: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation

**Reading Module** (Phase 3 complete)
- Route `/reading`; API `POST /api/reading/passage` (uses `generateText`, not streaming — needs full JSON)
- Stage machine: `select → options → generating/loading → reading → submitted`
- Domain selection → two options: "Pick from Library" (random from `reading_passages` table) or "Generate New" (auto-saves to library)
- `reading_passages` table: `id`, `title`, `domain`, `passage`, `questions` (jsonb `ReadingQuestionRow[]`); `getLibraryCounts()` returns count per domain for badge display
- Side-by-side layout: passage left (flex-55), questions right (flex-45), full viewport height
- Highlight system: passage uses global char offsets; questions use per-question local offsets; `PassageParagraphs` renders `\n\n`-separated paragraphs as `<p>` elements with hidden zero-size separator spans to preserve `document.createRange()` offset accuracy
- 6 T/F/NG + 4 short-answer questions; auto-scored; band estimated; saved as `skill: 'reading'`

**Writing Evaluator** (multi-pass grading, Phase 1.5 complete)
- Pass 1: `POST /api/writing/audit` — structural check (`AuditResult`)
- Pass 2: `POST /api/writing/vocabulary` — informal word detection (`VocabResult`)
- Pass 3: `POST /api/writing/score` — band scoring (streaming `FeedbackResult`)
- On-demand: `POST /api/writing/gap` — Band 6.5 vs 7.0 gap analysis
- Drafting Mode: `POST /api/writing/outline` — AI critiques outline before essay unlocks

**Listening Simulator** (Phase 3 complete)
- Route `/listening`; API `POST /api/listening/script` (uses `generateText` — needs full JSON)
- Stage machine: `select → options → generating | loading → listening → submitted`
- Domain selection → "Pick from Library" or "Generate New" (auto-saves to `listening_scripts` table)
- `listening_scripts` table: `id`, `domain`, `title`, `transcript` (jsonb `ListeningTurn[]`), `questions` (jsonb `ListeningQuestion[]`)
- `ListeningTurn`: `{ speaker: 'A' | 'B', text: string }`; `ListeningQuestion`: `{ id, sentence, answer }` (sentence has `___` gap)
- Browser TTS: `window.speechSynthesis`; 2 English voices selected per-speaker; pitch fallback if only 1 voice available; max 2 plays (real IELTS rule)
- Note-completion form: each question split on `___` → `<span>before</span><input/><span>after</span>`
- Answers accepted during or after playback; submit scores case-insensitive trimmed comparison
- `scoreListening` + `estimateBand` in `lib/ielts/listening/prompts.ts`; saved as `skill: 'listening'`
- See [PDR-0008](./docs/pdr/0008-listening-simulator-design.md) for design rationale

**Vocabulary Builder** (Phase 2 + Phase 3 extensions complete)
- `VocabularyDrawer` component — post-session collapsible panel, never blocks examiner flow
- `POST /api/vocabulary/lookup` — two-pass: detect informal words → fetch/generate academic cards
- AWL browser at `/vocabulary` — searchable, filterable by domain
- **Vocabulary Search** (Phase 3): `VocabSearch` component + `POST /api/vocabulary/search`; checks DB first (`findWord`), falls back to AI generation (`VOCAB_SEARCH_PROMPT`); auto-detects domains from known list; "Add to Library" button for AI-generated cards; already-saved words show read-only

**Target Profile System**
- `users.targetProfile` stored in DB; `parseTargetBand()` parses `IELTS_6.5` → `6.5`
- `targetBand` flows into all feedback prompts
- Refactored to load different prompt templates per target in Phase 3

### Key Design Decisions
- Use "Band 6.5 vs 7.0 gap analysis" framing in all feedback (not just scores)
- Writing feedback includes "Drafting Mode" (outline critique before full essay)
- Vocabulary Replacer identifies dev-slang and suggests formal IELTS-appropriate equivalents
- `FeedbackGenerator` runs *after* a session, not during, to maintain examiner strictness
- Web Speech API (not Whisper) chosen for STT: zero setup, free, native in Chrome

## Roadmap Summary

| Phase | Weeks | Status | Focus |
|-------|-------|--------|-------|
| 1 | 1–2 | ✅ Done | IELTS Scorer MVP: Examiner engine, Writing Task 2, Target Profile |
| 1.5 | 2–3 | ✅ Done | Writing Auditor: multi-pass pipeline, vocabulary replacer, drafting mode |
| 2 | 3–5 | ✅ Done | Speaking simulator, Web Speech API STT, filler detection, unified session |
| 3 | 6–10 | 🔄 In progress | Reading ✅ · Speaking Topic Selector ✅ · Listening ✅ · Vocab Search ✅ · Target Switcher ⬜ · Analytics ⬜ |
| 4 | TBD | Pending | Peer Review, Official Mock Integration |

Full sprint task details in `RoadMap.md` and `TODO.md`.
