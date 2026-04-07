# 🗺️ Project Roadmap: IELTS 6.5 for Engineers

## Phase 1: IELTS "Scorer" MVP (Weeks 1-2)
*Goal: Create a feedback loop based on IELTS 6.5 criteria.*
- [x] **IELTS Evaluation Engine**: Prompt Claude Code to act as an examiner. It must provide a "Mock Band" and specific "Band 7" improvement tips.
- [x] **Technical Writing Task 2**: Build an interface to write essays on tech topics (e.g., "Automation in the Workplace") with auto-scoring.
- [x] **Target Profile System**: Implement `users.targetProfile` in DB (hardcoded to `IELTS_6.5`; `targetBand` flows into feedback for Speaking + Writing).

## Phase 2: Speaking & Fluency (Weeks 3-5)
*Goal: Voice-first practice with filler detection and vocabulary coaching.*
- [x] **Voice Input (STT)**: Web Speech API (`useSpeechInput` hook) — mic button in speaking sessions; real-time interim transcript preview; Chrome-native, no API key required
- [x] **Hesitation Filler Detection**: Post-transcription regex scan for `um`, `ah`, `uh`, `er`, `like`, `you know`, `basically`, `literally`, `right`; counts per word shown as amber badges in session-end summary with discourse marker tips
- [x] **Unified Speaking Flow**: `/speaking/session` — single state machine (`idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended`); Part 3 examiner prompt added; existing `/speaking` and `/speaking/part2` routes retained as standalone entry points
- [x] **Vocabulary Builder**: AWL-based `VocabularyDrawer` integrated into all speaking sessions; post-session panel surfaces informal→academic word swaps

## Phase 3: Complete the 4 Skills + Analytics (Weeks 6-10)
*Goal: Full IELTS coverage — add Reading and Listening, show progress against target, expose the Target Switcher.*
- [ ] **Progress Analytics**: `/analytics` dashboard — rolling band average per skill per criterion, trend over time, "Distance to target" summary
- [ ] **Target Switcher UI**: `/settings` page — profile selector (`IELTS_6.5`, `IELTS_7.5`, `Business_Fluent`); update `users.targetProfile` via server action; load different prompt templates per profile
- [x] **Reading Module**: AI-generated tech-themed IELTS passages (~750 words) with 10–13 questions (T/F/NG, matching headings, short answer); 20-min timer; auto-scoring; saved to history as `skill: 'reading'`
- [ ] **Listening Simulator**: AI-generated tech conversation transcript; browser TTS (`SpeechSynthesis`) reads it aloud; user completes note-completion blanks during/after playback; auto-scored; saved to history as `skill: 'listening'`

## Phase 3 Sprint Tasks

### Task 3.1 — Progress Analytics Dashboard
- New route `/analytics`
- Query all `mockExams` rows that have a `feedback` JSON blob
- Compute per-skill rolling averages: overall band + per-criterion band (last 5 sessions)
- UI: summary cards ("Speaking avg 6.0 · target 6.5 · gap −0.5") + per-criterion breakdown table
- No charting library needed in MVP — plain table with colour-coded gap badges (same green/amber/red logic as `FeedbackView`)
- Show session count and date of last practice per skill

### Task 3.2 — Target Switcher UI
- New route `/settings`
- Profile options: `IELTS_6.5` (current), `IELTS_7.5`, `Business_Fluent`
- Server action updates `users.targetProfile` in DB; page re-renders with new value
- `Business_Fluent` requires a new feedback prompt framing: drop band-score language, focus on professional register, clarity, and conciseness
- Nav sidebar: add "Settings" link at bottom (above the Target badge)
- Target badge in sidebar footer reads the live DB value, not a hardcoded string

### Task 3.3 — Reading Module ✅
- Route `/reading`; API `POST /api/reading/passage`
- AI generates 700–900 word tech-themed passage + 10 questions: 6 T/F/NG (radio buttons) + 4 short answer (text input, max 3 words)
- Answer key embedded in AI response; auto-scored client-side (`scoreReading`, `estimateBand` in `lib/ielts/reading/prompts.ts`)
- 20-minute `useTimer`; results shown per-question (✓/✗ + correct answer on miss)
- `FeedbackResult` built from score and saved via `saveFeedback`; rendered with `FeedbackView`
- Saved to history as `skill: 'reading'`
- **Reading Library** (extended): `reading_passages` DB table; domain selector → two options ("Pick from Library" random, "Generate New" auto-saves); `libraryCounts` badge on library card; server actions `savePassageToLibrary` / `pickRandomPassage`
- **Passage formatting**: `PassageParagraphs` component splits on `\n\n` → proper `<p>` elements with spacing; hidden zero-size separator spans preserve char offsets for highlight range calculations; `HighlightedText` handles inline `\n` as `<br>`
- **Highlight system**: passage (global offsets) + questions (per-question local offsets); yellow `<mark>` click-to-remove; single toggle applies to both panels; "Clear (N)" button

