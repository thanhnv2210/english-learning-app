export type Phenomenon =
  | 'elision'
  | 'assimilation'
  | 'catenation'
  | 'intrusion'
  | 'weakening'
  | 'contraction'
  | 'gemination'

export type ConnectedSpeechInstance = {
  original: string      // e.g. "next day"
  transformed: string   // e.g. "nex day"
  phenomenon: Phenomenon
  description: string   // e.g. "/t/ is dropped before a consonant"
  tip: string           // learner-facing pronunciation tip
}

export type AnalysisResult = {
  transformedText: string          // full input text with all changes applied
  instances: ConnectedSpeechInstance[]
}

export const PHENOMENON_LABELS: Record<Phenomenon, string> = {
  elision: 'Elision',
  assimilation: 'Assimilation',
  catenation: 'Catenation',
  intrusion: 'Intrusion',
  weakening: 'Weakening',
  contraction: 'Contraction',
  gemination: 'Gemination',
}

export type PhenomenonMeta = {
  label: string
  explanation: string
  examples: { original: string; transformed: string; note: string }[]
}

export const PHENOMENON_META: Record<Phenomenon, PhenomenonMeta> = {
  elision: {
    label: 'Elision',
    explanation:
      'A sound (usually /t/, /d/, or /h/) is dropped to make speech flow more smoothly. This happens most often between consonants or at the end of a word before another consonant.',
    examples: [
      { original: 'next day', transformed: 'nex day', note: '/t/ dropped before consonant /d/' },
      { original: 'last night', transformed: 'las night', note: '/t/ dropped before consonant /n/' },
    ],
  },
  assimilation: {
    label: 'Assimilation',
    explanation:
      'A sound changes to become more like a neighbouring sound. The place or manner of articulation shifts so adjacent sounds are easier to produce together.',
    examples: [
      { original: 'ten boys', transformed: 'tem boys', note: '/n/ → /m/ to match the bilabial /b/' },
      { original: 'that person', transformed: 'thap person', note: '/t/ → /p/ before bilabial /p/' },
    ],
  },
  catenation: {
    label: 'Catenation',
    explanation:
      'A consonant at the end of one word links directly to the vowel at the start of the next word, making them sound like one word.',
    examples: [
      { original: 'turn off', transformed: 'tur-noff', note: '/n/ links to /ɒ/' },
      { original: 'pick it up', transformed: 'pi-ki-tup', note: '/k/ and /t/ link to following vowels' },
    ],
  },
  intrusion: {
    label: 'Intrusion',
    explanation:
      'An extra sound (/j/, /w/, or /r/) is inserted between two words to make the transition smoother, even though it is not in the spelling.',
    examples: [
      { original: 'she asked', transformed: 'she /j/ asked', note: 'intrusive /j/ after /iː/ vowel' },
      { original: 'go on', transformed: 'go /w/ on', note: 'intrusive /w/ after /əʊ/ vowel' },
    ],
  },
  weakening: {
    label: 'Weakening',
    explanation:
      'Unstressed grammatical words (and, to, of, the…) have their vowel reduced to a schwa /ə/, making them shorter and quieter in natural speech.',
    examples: [
      { original: 'and', transformed: '/ənd/', note: 'full vowel /æ/ → schwa /ə/' },
      { original: 'to', transformed: '/tə/', note: 'full vowel /uː/ → schwa /ə/' },
    ],
  },
  contraction: {
    label: 'Contraction',
    explanation:
      'Two words merge into one, with sounds dropped or blended. Informal contractions go further than written contractions like "don\'t" or "I\'m".',
    examples: [
      { original: 'want to', transformed: 'wanna', note: '"want to" fully merges in casual speech' },
      { original: 'going to', transformed: 'gonna', note: '"going to" merges to "gonna"' },
    ],
  },
  gemination: {
    label: 'Gemination',
    explanation:
      'When two identical or very similar consonants appear at a word boundary, they merge into a single, slightly lengthened sound instead of being pronounced twice.',
    examples: [
      { original: 'black coffee', transformed: 'bla-coffee', note: '/k/ + /k/ → single /kː/' },
      { original: 'big game', transformed: 'bi-game', note: '/g/ + /g/ → single /gː/' },
    ],
  },
}

