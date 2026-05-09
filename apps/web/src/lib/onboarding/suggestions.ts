export type SuggestedPage = {
  href: string
  label: string
  reason: string
}

const SKILL_PAGES: Record<string, SuggestedPage[]> = {
  writing: [
    { href: '/writing', label: 'Writing Task 2', reason: 'Practice IELTS essay writing with instant feedback' },
    { href: '/essay-builder', label: 'Essay Builder', reason: 'Generate and analyse sample essays by topic' },
    { href: '/paraphrase', label: 'Paraphrase Guide', reason: 'Master paraphrasing — a core writing skill' },
  ],
  speaking: [
    { href: '/speaking', label: 'Speaking Simulator', reason: 'Simulate Part 1, 2 and 3 with AI examiner' },
    { href: '/how-to-answer', label: 'How to Answer', reason: 'Structured strategies for each question type' },
  ],
  reading: [
    { href: '/reading', label: 'Reading Practice', reason: 'T/F/NG and short-answer passages' },
    { href: '/how-to-answer', label: 'How to Answer', reason: 'Techniques for skimming, scanning and inference' },
  ],
  listening: [
    { href: '/listening', label: 'Listening Practice', reason: 'Note-completion exercises with audio playback' },
  ],
}

const REASON_PAGES: Record<string, SuggestedPage[]> = {
  exam: [
    { href: '/analytics', label: 'Analytics', reason: 'Track your band scores across sessions' },
    { href: '/history', label: 'Session History', reason: 'Review past practice sessions' },
  ],
  vocabulary: [
    { href: '/vocabulary', label: 'Vocabulary', reason: 'Browse and save Academic Word List entries' },
    { href: '/collocations', label: 'Collocations', reason: 'Build natural word combinations' },
  ],
}

const ALWAYS_SUGGEST: SuggestedPage[] = [
  { href: '/vocabulary', label: 'Vocabulary', reason: 'Build your Academic Word List bank' },
  { href: '/collocations', label: 'Collocations', reason: 'Learn natural word combinations for higher bands' },
]

export function getSuggestedPages(weakSkills: string[], reasons: string[]): SuggestedPage[] {
  const seen = new Set<string>()
  const pages: SuggestedPage[] = []

  function add(p: SuggestedPage) {
    if (!seen.has(p.href)) {
      seen.add(p.href)
      pages.push(p)
    }
  }

  // Skill-based suggestions
  for (const skill of weakSkills) {
    for (const p of SKILL_PAGES[skill] ?? []) add(p)
  }

  // Reason-based suggestions
  const hasExamReason = reasons.some((r) =>
    r.toLowerCase().includes('university') ||
    r.toLowerCase().includes('job') ||
    r.toLowerCase().includes('migration') ||
    r.toLowerCase().includes('exam')
  )
  if (hasExamReason) {
    for (const p of REASON_PAGES.exam) add(p)
  }

  // Always include vocab/collocations
  for (const p of ALWAYS_SUGGEST) add(p)

  return pages
}
