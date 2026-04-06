# PDR-0003: Post-Session Feedback, Not Real-Time

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

There are two possible feedback models:

**Option A — Real-time feedback**: After each user response, the AI scores that turn and shows band-level notes inline before the next examiner question.

**Option B — Post-session feedback**: The user completes the full session. Only after they explicitly click "Generate Feedback" does the AI score the entire transcript.

Option A provides faster iteration but breaks the examination context entirely. The user would switch mental mode every turn (speaking → reading feedback → speaking), which is not what happens in the real test. It also increases latency per turn, and on a local LLM setup this would make the conversation feel sluggish.

## Decision

Use **Option B (post-session)**. The `FeedbackGenerator` (`POST /api/feedback`) is called only when the user deliberately ends the session and requests it. The feedback modal (in `history-view.tsx`) and the inline panel (in `speaking-chat.tsx` / `part2-chat.tsx` / `writing-task.tsx`) are the only surfaces where feedback is displayed.

The feedback shape is a structured `FeedbackResult`:

```ts
type FeedbackResult = {
  overallBand: number
  targetBand: number
  criteria: FeedbackCriterion[]  // one per IELTS criterion
}
```

Each criterion includes a `keyPoints` array — specific, actionable observations — rather than a generic description.

## Consequences

- `useChat` in speaking components has no feedback logic; it is a pure conversation channel.
- The `saveFeedback` server action and the feedback API route are completely decoupled from the chat route — they can be evolved independently.
- Users can re-generate feedback for a saved session from the History page without re-doing the speaking session.
- The post-session model also makes it feasible to switch models (e.g. use a stronger model for feedback than the one used for conversation) without architectural changes.
- For Writing Task 2, evaluation is streamed (`toTextStreamResponse`) to give visual progress on a slow local LLM, while still being a single post-submission call (not per-paragraph real-time scoring).
