# 🗺️ Project Roadmap: IELTS 6.5 for Engineers

## Phase 1: IELTS "Scorer" MVP (Weeks 1-2)
*Goal: Create a feedback loop based on IELTS 6.5 criteria.*
- [x] **IELTS Evaluation Engine**: Prompt Claude Code to act as an examiner. It must provide a "Mock Band" and specific "Band 7" improvement tips.
- [x] **Technical Writing Task 2**: Build an interface to write essays on tech topics (e.g., "Automation in the Workplace") with auto-scoring.
- [x] **Target Profile System**: Implement `users.targetProfile` in DB (hardcoded to `IELTS_6.5`; `targetBand` flows into feedback for Speaking + Writing).

## Phase 2: Speaking & Fluency (Weeks 3-5)
*Goal: Master the Speaking interview using technical context.*
- [ ] **IELTS Part 2 Simulator**: AI generates "Cue Cards" like: *"Describe a complex technical problem you solved"*.
- [ ] **STT Feedback Loop**: Use Whisper for Speech-to-Text to analyze "Hesitation Fillers" (um/ah) and recommend discourse markers (e.g., "As far as I'm concerned").
- [ ] **Vocabulary Builder**: Integrate the Academic Word List (AWL) into the technical chat sessions.

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
- [ ] **Task 1.5**: Design a "Band 6.5 vs 7.0" prompt template that highlights precisely what needs to change to move up one half-band.
- [ ] **Task 1.6**: Implement a "Vocabulary Replacer" that identifies basic dev-slang and suggests more formal academic equivalents for IELTS.
- [ ] **Task 1.7**: Create a "Drafting Mode" where you can outline your essay before writing, and the AI critiques your logic/structure first.