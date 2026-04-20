# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IELTS 6.5 Accelerator for Software Engineers** — an AI-powered app that helps senior engineers achieve IELTS Band 6.5 using technical topics (System Design, AI ethics, Remote Work) as training content. The evaluation engine uses Claude as an IELTS examiner with strict grading against four official criteria: Task Response, Coherence, Lexical Resource, and Grammatical Range.

## Current State

Phase 1, 2, and majority of Phase 3 complete. Done in Phase 3: Reading Module, Speaking Part 1 topic selector, Listening Simulator, Vocabulary Search, Writing Topic Library, How to Answer guide (all 4 skills), Topic Ideas (10 topics), Connected Speech Analyser, and Collocation Library. Nav sidebar reorganised into collapsible groups (Practice / Tools / Guides). Still pending: Target Switcher UI, Progress Analytics. See `Discussion.md` for the full project vision, `RoadMap.md` for the sprint breakdown, `docs/adr/` for architecture decision records, and `docs/pdr/` for product decision records.

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
│       │   │   ├── collocations/         # Collocation Library (search + saved)
│       │   │   ├── history/              # Session history
│       │   │   └── how-to-answer/        # Static exam guides (skill landing + per-skill pages)
│       │   │       └── listening/        # Listening guide — 7 IELTS question types
│       │   │   └── connected-speech/     # Connected Speech Analyser (standalone)
│       │   ├── actions/
│       │   │   ├── exam.ts               # saveExam, saveFeedback server actions
│       │   │   ├── reading.ts            # savePassageToLibrary, pickRandomPassage
│       │   │   ├── listening.ts          # saveScriptToLibrary, pickRandomScript
│       │   │   ├── writing.ts            # saveTopicToLibrary, pickRandomTopic, listTopicsByDomain
│       │   │   ├── vocabulary.ts         # addWordToLibrary
│       │   │   ├── connected-speech.ts   # saveAnalysisAction, listRecentAnalyses, listByPhenomenon, deleteAnalysisAction
│       │   │   └── collocations.ts       # saveCollocationAction, listCollocationAction, updateCollocationSkillsAction, deleteCollocationAction
│       │   └── api/                      # Backend API routes (BFF)
│       │       ├── chat/                 # POST — examiner streaming (Part 1/2/3 + topic)
│       │       ├── feedback/             # POST — post-session band scoring
│       │       ├── reading/passage/      # POST — generate IELTS reading passage (JSON)
│       │       ├── listening/script/     # POST — generate listening transcript + questions (JSON)
│       │       ├── vocabulary/lookup/    # POST — informal→academic word swaps
│       │       ├── vocabulary/search/    # POST — search/generate full vocabulary card
│       │       ├── writing/             # POST — multi-pass auditor (6 routes) + topic generation
│       │       ├── connected-speech/analyse/ # POST — identify connected speech phenomena (JSON)
│       │       └── collocations/search/ # POST — search by word (array) or phrase (single card)
│       ├── components/                   # Shared React components
│       │   ├── mic-input.tsx             # Mic button + interim transcript (Phase 2)
│       │   ├── vocabulary-drawer.tsx     # AWL word-swap sidebar
│       │   ├── timer-control.tsx         # Live countdown + toggle
│       │   ├── timer-alert-modal.tsx     # Fires at timer=0
│       │   └── feedback-view.tsx         # Per-criterion band score display
│       ├── lib/
│       │   ├── ai-client.ts              # Centralised Ollama client — OLLAMA_ENABLED, ollamaModel(), ollamaDisabledResponse()
│       │   ├── db/                       # PostgreSQL client & query helpers
│       │   │   ├── reading.ts            # saveReadingPassage, getRandomPassageByDomain, getLibraryCounts
│       │   │   ├── listening.ts          # saveListeningScript, getRandomScriptByDomain, getListeningLibraryCounts
│       │   │   ├── writing.ts            # saveWritingTopic, getRandomTopicByDomain, getTopicsByDomain, getWritingTopicLibraryCounts
│       │   │   ├── speaking.ts           # getAllSpeakingTopics
│       │   │   ├── vocabulary.ts         # findWord, saveVocabularyWord
│       │   │   ├── connected-speech.ts   # saveAnalysis, getRecentAnalyses, getTopByPhenomenon, deleteAnalysis
│       │   │   └── collocations.ts       # findCollocation, saveCollocation, getAllCollocations, updateCollocationSkills, deleteCollocation
│       │   ├── guides/                   # Static content for How to Answer (no DB, no AI)
│       │   │   ├── listening.ts          # LISTENING_GUIDES — 7 question types, steps/strategies/mistakes
│       │   │   ├── reading.ts            # READING_GUIDES — 9 question types
│       │   │   ├── writing.ts            # WRITING_TASK1_GUIDES (6 types) + WRITING_TASK2_GUIDES (4 types)
│       │   │   └── speaking.ts           # SPEAKING_GUIDES — 3 parts (Part 1, Part 2, Part 3)
│       │   └── ielts/                    # Core domain logic (no Next.js imports)
│       │       ├── examiner/             # Part 1 (fn+topic), Part 2, Part 3 prompts + feedback
│       │       ├── feedback/             # filler-detector.ts (Phase 2)
│       │       ├── reading/              # prompts.ts — passage prompt, scoreReading, estimateBand
│       │       ├── listening/            # prompts.ts — LISTENING_SCRIPT_PROMPT, scoreListening, estimateBand
│       │       ├── timer/               # use-timer.ts, use-speech-input.ts (Phase 2)
│       │       ├── vocabulary/          # AWL prompts, DB queries, VOCAB_SEARCH_PROMPT
│       │       ├── connected-speech/    # prompts.ts — CONNECTED_SPEECH_PROMPT, types, PHENOMENON_META, getPhenomenonColor
│       │       └── collocations/        # prompts.ts — COLLOCATION_BY_WORD_PROMPT, COLLOCATION_BY_PHRASE_PROMPT, CollocationResult
│       └── types/                        # App-local TypeScript types
├── packages/
│   └── shared/src/types/                 # TargetProfile, FeedbackSchema (cross-workspace)
├── docs/adr/
└── docker/docker-compose.yml
```

**Key rule:** `app/api/` route handlers must be thin — validate input → call `lib/ielts/` → return response. No business logic inside route files.

**AI client rule:** Never import `createOllama` directly in route files or server actions. Always import from `@/lib/ai-client` and guard with `if (!OLLAMA_ENABLED) return ollamaDisabledResponse()` (route handlers) or `if (!OLLAMA_ENABLED) throw new Error(...)` (server actions).

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

# Docker (PostgreSQL — not used locally; auto-used in GitHub Codespaces via Docker-in-Docker)
docker compose -f docker/docker-compose.yml up -d
```