export const PHENOMENON_COLORS: Record<Phenomenon, { bg: string; text: string; border: string }> = {
  elision:      { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300' },
  assimilation: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  catenation:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300' },
  intrusion:    { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  weakening:    { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  contraction:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300' },
  gemination:   { bg: 'bg-pink-100',   text: 'text-pink-700',   border: 'border-pink-300' },
}

export function CONNECTED_SPEECH_PROMPT(text: string): string {
  return `You are a phonetics expert specialising in English connected speech. Analyse the input text and identify every instance of connected speech phenomena that a native speaker would naturally produce.

PHENOMENA DEFINITIONS:
- elision: a sound is dropped (e.g. "next day" → "nex day", /t/ dropped before /d/)
- assimilation: a sound changes to match a neighbouring sound (e.g. "ten boys" → "tem boys", /n/ → /m/ before bilabial /b/)
- catenation: a word-final consonant links to the next word's initial vowel sound (e.g. "is it" → "i-zit", "pick up" → "pi-kup")
- intrusion: an extra /j/, /w/, or /r/ sound is inserted between words ending and starting with certain vowels (e.g. "go on" → "go-won", "she asked" → "she-yasked")
- weakening: unstressed grammatical words have their vowel reduced to schwa /ə/ — this applies to: a, an, the, to, of, and, or, for, from, at, but, that, have, has, do, does, can, was, were (e.g. "a" → /ə/, "or" → /ə/, "and" → /ənd/)
- contraction: two words merge into one (e.g. "want to" → "wanna", "going to" → "gonna", "kind of" → "kinda")
- gemination: identical adjacent consonants at a word boundary merge into one lengthened sound (e.g. "black coffee" → "bla(k)coffee")

IMPORTANT RULES:
- Function words (a, an, the, to, of, and, or, for, at) are ALMOST ALWAYS weakened in natural speech — always check these first
- Catenation occurs whenever a consonant-final word is followed by a vowel-initial word
- Be thorough — a short sentence like "is it a boy or a girl" contains multiple phenomena
- Each instance original must be words that appear consecutively in the input text
- Keep descriptions under 15 words, tips under 20 words

EXAMPLE — for input "is it a boy or a girl":
{
  "transformedText": "i-zit ə boy ər ə girl",
  "instances": [
    {
      "original": "is it",
      "transformed": "i-zit",
      "phenomenon": "catenation",
      "description": "/z/ at end of 'is' links to vowel /ɪ/ starting 'it'",
      "tip": "Listen for word boundaries to disappear when a consonant meets a vowel"
    },
    {
      "original": "a",
      "transformed": "ə",
      "phenomenon": "weakening",
      "description": "Unstressed 'a' reduces from /eɪ/ to schwa /ə/",
      "tip": "In natural speech 'a' almost never sounds like its letter name"
    },
    {
      "original": "or",
      "transformed": "ə",
      "phenomenon": "weakening",
      "description": "Unstressed 'or' reduces from /ɔː/ to schwa /ə/",
      "tip": "Unstressed 'or' sounds identical to 'a' in connected speech"
    },
    {
      "original": "it a",
      "transformed": "i-tə",
      "phenomenon": "catenation",
      "description": "/t/ at end of 'it' links to weakened /ə/ starting 'a'",
      "tip": "The boundary between 'it' and 'a' vanishes — they sound like one word"
    }
  ]
}

Now analyse this input text and return ONLY a JSON object in the same shape — no markdown, no explanation outside the JSON:

Input text:
"""
${text}
"""`
}
