# PDR-0002: Examiner Strictness and No-Help Protocol

- **Status**: Accepted
- **Date**: 2026-04-06

## Context

When an AI model acts as a conversation partner, its default behaviour is to be helpful: clarifying questions, completing the user's thoughts, offering suggestions mid-answer. This behaviour is the opposite of what a real IELTS examiner does.

In the actual IELTS Speaking test:
- The examiner does not rephrase questions if the candidate says "sorry, what do you mean?"
- The examiner does not correct grammar mid-answer
- The examiner enforces strict time transitions regardless of where the candidate is in their response
- The examiner uses scripted, neutral acknowledgements ("Thank you", "Right", "OK") — not affirmations like "Great answer!"

If the AI behaves helpfully, the user practises an easier, unrealistic version of the test and builds false confidence.

## Decision

The `IELTS_Examiner` system prompt (`src/lib/ielts/examiner/prompt.ts`) enforces the following rules:

1. **No rephrase**: If the user asks for clarification, the examiner repeats the question verbatim once, then moves on.
2. **No correction**: The examiner never points out grammar errors during the session.
3. **No affirmation**: The examiner uses only neutral acknowledgements.
4. **Strict transitions**: After 4–5 questions (Part 1) or when the timer fires (Part 2), the examiner ends the part with the scripted phrase and does not extend the conversation.
5. **No topic deviation**: The examiner stays on the cue card topic for Part 2; it does not allow the candidate to redirect.

The `FeedbackGenerator` is the correct place for corrections and suggestions — it runs *after* the session ends, never during.

## Consequences

- The examiner prompt must be tested qualitatively on every model change to ensure the no-help behaviour holds. Smaller LLMs (qwen2.5-coder:7b) tend to slip into helpful mode more often than larger models.
- Users who find this frustrating are learning the right lesson — real examiners are exactly this neutral.
- The timer (`useTimer` + `TimerAlertModal`) is the technical enforcement of time-based transitions; the prompt alone is not enough for Part 2's 2-minute cutoff.
- Session feedback and examiner behaviour must remain fully separated: no feedback prompt data should be part of the examiner context, and no examiner prompt should appear in the feedback generation call.
