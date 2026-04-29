export type GeneratedWord = {
  word: string
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase'
  meaning: string
  example: string
}

/**
 * Generate 15–20 key vocabulary items for a given topic.
 */
export function VOCAB_BANK_GENERATE_PROMPT(topic: string): string {
  return `You are an IELTS vocabulary expert. Generate the 15–20 most important vocabulary items for the topic "${topic}" that an IELTS candidate should know.

For each word, return:
- "word": the vocabulary item (single word or short phrase)
- "type": one of noun | verb | adjective | adverb | phrase
- "meaning": one clear sentence explaining what it means in context of the topic
- "example": one natural example sentence using this word at IELTS Band 6–7 level

Return ONLY valid JSON:
{
  "topic": "${topic}",
  "words": [
    {
      "word": "<word or short phrase>",
      "type": "<noun|verb|adjective|adverb|phrase>",
      "meaning": "<one sentence definition relevant to ${topic}>",
      "example": "<one Band 6–7 IELTS example sentence>"
    }
  ]
}

Rules:
- Include a balanced mix of nouns, verbs, and adjectives
- Cover core vocabulary someone would need to discuss "${topic}" in IELTS Speaking Part 2/3 or Writing Task 2
- Keep meanings concise (one sentence max)
- Example sentences must use the word naturally — not just define it
- Return between 15 and 20 words
- Return ONLY valid JSON — no markdown, no explanation`
}

/**
 * Look up a single word in the context of a topic.
 */
export function VOCAB_BANK_WORD_LOOKUP_PROMPT(word: string, topic: string): string {
  return `You are an IELTS vocabulary expert. The user wants to add the word or phrase "${word}" to their vocabulary bank for the topic "${topic}".

Return a JSON object:
{
  "valid": true,
  "word": "${word}",
  "type": "<noun|verb|adjective|adverb|phrase>",
  "meaning": "<one sentence: what this word means in the context of ${topic}>",
  "example": "<one natural IELTS Band 6–7 example sentence using this word in the context of ${topic}>"
}

If "${word}" is not a real English word or phrase, return:
{
  "valid": false,
  "reason": "<brief explanation>"
}

Rules:
- "meaning" must be specific to how the word is used in "${topic}" context
- "example" must use the word naturally at IELTS Band 6–7 level
- Return ONLY valid JSON — no markdown, no explanation`
}
