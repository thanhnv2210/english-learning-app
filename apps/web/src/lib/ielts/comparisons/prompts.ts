import type { ComparisonTerm, ComparisonExamplePair } from '@/lib/db/schema'

export type ComparisonResult = {
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
}

export function COMPARISON_PROMPT(termA: string, termB: string): string {
  return `You are an IELTS Academic English expert. Compare the two terms "${termA}" and "${termB}" for an IELTS learner targeting Band 6.5–7.

If they ARE meaningfully comparable (near-synonyms, commonly confused, or interchangeable in some contexts), return:
{
  "valid": true,
  "termA": "${termA}",
  "termB": "${termB}",
  "category": "<word type: adverb | verb | noun | adjective | conjunction | preposition | phrase>",
  "keyDifference": "<1–2 sentences: the single most important distinction an IELTS learner must know>",
  "dimensionA": {
    "register": "<formal | informal | neutral>",
    "ieltsWriting": "<short note: e.g. 'Preferred in Task 2', 'Avoid — too informal', 'Acceptable in both tasks'>",
    "ieltsSpeaking": "<short note: e.g. 'Natural in Part 2/3', 'Sounds unnatural in speech', 'Good for Part 3'>",
    "intensity": <1–5 number for degree words only — omit for others>,
    "note": "<optional: one extra nuance specific to this term>"
  },
  "dimensionB": {
    "register": "<formal | informal | neutral>",
    "ieltsWriting": "<short note>",
    "ieltsSpeaking": "<short note>",
    "intensity": <1–5 or omit>,
    "note": "<optional>"
  },
  "examples": [
    {
      "context": "<shared topic e.g. 'Discussing economic inequality'>",
      "withA": "<complete sentence using ${termA} naturally at Band 6–7 level>",
      "withB": "<the same idea rewritten using ${termB} — show how meaning or tone shifts>"
    },
    {
      "context": "<different shared topic>",
      "withA": "<complete sentence using ${termA}>",
      "withB": "<rewritten using ${termB}>"
    }
  ]
}

If they are NOT comparable (completely different meanings, different word classes with no overlap, or one is not a real English word), return:
{
  "valid": false,
  "reason": "<brief explanation>"
}

Rules:
- "keyDifference" must focus on IELTS impact — register, grammar pattern, or meaning shift that affects the learner's score
- "intensity" scale: 1 = weakest (slightly), 3 = moderate (fairly/quite), 5 = strongest (extremely) — only include for degree adverbs/adjectives
- "ieltsWriting" and "ieltsSpeaking" should each be a short phrase (5–10 words max), not a full sentence
- Both example sentences must be complete, natural, and clearly show WHY the two terms are different
- Return ONLY valid JSON — no markdown, no explanation`
}
