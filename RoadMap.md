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
- [x] **Progress Analytics**: `/analytics` dashboard — rolling band average per skill per criterion, trend over time, "Distance to target" summary
- [x] **Essay Builder**: `/essay-builder` — select vocab + collocations → generate sample essay/speaking response; versioning (5 per domain+skill); Analyse tab (paste text → detect domain/skill/question); History tab with filter + re-detect + save selections
- [x] **Target Switcher UI**: `/settings` page — profile selector (`IELTS_6.5`, `IELTS_7.5`, `Business_Fluent`); update `users.targetProfile` via server action; load different prompt templates per profile
- [x] **Reading Module**: AI-generated tech-themed IELTS passages (~750 words) with 10–13 questions (T/F/NG, matching headings, short answer); 20-min timer; auto-scoring; saved to history as `skill: 'reading'`
- [x] **Listening Simulator**: AI-generated tech conversation transcript; browser TTS (`SpeechSynthesis`) reads it aloud; user completes note-completion blanks during/after playback; auto-scored; saved to history as `skill: 'listening'`

## Phase 3 Sprint Tasks

### Task 3.1 — Progress Analytics Dashboard ✅
- Route `/analytics`; nav item added to `STANDALONE_BOTTOM`
- Queries all `mock_exams` rows with non-null `feedback` jsonb; groups by skill; computes per-skill stats in JS
- `lib/db/analytics.ts`: `getAnalyticsStats()` → `SkillStats[]` (sessionCount, avgBand, targetBand, gap, criteriaStats, recentSessions)
- **Summary bar**: total sessions · skills at target · strongest skill
- **Per-skill card**: avg band (colour-coded) · target · gap badge (green/amber/red) · criteria breakdown with inline progress bars + target marker · trend dots (last 5 sessions, colour by band vs target)
- Empty state with direct links to each practice module

### Task 3.16 — Essay Builder → Writing Evaluator Integration ✅
- "Evaluate essay" button appears in Builder result view for `writing_task1` and `writing_task2` skills only
- Runs the same 2-pass pipeline as the Writing module: `POST /api/writing/audit` (word count + notes) → `POST /api/writing/score` (streaming → `FeedbackResult`)
- Shows word count inline while scoring streams; renders parsed band scores + per-criterion keyPoints identical to `FeedbackView`
- "↻ Re-evaluate" button to re-run after editing the essay
- Eval state resets automatically when a different version is selected

### Task 3.2 — Target Switcher UI ✅
- Route `/settings` — 3 profile cards with active-state ring highlight
- Profile values: `IELTS_Academic_6.5`, `IELTS_Academic_7.5`, `Business_Fluent`
- `updateTargetProfileAction` (server action, `app/actions/user.ts`) — updates DB + `revalidatePath('/', 'layout')`; only async functions exported from `'use server'` files
- `DashboardLayout` made `async` to fetch `getDefaultUser()` and pass `targetProfile` prop to `NavSidebar`
- `NavSidebar` updated: accepts `targetProfile` prop, `formatTargetLabel()` renders dynamic label in both header and footer badge; Settings link added to `STANDALONE_BOTTOM`
- `SettingsForm` client component uses `useTransition` for non-blocking server action call

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

### Task 3.4 — Listening Simulator ✅
- Route `/listening`; API `POST /api/listening/script`
- AI generates a Section 3-style 2-person tech conversation: Speaker A (engineer) + Speaker B (PM); 10–14 turns, 250–350 words; 8 note-completion questions with exact 1–3 word answers verbatim from the transcript
- **Library pattern** (mirrors Reading): `listening_scripts` DB table; domain selector → "Pick from Library" (random, count badge) or "Generate New" (auto-saves); server actions in `app/actions/listening.ts`; `lib/db/listening.ts` helpers
- **Browser TTS** (`window.speechSynthesis`): `pickVoices()` selects 2 English voices for A/B; pitch variation fallback if only 1 voice found; utterances queued per turn; `cancelledRef` used for clean mid-speech cancellation; 2-play max enforced client-side
- **Note-completion UI**: each question's sentence split on `___` → rendered as `<span>before</span><input/><span>after</span>`; answers accepted during or after playback; submit enabled after ≥ 1 play
- `scoreListening(questions, userAnswers)`: case-insensitive trimmed string comparison; `estimateBand(correct, total)`: 90%→7.5, 80%→7.0, 70%→6.5, 60%→6.0, 50%→5.5, else 5.0
- Results: per-question correct/incorrect indicators; transcript revealed post-submit; saved as `skill: 'listening'` via `saveFeedback`
- Nav sidebar updated: Listening link (🎧) added after Reading
- See [PDR-0008](./docs/pdr/0008-listening-simulator-design.md) for design rationale