> `next dev` without `--turbo` must not be used for local development (M1 memory constraint).
> If you see "Internal Server Error" on first page load, run `pnpm dev:clean` to clear the stale `.next` cache.

### Environment variables (key ones)

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_BASE_URL` | `http://localhost:11434/api` | Ollama API endpoint — use ngrok URL in Codespaces |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b` | Model name passed to Ollama |
| `NEXT_PUBLIC_OLLAMA_ENABLED` | `true` | Set to `false` to disable all AI routes; shows amber banner in UI |
| `DATABASE_URL` | — | PostgreSQL connection string |

### GitHub Codespaces

A `.devcontainer/` config is provided. PostgreSQL starts automatically; AI features are **disabled by default** (`NEXT_PUBLIC_OLLAMA_ENABLED=false`). To re-enable:

1. On your local machine: `OLLAMA_ORIGINS='*' OLLAMA_HOST=0.0.0.0 ollama serve` + `ngrok http 11434` (copy the HTTPS URL)
2. In Codespace `apps/web/.env.local`: set `OLLAMA_BASE_URL=<ngrok-url>/api` and `NEXT_PUBLIC_OLLAMA_ENABLED=true`
3. Restart: `pnpm dev:clean`

See `.devcontainer/README.md` for full setup steps.

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
- `reading_passages` table: `id`, `title`, `domain`, `passage`, `questions` (jsonb `ReadingQuestionRow[]`), `rank`; `getLibraryCounts()` returns count per domain for badge display
- Side-by-side layout: passage left (flex-55), questions right (flex-45), full viewport height
- Highlight system: passage uses global char offsets; questions use per-question local offsets; `PassageParagraphs` renders `\n\n`-separated paragraphs as `<p>` elements with hidden zero-size separator spans to preserve `document.createRange()` offset accuracy
- 6 T/F/NG + 4 short-answer questions; auto-scored; band estimated; saved as `skill: 'reading'`

