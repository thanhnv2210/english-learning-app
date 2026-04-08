import type { ListeningQuestion } from '@/lib/db/schema'

/**
 * Generates an IELTS Listening Section 3-style conversation and note-completion
 * questions for the given domain.
 *
 * Speaker A = senior software engineer
 * Speaker B = product manager / business stakeholder
 */
export function LISTENING_SCRIPT_PROMPT(domain: string): string {
  return `You are an IELTS Listening test creator. Generate a Section 3-style conversation and 8 note-completion questions on the topic: "${domain}".

The conversation is between:
- Speaker A: a senior software engineer
- Speaker B: a product manager or business stakeholder

Rules for the conversation:
- 10–14 turns total, natural spoken English (contractions, hesitations like "well", "so", "right")
- 250–350 words total across all turns
- The exact answer to every question must appear verbatim somewhere in the transcript
- Answers must be 1–3 words, taken directly from the text (no paraphrasing needed)
- Spread answers evenly across the conversation — not all in the first half

Rules for the questions:
- Each sentence has exactly one gap marked as ___
- The sentence provides enough context to identify the answer
- Questions are numbered 1–8 in the order the answers appear in the transcript

Return ONLY valid JSON — no markdown, no explanation:
{
  "title": "<short title describing the conversation, e.g. 'Discussing a Microservices Migration'>",
  "transcript": [
    { "speaker": "A", "text": "<speaker A's line>" },
    { "speaker": "B", "text": "<speaker B's line>" }
  ],
  "questions": [
    { "id": 1, "sentence": "<sentence with ___ where the answer goes>", "answer": "<1–3 words from transcript>" },
    { "id": 2, "sentence": "...", "answer": "..." },
    { "id": 3, "sentence": "...", "answer": "..." },
    { "id": 4, "sentence": "...", "answer": "..." },
    { "id": 5, "sentence": "...", "answer": "..." },
    { "id": 6, "sentence": "...", "answer": "..." },
    { "id": 7, "sentence": "...", "answer": "..." },
    { "id": 8, "sentence": "...", "answer": "..." }
  ]
}`
}

/** Score answers against the key. Case-insensitive, trimmed. */
export function scoreListening(
  questions: ListeningQuestion[],
  userAnswers: Record<number, string>,
): { correct: number; total: number; perQuestion: Record<number, boolean> } {
  const perQuestion: Record<number, boolean> = {}
  let correct = 0
  for (const q of questions) {
    const given = (userAnswers[q.id] ?? '').trim().toLowerCase()
    const expected = q.answer.trim().toLowerCase()
    const isCorrect = given === expected
    perQuestion[q.id] = isCorrect
    if (isCorrect) correct++
  }
  return { correct, total: questions.length, perQuestion }
}

/** Map a raw score to an IELTS band estimate. */
export function estimateBand(correct: number, total: number): number {
  const pct = total === 0 ? 0 : correct / total
  if (pct >= 0.9) return 7.5
  if (pct >= 0.8) return 7.0
  if (pct >= 0.7) return 6.5
  if (pct >= 0.6) return 6.0
  if (pct >= 0.5) return 5.5
  return 5.0
}