### Task 3.5 — Vocabulary Search ✅
- `VocabSearch` component at `/vocabulary`; `POST /api/vocabulary/search` — checks DB first (`findWord`), falls back to AI generation (`VOCAB_SEARCH_PROMPT`); auto-detects domains; "Add to Library" for AI-generated cards; saved words show read-only

### Task 3.14 — Vocabulary Enhancements ✅
- **Rank field**: `vocabulary_words.rank` (integer 1–5, default 3, CHECK constraint); inline star widget on every card; `updateVocabularyRankAction` + `revalidatePath('/vocabulary')`
- **User-added flag**: `vocabulary_words.userAdded` boolean; two-step delete confirmation only for user-added words; "Added" badge on card header
- **Library controls**: sort dropdown (A→Z, Z→A, Rank high→low, Rank low→high, Newest, Oldest) + rank filter chips (★–★★★★★); filter and sort compose in `useMemo`
- **Favourite domains** (`user_skill_topics` table, skill=`'vocabulary'`): lazy default seeding on first visit (Technology, Environment, Education, Health, Economy, Work); pinned domain chips + `···` dropdown for others; ★ unpin / ☆ pin buttons; `toggleVocabFavoriteAction` + `revalidatePath('/vocabulary')`; pattern ready for speaking/writing/listening/reading (backlog)
- **Pronunciation** (`vocabulary_words.pronunciation` nullable jsonb `{ uk, us, ukAudio?, usAudio? }`):
  - `POST /api/vocabulary/pronunciation` — Free Dictionary API first (no key, real IPA + CDN audio URLs), AI fallback (`VOCAB_PRONUNCIATION_PROMPT`) when offline
  - UK/US detection: US = entry with `-us` in audio URL; UK = first non-US entry with IPA text
  - WordCard: IPA chips with ▶ play button (browser `Audio` API); `↻` refresh when AI-sourced (no audio URLs); `✎` manual edit form (two `font-mono` inputs); `enter manually` link when no pronunciation yet
  - Manual `updateWordPronunciationAction` merges IPA text with existing audio URLs
  - Offline workflow: AI generates IPA → `↻` upgrades to real API data when back online

### Task 3.6 — Writing Topic Library ✅
- `writing_topics` table (`domain`, `prompt`, `taskType`, `rank`); domain selector → "Pick from Library" (browse by domain, select specific) or "Generate New" (`POST /api/writing/topic`); `task_type` badge shown throughout session
- Back navigation: `options → select`, `library → options`, `writing/drafting → options`

### Task 3.7 — How to Answer Guide ✅
- Route `/how-to-answer` — skill landing; per-skill accordion pages for Listening (7 types), Reading (9 types), Writing (Task 1 + Task 2), Speaking (3 parts)
- Fully static — `lib/guides/<skill>.ts` → server page → client accordion

### Task 3.8 — Topic Ideas ✅
- Route `/topic-ideas` — skill selector; `/topic-ideas/[skill]` — card grid; `/topic-ideas/[skill]/[topicId]` — framework tabs + detail
- 10 topics × ~2 frameworks; fully static in `lib/topic-ideas/index.ts`

