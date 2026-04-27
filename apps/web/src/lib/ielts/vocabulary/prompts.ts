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
 * Generates a full vocabulary card for a user-searched word, including
 * auto-detected domain tags from the provided list.
 *
 * Returns a JSON object matching the VocabularyCard schema + suggestedDomains.
 */
export function VOCAB_SEARCH_PROMPT(word: string, availableDomains: string[]): string {
  return `You are an IELTS Academic vocabulary expert. Generate a comprehensive vocabulary card for the word "${word}" as used in IELTS Academic Writing and Speaking.

Also pick 0–3 domains from the list below that this word is most relevant to. Choose only domains where the word is genuinely useful; use an empty array for general academic vocabulary.

Available domains:
${availableDomains.map((d) => `  - ${d}`).join('\n')}

Return ONLY valid JSON — no markdown, no explanation:
{
  "word": "${word}",
  "wordType": "<one of: noun, verb, adjective, adverb, phrase, conjunction, preposition>",
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
    "writing": ["<formal IELTS Writing Task 2 sentence>", "<another formal IELTS Writing Task 2 sentence>"]
  },
  "pronunciation": {
    "uk": "<British IPA e.g. /ɪnˈfluəns/>",
    "us": "<American IPA e.g. /ˈɪnfluəns/>"
  },
  "suggestedDomains": ["<domain name from the list above>"]
}

IMPORTANT: "writing" must be a JSON array with exactly 2 strings — never a plain string.
Ensure all examples are realistic for IELTS Band 6–7 level.`
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
  "wordType": "<one of: noun, verb, adjective, adverb, phrase, conjunction, preposition>",
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
    "writing": ["<formal IELTS Writing Task 2 sentence>", "<another formal IELTS Writing Task 2 sentence>"]
  },
  "pronunciation": {
    "uk": "<British IPA e.g. /ɪnˈfluəns/>",
    "us": "<American IPA e.g. /ˈɪnfluəns/>"
  }
}

IMPORTANT: "writing" must be a JSON array with exactly 2 strings — never a plain string.
Ensure all examples are realistic for IELTS Band 6–7 level.`
}

/**
 * Generates UK and US IPA pronunciation for a single word.
 *
 * Returns JSON: { "uk": "...", "us": "..." }
 */
export function VOCAB_PRONUNCIATION_PROMPT(word: string): string {
  return `Provide the standard IPA pronunciation for the English word "${word}" in both British English (UK) and American English (US).

Return ONLY valid JSON — no markdown, no explanation:
{
  "uk": "<British IPA notation including slashes, e.g. /ɪnˈfluəns/>",
  "us": "<American IPA notation including slashes, e.g. /ˈɪnfluəns/>"
}

Use standard IPA symbols. Include the surrounding slashes in the string values.`
}
