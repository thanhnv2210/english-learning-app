// Client-safe constants — no DB imports allowed in this file.
// Import this in client components instead of lib/db/grammar-traps.

export const CATEGORY_LABELS: Record<string, string> = {
  uncountable:      'Uncountable Noun',
  always_plural:    'Always Plural',
  false_singular:   'False Singular',
  number_agreement: 'Number Agreement',
  collective:       'Collective Noun',
}

export const CATEGORY_COLORS: Record<string, string> = {
  uncountable:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  always_plural:    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  false_singular:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  number_agreement: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  collective:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]
