# PDR-0005: Band Gap Framing in Feedback

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

IELTS feedback tools typically show a band score and a list of generic suggestions. The problem: a score of 6.0 with a note "improve coherence" tells the user what is wrong but not what specifically needs to change to reach 6.5. This is especially demotivating for engineers who are used to precise, actionable error messages.

Two feedback framings were considered:

**Option A — Score-only**: Report `overallBand: 6.0` and per-criterion scores. Simple to implement and display.

**Option B — Gap framing**: Report the current score *and* the target score on every criterion, so the UI can immediately show "you are 0.5 below target on Lexical Resource". The `FeedbackResult` shape carries both `score` and `targetScore` per criterion.

## Decision

Use **Option B (gap framing)**. Every `FeedbackCriterion` in `FeedbackResult` includes:

```ts
{
  criterion: string   // e.g. "Lexical Resource"
  score: number       // actual scored band
  targetScore: number // user's target band (from targetProfile)
  keyPoints: string[] // specific, actionable observations
}
```

The `FeedbackView` component (`src/components/feedback-view.tsx`) renders each criterion with a coloured badge:
- Green: `score >= targetScore`
- Amber: `score >= targetScore - 0.5`
- Red: `score < targetScore - 0.5`

The overall band panel also shows the delta to target explicitly ("0.5 below target").

The feedback prompt instructs the model to write `keyPoints` in the form of specific observations, not generic advice. For example:
- Bad: "Improve your vocabulary range."
- Good: "You used 'good' and 'bad' where 'exemplary' and 'detrimental' would demonstrate Band 7 Lexical Resource."

## Consequences

- The feedback prompt (`FEEDBACK_SYSTEM_PROMPT`, `EVALUATION_PROMPT`) must enforce the `FeedbackResult` JSON schema strictly — the UI depends on `targetScore` being present on every criterion.
- The `targetBand` value passed to the feedback API becomes the `targetScore` for all criteria. This is intentional: Phase 1 does not support per-criterion targets.
- Per-criterion target differentiation (e.g., target 7.0 on GRA but 6.5 on Task Achievement) is out of scope until Phase 3.
- `keyPoints` quality is the most model-dependent part of the system. On small local models, keyPoints may be generic. This is acceptable for Phase 1 but is a known quality gap relative to a hosted model.
