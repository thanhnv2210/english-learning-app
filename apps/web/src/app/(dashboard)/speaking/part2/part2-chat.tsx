'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, updateExamTranscript, saveFeedback } from '@/app/actions/exam'
import { generateAndSaveCueCard } from '@/app/actions/cue-card'
import { TimerControl } from '@/components/timer-control'
import { TimerAlertModal } from '@/components/timer-alert-modal'
import { FeedbackView } from '@/components/feedback-view'
import { VocabularyDrawer } from '@/components/vocabulary-drawer'
import { useTimer } from '@/lib/ielts/timer/use-timer'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'
import type { Message } from 'ai'

type CueCard = { id: number; prompt: string }

type Props = {
  initialMessages?: TranscriptMessage[]
  resumeExamId?: number
  initialCueCard?: CueCard
  targetBand?: number
}

type Stage = 'idle' | 'generating' | 'prep' | 'speaking' | 'ended'

export function Part2Chat({ initialMessages, resumeExamId, initialCueCard, targetBand = 6.5 }: Props) {
  const router = useRouter()
  const prepTimer = useTimer(60)    // 1-minute prep
  const speakTimer = useTimer(120)  // 2-minute speak

  const [stage, setStage] = useState<Stage>(resumeExamId ? 'speaking' : 'idle')
  const [cueCard, setCueCard] = useState<CueCard | undefined>(initialCueCard)
  const [examId, setExamId] = useState<number | undefined>(resumeExamId)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [isSaving, startSaveTransition] = useTransition()
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { mode: 'part2', cueCardPrompt: cueCard?.prompt },
    initialMessages: initialMessages as Message[] | undefined,
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleStart() {
    setStage('generating')
    const card = await generateAndSaveCueCard()
    setCueCard(card)
    setStage('prep')
    prepTimer.start()
  }

  function handleBeginSpeaking() {
    prepTimer.stop()
    setStage('speaking')
    speakTimer.start()
    append({ role: 'user', content: '__START__' })
  }

  function handleMoveOn() {
    speakTimer.stop()
    handleEndSession()
  }

  function handleEndSession() {
    speakTimer.stop()
    startSaveTransition(async () => {
      const transcript: TranscriptMessage[] = messages
        .filter((m) => m.content !== '__START__')
        .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content }))

      if (examId) {
        await updateExamTranscript(examId, transcript)
      } else {
        const result = await saveExam({
          skill: 'speaking_part2',
          transcript,
          cueCardId: cueCard?.id,
        })
        setExamId(result.id)
      }
      setStage('ended')
    })
  }

  async function handleGenerateFeedback() {
    if (!examId) return
    setIsGeneratingFeedback(true)
    const transcript: TranscriptMessage[] = messages
      .filter((m) => m.content !== '__START__')
      .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content }))

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, skill: 'speaking_part2', targetBand }),
      })
      const data: FeedbackResult = await res.json()
      setFeedback(data)
      await saveFeedback(examId, data)
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const visibleMessages = messages.filter((m) => m.content !== '__START__')

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {/* Timer alert modal */}
      <TimerAlertModal timer={speakTimer} partLabel="Part 3" onMoveOn={handleMoveOn} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speaking — Part 2</h1>
          <p className="mt-1 text-sm text-gray-500">Cue card topic. 1 min prep · 2 min speak.</p>
        </div>
        {stage === 'prep' && (
          <TimerControl timer={prepTimer} label="Prep" />
        )}
        {stage === 'speaking' && (
          <TimerControl timer={speakTimer} label="Speaking" />
        )}
      </div>

      {/* ── Idle ── */}
      {stage === 'idle' && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-10">
          <p className="text-sm text-gray-500 text-center max-w-sm">
            The AI will generate a tech-themed cue card. You get 1 minute to prepare, then 2 minutes to speak.
          </p>
          <button
            onClick={handleStart}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Start Part 2
          </button>
        </div>
      )}

      {/* ── Generating cue card ── */}
      {stage === 'generating' && (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-10">
          <p className="text-sm text-gray-400 animate-pulse">Generating cue card…</p>
        </div>
      )}

      {/* ── Prep phase ── */}
      {stage === 'prep' && cueCard && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-3">Cue Card</p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{cueCard.prompt}</p>
          </div>
          <button
            onClick={handleBeginSpeaking}
            className="self-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Begin Speaking →
          </button>
        </div>
      )}

      {/* ── Speaking phase ── */}
      {(stage === 'speaking' || stage === 'ended') && (
        <div className="flex flex-col gap-4">
          {/* Cue card reminder (collapsed) */}
          {cueCard && (
            <details className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 cursor-pointer">
              <summary className="font-medium">View cue card</summary>
              <p className="mt-2 whitespace-pre-line leading-relaxed">{cueCard.prompt}</p>
            </details>
          )}

          {/* Chat */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 min-h-48 max-h-[45vh] overflow-y-auto">
            {visibleMessages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-4 py-2 text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'assistant'
                    ? 'self-start bg-gray-100 text-gray-800'
                    : 'self-end bg-blue-600 text-white'
                }`}
                {...(m.role === 'assistant' ? { 'data-testid': 'ai-message' } : {})}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <p className="self-start text-xs text-gray-400 animate-pulse">Examiner…</p>
            )}
            <div ref={bottomRef} />
          </div>

          {stage === 'speaking' && (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  data-testid="user-input"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your response…"
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  data-testid="send-btn"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
              <button
                onClick={handleEndSession}
                disabled={isSaving || isLoading || visibleMessages.length < 1}
                className="self-end rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                {isSaving ? 'Saving…' : 'End & Save Session'}
              </button>
            </>
          )}

          {stage === 'ended' && !feedback && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Session saved ✓</p>
                <p className="text-xs text-gray-500">Generate AI feedback on your Part 2 response.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateFeedback}
                  disabled={isGeneratingFeedback}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGeneratingFeedback ? 'Analysing…' : 'Generate Feedback'}
                </button>
                <button
                  onClick={() => router.push('/history')}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
                >
                  History →
                </button>
              </div>
            </div>
          )}

          {stage === 'ended' && feedback && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-gray-800">Feedback</h2>
              <FeedbackView feedback={feedback} />
              <button
                onClick={() => router.push('/history')}
                className="self-end rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
              >
                View in History →
              </button>
            </div>
          )}

          {stage === 'ended' && (
            <VocabularyDrawer
              text={visibleMessages
                .filter((m) => m.role === 'user')
                .map((m) => m.content)
                .join(' ')}
            />
          )}
        </div>
      )}
    </div>
  )
}