### Task 3.9 — Connected Speech Analyser ✅
- Route `/connected-speech`; `POST /api/connected-speech/analyse` — `generateText` (full JSON), strips markdown fences before `JSON.parse`
- Detects 7 phenomena: elision, assimilation, catenation, intrusion, weakening, contraction, gemination
- Part 1: Full sentence view (colour-highlighted spans) or Phrase-by-phrase toggle
- Part 2: Pronunciation tips grouped by phenomenon with colour-coded badges
- Reference accordion: static `PHENOMENON_META` with explanation + 2 examples per phenomenon
- History: `connected_speech_analyses` table; filter by phenomenon; delete on hover
- Recommended model: `llama3.1:8b` or `gemma2:9b` (general-purpose phonetics); `qwen2.5-coder:7b` lacks phonetic knowledge

### Task 3.10 — Collocation Library ✅
- Route `/collocations`; `POST /api/collocations/search` — `generateText` (full JSON), two modes: `word` (returns array) and `phrase` (validates single collocation)
- `collocation_entries` table: `phrase` (unique, lowercase), `type`, `explanation`, `skills` (jsonb `CollocationSkill[]`), `examples` (jsonb `string[]`), `rank` (integer 1–5, default 3, CHECK constraint)
- `CollocationSkill` type: `'Writing_1' | 'Writing_2' | 'Speaking'` — AI-suggested, user-editable before and after save
- Search UI: shared input + two buttons ("By Word" / "By Phrase"); "By Phrase" shows invalid reason if not a real collocation
- **Lowercase normalization**: query lowercased before AI prompt; AI-returned phrases lowercased before DB ops; `saveCollocation` lowercases on insert
- **Rank (1–5)**: inline star widget per card; `updateCollocationRankAction` + `revalidatePath('/collocations')`; DB orders by `rank DESC, createdAt DESC`
- **Delete confirmation**: two-step inline "Delete? Yes / No"; `deleteCollocationAction` + `revalidatePath('/collocations')`
- **Library controls**: text search + skill filter chips + rank filter chips (★–★★★★★) + sort dropdown (6 options: rank↑↓, date↑↓, A→Z, Z→A); all compose in `useMemo`
- `lib/ielts/collocations/prompts.ts`: `COLLOCATION_BY_WORD_PROMPT` → `{ collocations: CollocationResult[] }`, `COLLOCATION_BY_PHRASE_PROMPT` → `{ valid, ...CollocationResult } | { valid: false, reason }`

### Task 3.15 — Essay Builder ✅
- Route `/essay-builder` — three-tab layout: Builder · History · Analyse
- **Builder tab**: domain selector (from `writing_domains`) + skill chips (Writing Task 1 / Task 2 / Speaking) + vocabulary checklist + collocation checklist → `POST /api/essay-builder/generate` → generated topic + sample essay
- **AI output format**: delimiter-based (`---TOPIC---` / `---TEXT---`) replacing JSON — 7B models truncate or corrupt JSON when generating 250+ word bodies; delimiters are model-safe; parsed with regex capture groups
- **Versioning**: last 5 per `(domain, skill)` from `ai_generated_content`; auto-saved on generate; version strip (v1–v5) with two-step delete; selecting a version restores text + selections + bonus coverage
- **DB config persistence**: selections persisted to `essay_builder_configs` table (`(userId, domain, skill)` composite PK, `selectedVocabulary` / `selectedCollocations` jsonb); loaded via `getEssayBuilderConfigAction` on domain/skill change; auto-saved with 800ms debounce via `saveEssayBuilderConfigAction`; `isLoadingConfigRef` guard prevents debounce firing during load; cross-device and cross-browser access (previously localStorage, revised to DB)
- **4-tier highlight**: selected vocab (purple) · selected colloc (blue) · bonus vocab (green) · bonus colloc (amber); first match wins; bonus items are clickable pills to promote to selection
- **Bonus coverage scan**: post-generation client-side scan of full library against generated text; unselected matches shown as green/amber bonus strip
- **Edit mode**: inline textarea for modifying `decoratedText`; "Save changes" → `updateDecoratedTextAction` → DB
- **Analyse tab**: paste raw text → `POST /api/essay-builder/analyse` (delimiter format: `---DOMAIN---` / `---SKILL---` / `---QUESTION---`) → detected domain, skill badge, generated IELTS question; library matches highlighted; "Load into Builder" pre-fills state + switches tab; "Save to History" → `saveEssayAction` with pasted text as `decoratedText`, detected question as `topic`
- **History tab**: filter by skill (chips) + topic/domain text search (client-side `useMemo`); per-card "Detect vocab & collocations" button scans `decoratedText` against library; "Save to this essay" → `updateEssaySelectionsAction` merges bonus into `selectedVocabulary`/`selectedCollocations` + optimistic update
- **DB table**: `ai_generated_content` — shared by Builder versioning and History global view; `selectedVocabulary` and `selectedCollocations` are mutable jsonb columns updated by `updateEssaySelections`
- **Server actions** (`app/actions/essay-builder.ts`): `saveEssayAction`, `getVersionsAction`, `updateDecoratedTextAction`, `updateEssaySelectionsAction`, `toggleEssayFavoriteAction`, `deleteEssayAction`, `getEssayBuilderConfigAction`, `saveEssayBuilderConfigAction`
- **Prompts** (`lib/ielts/essay-builder/prompts.ts`): `ESSAY_BUILDER_PROMPT(skill, domain, vocabulary, collocations, targetBand)`, `ESSAY_ANALYSE_PROMPT(text, domains)`
- See [PDR-0012](./docs/pdr/0012-essay-builder-design.md) for all design decisions

