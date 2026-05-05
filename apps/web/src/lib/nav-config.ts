// Single source of truth for navigation structure.
// Imported by both NavSidebar (desktop) and MobileHeader (mobile).

export type NavItem = { href: string; label: string; icon: string }
export type NavGroup = { label: string; items: NavItem[] }

export const STANDALONE: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
]

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Practice',
    items: [
      { href: '/speaking/session', label: 'Speaking (Full)', icon: '🎙' },
      { href: '/speaking', label: 'Speaking Pt 1', icon: '🎤' },
      { href: '/speaking/part2', label: 'Speaking Pt 2', icon: '🎤' },
      { href: '/writing', label: 'Writing Task 2', icon: '✍' },
      { href: '/writing/task1', label: 'Writing Task 1', icon: '📊' },
      { href: '/reading', label: 'Reading', icon: '📖' },
      { href: '/listening', label: 'Listening', icon: '🎧' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/vocabulary', label: 'Vocabulary', icon: '📚' },
      { href: '/vocabulary/review', label: 'Vocab Review (SRS)', icon: '🔁' },
      { href: '/collocations', label: 'Collocations', icon: '🧩' },
      { href: '/idioms', label: 'Idioms', icon: '💬' },
      { href: '/compare', label: 'Word Compare', icon: '⚖️' },
      { href: '/vocab-banks', label: 'Vocab Banks', icon: '🏦' },
      { href: '/essay-builder', label: 'Essay Builder', icon: '✍️' },
      { href: '/connected-speech', label: 'Connected Speech', icon: '🔗' },
      { href: '/grammar-traps', label: 'Grammar Traps', icon: '⚠️' },
      { href: '/speaking/phrases', label: 'Speaking Phrases', icon: '🗣️' },
      { href: '/writing/phrases', label: 'Writing Phrases', icon: '✍️' },
      { href: '/word-pairs', label: 'Word Pairs', icon: '⇄' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { href: '/getting-started', label: 'Getting Started', icon: '🚀' },
      { href: '/cheat-sheet', label: 'Cheat Sheet', icon: '🗺️' },
      { href: '/how-to-answer', label: 'How to Answer', icon: '💡' },
      { href: '/irregular-verbs', label: 'Irregular Verbs', icon: '🔀' },
      { href: '/how-to-answer/question-anatomy', label: 'Question Anatomy', icon: '🔍' },
      { href: '/paraphrase', label: 'Paraphrase', icon: '🔄' },
      { href: '/language-comparison', label: 'Language DNA', icon: '🧬' },
      { href: '/topic-ideas', label: 'Topic Ideas', icon: '🗂️' },
      { href: '/prompt-library', label: 'AI Prompts', icon: '🤖' },
      { href: '/exam-countdown', label: 'Exam Sprint', icon: '⏱️' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { href: '/projects', label: 'Projects', icon: '📋' },
      { href: '/analytics', label: 'Analytics', icon: '📊' },
      { href: '/wrong-decisions', label: 'Wrong Decisions', icon: '❌' },
      { href: '/history', label: 'History', icon: '🕐' },
    ],
  },
]

export const ADMIN_GROUP: NavGroup = {
  label: 'Admin',
  items: [
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/campaign', label: 'Campaign', icon: '📣' },
  ],
}

export const SETTINGS_ITEM: NavItem = { href: '/settings', label: 'Settings', icon: '⚙️' }

export const ALL_NAV_ITEMS: NavItem[] = [
  ...STANDALONE,
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...ADMIN_GROUP.items,
  SETTINGS_ITEM,
]
