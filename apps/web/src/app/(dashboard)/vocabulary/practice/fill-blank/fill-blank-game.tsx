'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  createPracticeSessionAction,
  logPracticeResultAction,
  completePracticeSessionAction,
} from '@/app/actions/word-sentences'
import type { WordSentenceWithWord } from '@/lib/db/word-sentences'

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Replace the target word in the sentence with a blank, whole-word, case-insensitive. */
function blankSentence(sentence: string, word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
  return sentence.replace(regex, '_____')
}

function isCorrect(input: string, word: string): boolean {
  return input.trim().toLowerCase() === word.toLowerCase()
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'question' | 'result'
type GamePhase = 'ready' | 'playing' | 'finished'

const CONTEXT_COLORS: Record<string, string> = {
  Speaking: 'bg-green-50 text-green-700',
  Writing:  'bg-blue-50 text-blue-700',
  News:     'bg-orange-50 text-orange-700',
  Book:     'bg-purple-50 text-purple-700',
  Podcast:  'bg-pink-50 text-pink-700',
  Other:    'bg-subtle text-muted-foreground',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FillBlankGame({ sentences }: { sentences: WordSentenceWithWord[] }) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [queue, setQueue] = useState<WordSentenceWithWord[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = queue[index]

  // ── Start ──────────────────────────────────────────────────────────────────

  async function startGame() {
    const shuffled = shuffle(sentences)
    setQueue(shuffled)
    setIndex(0)
    setScore(0)
    setPhase('question')
    setAnswer('')
    setCorrect(null)
    const sid = await createPracticeSessionAction('fill_blank')
    setSessionId(sid)
    setGamePhase('playing')
    startTimeRef.current = Date.now()
  }

  // Focus input when question phase starts
  useEffect(() => {
    if (gamePhase === 'playing' && phase === 'question') {
      setTimeout(() => inputRef.current?.focus(), 50)
      startTimeRef.current = Date.now()
    }
  }, [gamePhase, phase, index])

  // ── Submit answer ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!current || phase !== 'question') return
    const timeMs = Date.now() - startTimeRef.current
    const ok = isCorrect(answer, current.word)
    setCorrect(ok)
    setPhase('result')
    if (ok) setScore((s) => s + 1)
    if (sessionId) {
      await logPracticeResultAction(sessionId, current.id, ok, timeMs)
    }
  }, [answer, current, phase, sessionId])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (phase === 'question') handleSubmit()
      else handleNext()
    }
  }

  // ── Next ───────────────────────────────────────────────────────────────────

  async function handleNext() {
    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      if (sessionId) {
        await completePracticeSessionAction(sessionId, score + (correct ? 1 : 0))
      }
      setGamePhase('finished')
    } else {
      setIndex(nextIndex)
      setPhase('question')
      setAnswer('')
      setCorrect(null)
    }
  }

  // ── Screens ────────────────────────────────────────────────────────────────

  if (sentences.length < 3) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col gap-3 items-center">
        <p className="text-sm text-muted-foreground">
          You need at least 3 saved sentences to play.
        </p>
        <Link href="/vocabulary" className="text-sm font-medium text-blue-500 hover:text-blue-700">
          Go save some sentences →
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
            {sentences.length} sentences across your vocabulary library.
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
            href="/vocabulary"
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Back to Vocabulary
          </Link>
        </div>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────────────

  if (!current) return null

  const blanked = blankSentence(current.sentence, current.word)
  const progress = ((index) / queue.length) * 100

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
        {/* Context + word */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTEXT_COLORS[current.context] ?? CONTEXT_COLORS.Other}`}>
            {current.context}
          </span>
          {phase === 'result' && (
            <span className="text-xs text-faint italic">{current.wordType ?? ''}</span>
          )}
        </div>

        {/* Sentence */}
        <p className="text-base leading-relaxed text-foreground">
          {phase === 'question'
            ? blanked
            : current.sentence.replace(
                new RegExp(`\\b${current.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'),
                `<mark>${current.word}</mark>`
              ).split(/(<mark>.*?<\/mark>)/).map((part, i) =>
                part.startsWith('<mark>') ? (
                  <mark key={i} className="bg-transparent font-bold text-blue-600 not-italic">{current.word}</mark>
                ) : part
              )
          }
        </p>

        {/* Answer hint on result */}
        {phase === 'result' && (
          <div className={`rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 ${
            correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${current.word}`}
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
              placeholder="Type the missing word…"
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

      {/* Score tracker */}
      <p className="text-xs text-faint text-center">
        Score: <span className="font-semibold text-muted-foreground">{score}</span> correct so far
      </p>
    </div>
  )
}
