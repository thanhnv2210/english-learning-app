export type GrammarCheckResult = {
  isCorrect: boolean
  error: string | null
  correction: string | null
  category: 'uncountable' | 'always_plural' | 'false_singular' | 'number_agreement' | 'collective' | null
  explanation: string
}

export type GrammarTrapGenerateResult = {
  phrase: string
  correction: string
  category: string
  explanation: string
  examples: { wrong: string; correct: string }[]
}

export function GRAMMAR_CHECK_PROMPT(input: string): string {
  return `You are an English grammar expert specialising in noun form errors common among IELTS learners (especially Vietnamese speakers).

Check if the following phrase or sentence contains a noun form error. Focus ONLY on:
- Uncountable nouns wrongly pluralised (e.g. "staffs" → "staff", "advices" → "advice", "furnitures" → "furniture", "informations" → "information", "3 dollar" → "3 dollars")
- Number agreement errors (e.g. "3 dollar" instead of "3 dollars")
- False singulars (words that look plural but are grammatically singular: "news", "economics", "mathematics")
- Always-plural nouns used wrongly (e.g. "a scissor" instead of "scissors")
- Collective noun errors

Input: "${input}"

Respond ONLY in valid JSON with no markdown fences:
{
  "isCorrect": true or false,
  "error": "brief description of the error" or null if correct,
  "correction": "the corrected form" or null if correct,
  "category": "uncountable" or "always_plural" or "false_singular" or "number_agreement" or "collective" or null if correct,
  "explanation": "1-2 sentence explanation of the grammar rule"
}`
}

export function GRAMMAR_TRAP_GENERATE_PROMPT(input: string): string {
  return `You are an English grammar expert creating study material for IELTS learners about noun form errors.

Generate a grammar trap entry for: "${input}"

Focus on one specific noun form error type:
- uncountable: noun that cannot be pluralised (e.g. staff, advice, furniture, information, equipment, luggage, research)
- always_plural: noun with no singular form (e.g. scissors, trousers, glasses, earnings)
- false_singular: looks plural but is grammatically singular (e.g. news, economics, mathematics, physics)
- number_agreement: must use plural after numbers > 1 (e.g. "3 dollars" not "3 dollar")
- collective: collective noun agreement rules (e.g. team, staff, government)

Respond ONLY in valid JSON with no markdown fences:
{
  "phrase": "the incorrect trap form learners commonly use",
  "correction": "the correct form",
  "category": "uncountable" or "always_plural" or "false_singular" or "number_agreement" or "collective",
  "explanation": "2-3 clear sentences explaining why the trap form is wrong and the rule to remember",
  "examples": [
    { "wrong": "full sentence using the wrong form", "correct": "corrected full sentence" },
    { "wrong": "another wrong example sentence", "correct": "corrected sentence" },
    { "wrong": "third wrong example sentence", "correct": "corrected sentence" }
  ]
}`
}
