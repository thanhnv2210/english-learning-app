'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  createPracticeSessionAction,
  logPracticeResultAction,
  completePracticeSessionAction,
} from '@/app/actions/word-sentences'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const regex = new RegExp(escaped, 'gi')
  return sentence.replace(regex, '_____')
}

function isCorrect(input: string, answer: string): boolean {
  return input.trim().toLowerCase() === answer.toLowerCase()
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTEXT_COLORS: Record<string, string> = {
  Speaking: 'bg-green-50 text-green-700',
  Writing:  'bg-blue-50 text-blue-700',
  News:     'bg-orange-50 text-orange-700',
  Book:     'bg-purple-50 text-purple-700',
  Podcast:  'bg-pink-50 text-pink-700',
  Other:    'bg-subtle text-muted-foreground',
}

const SOURCE_LABEL: Record<string, string> = {
  vocabulary:   'Vocabulary',
  collocation:  'Collocation',
}

type GamePhase = 'ready' | 'playing' | 'finished'
type Phase = 'question' | 'result'

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  items: PracticeItem[]
  backHref: string
  backLabel?: string
  emptyMessage?: string
  gameType: string
}

export function FillBlankGame({ items, backHref, backLabel = 'Back', emptyMessage, gameType }: Props) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [queue, setQueue] = useState<PracticeItem[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = queue[index]

  async function startGame() {
    const shuffled = shuffle(items)
    setQueue(shuffled)
    setIndex(0)
    setScore(0)
    setPhase('question')
    setAnswer('')
    setCorrect(null)
    const sid = await createPracticeSessionAction(gameType)
    setSessionId(sid)
    setGamePhase('playing')
    startTimeRef.current = Date.now()
  }

  useEffect(() => {
    if (gamePhase === 'playing' && phase === 'question') {
      setTimeout(() => inputRef.current?.focus(), 50)
      startTimeRef.current = Date.now()
    }
  }, [gamePhase, phase, index])

  const handleSubmit = useCallback(async () => {
    if (!current || phase !== 'question') return
    const timeMs = Date.now() - startTimeRef.current
    const ok = isCorrect(answer, current.answer)
    setCorrect(ok)
    setPhase('result')
    if (ok) setScore((s) => s + 1)
    // Only log individual results for vocabulary sentences (have sentenceId)
    if (sessionId && current.sentenceId) {
      await logPracticeResultAction(sessionId, current.sentenceId, ok, timeMs)
    }
  }, [answer, current, phase, sessionId])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (phase === 'question') handleSubmit()
      else handleNext()
    }
  }

  async function handleNext() {
    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      const finalScore = score + (correct ? 1 : 0)
      if (sessionId) await completePracticeSessionAction(sessionId, finalScore)
      setGamePhase('finished')
    } else {
      setIndex(nextIndex)
      setPhase('question')
      setAnswer('')
      setCorrect(null)
    }
  }

  // ── Screens ────────────────────────────────────────────────────────────────

  if (items.length < 3) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col gap-3 items-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? 'You need at least 3 items to play.'}
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
        <div className="text-4xl">✏️</div>
        <div>
          <p className="text-base font-semibold text-foreground">Ready to practice?</p>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} sentences to go through.
          </p>
        </div>
        <button
          onClick={startGame}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Start Game
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
          <p className="text-sm text-muted-foreground mt-1">{pct}% correct</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Play Again
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

  const blanked = blankSentence(current.sentence, current.answer)
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
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTEXT_COLORS[current.context] ?? CONTEXT_COLORS.Other}`}>
              {current.context}
            </span>
            <span className="text-xs text-faint">{SOURCE_LABEL[current.source]}</span>
          </div>
          {phase === 'result' && current.hint && (
            <span className="text-xs italic text-faint">{current.hint}</span>
          )}
        </div>

        {/* Sentence */}
        <p className="text-base leading-relaxed text-foreground">
          {phase === 'question'
            ? blanked
            : current.sentence
                .split(new RegExp(`(${current.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
                .map((part, i) =>
                  part.toLowerCase() === current.answer.toLowerCase()
                    ? <mark key={i} className="bg-transparent font-bold text-blue-600 not-italic">{part}</mark>
                    : part
                )
          }
        </p>

        {/* Result banner */}
        {phase === 'result' && (
          <div className={`rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 ${
            correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${current.answer}`}
          </div>
        )}

        {/* Input */}
        {phase === 'question' && (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type the missing word or phrase…"
              className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-faint"
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Check
            </button>
          </div>
        )}

        {phase === 'result' && (
          <button
            onClick={handleNext}
            className="self-end rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {index + 1 >= queue.length ? 'See Results' : 'Next →'}
          </button>
        )}
      </div>

      <p className="text-xs text-faint text-center">
        Score: <span className="font-semibold text-muted-foreground">{score}</span> correct so far
      </p>
    </div>
  )
}
