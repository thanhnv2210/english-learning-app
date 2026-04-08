# PDR-0008: Listening Simulator Design

- **Status**: Accepted
- **Date**: 2026-04-08
- **Phase**: 3

## Context

Phase 3 required a Listening module to complete the four IELTS skills. The real IELTS Listening test involves:
- Listening to a recorded conversation (Section 3: academic/professional context)
- Completing note-completion, sentence-completion, or gap-fill tasks while listening
- Two plays are not permitted in the real test — the recording plays once only

Three sub-decisions were required: (1) how to generate the audio, (2) how to structure the question format, and (3) whether to share the library pattern with Reading.

---

## Decision 1 — Browser TTS over external Audio API

**Options considered:**

**Option A — Pre-generate audio with a TTS API** (e.g., ElevenLabs, OpenAI TTS): produces natural speech with distinct voices; requires an API key, incurs cost per character, and introduces a network round-trip to generate and serve audio files.

**Option B — Browser `window.speechSynthesis`**: zero setup, zero cost, no API key, works offline, already available in Chrome on macOS. Voice quality is synthetic but sufficient for comprehension practice. Two voices can be assigned to Speaker A and Speaker B using the `getVoices()` API.

**Decision**: Use **Option B** — `window.speechSynthesis`.

This is consistent with the Web Speech API choice for STT in PDR-0006. The same principle applies: avoid external API dependencies for features where browser-native capability is adequate for the learning objective.

Implementation details:
- `pickVoices()` selects up to 2 English (`en`) voices from `speechSynthesis.getVoices()`
- If only 1 English voice is available, Speaker B uses the same voice with `pitch` offset as fallback
- Each conversation turn is queued as a separate `SpeechSynthesisUtterance` to allow pausing mid-conversation
- A `cancelledRef` flag is set before `speechSynthesis.cancel()` to distinguish user-initiated stop from natural end-of-speech
- Playback is capped at 2 plays. The counter increments on each full playback completion, and the Play button is disabled after 2 plays. (In a real exam only 1 play is allowed; 2 plays is used here to support learners building confidence.)

---

## Decision 2 — Note-Completion as the Primary Question Type

**Options considered:**

**Option A — Multiple choice**: simplest to score, but does not replicate IELTS Listening Section 3 format and gives the learner a guessing advantage.

**Option B — Short answer / free text**: more realistic but requires fuzzy matching to handle minor spelling variation.

**Option C — Note-completion (sentence with a single `___` gap)**: matches the real IELTS Section 3 format; the sentence provides enough context to identify the answer; answers are 1–3 words taken verbatim from the transcript, so exact string matching (case-insensitive, trimmed) is accurate.

**Decision**: Use **Option C** — note-completion with exact-match scoring.

The AI prompt (`LISTENING_SCRIPT_PROMPT`) enforces:
- 8 questions, each with exactly one `___` gap
- Answers are 1–3 words appearing verbatim in the transcript
- Questions ordered by the position the answer appears in the conversation
- Answers spread across the full conversation (not all in the first half)

The UI renders each sentence split on `___`:
```
<span>{before}</span><input /><span>{after}</span>
```

Answers are accepted during playback or after — the submit button is enabled as soon as the user has completed at least one full play. This replicates the real exam practice of writing answers while listening.

---

## Decision 3 — Shared Library Pattern with Reading

The Reading module (Task 3.3) established a domain-selection → library flow:
- Domain picker → two options: "Pick from Library" (random existing) or "Generate New" (auto-saves)
- `reading_passages` table stores generated content; `getLibraryCounts()` returns per-domain counts shown as badges

The Listening Simulator reuses this exact pattern:
- `listening_scripts` table: same shape (domain, title, jsonb content columns)
- `lib/db/listening.ts`: `saveListeningScript`, `getRandomScriptByDomain`, `getListeningLibraryCounts`
- `app/actions/listening.ts`: `saveScriptToLibrary`, `pickRandomScript` server actions
- The `listening-task.tsx` stage machine mirrors `reading-task.tsx`: `select → options → generating | loading → listening → submitted`

**Reason**: Consistency reduces cognitive load for both the user (same flow for all skill types) and future developers (same architectural pattern to extend). The library avoids redundant LLM calls for frequently-used domains.

---

## Consequences

- `window.speechSynthesis` voice availability varies by OS and browser. On macOS + Chrome, typically 10–20 English voices are available. On systems with only 1 voice, the pitch-fallback path kicks in — Speaker B sounds similar but distinguishable.
- Exact-match scoring means minor spelling errors (e.g. "microservices" vs "micro services") will be marked incorrect. Fuzzy matching is deferred to a later phase if user feedback indicates this is a pain point.
- The 2-play limit is enforced client-side only (no server state). A user could reload the page to reset the counter. This is acceptable for a solo-learner app with no competitive ranking.
- The `listeningScripts` table uses the same `domain` column as `readingPassages`, allowing future cross-skill library analytics (e.g. "you have 3 reading passages and 2 listening scripts on System Design").
- History saves use `skill: 'listening'` consistent with `skill: 'reading'` and `skill: 'speaking_full'`. The History page renders any `FeedbackResult` regardless of skill with no changes needed.