### Task 3.3b — Speaking Part 1 Topic Selector ✅
- `speaking_topics` DB table: `id`, `rank` (unique), `name`, `description`, `exampleQuestions` (jsonb `string[]`)
- 10 seeded topics ordered by IELTS frequency; seed script at `lib/db/seeds/speaking-topics.ts` (`pnpm db:seed:speaking-topics`)
- `IELTS_PART1_EXAMINER_PROMPT` refactored from constant → function accepting optional `{ name, description, exampleQuestions }` topic; without topic the examiner covers a mixed set
- `/api/chat` route extracts `topic` from request body and passes to prompt function
- `SpeakingChat` topic grid: 2–4 column responsive; toggle-select (click again to deselect = mixed session); preview panel shows 4 example questions for selected topic; hidden when resuming a saved session
- `useChat body` carries `{ topic }` on every request so the system prompt is always rebuilt server-side with the correct focus

### Task 3.4 — Listening Simulator
- New route `/listening`
- `POST /api/listening/script` — AI generates a 2-person tech conversation (e.g., engineer explaining a system to a PM) as a structured transcript with 8–10 note-completion gaps marked
- Browser TTS (`window.speechSynthesis`) reads the transcript aloud — two voices (voice 0 = Speaker A, voice 1 = Speaker B) using `SpeechSynthesisUtterance`; no external API required
- UI: note-completion form with blank fields; user fills in during or after playback
- Playback controls: Play / Pause / Replay (the full transcript can be played twice, matching real IELTS rules)
- On submit: compare user answers against gap key (case-insensitive, trim); score + band estimate
- Save to history as `skill: 'listening'`

## Phase 4: Release & Community
- [ ] **Peer Review Mode**: Let other "Tech Guys" review each other's practice essays.
- [ ] **Official Mock Integration**: Connect to official [IELTS by IDP](url) or [British Council](url) resources for final testing.

## Phase 1 Sprint: The "Examiner" Engine
- [x] **Task 1.1**: Develop the `IELTS_Examiner` system prompt that enforces "Examiner Protocol" (no helping the user, strict transitions).
- [x] **Task 1.2**: Implement a `TimerService` to force transitions (especially the 2-minute cutoff for Part 2).
- [x] **Task 1.3**: Create a `FeedbackGenerator` that runs *after* the session to provide a Band 6.5 vs 7.0 gap analysis.
- [x] **Task 1.4**: Contextual Topic Injection: Inject dev-friendly topics into Part 2 (e.g., "Describe a time you solved a complex bug") to keep you engaged.

## Phase 1.5: The "Writing Auditor"
- [x] **Task 1.5**: `POST /api/writing/gap` — on-demand band delta; "Show Gap Analysis" button fires after scoring; streams per-criterion "to reach X you need to…" text
- [x] **Task 1.6**: Vocabulary Replacer runs as Pass 2 (`POST /api/writing/vocabulary`); output `{word, suggestion, reason}[]`; rendered as "Vocabulary" section in feedback panel, always on submit
- [x] **Task 1.7**: Drafting Mode toggle on domain selector; structured outline fields (intro thesis, body ×2, conclusion); AI critiques outline structure before full essay textarea unlocks
- [x] **Multi-pass pipeline**: 3 sequential routes replace single evaluate call; UI shows pass-level progress indicators before rendering final `FeedbackResult`

## Phase 2 Sprint Tasks
- [x] **Task 2.1 — STT Integration**: `useSpeechInput` hook (Web Speech API); `MicInput` component with mic toggle + interim text display; integrated into Part 1, Part 2, and unified session
- [x] **Task 2.2 — Filler Detector**: `lib/ielts/feedback/filler-detector.ts` — regex scan, per-word counts, total; amber panel with filler badges and discourse marker suggestions shown at session end
- [x] **Task 2.3 — Unified Speaking Session**: `SpeakingSession` state machine at `/speaking/session`; Part 3 examiner prompt (`IELTS_PART3_EXAMINER_PROMPT`) added; `/api/chat` updated to support `mode=part3`; filler summary + vocabulary drawer integrated into ended stage
- [x] **Task 2.4 — Vocabulary Builder**: `VocabularyDrawer` integrated post-session in all three speaking routes; real-time word swap suggestions via `/api/vocabulary/lookup`