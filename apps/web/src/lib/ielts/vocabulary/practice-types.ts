export type PracticeItem = {
  /** Unique key for React rendering */
  id: string
  /** Full sentence with the answer somewhere inside */
  sentence: string
  /** The word or phrase to be blanked out */
  answer: string
  /** Part-of-speech or collocation type — shown after reveal */
  hint: string | null
  /** Context label shown on the card (Speaking, Writing, News, …) */
  context: string
  /** Source section — used for session tracking */
  source: 'vocabulary' | 'collocation'
  /** Only set for vocabulary sentences — used to log individual results */
  sentenceId?: number
}
