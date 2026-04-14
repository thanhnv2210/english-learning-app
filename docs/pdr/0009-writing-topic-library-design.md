# PDR-0009: Writing Topic Library Design

- **Status**: Accepted
- **Date**: 2026-04-15
- **Phase**: 3

## Context

Prior to this decision, Writing Task 2 topics were ephemeral: a server action (`generateWritingTopic`) called Ollama on every session, returned a plain text string, and discarded it — nothing was persisted. This meant:

- The same prompt was re-generated repeatedly, often producing near-identical topics due to LLM determinism at low temperature
- No way to curate or revisit previously generated topics
- No consistency with the Reading and Listening library pattern already established in Phase 3

Three sub-decisions were required: (1) whether to adopt the library pattern for Writing, (2) how to classify topic types, and (3) how to ensure topic variety across generations.

---

## Decision 1 — Adopt the Shared Library Pattern

**Options considered:**

**Option A — Keep topics ephemeral**: simplest, no schema change. Topics remain one-time throwaway strings. Does not solve the repetition problem.

**Option B — Add a `writing_topics` library table**: follows the exact same pattern as `reading_passages` and `listening_scripts`. Domains show library count badges; users choose "Pick from Library" or "Generate New"; generated topics are auto-saved.

**Decision**: Use **Option B** — `writing_topics` library table.

Table schema:
```
writing_topics: id, domain, prompt, task_type, rank, createdAt
```

Stage machine updated from:
```
select → generating → (drafting | writing) → ...
```
to:
```
select → options → (library | generating | loading) → (drafting | writing) → ...
```

The `options` stage mirrors Reading and Listening exactly: two cards — "Pick from Library" (shows saved count, disabled if 0) and "Generate New" (always available).

The `library` stage (unique to Writing) allows the user to browse and select a specific saved topic rather than receiving a random one. Reading and Listening use random pick because their content (full passage + 10 questions, full transcript + 8 questions) is large enough that any entry is sufficiently distinct. Writing topics are short prompts where the user may want to revisit a specific question intentionally.

**Back navigation** is available at every stage from `options` through `writing`/`drafting`, allowing the user to swap topics without restarting the session.

---

## Decision 2 — Topic Type Classification (`task_type`)

IELTS Writing Task 2 has four recognised question types, each requiring a distinct essay structure. The original prompt returned only a text string with no metadata.

**Decision**: Add `task_type` to every saved topic. Values: `opinion | discussion | problem_solution | two_part`.

This classification:
- Is displayed as a badge on the topic card throughout the session (generation → writing → results)
- Is shown in the library browser so users can see at a glance what structure each saved topic requires
- Is determined by the generation prompt, not post-hoc inference

The `taskType` is hardcoded into the JSON schema the prompt returns, matching the task type the prompt was instructed to generate — eliminating the risk of a mismatch between the written question and its label.

---

## Decision 3 — Ensuring Topic Variety at Generation Time

**Problem**: LLMs with a fixed prompt tend to produce nearly identical outputs across calls (the model's default decoding is deterministic or near-deterministic at standard temperature settings).

**Options considered:**

**Option A — Increase model temperature**: reduces determinism but increases the chance of malformed JSON output. Not reliable.

**Option B — Inject randomness into the prompt itself**: pick a task type and a specific sub-topic angle at call time, embed both into the prompt, and instruct the model to write specifically to that angle.

**Decision**: Use **Option B** — caller-side randomisation baked into the prompt.

`TOPIC_GENERATION_PROMPT(domain)` now:
1. Randomly selects one of the four `task_type` values
2. Randomly selects a specific angle from a curated list per domain (e.g. for `AI & Automation`: "AI replacing junior developers", "LLMs in production systems", "bias in AI hiring tools", etc.)
3. Passes the chosen `task_type` and `angle` into the prompt as explicit constraints
4. Locks the returned `taskType` JSON field to the pre-selected value — the model cannot deviate

This guarantees output variety without relying on model temperature and produces questions that are more specific and IELTS-realistic than a generic domain-level prompt.

---

## Decision 4 — Topic Generation Moved from Server Action to API Route

The original `generateWritingTopic` was a Next.js server action. When the library was added, the route needed to auto-save the generated topic to the DB as a side-effect of generation.

**Decision**: Move topic generation to `POST /api/writing/topic`, consistent with `POST /api/reading/passage` and `POST /api/listening/script`.

**Why**: Server actions with significant side-effects (DB writes + external LLM calls) are harder to observe and debug than API routes. Route handlers allow standard HTTP tooling (curl, Postman, network tab) for testing. The server action file (`app/actions/writing.ts`) is now limited to thin DB wrappers: `saveTopicToLibrary` and `pickRandomTopic`.

---

## Consequences

- The `writing_topics` table grows with every "Generate New" call. Unlike Reading (passages are large, generation is slow) there is no performance penalty to generating many writing topics. Duplicate-similar topics may accumulate over time; deduplication is deferred.
- The library browser shows full prompt text for each topic. Since prompts are 2–4 sentences, this is readable inline without truncation.
- Drafting mode is fully compatible with both library-picked and newly-generated topics — the mode toggle on the select screen is preserved regardless of topic source.
- The `task_type` field is stored as plain text, not an enum constraint, to allow future extension without a migration.
