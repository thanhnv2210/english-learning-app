'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, updateExamTranscript, saveFeedback } from '@/app/actions/exam'
import { TimerControl } from '@/components/timer-control'
import { FeedbackView } from '@/components/feedback-view'
import { VocabularyDrawer } from '@/components/vocabulary-drawer'
import { MicInput } from '@/components/mic-input'
import { useTimer } from '@/lib/ielts/timer/use-timer'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'
import type { SpeakingTopic } from '@/lib/db/speaking'
import type { Message } from 'ai'

type Props = {
  initialMessages?: TranscriptMessage[]
  resumeExamId?: number
  targetBand?: number
  topics?: SpeakingTopic[]
}

export function SpeakingChat({ initialMessages, resumeExamId, targetBand = 6.5, topics = [] }: Props) {
  const router = useRouter()
  const timer = useTimer(5 * 60) // 5-min session guideline for Part 1

  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: selectedTopic
      ? { topic: { name: selectedTopic.name, description: selectedTopic.description, exampleQuestions: selectedTopic.exampleQuestions } }
      : {},
    initialMessages: initialMessages as Message[] | undefined,
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  const started = messages.length > 0
  const [examId, setExamId] = useState<number | undefined>(resumeExamId)
  const [ended, setEnded] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [isSaving, startSaveTransition] = useTransition()
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function startSession() {
    append({ role: 'user', content: '__START__' })
    timer.reset()
  }

  function handleEndSession() {
    timer.stop()
    startSaveTransition(async () => {
      const transcript: TranscriptMessage[] = messages
        .filter((m) => m.content !== '__START__')
        .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content }))

      if (examId) {
        await updateExamTranscript(examId, transcript)
      } else {
        const result = await saveExam({ skill: 'speaking', transcript })
        setExamId(result.id)
      }
      setEnded(true)
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
        body: JSON.stringify({ transcript, skill: 'speaking', targetBand }),
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speaking — Part 1</h1>
          <p className="mt-1 text-sm text-gray-500">
            {resumeExamId ? 'Resuming session #' + resumeExamId : 'Answer naturally. No help from the examiner.'}
          </p>
        </div>
        {started && !ended && (
          <TimerControl timer={timer} label="Session" onStart={timer.start} />
        )}
      </div>

      {!started ? (
        <div className="flex flex-col gap-5">
          {/* Topic selector — skip when resuming a saved session */}
          {!resumeExamId && topics.length > 0 && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Choose a topic</p>
                <p className="text-xs text-gray-400 mt-0.5">The examiner will focus on this topic. Leave unselected for a mixed session.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic((prev) => prev?.id === t.id ? null : t)}
                    className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      selectedTopic?.id === t.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-xs font-semibold leading-snug ${selectedTopic?.id === t.id ? 'text-blue-700' : 'text-gray-800'}`}>
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-tight">{t.description}</p>
                  </button>
                ))}
              </div>

              {/* Selected topic preview */}
              {selectedTopic && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1.5">Example questions — {selectedTopic.name}</p>
                  <ul className="flex flex-col gap-1">
                    {selectedTopic.exampleQuestions.map((q, i) => (
                      <li key={i} className="text-xs text-blue-600 flex gap-1.5">
                        <span className="shrink-0 text-blue-300">·</span>{q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-8">
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {selectedTopic
                ? `The examiner will ask 4–5 questions about "${selectedTopic.name}".`
                : resumeExamId
                  ? `Resuming session #${resumeExamId}.`
                  : 'The examiner will ask 4–5 questions on mixed Part 1 topics.'}
            </p>
            <button
              data-testid="start-btn"
              onClick={startSession}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              {resumeExamId ? 'Resume Session' : 'Start Session'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Chat */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 min-h-64 max-h-[50vh] overflow-y-auto">
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
              <p className="self-start text-xs text-gray-400 animate-pulse">Examiner is speaking…</p>
            )}
            <div ref={bottomRef} />
          </div>

          {!ended ? (
            <>
              <MicInput
                value={input}
                onChange={(v) => handleInputChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>)}
                onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
              />
              <button
                onClick={handleEndSession}
                disabled={isSaving || isLoading || visibleMessages.length < 2}
                className="self-end rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                {isSaving ? 'Saving…' : 'End & Save Session'}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Feedback section */}
              {!feedback ? (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Session saved ✓</p>
                    <p className="text-xs text-gray-500">Generate AI feedback based on your transcript.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateFeedback}
                      disabled={isGeneratingFeedback}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingFeedback ? 'Analysing…' : 'Generate Feedback'}
                    </button>
                    <button
                      onClick={() => router.push('/history')}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      History →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <h2 className="text-base font-semibold text-gray-800">Feedback</h2>
                  <FeedbackView feedback={feedback} />
                  <button
                    onClick={() => router.push('/history')}
                    className="self-end rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    View in History →
                  </button>
                </div>
              )}

              <VocabularyDrawer
                text={visibleMessages
                  .filter((m) => m.role === 'user')
                  .map((m) => m.content)
                  .join(' ')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
