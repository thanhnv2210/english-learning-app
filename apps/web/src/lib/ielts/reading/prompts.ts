// ─── Types ────────────────────────────────────────────────────────────────────

export type TFNGQuestion = {
  id: number
  type: 'tfng'
  question: string   // a statement about the passage
  answer: 'True' | 'False' | 'Not Given'
}

export type ShortAnswerQuestion = {
  id: number
  type: 'short_answer'
  question: string   // "What does the author say about X?"
  answer: string     // 1–3 words from the passage (exact)
}

export type ReadingQuestion = TFNGQuestion | ShortAnswerQuestion

export type ReadingPassage = {
  title: string
  domain: string
  passage: string          // 700–900 words, plain text, paragraphs separated by \n\n
  questions: ReadingQuestion[]
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

export function READING_PASSAGE_PROMPT(domain: string): string {
  return `\
You are an IELTS Reading test setter. Generate a reading passage and questions for a senior software engineer.

Domain: ${domain}

Requirements for the passage:
- Length: 700–900 words
- Academic register — formal, objective, third-person
- Topic must be tech-related: AI ethics, system design, remote work, automation, cybersecurity, or open-source
- Organised into 5 clear paragraphs separated by blank lines
- Include specific facts, figures, or named examples the questions can reference

Requirements for the questions:
- 6 True / False / Not Given questions (type: "tfng")
  - "True": the passage explicitly confirms the statement
  - "False": the passage explicitly contradicts the statement
  - "Not Given": the passage neither confirms nor contradicts
  - Mix all three answers — do not make all answers the same
- 4 Short Answer questions (type: "short_answer")
  - Each answer must be 1–3 words taken verbatim from the passage
  - Question must begin with "According to the passage," or "What" or "How many/much"

Return ONLY a valid JSON object — no markdown, no code fences, no explanation.

JSON schema:
{
  "title": "<passage title>",
  "domain": "${domain}",
  "passage": "<full passage text, paragraphs separated by \\n\\n>",
  "questions": [
    { "id": 1, "type": "tfng", "question": "<statement>", "answer": "True" },
    { "id": 2, "type": "tfng", "question": "<statement>", "answer": "False" },
    { "id": 3, "type": "tfng", "question": "<statement>", "answer": "Not Given" },
    { "id": 4, "type": "tfng", "question": "<statement>", "answer": "True" },
    { "id": 5, "type": "tfng", "question": "<statement>", "answer": "False" },
    { "id": 6, "type": "tfng", "question": "<statement>", "answer": "Not Given" },
    { "id": 7, "type": "short_answer", "question": "<question>", "answer": "<1–3 words>" },
    { "id": 8, "type": "short_answer", "question": "<question>", "answer": "<1–3 words>" },
    { "id": 9, "type": "short_answer", "question": "<question>", "answer": "<1–3 words>" },
    { "id": 10, "type": "short_answer", "question": "<question>", "answer": "<1–3 words>" }
  ]
}`
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function scoreReading(
  questions: ReadingQuestion[],
  userAnswers: Record<number, string>
): { correct: number; total: number; perQuestion: Record<number, boolean> } {
  const perQuestion: Record<number, boolean> = {}
  let correct = 0

  for (const q of questions) {
    const userRaw = (userAnswers[q.id] ?? '').trim().toLowerCase()
    const answerRaw = q.answer.trim().toLowerCase()
    const isCorrect = userRaw === answerRaw
    perQuestion[q.id] = isCorrect
    if (isCorrect) correct++
  }

  return { correct, total: questions.length, perQuestion }
}

export function estimateBand(correct: number, total: number): number {
  const pct = total === 0 ? 0 : correct / total
  if (pct >= 0.9) return 7.5
  if (pct >= 0.8) return 7.0
  if (pct >= 0.7) return 6.5
  if (pct >= 0.6) return 6.0
  if (pct >= 0.5) return 5.5
  return 5.0
}
