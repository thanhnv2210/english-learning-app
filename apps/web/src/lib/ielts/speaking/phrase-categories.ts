export const PHRASE_CATEGORIES = [
  'Opinion',
  'Agreeing',
  'Disagreeing',
  'Buying Time',
  'Describing',
  'Part 2 Opener',
  'Speculation',
  'Example',
  'Other',
] as const

export type PhraseCategory = (typeof PHRASE_CATEGORIES)[number]
