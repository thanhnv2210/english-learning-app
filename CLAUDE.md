# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IELTS 6.5 Accelerator for Software Engineers** — an AI-powered app that helps senior engineers achieve IELTS Band 6.5 using technical topics (System Design, AI ethics, Remote Work) as training content. The evaluation engine uses Claude as an IELTS examiner with strict grading against four official criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

## Current State

Phase 1 and Phase 2 complete. Phase 3 (Target Switcher, Reading/Listening, Analytics) is next. See `Discussion.md` for the full project vision, `RoadMap.md` for the sprint breakdown, and `docs/adr/` for architecture decision records.

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
│       │   │   ├── speaking/             # Part 1 standalone
│       │   │   │   └── part2/            # Part 2 standalone
│       │   │   │   └── session/          # Unified full session (Phase 2)
│       │   │   ├── writing/              # Writing Task 2
│       │   │   ├── vocabulary/           # AWL browser
│       │   │   └── history/              # Session history
│       │   └── api/                      # Backend API routes (BFF)
│       │       ├── chat/                 # POST — examiner streaming (Part 1/2/3)
│       │       ├── feedback/             # POST — post-session band scoring
│       │       ├── vocabulary/lookup/    # POST — informal→academic word swaps
│       │       └── writing/             # POST — multi-pass auditor (6 routes)
│       ├── components/                   # Shared React components
│       │   ├── mic-input.tsx             # Mic button + interim transcript (Phase 2)
│       │   ├── vocabulary-drawer.tsx     # AWL word-swap sidebar
│       │   ├── timer-control.tsx         # Live countdown + toggle
│       │   ├── timer-alert-modal.tsx     # Fires at timer=0
│       │   └── feedback-view.tsx         # Per-criterion band score display
│       ├── lib/
│       │   ├── db/                       # PostgreSQL client & query helpers
│       │   └── ielts/                    # Core domain logic (no Next.js imports)
│       │       ├── examiner/             # Part 1, Part 2, Part 3 prompts + feedback
│       │       ├── feedback/             # filler-detector.ts (Phase 2)
│       │       ├── timer/               # use-timer.ts, use-speech-input.ts (Phase 2)
│       │       └── vocabulary/          # AWL prompts, DB queries
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
pnpm build                            # production build
pnpm lint                             # ESLint

# Docker (PostgreSQL)
docker compose -f docker/docker-compose.yml up -d
```

> `next dev` without `--turbo` must not be used for local development (M1 memory constraint).

## Architecture

### Core Modules

**IELTS Evaluation Engine** (`IELTS_Examiner` system prompt)
- Acts as a strict examiner (no helping the user, enforces transitions)
- Grades against four criteria; targets "controlled complexity" at Band 6.5 (encourages complex structures even with minor errors)
- Prompts: `IELTS_PART1_EXAMINER_PROMPT`, `IELTS_PART2_EXAMINER_PROMPT(cueCard)`, `IELTS_PART3_EXAMINER_PROMPT(cueCard)` — all in `lib/ielts/examiner/`
- `TargetProfile` schema supports switching between `IELTS_6.5`, `IELTS_7.5`, `Business_Fluent` (Phase 3)

**Speaking Simulator** (Phase 1 + 2 complete)
- Unified session at `/speaking/session`: state machine `idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended`
- STT via Chrome Web Speech API (`useSpeechInput` hook) — no API key required
- Filler detection (`filler-detector.ts`): regex scan post-session, shown as amber badges with discourse marker tips
- Standalone routes `/speaking` (Part 1) and `/speaking/part2` (Part 2) preserved for focused practice
- Evaluation: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation

**Writing Evaluator** (multi-pass grading, Phase 1.5 complete)
- Pass 1: `POST /api/writing/audit` — structural check (`AuditResult`)
- Pass 2: `POST /api/writing/vocabulary` — informal word detection (`VocabResult`)
- Pass 3: `POST /api/writing/score` — band scoring (streaming `FeedbackResult`)
- On-demand: `POST /api/writing/gap` — Band 6.5 vs 7.0 gap analysis
- Drafting Mode: `POST /api/writing/outline` — AI critiques outline before essay unlocks

**Vocabulary Builder** (Phase 2 complete)
- `VocabularyDrawer` component — post-session collapsible panel, never blocks examiner flow
- `POST /api/vocabulary/lookup` — two-pass: detect informal words → fetch/generate academic cards
- AWL browser at `/vocabulary` — searchable, filterable by domain

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
| 3 | 6–10 | Pending | Target Switcher, Reading/Listening, Progress Analytics |
| 4 | TBD | Pending | Peer Review, Official Mock Integration |

Full sprint task details in `RoadMap.md` and `TODO.md`.
