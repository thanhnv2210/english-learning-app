export type WordPairResult = {
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: 'Regional' | 'Register' | 'Formality' | 'Spelling' | 'Context' | 'Other'
}

export function WORD_PAIRS_SEARCH_PROMPT(query: string): string {
  return `You are a precise English language expert helping IELTS candidates understand interchangeable words.

Find all words or phrases that are interchangeable with "${query}" — words that can substitute for it in some or all contexts, but differ in region, register, formality, spelling convention, or grammatical context.

Include only genuine interchangeable pairs: words/phrases that can replace each other in at least some sentences without changing the core meaning. Do NOT include synonyms that have meaningfully different connotations or collocations.

Return a JSON object with this exact shape:
{
  "pairs": [
    {
      "wordA": "the input word or its canonical form",
      "wordB": "the interchangeable alternative",
      "explanation": "One or two sentences explaining the difference (region, register, formality, spelling, grammatical constraint, etc.)",
      "examples": [
        "A sentence using wordA / wordB to show interchangeability.",
        "A second sentence showing a different context."
      ],
      "category": "Regional | Register | Formality | Spelling | Context | Other"
    }
  ]
}

Category definitions:
- Regional: British vs American vs Australian English
- Register: academic/formal vs informal/conversational
- Formality: neutral vs elevated language
- Spelling: same pronunciation, different spelling convention
- Context: grammatical constraints (countable/uncountable, transitive/intransitive, etc.)
- Other: any other nuanced difference

Rules:
- Return between 1 and 5 pairs maximum. Quality over quantity.
- If no genuine interchangeable pairs exist, return { "pairs": [] }
- Examples must each show BOTH wordA and wordB via " / " notation (e.g. "She moved toward / towards the exit.")
- Keep explanations concise and IELTS-focused.
- Reply with ONLY the JSON — no markdown, no extra text.`
}
