import { getCurrentUser } from '@/lib/db/user'
import { getWordPairs } from '@/lib/db/word-pairs'
import { WordPairDrillView } from './drill-view'
import Link from 'next/link'

export default async function WordPairDrillPage() {
  const user = await getCurrentUser()
  const pairs = await getWordPairs(user.id, user.role === 'admin', user.showSystemData)

  return (
    <div className="mx-auto max-w-xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/word-pairs"
          className="text-xs text-faint hover:text-muted-foreground transition-colors"
        >
          ← Word Pairs
        </Link>
        <span className="text-xs text-faint">{pairs.length} pair{pairs.length !== 1 ? 's' : ''}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Word Pairs Drill</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flashcard drill — flip each card to recall when to use each word.
        </p>
      </div>

      {pairs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-faint mb-3">No word pairs in your library yet.</p>
          <Link
            href="/word-pairs"
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            Add some pairs →
          </Link>
        </div>
      ) : (
        <WordPairDrillView pairs={pairs} />
      )}
    </div>
  )
}
