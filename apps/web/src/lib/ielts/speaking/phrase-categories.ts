export const SPEAKING_PHRASE_CATEGORIES = [
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

export const WRITING_PHRASE_CATEGORIES = [
  'Thesis Statement',
  'Concession',
  'Linking',
  'Giving Examples',
  'Hedging',
  'Conclusion',
  'Task 1 Trend',
  'Task 1 Comparison',
  'Other',
] as const

/** Legacy alias kept for backwards compatibility with speaking phrases */
export const PHRASE_CATEGORIES = SPEAKING_PHRASE_CATEGORIES

export type SpeakingPhraseCategory = (typeof SPEAKING_PHRASE_CATEGORIES)[number]
export type WritingPhraseCategory = (typeof WRITING_PHRASE_CATEGORIES)[number]
export type PhraseCategory = SpeakingPhraseCategory | WritingPhraseCategory
