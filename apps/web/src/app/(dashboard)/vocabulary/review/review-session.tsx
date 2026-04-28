'use client'

import { useState } from 'react'
import Link from 'next/link'
import { recordReviewAction } from '@/app/actions/vocabulary-srs'
import type { ReviewWord } from '@/lib/db/vocabulary-srs'
import { sm2, intervalLabel, type ReviewQuality } from '@/lib/srs'

type Props = { words: ReviewWord[] }

type Rating = { label: string; quality: ReviewQuality; color: string }

const RATINGS: Rating[] = [
  { label: 'Again', quality: 0, color: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' },
  { label: 'Hard', quality: 2, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400' },
  { label: 'Good', quality: 3, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Easy', quality: 5, color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' },
]

function nextIntervalLabel(quality: ReviewQuality, state: { interval: number; easeFactor: number; repetitions: number }): string {
  return intervalLabel(sm2(quality, state).interval)
}

export function ReviewSession({ words }: Props) {
  const [queue, setQueue] = useState<ReviewWord[]>(words)
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 })

  const card = queue[current]
  const remaining = queue.length - current

  async function handleRate(quality: ReviewQuality) {
    if (!card) return

    // Track stats
    setStats((prev) => ({
      ...prev,
      again: quality === 0 ? prev.again + 1 : prev.again,
      hard: quality === 2 ? prev.hard + 1 : prev.hard,
      good: quality === 3 ? prev.good + 1 : prev.good,
      easy: quality === 5 ? prev.easy + 1 : prev.easy,
    }))

    // Re-queue cards rated "Again" at the end of the deck
    if (quality === 0) {
      setQueue((prev) => [...prev, card])
    }

    await recordReviewAction(card.id, quality)

    const nextIdx = current + 1
    if (nextIdx >= queue.length || (quality !== 0 && nextIdx >= words.length)) {
      setDone(true)
    } else {
      setCurrent(nextIdx)
      setRevealed(false)
    }
  }

  if (done || words.length === 0) {
    const total = stats.again + stats.hard + stats.good + stats.easy
    const correct = stats.good + stats.easy
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-4xl">🎉</p>
        <div>
          <p className="text-lg font-bold text-foreground">Session complete!</p>
          <p className="text-sm text-muted-foreground mt-1">
            {words.length === 0 ? 'No cards due right now.' : `${total} card${total !== 1 ? 's' : ''} reviewed`}
          </p>
        </div>
        {total > 0 && (
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">{correct} correct</span>
            <span className="text-red-500 font-medium">{stats.again} again</span>
          </div>
        )}
        <div className="flex gap-3">
          <Link
            href="/vocabulary/review"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Review
          </Link>
          <Link
            href="/vocabulary"
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Vocabulary
          </Link>
        </div>
      </div>
    )
  }

  const srsState = card.reviewState ?? { interval: 1, easeFactor: 2.5, repetitions: 0 }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, ((current) / words.length) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{remaining} left</span>
      </div>

      {/* Flash card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Front */}
        <div className="p-8 text-center border-b border-border">
          <p className="text-3xl font-bold text-foreground">{card.word}</p>
          {card.wordType && (
            <p className="mt-1 text-xs text-muted-foreground italic">{card.wordType}</p>
          )}
          {card.reviewState && (
            <p className="mt-2 text-xs text-faint">
              Streak: {card.reviewState.repetitions} · EF: {card.reviewState.easeFactor.toFixed(2)}
            </p>
          )}
        </div>

        {/* Back — revealed */}
        {revealed ? (
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Definition</p>
              <p className="text-sm text-foreground">{card.definition}</p>
            </div>

            {card.examples && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Examples</p>
                <p className="text-xs text-muted-foreground">Speaking: {card.examples.speaking}</p>
                {card.examples.writing[0] && (
                  <p className="text-xs text-muted-foreground mt-0.5">Writing: {card.examples.writing[0]}</p>
                )}
              </div>
            )}

            {Object.values(card.familyWords ?? {}).some(Boolean) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Word family</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(card.familyWords ?? {}).map(([type, form]) =>
                    form ? (
                      <span key={type} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {type}: {form}
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {/* Rating buttons */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">How well did you know it?</p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleRate(r.quality)}
                    className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${r.color}`}
                  >
                    {r.label}
                    <span className="text-[10px] opacity-70 font-normal">
                      {nextIntervalLabel(r.quality, srsState)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 flex justify-center">
            <button
              onClick={() => setRevealed(true)}
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all"
            >
              Show definition
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
