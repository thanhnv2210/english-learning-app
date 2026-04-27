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
  return sentence.replace(new RegExp(escaped, 'gi'), '_____')
}

/** Pick 3 unique distractors from the pool, different from the correct answer. */
function pickDistractors(correct: string, pool: PracticeItem[]): string[] {
  const seen = new Set([correct.toLowerCase()])
  const distractors: string[] = []
  for (const item of shuffle(pool)) {
    const a = item.answer
    if (!seen.has(a.toLowerCase())) {
      seen.add(a.toLowerCase())
      distractors.push(a)
      if (distractors.length === 3) break
    }
  }
  return distractors
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
type Phase = 'question' | 'result'

type RoundOptions = { options: string[]; correct: string }

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  items: PracticeItem[]
  backHref: string
  backLabel?: string
  emptyMessage?: string
  gameType: string
}

export function MultipleChoiceGame({ items, backHref, backLabel = 'Back', emptyMessage, gameType }: Props) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [queue, setQueue] = useState<PracticeItem[]>([])
  const [roundOptions, setRoundOptions] = useState<RoundOptions[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const current = queue[index]
  const options = roundOptions[index]

  async function startGame() {
    const shuffled = shuffle(items)
    // Pre-compute options for every round so they don't change on re-render
    const allOptions: RoundOptions[] = shuffled.map((item) => {
      const distractors = pickDistractors(item.answer, items)
      return { options: shuffle([item.answer, ...distractors]), correct: item.answer }
    })
    setQueue(shuffled)
    setRoundOptions(allOptions)
    setIndex(0)
    setScore(0)
    setPhase('question')
    setSelected(null)
    const sid = await createPracticeSessionAction(gameType)
    setSessionId(sid)
    setGamePhase('playing')
    startTimeRef.current = Date.now()
  }

  useEffect(() => {
    if (gamePhase === 'playing' && phase === 'question') {
      startTimeRef.current = Date.now()
    }
  }, [gamePhase, phase, index])

  const handleSelect = useCallback(async (choice: string) => {
    if (!current || !options || phase !== 'question') return
    const timeMs = Date.now() - startTimeRef.current
    const ok = choice.toLowerCase() === options.correct.toLowerCase()
    setSelected(choice)
    setPhase('result')
    if (ok) setScore((s) => s + 1)
    if (sessionId && current.sentenceId) {
      await logPracticeResultAction(sessionId, current.sentenceId, ok, timeMs)
    }
  }, [current, options, phase, sessionId])

  async function handleNext() {
    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      const finalScore = score + (selected?.toLowerCase() === options?.correct.toLowerCase() ? 1 : 0)
      if (sessionId) await completePracticeSessionAction(sessionId, finalScore)
      setGamePhase('finished')
    } else {
      setIndex(nextIndex)
      setPhase('question')
      setSelected(null)
    }
  }

  // ── Screens ────────────────────────────────────────────────────────────────

  if (items.length < 4) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col gap-3 items-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? 'You need at least 4 items to generate choices.'}
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
        <div className="text-4xl">🔤</div>
        <div>
          <p className="text-base font-semibold text-foreground">Ready to practice?</p>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} sentences · pick the correct word from 4 choices.
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

  if (!current || !options) return null

  const progress = (index / queue.length) * 100
  const isCorrect = (choice: string) => choice.toLowerCase() === options.correct.toLowerCase()

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
          </div>
          {phase === 'result' && current.hint && (
            <span className="text-xs italic text-faint">{current.hint}</span>
          )}
        </div>

        {/* Sentence */}
        <p className="text-base leading-relaxed text-foreground">
          {phase === 'question'
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

        {/* Options */}
        <div className="grid grid-cols-2 gap-2">
          {options.options.map((opt) => {
            let style = 'border-border bg-card text-foreground hover:bg-muted'
            if (phase === 'result') {
              if (isCorrect(opt)) style = 'border-green-400 bg-green-50 text-green-700'
              else if (opt === selected) style = 'border-red-400 bg-red-50 text-red-700'
              else style = 'border-border bg-card text-faint opacity-50'
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={phase === 'result'}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition-colors ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

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
