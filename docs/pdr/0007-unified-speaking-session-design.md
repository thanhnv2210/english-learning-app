# PDR-0007: Unified Speaking Session Design

- **Status**: Accepted
- **Date**: 2026-04-07
- **Phase**: 2

## Context

Phase 1 shipped speaking as two separate routes:
- `/speaking` — Part 1 (4–5 examiner questions, text input)
- `/speaking/part2` — Part 2 (cue card generation, 1-min prep, 2-min speak, text input)

Part 3 did not exist. The user had to navigate between routes manually, which broke the realism of the speaking test — in the real IELTS exam all three parts flow continuously in a single sitting.

Three architectural options were considered for Phase 2:

**Option A — Extend existing routes**: Add Part 3 as a third separate route (`/speaking/part3`) and link the routes via `examId` in query params.

**Option B — Replace existing routes with one unified page**: Delete `/speaking` and `/speaking/part2`; create a single `/speaking/session` that runs all three parts.

**Option C — New unified route, keep existing routes intact**: Create `/speaking/session` as the primary full-session experience. Keep `/speaking` and `/speaking/part2` as standalone entry points for focused single-part practice.

## Decision

Use **Option C**.

The `SpeakingSession` component (`src/app/(dashboard)/speaking/session/speaking-session.tsx`) implements a state machine:

```
idle → part1 → part2_generating → part2_prep → part2_speaking → part3 → ended
```

Each stage renders the appropriate UI, examiner prompt, and timer. Three separate `useChat` instances are maintained (one per part) so that each part has its own message history. At session end, all transcripts are concatenated (tagged `[Part 1]`, `[Part 2]`, `[Part 3]`) and saved as a single `mockExams` row with `skill: 'speaking_full'`.

Filler detection (`detectFillers()`) runs over the concatenated user text from all three parts at session end and surfaces counts in an amber badge panel before the feedback prompt.

The nav sidebar lists "Speaking (Full)" (`/speaking/session`) as the primary entry point. The standalone Part 1 and Part 2 routes remain visible for focused practice or when the user only has time for one part.

The `IELTS_PART3_EXAMINER_PROMPT(cueCardTopic)` function was added to `part2-prompt.ts`. It receives the Part 2 cue card topic so Part 3 questions are analytically linked to what the candidate just spoke about — matching real IELTS test structure. The `/api/chat` route was extended to handle `mode: 'part3'`.

## Consequences

- The `mockExams` table stores unified sessions under `skill: 'speaking_full'`. The History page already renders any `FeedbackResult` regardless of skill, so no schema migration was needed.
- Three `useChat` instances per page increases memory slightly but is negligible on a local-only app. If this becomes a constraint, messages can be unified into a single `useChat` with manual system prompt switching.
- Users who want to practice only Part 1 or Part 2 in isolation still have dedicated routes. These routes now also include the `MicInput` component and vocabulary drawer.
- Part transitions in the unified session are manual (the user clicks "Move to Part 2 →" / "Move to Part 3 →") rather than fully automatic. Automatic timer-driven transitions were deferred because they require storing mid-session state across page reloads, which adds complexity without clear benefit for the solo-user Phase 2 scope.
- The `TimerAlertModal` on the Part 2 speak timer fires `startPart3()` automatically, providing a timer-driven transition for the critical 2-minute Part 2 cutoff.
