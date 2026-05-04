import { getCurrentUser } from '@/lib/db/user'
import { getWordPairs } from '@/lib/db/word-pairs'
import { WordPairsView } from './word-pairs-view'

export default async function WordPairsPage() {
  const user = await getCurrentUser()
  const pairs = await getWordPairs(user.id, user.role === 'admin', user.showSystemData)
  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Vocabulary
          </span>
          <span className="text-xs text-faint">{pairs.length} pairs</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Word Pairs</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Interchangeable words that look or feel similar but differ by region, register, formality,
          spelling, or context. Knowing the difference prevents subtle errors in IELTS writing and speaking.
        </p>
      </div>
      {pairs.length === 0 && (
        <p className="text-sm text-muted-foreground px-2">
          No word pairs yet.{!user.showSystemData && ' Enable system data in Settings to see built-in pairs, or'} Add your first pair below.
        </p>
      )}
      <WordPairsView initialPairs={pairs} />
    </div>
  )
}
