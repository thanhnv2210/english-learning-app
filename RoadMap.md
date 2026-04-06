# 🗺️ Project Roadmap: IELTS 6.5 for Engineers

## Phase 1: IELTS "Scorer" MVP (Weeks 1-2)
*Goal: Create a feedback loop based on IELTS 6.5 criteria.*
- [x] **IELTS Evaluation Engine**: Prompt Claude Code to act as an examiner. It must provide a "Mock Band" and specific "Band 7" improvement tips.
- [x] **Technical Writing Task 2**: Build an interface to write essays on tech topics (e.g., "Automation in the Workplace") with auto-scoring.
- [x] **Target Profile System**: Implement `users.targetProfile` in DB (hardcoded to `IELTS_6.5`; `targetBand` flows into feedback for Speaking + Writing).

## Phase 2: Speaking & Fluency (Weeks 3-5)
*Goal: Voice-first practice with filler detection and vocabulary coaching.*
- [ ] **Voice Input (STT)**: Browser MediaRecorder → audio blob → `POST /api/stt` → Whisper transcription; replaces typed input in speaking sessions
- [ ] **Hesitation Filler Detection**: Post-transcription scan for `um`, `ah`, `uh`, `like`, `you know`; count + flag per response in session summary
- [ ] **Unified Speaking Flow**: Single session covering Part 1 → Part 2 (prep + speak) → Part 3; timer-driven transitions replace separate routes
- [ ] **Vocabulary Builder**: AWL-based sidebar that detects informal/slang words in the user's typed or transcribed response and suggests academic alternatives in real time

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
- [ ] **Task 2.1 — STT Integration**: Browser audio capture (MediaRecorder API, WebM/opus) → `POST /api/stt` → Whisper transcription → returned as text; speaking input switches from keyboard to microphone
- [ ] **Task 2.2 — Filler Detector**: Post-transcription scan using regex; count per response; display in per-turn annotation and session summary; flag discourse marker opportunities
- [ ] **Task 2.3 — Unified Speaking Session**: Merge Part 1, Part 2, Part 3 into one continuous session flow; `SpeakingSession` state machine drives transitions; separate `/speaking/part1`, `/speaking/part2` routes remain as entry points that resume mid-session
- [ ] **Task 2.4 — Vocabulary Builder**: Embedded AWL lookup; after each response surface 2–3 words the user used that have a stronger academic equivalent; shown in a non-blocking panel (does not interrupt examiner flow)