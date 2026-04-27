'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  createPracticeSessionAction,
  logPracticeResultAction,
  completePracticeSessionAction,
} from '@/app/actions/word-sentences'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function blankSentence(sentence: string, answer: string): string {
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return sentence.replace(new RegExp(escaped, 'gi'), '_____')
}

const CONTEXT_COLORS: Record<string, string> = {
  Speaking: 'bg-green-50 text-green-700',
  Writing:  'bg-blue-50 text-blue-700',
  News:     'bg-orange-50 text-orange-700',
  Book:     'bg-purple-50 text-purple-700',
  Podcast:  'bg-pink-50 text-pink-700',
  Other:    'bg-subtle text-muted-foreground',
}

type GamePhase = 'ready' | 'playing' | 'finished'
type Phase = 'hidden' | 'revealed'

type Props = {
  items: PracticeItem[]
  backHref: string
  backLabel?: string
  emptyMessage?: string
  gameType: string
}

export function FlashcardGame({ items, backHref, backLabel = 'Back', emptyMessage, gameType }: Props) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [queue, setQueue] = useState<PracticeItem[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('hidden')
  const [score, setScore] = useState(0)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const current = queue[index]

  async function startGame() {
    const shuffled = shuffle(items)
    setQueue(shuffled)
    setIndex(0)
    setScore(0)
    setPhase('hidden')
    const sid = await createPracticeSessionAction(gameType)
    setSessionId(sid)
    setGamePhase('playing')
    startTimeRef.current = Date.now()
  }

  useEffect(() => {
    if (gamePhase === 'playing' && phase === 'hidden') {
      startTimeRef.current = Date.now()
    }
  }, [gamePhase, phase, index])

  async function handleRate(knew: boolean) {
    if (!current) return
    const timeMs = Date.now() - startTimeRef.current
    if (knew) setScore((s) => s + 1)
    if (sessionId && current.sentenceId) {
      await logPracticeResultAction(sessionId, current.sentenceId, knew, timeMs)
    }
    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      const finalScore = score + (knew ? 1 : 0)
      if (sessionId) await completePracticeSessionAction(sessionId, finalScore)
      setGamePhase('finished')
    } else {
      setIndex(nextIndex)
      setPhase('hidden')
    }
  }

  // ── Screens ────────────────────────────────────────────────────────────────

  if (items.length < 3) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col gap-3 items-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? 'You need at least 3 items to start.'}
        </p>
        <Link href={backHref} className="text-sm font-medium text-blue-500 hover:text-blue-700">
          {backLabel} →
        </Link>
      </div>
    )
  }

  if (gamePhase === 'ready') {
    return (
      <div className="rounded-xl border border-border bg-card p-10 flex flex-col gap-4 items-center text-center">
        <div className="text-4xl">🃏</div>
        <div>
          <p className="text-base font-semibold text-foreground">Ready to review?</p>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} cards · reveal the answer and self-rate.
          </p>
        </div>
        <button
          onClick={startGame}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Start Review
        </button>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    const total = queue.length
    const pct = Math.round((score / total) * 100)
    return (
      <div className="rounded-xl border border-border bg-card p-10 flex flex-col gap-5 items-center text-center">
        <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
        <div>
          <p className="text-xl font-bold text-foreground">{score} / {total}</p>
          <p className="text-sm text-muted-foreground mt-1">{pct}% known</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Review Again
          </button>
          <Link
            href={backHref}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    )
  }

  if (!current) return null

  const progress = (index / queue.length) * 100

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-faint shrink-0">{index + 1} / {queue.length}</span>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5 min-h-48">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTEXT_COLORS[current.context] ?? CONTEXT_COLORS.Other}`}>
            {current.context}
          </span>
          {phase === 'revealed' && current.hint && (
            <span className="text-xs italic text-faint">{current.hint}</span>
          )}
        </div>

        {/* Sentence */}
        <p className="text-base leading-relaxed text-foreground flex-1">
          {phase === 'hidden'
            ? blankSentence(current.sentence, current.answer)
            : current.sentence
                .split(new RegExp(`(${current.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
                .map((part, i) =>
                  part.toLowerCase() === current.answer.toLowerCase()
                    ? <mark key={i} className="bg-transparent font-bold text-blue-600 not-italic">{part}</mark>
                    : part
                )
          }
        </p>

        {/* Answer word revealed */}
        {phase === 'revealed' && (
          <div className="rounded-lg border border-border bg-muted px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-faint">Answer:</span>
            <span className="text-sm font-semibold text-foreground">{current.answer}</span>
          </div>
        )}

        {/* Actions */}
        {phase === 'hidden' ? (
          <button
            onClick={() => setPhase('revealed')}
            className="self-start rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Reveal Answer
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleRate(false)}
              className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              ✗ Didn&apos;t know
            </button>
            <button
              onClick={() => handleRate(true)}
              className="flex-1 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-100 transition-colors"
            >
              ✓ Knew it
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-faint text-center">
        Known: <span className="font-semibold text-muted-foreground">{score}</span> so far
      </p>
    </div>
  )
}
