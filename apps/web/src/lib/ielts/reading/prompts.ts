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

export type MultipleChoiceQuestion = {
  id: number
  type: 'multiple_choice'
  question: string   // "According to the passage, which of the following…"
  options: string[]  // 4 options; first word of each is 'A.', 'B.', 'C.', 'D.'
  answer: 'A' | 'B' | 'C' | 'D'
}

export type MatchingHeadingsQuestion = {
  id: number
  type: 'matching_headings'
  question: string   // "Paragraph [letter] — <first ~10 words of that paragraph>…"
  options: string[]  // 6–8 headings labelled 'i', 'ii', etc.; some are distractors
  answer: string     // Roman numeral e.g. 'i', 'ii', 'iii'
}

export type ReadingQuestion =
  | TFNGQuestion
  | ShortAnswerQuestion
  | MultipleChoiceQuestion
  | MatchingHeadingsQuestion

export type ReadingPassage = {
  title: string
  domain: string
  passage: string          // 700–900 words, plain text, paragraphs separated by \n\n
  questions: ReadingQuestion[]
}

export type QuestionStyle = 'classic' | 'headings_mc'

// ─── Prompts ──────────────────────────────────────────────────────────────────

/** New question types: Matching Headings + Multiple Choice */
export function READING_PASSAGE_HEADINGS_MC_PROMPT(domain: string): string {
  return `\
You are an IELTS Academic Reading test setter. Generate a reading passage and questions for a senior software engineer.

Domain: ${domain}

Requirements for the passage:
- Length: 700–900 words
- Academic register — formal, objective, third-person
- Topic must be tech-related: AI ethics, system design, remote work, automation, cybersecurity, or open-source
- Organised into exactly 5 clear paragraphs separated by blank lines, labelled A through E at the start of each paragraph (e.g. "A  Artificial intelligence...")

Requirements for the questions:
- 5 Matching Headings questions (type: "matching_headings"), one per paragraph (A–E)
  - Each question field: "Paragraph A — <first ~8 words of that paragraph>…"
  - Provide 7 heading options total (i through vii) in each question's "options" array — 5 correct + 2 distractors. Use the SAME 7 options for every matching_headings question.
  - Each paragraph's correct heading is the Roman numeral that best summarises it
  - Answers must all be distinct Roman numerals from i to vii
- 5 Multiple Choice questions (type: "multiple_choice")
  - Each tests comprehension of a specific claim, figure, or comparison in the passage
  - Provide exactly 4 options labelled "A. …", "B. …", "C. …", "D. …"
  - One option is unambiguously correct based on the passage
  - Answer is a single letter: "A", "B", "C", or "D"

Return ONLY a valid JSON object — no markdown, no code fences, no explanation.

JSON schema:
{
  "title": "<passage title>",
  "domain": "${domain}",
  "passage": "<full passage text, paragraphs separated by \\n\\n, each starting with its letter label>",
  "questions": [
    { "id": 1, "type": "matching_headings", "question": "Paragraph A — <first ~8 words>…", "options": ["i. <heading>", "ii. <heading>", "iii. <heading>", "iv. <heading>", "v. <heading>", "vi. <heading>", "vii. <heading>"], "answer": "i" },
    { "id": 2, "type": "matching_headings", "question": "Paragraph B — <first ~8 words>…", "options": ["i. <heading>", "ii. <heading>", "iii. <heading>", "iv. <heading>", "v. <heading>", "vi. <heading>", "vii. <heading>"], "answer": "ii" },
    { "id": 3, "type": "matching_headings", "question": "Paragraph C — <first ~8 words>…", "options": ["i. <heading>", "ii. <heading>", "iii. <heading>", "iv. <heading>", "v. <heading>", "vi. <heading>", "vii. <heading>"], "answer": "iii" },
    { "id": 4, "type": "matching_headings", "question": "Paragraph D — <first ~8 words>…", "options": ["i. <heading>", "ii. <heading>", "iii. <heading>", "iv. <heading>", "v. <heading>", "vi. <heading>", "vii. <heading>"], "answer": "iv" },
    { "id": 5, "type": "matching_headings", "question": "Paragraph E — <first ~8 words>…", "options": ["i. <heading>", "ii. <heading>", "iii. <heading>", "iv. <heading>", "v. <heading>", "vi. <heading>", "vii. <heading>"], "answer": "v" },
    { "id": 6, "type": "multiple_choice", "question": "<comprehension question>", "options": ["A. …", "B. …", "C. …", "D. …"], "answer": "A" },
    { "id": 7, "type": "multiple_choice", "question": "<comprehension question>", "options": ["A. …", "B. …", "C. …", "D. …"], "answer": "B" },
    { "id": 8, "type": "multiple_choice", "question": "<comprehension question>", "options": ["A. …", "B. …", "C. …", "D. …"], "answer": "C" },
    { "id": 9, "type": "multiple_choice", "question": "<comprehension question>", "options": ["A. …", "B. …", "C. …", "D. …"], "answer": "A" },
    { "id": 10, "type": "multiple_choice", "question": "<comprehension question>", "options": ["A. …", "B. …", "C. …", "D. …"], "answer": "D" }
  ]
}`
}

export function READING_PASSAGE_PROMPT(domain: string): string {
  return `\
You are an IELTS Academic Reading test setter. Generate a reading passage and questions in the style of the IELTS Academic Reading test, for a senior software engineer.

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
    // For matching_headings: strip trailing punctuation/description (e.g. "i. heading text" → "i")
    const normalised = (s: string) => s.replace(/^([ivxlcdm]+)\..*$/i, '$1').toLowerCase().trim()
    const isCorrect =
      q.type === 'matching_headings'
        ? normalised(userRaw) === normalised(answerRaw)
        : userRaw === answerRaw
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
