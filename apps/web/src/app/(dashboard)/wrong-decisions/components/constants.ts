export const SKILLS = ['reading', 'listening', 'speaking', 'writing'] as const
export type Skill = (typeof SKILLS)[number]

export const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
}

export const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  reading:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-700 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-800' },
  listening: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  speaking:  { bg: 'bg-green-50 dark:bg-green-900/20',  text: 'text-green-700 dark:text-green-400',  border: 'border-green-200 dark:border-green-800' },
  writing:   { bg: 'bg-amber-50 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-400',  border: 'border-amber-200 dark:border-amber-800' },
}

export const QUESTION_TYPES_BY_SKILL: Record<string, string[]> = {
  reading: [
    'True/False/NG',
    'Yes/No/NG',
    'Matching Headings',
    'Matching Information',
    'Multiple Choice',
    'Note/Table Completion',
    'Sentence Completion',
    'Diagram Labelling',
    'Short Answer',
  ],
  listening: [
    'Multiple Choice',
    'Form Completion',
    'Sentence Completion',
    'Note/Table Completion',
    'Diagram/Map Labelling',
    'Matching',
    'Short Answer',
  ],
  writing: [
    'Task 1 – Bar/Line Chart',
    'Task 1 – Pie Chart',
    'Task 1 – Table',
    'Task 1 – Process',
    'Task 1 – Map',
    'Task 1 – Mixed',
    'Task 2 – Opinion',
    'Task 2 – Discussion',
    'Task 2 – Problem/Solution',
    'Task 2 – Two-Part',
  ],
  speaking: [
    'Part 1 – Personal Questions',
    'Part 2 – Long Turn',
    'Part 3 – Discussion',
  ],
}

export const QUESTION_ROLES = [
  'question-word',
  'category',
  'exclusion',
  'hedge',
  'relationship',
  'target',
  'time',
] as const

export const ROLE_LABELS: Record<string, string> = {
  'question-word': 'Question word',
  'category':      'Category',
  'exclusion':     'Exclusion',
  'hedge':         'Hedge signal',
  'relationship':  'Relationship',
  'target':        'Target',
  'time':          'Time constraint',
}

export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  'question-word': { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-800 dark:text-blue-300'   },
  'category':      { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300' },
  'exclusion':     { bg: 'bg-rose-100 dark:bg-rose-900/30',   text: 'text-rose-800 dark:text-rose-300'   },
  'hedge':         { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-800 dark:text-amber-300'  },
  'relationship':  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300' },
  'target':        { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-800 dark:text-green-300'  },
  'time':          { bg: 'bg-subtle',       text: 'text-foreground'   },
}

export const ARTICLE_STRUCTURES = [
  'Problem → Solution',
  'Cause → Effect',
  'Scientific Discovery / Research Study',
  'Historical Evolution / Chronological',
  'Comparison / Contrast',
  'Argument → Counter-argument → Rebuttal',
  'General → Specific (Classificatory)',
]

export function roleColor(role: string) {
  return ROLE_COLORS[role] ?? { bg: 'bg-subtle', text: 'text-muted-foreground' }
}

export function relativeDate(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return new Date(date).toLocaleDateString()
}