**Writing Evaluator** (multi-pass grading, Phase 1.5 complete; topic library added Phase 3)
- **Topic Library**: `writing_topics` table — `id`, `domain`, `prompt`, `taskType`, `rank`, `createdAt`; stage machine `select → options → (library | generating | loading) → (drafting | writing) → ...`
- Topic source: "Pick from Library" (browse by domain, select specific topic) or "Generate New" (`POST /api/writing/topic` — auto-saves, returns `{ prompt, taskType }`)
- Topic variety: `TOPIC_GENERATION_PROMPT` randomly picks task type + domain-specific angle at call time to prevent repeated outputs
- `task_type` values: `opinion | discussion | problem_solution | two_part`; displayed as badge on topic card throughout session
- Back navigation available from `options` → `select`, `library` → `options`, `writing`/`drafting` → `options`
- Pass 1: `POST /api/writing/audit` — structural check (`AuditResult`)
- Pass 2: `POST /api/writing/vocabulary` — informal word detection (`VocabResult`)
- Pass 3: `POST /api/writing/score` — band scoring (streaming `FeedbackResult`)
- On-demand: `POST /api/writing/gap` — Band 6.5 vs 7.0 gap analysis
- Drafting Mode: `POST /api/writing/outline` — AI critiques outline before essay unlocks
- See [PDR-0009](./docs/pdr/0009-writing-topic-library-design.md) for design rationale

**Listening Simulator** (Phase 3 complete)
- Route `/listening`; API `POST /api/listening/script` (uses `generateText` — needs full JSON)
- Stage machine: `select → options → generating | loading → listening → submitted`
- Domain selection → "Pick from Library" or "Generate New" (auto-saves to `listening_scripts` table)
- `listening_scripts` table: `id`, `domain`, `title`, `transcript` (jsonb `ListeningTurn[]`), `questions` (jsonb `ListeningQuestion[]`), `rank`
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

**How to Answer Guide** (Phase 3 — all 4 skills complete)
- Route `/how-to-answer` — skill landing page linking to all four skill guides
- Route `/how-to-answer/listening` — accordion guide covering all 7 real IELTS Listening question types; "CRITICAL SKILL" callout for CBT pre-recording reading; all advice is computer-based (scratch paper, typing, clicking, flagging)
- Route `/how-to-answer/reading` — 9 question types (T/F/NG, Y/N/NG, Matching Headings, Matching Information, Multiple Choice, Completion, Sentence Completion, Diagram Labelling, Short Answer)
- Route `/how-to-answer/writing` — two-section layout: Task 1 (6 chart types: Bar/Line, Pie, Table, Process, Map, Mixed) + Task 2 (4 essay types: Opinion, Discussion, Problem/Solution, Two-Part); uses blue accent for Task 1, purple for Task 2
- Route `/how-to-answer/speaking` — 3 parts; Part 1 (green), Part 2 (blue), Part 3 (purple); real exam focus, not app-specific
- Content is fully static (no DB, no AI); pattern: `lib/guides/<skill>.ts` → `how-to-answer/<skill>/page.tsx` (server) → `<skill>-guide.tsx` (client, accordion)
- See [PDR-0011](./docs/pdr/0011-how-to-answer-guide.md) for design rationale

**Topic Ideas** (Phase 3 — all 10 topics complete)
- Route `/topic-ideas` — skill selector landing (Listening / Reading / Writing / Speaking)
- Route `/topic-ideas/[skill]` — grid of topic cards for the selected skill
- Route `/topic-ideas/[skill]/[topicId]` — framework selector (pill tabs) + full detail view
- Framework detail shows: numbered steps with amber vocabulary pills + a skill-specific example (chat bubbles for Speaking/Listening, annotated passage for Reading, prompt + sample paragraph for Writing)
- All content is fully static — `lib/topic-ideas/index.ts` holds `TOPICS: Topic[]` with `TopicFramework[]` per topic, each framework containing 4 skill-specific examples
- 10 topics, ~20 frameworks total: Health & Disease · Education & Learning · Technology & Innovation · Environment & Climate · Economy & Work · Society & Culture · Media & Communication · Government & Policy · Science & Research · Urban Development

