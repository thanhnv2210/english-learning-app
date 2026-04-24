# PDR-0012: Essay Builder Design

- **Status**: Accepted
- **Date**: 2026-04-24
- **Phase**: 3

## Context

The Vocabulary Library and Collocation Library give users curated word lists and phrases, but there was no tool to put them into practice together. Users needed a way to generate realistic IELTS sample essays and speaking responses that incorporate their saved vocabulary and collocations in context — turning passive library browsing into active writing practice.

Six sub-decisions were required: (1) AI output format for long-form text, (2) versioning and persistence strategy, (3) selection persistence across sessions, (4) bonus coverage scanning, (5) the Analyse tab design, and (6) History tab filters and re-detect.

---

## Decision 1 — Delimiter-Based AI Output Instead of JSON

**Problem**: The initial implementation returned `{ topic, text }` as JSON. Small 7B models (qwen2.5-coder, llama3.1) reliably produce malformed JSON when the `text` value exceeds ~150 words — literal newlines appear inside string values, the model loses track of quote escaping, or the JSON is simply truncated before the closing `}`. IELTS Writing Task 2 responses are 250–280 words; JSON is not a viable container.

**Options considered:**

**Option A — Sanitize the JSON response**: strip control characters with a regex, then `JSON.parse`. Works for literal newlines but does not fix truncation — if the model stops mid-response, no amount of post-processing recovers the lost content.

**Option B — Delimiter-based format**: instruct the model to output named sections separated by fixed sentinel strings on their own lines (`---TOPIC---`, `---TEXT---`). The model never needs to quote or escape the essay body. Parsing uses regex capture groups rather than `JSON.parse`.

**Decision**: Use **Option B** — delimiter format.

```
---TOPIC---
<the question or task prompt, single line>
---TEXT---
<the full response, plain text, paragraphs separated by blank lines>
```

Regex extraction:
```ts
const topicMatch = raw.match(/---TOPIC---\s*\n([\s\S]*?)\n---TEXT---/)
const textMatch  = raw.match(/---TEXT---\s*\n([\s\S]+)/)
```

The `---TEXT---` pattern captures everything after the sentinel to end-of-output, so even a truncated essay is surfaced rather than silently failing. The same delimiter pattern is used for the Analyse tab (`---DOMAIN---`, `---SKILL---`, `---QUESTION---`).

**Root cause discovery**: `OLLAMA_DEBUG=true` was added as an env flag (`ollamaDebug(label, raw)` helper in `lib/ai-client.ts`) to log the full raw model output. This revealed that the model's last token was a markdown fence (` ``` `) with no closing JSON — confirming truncation rather than an escaping issue. The debug flag is the recommended first step for any future `generateText` parse errors.

---

## Decision 2 — Versioning via Existing `ai_generated_content` Table

**Options considered:**

**Option A — New `essay_builder_versions` table**: explicit schema, can add version-specific metadata. Requires a migration and adds a new table to maintain.

**Option B — Reuse `ai_generated_content`**: query by `(domain, skill)` with `LIMIT 5 ORDER BY created_at DESC`. The table already stores all required fields (`skill`, `domain`, `topic`, `selectedVocabulary`, `selectedCollocations`, `originalGeneratedText`, `decoratedText`, `targetBand`, `isFavorite`). No migration needed.

**Decision**: Use **Option B** — no new table.

`getVersionsByDomainSkill(domain, skill, limit = 5)` returns the 5 most recent records for the selected domain+skill combination. The same rows appear in the global History tab (`getAllEssayBuilderRecords`). Version numbering is display-only (v1–v5 based on list position); the database has no explicit version column.

**Version selection behaviour**: selecting a version restores `decoratedText`, `selectedVocabulary`, and `selectedCollocations` to the component state and recomputes bonus coverage for that record. Any subsequent "Save changes" or "Save to this essay" updates that specific record's row.

---

## Decision 3 — DB Persistence for Selections (Revised from localStorage)

**Problem**: The vocabulary and collocation checkboxes a user selects are valuable context. Losing them on page refresh or when switching devices creates friction that discourages library-building.

**Options considered:**

**Option A — Save selections to DB on every change**: consistent across devices, survives cache clears. Introduces a DB write on every checkbox toggle — potentially dozens per session.

**Option B — localStorage keyed by `essay-builder:${domain}:${skill}`**: zero-latency, no server round-trip, survives refresh. Does not survive clearing site data or switching devices.

**Option C — Debounced DB writes**: 800ms debounce collapses rapid checkbox toggles into a single write per burst. Cross-device, zero friction after the initial delay.

**Decision**: Initially implemented as **Option B** (localStorage). Later revised to **Option C** (debounced DB) to support cross-device and cross-browser access.

**Implementation**:
- `essay_builder_configs` table: `(userId, domain, skill)` composite PK, `selectedVocabulary` jsonb, `selectedCollocations` jsonb, `updatedAt`
- `upsertEssayBuilderConfig(domain, skill, vocab, colloc)` — Drizzle `onConflictDoUpdate` on composite PK
- `getEssayBuilderConfig(domain, skill)` — returns saved selections or `null`
- Client: `useEffect` with 800ms `setTimeout`/`clearTimeout` cleanup → `saveEssayBuilderConfigAction`; `loadConfig(domain, skill)` → `getEssayBuilderConfigAction` called on domain/skill change
- **Race-condition guard**: `isLoadingConfigRef = useRef(false)` — set to `true` before calling setState with loaded values; cleared via `setTimeout(..., 0)` after React processes state updates. This prevents the debounced save `useEffect` from firing with the just-loaded values and writing them back as if they were user changes.

