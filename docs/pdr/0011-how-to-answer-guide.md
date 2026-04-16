# PDR-0011: How to Answer Guide

- **Status**: Accepted
- **Date**: 2026-04-17
- **Phase**: 3

## Context

The app trains users on IELTS skills through active practice (speaking, writing, reading, listening simulators) but provides no reference material explaining *how* to approach each question type. Users — particularly software engineers unfamiliar with IELTS format — benefit from structured strategy guides before or between practice sessions. A dedicated section was needed.

Three sub-decisions were required: (1) static vs. AI-generated content, (2) navigation placement, and (3) content structure per question type.

---

## Decision 1 — Static Content Over AI-Generated

**Options considered:**

**Option A — AI-generated tips on demand**: flexible, personalised, always fresh. Requires an LLM call per page load or per question type, introduces latency, and risks inconsistent or incorrect IELTS advice.

**Option B — Static content authored once**: zero latency, fully controlled, deterministic. Content can be reviewed for accuracy before shipping and updated as a deliberate editorial decision rather than incidentally on every render.

**Decision**: Use **Option B** — fully static content in `lib/guides/<skill>.ts`.

IELTS strategy is well-established and does not change. The value is in the quality and accuracy of the advice, not in its novelty on each visit. Static content also means no API cost, no error handling for AI failures, and no risk of the guide giving contradictory advice across sessions.

The `lib/guides/` directory is separate from `lib/ielts/` (which contains prompts and scoring logic) to make clear that guide content is editorial, not computational.

---

## Decision 2 — Top-Level Navigation Item

**Options considered:**

**Option A — Links within each skill module**: a "Tips" tab or button inside `/listening`, `/reading`, etc. Contextually close to practice but fragments the reference material across multiple routes.

**Option B — Top-level "How to Answer" nav item below History**: a single destination for all strategy guides regardless of which skill the user is currently practising. Consistent with how IELTS candidates use reference material — they study strategies separately from active practice.

**Decision**: Use **Option B** — top-level nav item `{ href: '/how-to-answer', label: 'How to Answer', icon: '💡' }` added below History in `NavSidebar`.

The landing page at `/how-to-answer` shows all four skills. Completed guides link through; unimplemented ones show a "Coming soon" badge. This establishes the full scope visually without blocking on incomplete content.

---

## Decision 3 — Content Structure Per Question Type

Each question type entry in `LISTENING_GUIDES` follows this fixed schema:

```typescript
type QuestionTypeGuide = {
  id: string
  name: string
  description: string      // What the question type looks like
  wordLimit: string        // Displayed as an amber callout — most common source of lost marks
  steps: string[]          // Numbered step-by-step approach — shown first
  strategies: string[]     // Key strategies — bullet points
  mistakes: string[]       // Common mistakes to avoid — red ✕ markers
}
```

**Step-by-step approach is placed first** within each guide because it is the most actionable content. A user under time pressure reads the steps and can immediately apply them. Strategies and mistakes provide depth for users who want to understand the reasoning.

The word limit is surfaced as a separate amber callout rather than buried in the steps because exceeding the word limit is the single most common avoidable error in IELTS Listening, regardless of question type.

---

## Decision 4 — Computer-Based Test (CBT) First

All advice is written specifically for IELTS on Computer (IoC), which is now the dominant delivery format. Paper-based assumptions were explicitly removed:

| Paper-based assumption | CBT replacement |
|---|---|
| Underline keywords on the question sheet | Jot one keyword per question on scratch paper provided at the test centre |
| Cross out / tick options on the page | Track confirmed (✓) and eliminated (✗) options on scratch paper; click on screen when confident |
| Circle the letter for multiple choice | Click the option — no typing needed |
| Write answers in gaps | Type answers into on-screen input fields |
| Write a guess and move on | Type a guess, flag the question if the interface allows, return at review time |

The "Before the Recording Starts" callout is displayed as a **"CRITICAL SKILL"** banner above the question-type accordions because time management during the reading phase is the most common cause of lost marks and applies to every question type equally. It opens by default so first-time visitors cannot miss it.

---

## Consequences

- `lib/guides/` is a new directory distinct from `lib/ielts/`. Future skill guides follow the same pattern: create `lib/guides/<skill>.ts`, add a `how-to-answer/<skill>/page.tsx` (server component), and a `<skill>-guide.tsx` client component with the accordion UI.
- The `ListeningGuide` client component handles the accordion open/close state locally — no URL params, no DB. This keeps the guide stateless and fast.
- Reading, Writing, and Speaking guides are marked "Coming soon" on the landing page. Their routes do not exist yet; clicking them will 404 until implemented.
- Content accuracy is an editorial responsibility. When IELTS format changes (e.g. new question types introduced by the British Council), `lib/guides/<skill>.ts` must be manually updated.
