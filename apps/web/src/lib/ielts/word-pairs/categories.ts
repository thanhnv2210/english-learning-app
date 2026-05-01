export const WORD_PAIR_CATEGORIES = [
  'Regional',
  'Register',
  'Formality',
  'Spelling',
  'Context',
  'Other',
] as const

export type WordPairCategory = (typeof WORD_PAIR_CATEGORIES)[number]

export const CATEGORY_COLORS: Record<string, string> = {
  Regional:   'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Register:   'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  Formality:  'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Spelling:   'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  Context:    'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  Other:      'bg-subtle text-muted-foreground',
}