**Connected Speech Analyser** (Phase 3 complete)
- Route `/connected-speech` — standalone tool; no session required
- Input: free-text textarea + "Use example text" button; AI analysis via `POST /api/connected-speech/analyse`
- Uses `generateText` (not streaming) — needs full JSON before rendering; strips markdown fences before `JSON.parse`
- Detects 7 phenomena: elision, assimilation, catenation, intrusion, weakening, contraction, gemination
- Output Part 1 (sentence view): toggle between **Full sentence** (colour-highlighted spans) and **Phrase-by-phrase** (stacked cards per instance)
- Output Part 2 (pronunciation tips): instances grouped by phenomenon with colour-coded badges
- Reference accordion: static `PHENOMENON_META` — label, explanation, 2 examples each; collapsible, one section at a time
- History panel: save analysis to `connected_speech_analyses` table; filter by phenomenon; delete on hover
- `getPhenomenonColor(p)` — safe getter with gray fallback prevents crash when AI returns an unknown phenomenon string
- `connected_speech_analyses` table: `id`, `originalText`, `transformedText`, `instances` (jsonb), `phenomena` (jsonb — deduplicated list for filtering), `createdAt`
- Recommended model: `llama3.1:8b` or `gemma2:9b` (general-purpose); `qwen2.5-coder:7b` lacks phonetic knowledge

**Collocation Library** (Phase 3 complete)
- Route `/collocations` — standalone tool; no session required
- Two search modes via `POST /api/collocations/search`: **By Word** (returns up to 8 collocations containing the word) and **By Phrase** (validates a specific phrase, or returns invalid reason)
- Uses `generateText` (not streaming) — needs full JSON before rendering; strips markdown fences before `JSON.parse`
- Each collocation card: `phrase`, `type` (e.g. `verb+noun`), `skills` (`Writing_1` | `Writing_2` | `Speaking`), `examples` (2–3 sentences)
- AI suggests skills; user can toggle any skill on/off before saving
- `collocation_entries` table: `id`, `phrase` (unique), `type`, `skills` (jsonb), `examples` (jsonb), `createdAt`
- Library: search by phrase/type/example text; filter by skill chip; edit skills inline post-save; delete on hover
- `CollocationSkill` type exported from `schema.ts`: `'Writing_1' | 'Writing_2' | 'Speaking'`
- Two AI prompts: `COLLOCATION_BY_WORD_PROMPT(word)` → `{ collocations: CollocationResult[] }`, `COLLOCATION_BY_PHRASE_PROMPT(phrase)` → `{ valid, phrase, type, suggestedSkills, examples } | { valid: false, reason }`

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
- All three content library tables (`reading_passages`, `listening_scripts`, `writing_topics`) share a `rank` column (1–5, default 1, DB-enforced CHECK constraint); sort order is `rank DESC, createdAt DESC` — see [PDR-0010](./docs/pdr/0010-library-rank-ordering.md)
- Centralised Ollama client (`src/lib/ai-client.ts`) — single source for `createOllama` config, `OLLAMA_ENABLED` flag, and disabled-response helper; all 16 API routes + 1 server action import from here
- Nav sidebar (`components/nav-sidebar.tsx`) uses collapsible groups: **Practice** (Speaking Full/Pt1/Pt2, Writing, Reading, Listening), **Tools** (Vocabulary, Collocations, Connected Speech), **Guides** (How to Answer, Topic Ideas); Dashboard and History are standalone. Active group auto-opens on load; group header turns blue when it contains the active page.
- `NEXT_PUBLIC_OLLAMA_ENABLED=false` disables all AI routes and shows an amber banner in the dashboard layout; designed for GitHub Codespaces where Ollama cannot run in-container
- Safe colour getter pattern (`getPhenomenonColor(p)`) — always look up dynamic AI-returned strings through a getter with a fallback rather than direct object indexing; prevents crashes when the model returns an unexpected value

## Roadmap Summary

| Phase | Weeks | Status | Focus |
|-------|-------|--------|-------|
| 1 | 1–2 | ✅ Done | IELTS Scorer MVP: Examiner engine, Writing Task 2, Target Profile |
| 1.5 | 2–3 | ✅ Done | Writing Auditor: multi-pass pipeline, vocabulary replacer, drafting mode |
| 2 | 3–5 | ✅ Done | Speaking simulator, Web Speech API STT, filler detection, unified session |
| 3 | 6–10 | 🔄 In progress | Reading ✅ · Speaking Topic Selector ✅ · Listening ✅ · Vocab Search ✅ · Writing Topic Library ✅ · How to Answer (all 4 skills) ✅ · Topic Ideas (10 topics) ✅ · Connected Speech Analyser ✅ · Collocation Library ✅ · Nav reorganisation ✅ · Target Switcher ⬜ · Analytics ⬜ |
| 4 | TBD | Pending | Peer Review, Official Mock Integration |

Full sprint task details in `RoadMap.md` and `TODO.md`.