### Task 3.17 — Essay Builder Config DB Persistence ✅
- Moved selection persistence from localStorage to `essay_builder_configs` DB table for cross-device access
- `essay_builder_configs`: `(userId, domain, skill)` composite PK; `selectedVocabulary` / `selectedCollocations` jsonb; `updatedAt`
- Drizzle `onConflictDoUpdate` upsert on composite PK — one row per user/domain/skill pair, no unbounded growth
- 800ms debounce collapses rapid checkbox toggles into a single write per burst
- `isLoadingConfigRef = useRef(false)` race-condition guard: set `true` before applying loaded config to state; cleared via `setTimeout(..., 0)` after React render cycle — prevents the save `useEffect` from treating the load as a user change

### Task 3.12 — AI Prompt Library ✅
- Route `/prompt-library` — 5 practice prompts × 4 skills (Speaking, Writing, Reading, Listening) × 3 platforms (Claude, ChatGPT, Gemini) = 60 prompts
- Fully static — `lib/prompt-library/index.ts` exports `getPromptLibrary(targetBand, targetProfile)`; band and goal line interpolated at call time
- `Business_Fluent` profile: band references replaced with "professional business English" throughout
- `PLATFORM_META`: label, icon, and platform-specific usage tip per platform
- **Token input UI**: `[BRACKETED]` placeholders parsed into labeled input fields (label from token text, placeholder from `e.g.` clause); prompt preview highlights unfilled tokens amber, filled tokens blue; copy button copies fully assembled text
- Copy button turns blue when all fields are filled; icon swaps to checkmark for 2s on copy
- Backlog: Examiner prompts (interactive session), Evaluator prompts (grade my response)
- Added to Guides group in nav sidebar

### Task 3.13 — Target Switcher UI ✅
- See Task 3.2 — implemented as part of Phase 3 completion

### Task 3.11 — Nav Sidebar Reorganisation ✅
- Sidebar reorganised from a flat list into collapsible groups to reduce visual clutter
- **Practice**: Speaking (Full), Speaking Pt 1, Speaking Pt 2, Writing, Reading, Listening
- **Tools**: Vocabulary, Collocations, Connected Speech
- **Guides**: How to Answer, Topic Ideas
- Dashboard and History remain standalone (not grouped)
- Group containing the active page auto-opens on load; group label turns blue when active; items indented inside open groups

