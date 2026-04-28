import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'

export type IdiomLookupResult = {
  idiom: string
  meaning: string
  register: 'formal' | 'informal' | 'neutral'
  suggestedSkills: IdiomSkill[]
  suggestedContexts: IdiomContext[]
  examples: string[]
}

/**
 * Validate and describe a single idiom.
 * Returns IdiomLookupResult | { valid: false, reason: string }
 */
export function IDIOM_LOOKUP_PROMPT(phrase: string): string {
  return `You are an IELTS Academic English expert. The user wants to look up the idiom "${phrase}".

If it IS a recognised English idiom, return:
{
  "valid": true,
  "idiom": "<the idiom, corrected/normalised if needed, all lowercase>",
  "meaning": "<plain English definition: what it means when used figuratively, 1–2 sentences>",
  "register": "<one of: formal, informal, neutral>",
  "suggestedSkills": ["Writing_1" | "Writing_2" | "Speaking"],
  "suggestedContexts": ["Speaking" | "Writing" | "News" | "Book" | "Podcast" | "Other"],
  "examples": [
    "<natural IELTS Band 6–7 example sentence 1 — the idiom must appear verbatim>",
    "<natural IELTS Band 6–7 example sentence 2 — the idiom must appear verbatim>",
    "<natural IELTS Band 6–7 example sentence 3 — the idiom must appear verbatim>"
  ]
}

If it is NOT a recognised idiom or is just a literal phrase, return:
{
  "valid": false,
  "reason": "<brief explanation of why it is not an idiom>"
}

Rules:
- "meaning" must describe the FIGURATIVE meaning only — not the literal one
- "register": formal = academic writing, informal = conversation/casual speech, neutral = both
- "suggestedSkills": include all that genuinely apply — Writing_1 = Task 1 (charts/graphs), Writing_2 = Task 2 (essays), Speaking = Part 1/2/3
- "suggestedContexts": where the learner is most likely to encounter this idiom — pick 1–3 from: Speaking, Writing, News, Book, Podcast, Other
- Each example sentence must use the idiom naturally at IELTS Band 6–7 level, relevant to academic/social topics (technology, environment, education, economy, health, society)
- Do NOT explain the idiom in the example sentences — just use it naturally
- Return ONLY valid JSON — no markdown, no explanation`
}
