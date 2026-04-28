import Link from 'next/link'
import { getDueReviewWords, getDueReviewCount, getEnrolledCount } from '@/lib/db/vocabulary-srs'
import { ReviewSession } from './review-session'

export default async function VocabularyReviewPage() {
  const [dueWords, dueCount, enrolledCount] = await Promise.all([
    getDueReviewWords(20),
    getDueReviewCount(),
    getEnrolledCount(),
  ])

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vocabulary Review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Spaced repetition · {enrolledCount} word{enrolledCount !== 1 ? 's' : ''} enrolled
            {dueCount > 0 && (
              <span className="ml-2 font-semibold text-blue-600">{dueCount} due today</span>
            )}
          </p>
        </div>
        <Link
          href="/vocabulary"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Vocabulary
        </Link>
      </div>

      {enrolledCount === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-3xl">📚</p>
          <div>
            <p className="text-sm font-semibold text-foreground">No words enrolled yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Open any vocabulary word and click &ldquo;Add to Review&rdquo; to start building your deck.
            </p>
          </div>
          <Link
            href="/vocabulary"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse vocabulary
          </Link>
        </div>
      ) : dueCount === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-3xl">✅</p>
          <p className="text-sm font-semibold text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground">No cards due right now. Check back later.</p>
        </div>
      ) : (
        <ReviewSession words={dueWords} />
      )}
    </div>
  )
}