## Phase 4: Progress Focus & Community
- [x] **Wrong Decision Log**: Manual mistake journal — record wrong answers with source text, reasoning, correct answer, AI analytic, solution, and question role tags.
- [x] **Paraphrase Guide**: Static guide covering all 4 IELTS skills (Writing, Reading, Speaking, Listening) × 3 difficulty levels (Beginner / Intermediate / Advanced) with expandable examples, change tables, and exam tips.
- [ ] **Question Anatomy deep-dive**: Interactive practice mode for decoding question structure (role identification drill or try-it-yourself mode).
- [ ] **Peer Review Mode**: Let other "Tech Guys" review each other's practice essays.
- [ ] **Official Mock Integration**: Connect to official [IELTS by IDP](url) or [British Council](url) resources for final testing.
- [ ] **User Roles System**: Multi-role support — `admin`, `student`, `admin of a student group` (group admin manages a cohort); currently single-user (`DEFAULT_EMAIL`); requires auth layer and RBAC before implementation.

## Phase 4 Sprint Tasks

### Task 4.1 — Wrong Decision Log ✅
- Route `/wrong-decisions` — mistake journal for all 4 skills; standalone item in nav sidebar (`STANDALONE_BOTTOM` between Analytics and History)
- **Entry**: skill selector + source text (optional) + question + my thought + correct answer + AI Analyse button + analytic + solution + question role chip toggles + Save
- **AI analysis**: `POST /api/wrong-decisions/analyse` — delimiter format (`---ANALYTIC---` / `---SOLUTION---` / `---ROLES---`); roles validated against known `QuestionRole` list before returning; `WRONG_DECISION_PROMPT` in `lib/ielts/wrong-decisions/prompts.ts`
- **Question roles**: 7 roles from Question Anatomy (`question-word`, `category`, `exclusion`, `hedge`, `relationship`, `target`, `time`); AI-suggested, user-editable at any time; colour-coded badges match Question Anatomy page
- **Stats bar**: total logged · most error-prone skill · most missed role; skill breakdown mini-bars
- **Filters**: skill chips + role chips (only roles present in data) + text search — all client-side `useMemo`
- **Cards**: collapsed = skill badge + question + role badges + date; expanded = source text · my thought (red) / correct answer (green) · analytic/solution (violet) · roles · Edit mode with re-analyse button · two-step delete
- **Analytics page**: `WrongDecisionCard` appended to `/analytics` — total, most-missed role, most-error skill, link to full log
- **DB**: `wrong_decision_logs` — `(userId, skill, sourceText?, question, myThought, actualAnswer, analytic?, solution?, questionRoles jsonb, createdAt)`
- **Server actions** (`app/actions/wrong-decisions.ts`): `saveWrongDecisionAction`, `updateWrongDecisionAction`, `deleteWrongDecisionAction` — all call `revalidatePath('/wrong-decisions')`

### Task 4.2 — Paraphrase Guide ✅
- Route `/paraphrase` — fully static guide (no DB, no AI); added to Guides group in nav sidebar
- **4 skill tabs**: Writing (amber) · Reading (blue) · Speaking (green) · Listening (purple)
- **3 level pills per skill**: L1 Beginner (green) · L2 Intermediate (amber) · L3 Advanced (purple)
- **Technique blocks**: name + description + expandable example cards; each card: original → paraphrased → ChangeTable (from / to / reason, mono) → optional trap callout
- **Writing**: L1 Synonym Substitution · L2 Structural Restructuring · L3 Concept-Level Rewrite
- **Reading**: L1 Recognising Synonyms · L2 Structural Paraphrase Recognition · L3 Concept-Level & Distractor Traps
- **Speaking**: L1 Restating the Question · L2 Structural Reformulation · L3 Concept-Level Reformulation (self-correction repair strategy)
- **Listening**: L1 Recognising Spoken Synonyms · L2 Structural Paraphrase in Audio · L3 Distractor Traps
- Content: `lib/guides/paraphrase.ts` → `paraphrase/page.tsx` (server) → `paraphrase/paraphrase-guide.tsx` (client)
- Interactive practice deferred to backlog; connection to practice sessions deferred

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