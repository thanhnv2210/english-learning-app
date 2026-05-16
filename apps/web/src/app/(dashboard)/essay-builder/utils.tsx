import { buildInflectPattern } from '@/lib/ielts/irregular-verbs'

// ── Types ─────────────────────────────────────────────────────────────────────

export type Skill = 'writing_task1' | 'writing_task2' | 'speaking'

export const SKILL_LABELS: Record<string, string> = {
  writing_task1: 'Writing Task 1',
  writing_task2: 'Writing Task 2',
  speaking: 'Speaking',
}

// ── Highlight helper ──────────────────────────────────────────────────────────

export type PhraseSet = { phrases: string[]; className: string }

export function buildPattern(phrase: string): string {
  const words = phrase.trim().split(/\s+/)
  if (words.length === 1) return buildInflectPattern(phrase)
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlight(text: string, phraseSets: PhraseSet[]) {
  const all = phraseSets
    .flatMap(({ phrases, className }) => phrases.map((p) => ({ phrase: p, className })))
    .sort((a, b) => b.phrase.length - a.phrase.length)

  if (all.length === 0) return <>{text}</>

  const phraseMap = new Map<string, string>()
  for (const { phrase, className } of all) {
    const key = phrase.toLowerCase()
    if (!phraseMap.has(key)) phraseMap.set(key, className)
  }

  const patterns = all.map(({ phrase }) => buildPattern(phrase))
  const regex = new RegExp(`(${patterns.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) => {
        const partLower = part.toLowerCase()
        let cls: string | undefined
        for (const [base, className] of phraseMap) {
          const baseWords = base.split(/\s+/)
          if (baseWords.length === 1) {
            const pat = new RegExp(`^${buildInflectPattern(base)}$`, 'i')
            if (pat.test(part)) { cls = className; break }
          } else {
            if (partLower === base) { cls = className; break }
          }
        }
        return cls ? (
          <mark key={i} className={`rounded px-0.5 font-semibold not-italic ${cls}`}>{part}</mark>
        ) : (
          part
        )
      })}
    </>
  )
}
