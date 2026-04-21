import type { CollocationSkill } from '@/lib/db/schema'

export type CollocationResult = {
  phrase: string
  type: string
  explanation: string
  suggestedSkills: CollocationSkill[]
  examples: string[]
}

/**
 * Search by word — returns up to 8 collocations that contain the given word.
 * Returns JSON: { "collocations": CollocationResult[] }
 */
export function COLLOCATION_BY_WORD_PROMPT(word: string): string {
  return `You are an IELTS Academic English expert. List up to 8 common collocations that contain the word "${word}" and are useful for IELTS Academic Writing or Speaking.

For each collocation return:
- "phrase": the full collocation (2–4 words)
- "type": the grammatical pattern — one of: "verb+noun", "adj+noun", "noun+noun", "adv+verb", "adv+adj", "verb+prep", "noun+prep", "other"
- "explanation": 1–2 sentences explaining what the collocation means and when/how to use it in IELTS context
- "suggestedSkills": which IELTS skills this collocation is most useful for — pick from ["Writing_1", "Writing_2", "Speaking"]. Writing_1 = Task 1 (charts/graphs/processes), Writing_2 = Task 2 (essays). Include all that apply.
- "examples": 2 natural example sentences using this collocation at IELTS Band 6–7 level

Return ONLY valid JSON — no markdown, no explanation:
{
  "collocations": [
    {
      "phrase": "<the collocation>",
      "type": "<grammatical type>",
      "explanation": "<what it means and when to use it>",
      "suggestedSkills": ["Writing_2", "Speaking"],
      "examples": [
        "<example sentence 1>",
        "<example sentence 2>"
      ]
    }
  ]
}

Rules:
- Only include collocations that are genuinely common in formal/academic English.
- Prefer collocations relevant to IELTS topics: technology, environment, society, economy, health, education.
- Do not repeat the same phrase twice.
- Return between 4 and 8 collocations.`
}

/**
 * Search by phrase — validates and describes a single collocation phrase.
 * Returns JSON: CollocationResult | { "valid": false, "reason": string }
 */
export function COLLOCATION_BY_PHRASE_PROMPT(phrase: string): string {
  return `You are an IELTS Academic English expert. The user wants to check whether "${phrase}" is a natural English collocation used in IELTS Academic Writing or Speaking.

If it IS a valid collocation, return:
{
  "valid": true,
  "phrase": "<the collocation, corrected/normalised if needed>",
  "type": "<grammatical pattern — one of: verb+noun, adj+noun, noun+noun, adv+verb, adv+adj, verb+prep, noun+prep, other>",
  "explanation": "<1–2 sentences: what the collocation means and when/how to use it in IELTS Academic Writing or Speaking>",
  "suggestedSkills": ["Writing_1" | "Writing_2" | "Speaking"],
  "examples": [
    "<natural IELTS Band 6–7 example sentence 1>",
    "<natural IELTS Band 6–7 example sentence 2>",
    "<natural IELTS Band 6–7 example sentence 3>"
  ]
}

If it is NOT a valid or natural collocation, return:
{
  "valid": false,
  "reason": "<brief explanation of why it does not work as a collocation>"
}

Rules:
- "suggestedSkills" must be an array containing one or more of: "Writing_1", "Writing_2", "Speaking"
- Writing_1 = IELTS Writing Task 1 (charts, graphs, processes, maps)
- Writing_2 = IELTS Writing Task 2 (opinion/discussion/problem essays)
- Include all skills where this collocation is genuinely useful
- Return ONLY valid JSON — no markdown, no explanation`
}
