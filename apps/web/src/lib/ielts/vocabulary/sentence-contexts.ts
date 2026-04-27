export const SENTENCE_CONTEXTS = ['Speaking', 'Writing', 'News', 'Book', 'Podcast', 'Other'] as const
export type SentenceContext = (typeof SENTENCE_CONTEXTS)[number]
