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

## Phase 3: The "Target Switcher" (Weeks 6-10)
*Goal: Add flexibility for different goals (IELTS 7.5, TOEFL, etc.).*
- [ ] **Dynamic Scoring Profiles**: Refactor the evaluator to load different prompt templates based on the user's target.
- [ ] **Reading/Listening Modules**: Add practice for technical whitepapers or dev podcasts with IELTS-style comprehension questions.
- [ ] **Progress Analytics**: A dashboard showing "Distance to 6.5" across all 4 skills.

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