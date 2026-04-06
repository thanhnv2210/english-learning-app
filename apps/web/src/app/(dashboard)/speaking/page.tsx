'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam } from '@/app/actions/exam'
import type { TranscriptMessage } from '@/lib/db/schema'

export default function SpeakingPage() {
  const router = useRouter()
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  const started = messages.length > 0
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function startSession() {
    append({ role: 'user', content: '__START__' })
  }

  function endSession() {
    startTransition(async () => {
      const transcript: TranscriptMessage[] = messages
        .filter((m) => m.content !== '__START__')
        .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content }))

      await saveExam({ skill: 'speaking', transcript })
      setSaved(true)
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Speaking — Part 1</h1>
        <p className="mt-1 text-sm text-gray-500">
          Answer naturally. The examiner will not help you — that is intentional.
        </p>
      </div>

      {!started ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-10">
          <p className="text-sm text-gray-500 text-center max-w-sm">
            The examiner will ask 4–5 questions on everyday and tech topics. Respond as you would in
            a real test.
          </p>
          <button
            data-testid="start-btn"
            onClick={startSession}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Start Session
          </button>
        </div>
      ) : saved ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-10">
          <p className="text-sm font-medium text-green-700">Session saved!</p>
          <button
            onClick={() => router.push('/history')}
            className="rounded-lg bg-green-600 px-5 py-2 text-sm text-white font-semibold hover:bg-green-700"
          >
            View in History →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Chat messages */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 min-h-64 max-h-[55vh] overflow-y-auto">
            {messages
              .filter((m) => m.content !== '__START__')
              .map((m) => (
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
              <p className="self-start text-xs text-gray-400 animate-pulse">
                Examiner is speaking…
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              data-testid="user-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your answer…"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              data-testid="send-btn"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Send
            </button>
          </form>

          {/* End session */}
          <button
            onClick={endSession}
            disabled={isPending || isLoading || messages.filter((m) => m.content !== '__START__').length < 2}
            className="self-end rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-colors"
          >
            {isPending ? 'Saving…' : 'End & Save Session'}
          </button>
        </div>
      )}
    </div>
  )
}
