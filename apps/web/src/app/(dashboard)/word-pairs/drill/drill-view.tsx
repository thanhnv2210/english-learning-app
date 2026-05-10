'use client'

import { useState, useMemo } from 'react'
import { CATEGORY_COLORS } from '@/lib/ielts/word-pairs/categories'
import type { WordPair } from '@/lib/db/word-pairs'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type DrillStage = 'drilling' | 'summary'

export function WordPairDrillView({ pairs }: { pairs: WordPair[] }) {
  const [queue, setQueue] = useState<WordPair[]>(() => shuffle(pairs))
  const [flipped, setFlipped] = useState(false)
  const [gotIt, setGotIt] = useState(0)
  const [reviewAgain, setReviewAgain] = useState(0)
  const [stage, setStage] = useState<DrillStage>('drilling')
  const [missedIds, setMissedIds] = useState<Set<number>>(new Set())

  const total = pairs.length
  const done = gotIt + reviewAgain
  const current = queue[0]

  function handleGotIt() {
    setGotIt((n) => n + 1)
    next()
  }

  function handleReviewAgain() {
    setReviewAgain((n) => n + 1)
    setMissedIds((prev) => new Set(prev).add(current.id))
    // Re-queue at the end
    setQueue((prev) => [...prev.slice(1), prev[0]])
    setFlipped(false)
  }

  function next() {
    const nextQueue = queue.slice(1)
    if (nextQueue.length === 0) {
      setStage('summary')
    } else {
      setQueue(nextQueue)
      setFlipped(false)
    }
  }

  function restartMissed() {
    const missed = pairs.filter((p) => missedIds.has(p.id))
    setQueue(shuffle(missed))
    setGotIt(0)
    setReviewAgain(0)
    setMissedIds(new Set())
    setFlipped(false)
    setStage('drilling')
  }

  function restartAll() {
    setQueue(shuffle(pairs))
    setGotIt(0)
    setReviewAgain(0)
    setMissedIds(new Set())
    setFlipped(false)
    setStage('drilling')
  }

  // ── Summary screen ─────────────────────────────────────────────────────────
  if (stage === 'summary') {
    const pct = total > 0 ? Math.round((gotIt / total) * 100) : 0
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4">
          <p className="text-5xl font-bold tabular-nums text-violet-600">{pct}%</p>
          <p className="text-sm text-muted-foreground">
            {gotIt} of {total} pairs recalled on first flip
          </p>
          <div className="w-full max-w-xs h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {missedIds.size > 0 && (
            <div className="flex flex-col gap-2 w-full text-center text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{missedIds.size}</span> pair{missedIds.size > 1 ? 's' : ''} marked for review
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {pairs.filter((p) => missedIds.has(p.id)).map((p) => (
                  <span key={p.id} className="rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    {p.wordA} / {p.wordB}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {missedIds.size > 0 && (
            <button
              onClick={restartMissed}
              className="flex-1 rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              Drill missed ({missedIds.size})
            </button>
          )}
          <button
            onClick={restartAll}
            className={`rounded-lg border border-border bg-card py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors ${missedIds.size > 0 ? 'px-5' : 'flex-1'}`}
          >
            Restart all
          </button>
        </div>
      </div>
    )
  }

  // ── Drilling screen ────────────────────────────────────────────────────────
  if (!current) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-300"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-faint shrink-0">{done} / {total}</span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[320px] flex flex-col">

        {/* Front — always visible */}
        <div className="flex flex-col items-center justify-center gap-3 px-8 py-10 text-center border-b border-border">
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[current.category] ?? CATEGORY_COLORS['Other']}`}>
            {current.category}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">{current.wordA}</span>
            <span className="text-xl text-faint font-light">/</span>
            <span className="text-3xl font-bold text-violet-600">{current.wordB}</span>
          </div>
          <p className="text-sm text-faint mt-1">What&apos;s the difference?</p>
        </div>

        {/* Back — revealed on flip */}
        {flipped ? (
          <div className="flex flex-col gap-4 px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground">{current.explanation}</p>
            {current.examples.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {current.examples.map((ex, i) => (
                  <li key={i} className="text-xs text-muted-foreground italic leading-relaxed pl-3 border-l-2 border-violet-300">
                    {ex}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 py-8">
            <button
              onClick={() => setFlipped(true)}
              className="rounded-xl border-2 border-violet-300 dark:border-violet-700 px-8 py-3 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
            >
              Flip to see ▼
            </button>
          </div>
        )}
      </div>

      {/* Action buttons — only after flip */}
      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleReviewAgain}
            className="rounded-xl border border-border bg-card py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Review again ↩
          </button>
          <button
            onClick={handleGotIt}
            className="rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Got it ✓
          </button>
        </div>
      )}

      {/* Running tally */}
      <div className="flex justify-center gap-6 text-xs text-faint">
        <span><span className="font-semibold text-green-600">{gotIt}</span> got it</span>
        <span><span className="font-semibold text-amber-500">{reviewAgain}</span> to review</span>
        <span><span className="font-semibold text-foreground">{queue.length}</span> remaining</span>
      </div>
    </div>
  )
}