If no saved config exists for a `(domain, skill)` pair, selections default to empty.

---

## Decision 4 — Bonus Coverage Scan (4-Tier Highlight System)

**Context**: After generation, the essay may naturally use vocabulary or collocations from the library that the user did not explicitly select. Surfacing these "bonus" matches serves two purposes: (1) it shows the user which library items are already in their productive vocabulary, and (2) it lets them retroactively add the items to their selection for future use.

**Decision**: After generation, scan `decoratedText` against the full `words` and `collocations` library (client-side, no API call). Items not in `selectedVocab`/`selectedColloc` but found in the text are shown as "bonus" with a distinct colour.

Four-tier highlight system (priority: first match wins, applied in order):

| Tier | Source | Colour |
|------|--------|--------|
| 1 | `selectedVocab` | Purple (`bg-purple-100 text-purple-800`) |
| 2 | `selectedColloc` | Blue (`bg-blue-100 text-blue-800`) |
| 3 | `bonusVocab` | Green (`bg-green-100 text-green-800`) |
| 4 | `bonusColloc` | Amber (`bg-amber-100 text-amber-800`) |

Bonus items are shown as clickable pills ("+ word") below the essay. Clicking promotes the item from bonus to selected, removes it from the bonus strip, and persists the updated selection to localStorage. The same scan runs when selecting a saved version.

The same 4-tier system is reused in the History tab's "Detect vocab & collocations" feature (see Decision 5).

---

## Decision 5 — Analyse Tab Design

**Context**: Users may have existing IELTS essays or speaking transcripts they want to analyse against their library — either self-authored texts or samples from other sources. Rather than forcing them to use the Builder tab to generate new content, an Analyse tab allows pasting arbitrary text and deriving context from it.

**Three sub-features:**

**1. AI detection** (`POST /api/essay-builder/analyse`): given the pasted text and the list of all domain names, the model returns the most fitting domain, the IELTS skill (`writing_task1 | writing_task2 | speaking`), and a realistic IELTS question the text could be responding to. Uses the same delimiter format as generation to avoid JSON issues.

**2. Library match highlighting**: after detection, the pasted text is highlighted using the same 2-tier system (purple for vocab matches, blue for collocation matches). This is read-only — the user is not modifying the text.

**3. Actions on the result**:
- **Load into Builder**: sets domain, skill, and pre-selects all matched library items, then switches to the Builder tab. The user can immediately generate a new version with these selections.
- **Save to History**: creates an `EssayBuilderRecord` from the pasted text — `topic` = generated question, `decoratedText` = pasted text, `selectedVocabulary`/`selectedCollocations` = library matches. The record appears in the History tab immediately (optimistic update). The save button disables after saving to prevent duplicates; re-running Analyse resets it.

---

## Decision 6 — History Tab: Filter + Re-Detect + Save Selections

**Filter**: client-side `useMemo` filter on `skill` (chip selector: All / Writing Task 1 / Writing Task 2 / Speaking) and `topic` (text search across `record.topic` and `record.domain`). No server round-trip; the full history is loaded once on page render.

**Re-detect in History**: each expanded `HistoryCard` can run "Detect vocab & collocations" independently. The scan compares `record.decoratedText` against the full library and surfaces bonus matches (items not in `record.selectedVocabulary`/`record.selectedCollocations`). This uses the same 4-tier highlight system as the Builder tab.

**Save detected selections**: "Save to this essay" merges bonus vocab and bonus colloc into the record's selection lists and persists via `updateEssaySelectionsAction` → `updateEssaySelections(id, mergedVocab, mergedColloc)`. The parent component updates `history` state and `versions` state optimistically so the History tab and the Builder's Versions strip both reflect the change without a page reload. After saving, the bonus strips clear (the items are now part of the selected set) and subsequent re-detection finds zero additional matches.

---

## Consequences

- `ai_generated_content` table serves both the Essay Builder (versioned practice) and the global History view. The `topic` field doubles as the "generated IELTS question" for both builder-generated and analyse-imported records.
- `essay_builder_configs` table holds one row per `(userId, domain, skill)` — the user's last saved selection state for each combination. Upserted on each debounced save; never grows beyond one row per pair.
- The 5-version limit per domain+skill is a display limit only — older records remain in the DB and appear in the History tab. Users can delete individual versions from the Builder's versions strip.
- The delimiter parsing regex (`/---TEXT---\s*\n([\s\S]+)/`) captures trailing whitespace and markdown fences if the model adds them. `trim()` is applied to all captured groups.
- `OLLAMA_DEBUG=true` should be set in `.env.local` when diagnosing any new `generateText` parse failure — it logs the full raw model output before any processing.
- The Analyse tab's "Load into Builder" function calls `loadVersions` after setting state, which is async. The domain/skill state update and version load are fire-and-forget; no race condition exists because `loadVersions` only reads state after the next render cycle.
- The `isLoadingConfigRef` guard is critical: without it, loading config from DB triggers the save `useEffect` (because state changed), which immediately writes the loaded values back — creating a redundant write on every domain/skill switch. The `setTimeout(..., 0)` clear ensures the guard stays `true` for the entire React render cycle triggered by the state update.
