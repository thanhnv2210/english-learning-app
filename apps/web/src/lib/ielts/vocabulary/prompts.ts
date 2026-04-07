/**
 * Detects informal or weak words in the user's text and maps each to a
 * stronger IELTS academic replacement.
 *
 * Returns JSON: { "words": [{ "original": "...", "academic": "..." }] }
 */
export function VOCAB_DETECTION_PROMPT(text: string): string {
  return `You are an IELTS examiner reviewing a candidate's response for vocabulary improvement.

Identify up to 6 informal, basic, or overused words/phrases in the text below that could be replaced with stronger IELTS academic vocabulary.
For each, provide the exact word or phrase as it appears and the best single academic replacement word.

Text:
"""
${text}
"""

Return ONLY valid JSON — no markdown, no explanation:
{
  "words": [
    { "original": "<word or phrase as it appears>", "academic": "<single academic replacement word>" }
  ]
}

Rules:
- Only flag genuinely informal or weak words (e.g. "good", "bad", "big", "a lot of", "get", "thing").
- Do not flag technical terms, proper nouns, or words that are already academic.
- If the text is already strong, return fewer than 6 or an empty array.
- The "academic" field must be a single dictionary word (no phrases).`
}

/**
 * Generates a full vocabulary card for a word that is not in the database.
 *
 * Returns a JSON object matching the VocabularyCard schema.
 */
export function VOCAB_CARD_PROMPT(word: string, originalWord: string): string {
  return `You are an IELTS vocabulary expert. Generate a comprehensive vocabulary card for the word "${word}" as used in IELTS Academic Writing and Speaking.

The user originally wrote "${originalWord}" and this word is the recommended academic replacement.

Return ONLY valid JSON — no markdown, no explanation:
{
  "word": "${word}",
  "definition": "<one clear, simple definition suitable for a non-native speaker>",
  "familyWords": {
    "noun": "<noun form or null>",
    "verb": "<verb form or null>",
    "adjective": "<adjective form or null>",
    "adverb": "<adverb form or null>"
  },
  "synonyms": [
    { "word": "<synonym 1>", "type": "synonym" },
    { "word": "<synonym 2>", "type": "synonym" },
    { "word": "<synonym 3>", "type": "synonym" },
    { "word": "<antonym>", "type": "antonym" }
  ],
  "collocations": [
    "<collocation 1>",
    "<collocation 2>",
    "<collocation 3>",
    "<collocation 4>",
    "<collocation 5>"
  ],
  "examples": {
    "speaking": "<one natural conversational sentence an IELTS candidate might say>",
    "writing": [
      "<formal IELTS Writing Task 2 sentence>",
      "<another formal IELTS Writing Task 2 sentence>"
    ]
  }
}

Ensure all examples are realistic for IELTS Band 6–7 level.`
}
