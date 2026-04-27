'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, updateExamTranscript, saveFeedback } from '@/app/actions/exam'
import { generateAndSaveCueCard } from '@/app/actions/cue-card'
import type { SpeakingPart2Topic } from '@/lib/db/speaking'
import { TimerControl } from '@/components/timer-control'
import { TimerAlertModal } from '@/components/timer-alert-modal'
import { FeedbackView } from '@/components/feedback-view'
import { VocabularyDrawer } from '@/components/vocabulary-drawer'
import { MicInput } from '@/components/mic-input'
import { useTimer } from '@/lib/ielts/timer/use-timer'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'
import type { Message } from 'ai'

type CueCard = { id: number; prompt: string }

type Props = {
  initialMessages?: TranscriptMessage[]
  resumeExamId?: number
  initialCueCard?: CueCard
  targetBand?: number
  topics?: SpeakingPart2Topic[]
}

type Stage = 'idle' | 'topic-select' | 'generating' | 'prep' | 'speaking' | 'ended'

export function Part2Chat({ initialMessages, resumeExamId, initialCueCard, targetBand = 6.5, topics = [] }: Props) {
  const router = useRouter()
  const prepTimer = useTimer(60)    // 1-minute prep
  const speakTimer = useTimer(120)  // 2-minute speak

  const [stage, setStage] = useState<Stage>(resumeExamId ? 'speaking' : 'idle')
  const [selectedTopic, setSelectedTopic] = useState<SpeakingPart2Topic | null>(null)
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

  function handleOpenTopicSelect() {
    setStage('topic-select')
  }

  async function handleStart() {
    setStage('generating')
    const card = await generateAndSaveCueCard(selectedTopic ?? undefined)
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6 xl:max-w-3xl">
      {/* Timer alert modal */}
      <TimerAlertModal timer={speakTimer} partLabel="Part 3" onMoveOn={handleMoveOn} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Speaking — Part 2</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cue card topic. 1 min prep · 2 min speak.</p>
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
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            The AI will generate a tech-themed cue card. You get 1 minute to prepare, then 2 minutes to speak.
          </p>
          <div className="flex gap-3">
            {topics.length > 0 && (
              <button
                onClick={handleOpenTopicSelect}
                className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:border-muted-foreground hover:bg-muted active:scale-95 transition-all"
              >
                Choose Topic
              </button>
            )}
            <button
              onClick={handleStart}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              Start Part 2
            </button>
          </div>
        </div>
      )}

      {/* ── Topic selector ── */}
      {stage === 'topic-select' && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Choose a topic category</p>
            <p className="text-xs text-faint mt-0.5">
              The AI will generate a cue card within this theme. Leave unselected for a random tech topic.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic((prev) => prev?.id === t.id ? null : t)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  selectedTopic?.id === t.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-muted'
                }`}
              >
                <p className={`text-xs font-semibold leading-snug ${selectedTopic?.id === t.id ? 'text-blue-700' : 'text-foreground'}`}>
                  {t.name}
                </p>
                <p className="text-xs text-faint mt-0.5 line-clamp-2 leading-tight">{t.description}</p>
              </button>
            ))}
          </div>

          {/* Selected topic preview */}
          {selectedTopic && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-semibold text-blue-700 mb-1.5">Example cue card — {selectedTopic.name}</p>
              <p className="text-xs text-blue-600 leading-relaxed whitespace-pre-line">
                {selectedTopic.examplePrompts[0]}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground max-w-xs">
              {selectedTopic
                ? `A cue card about "${selectedTopic.name}" will be generated.`
                : 'No topic selected — a random tech cue card will be generated.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedTopic(null); setStage('idle') }}
                className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStart}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
              >
                {selectedTopic ? `Start with "${selectedTopic.name}"` : 'Start Part 2'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Generating cue card ── */}
      {stage === 'generating' && (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card p-10">
          <p className="text-sm text-faint animate-pulse">Generating cue card…</p>
        </div>
      )}

      {/* ── Prep phase ── */}
      {stage === 'prep' && cueCard && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-3">Cue Card</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{cueCard.prompt}</p>
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
            <details className="rounded-lg border border-border bg-muted px-4 py-2 text-xs text-muted-foreground cursor-pointer">
              <summary className="font-medium">View cue card</summary>
              <p className="mt-2 whitespace-pre-line leading-relaxed">{cueCard.prompt}</p>
            </details>
          )}

          {/* Chat */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 min-h-48 max-h-[45vh] overflow-y-auto">
            {visibleMessages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-4 py-2 text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'assistant'
                    ? 'self-start bg-subtle text-foreground'
                    : 'self-end bg-blue-600 text-white'
                }`}
                {...(m.role === 'assistant' ? { 'data-testid': 'ai-message' } : {})}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <p className="self-start text-xs text-faint animate-pulse">Examiner…</p>
            )}
            <div ref={bottomRef} />
          </div>

          {stage === 'speaking' && (
            <>
              <MicInput
                value={input}
                onChange={(v) => handleInputChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>)}
                onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
                placeholder="Type or speak your response…"
              />
              <button
                onClick={handleEndSession}
                disabled={isSaving || isLoading || visibleMessages.length < 1}
                className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                {isSaving ? 'Saving…' : 'End & Save Session'}
              </button>
            </>
          )}

          {stage === 'ended' && !feedback && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Session saved ✓</p>
                <p className="text-xs text-muted-foreground">Generate AI feedback on your Part 2 response.</p>
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
                  className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted"
                >
                  History →
                </button>
              </div>
            </div>
          )}

          {stage === 'ended' && feedback && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Feedback</h2>
              <FeedbackView feedback={feedback} />
              <button
                onClick={() => router.push('/history')}
                className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted"
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
