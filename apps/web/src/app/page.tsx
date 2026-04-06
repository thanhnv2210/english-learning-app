'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  const started = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function startSession() {
    append({ role: 'user', content: '__START__' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-6 text-2xl font-bold">IELTS Speaking — Part 1</h1>

      {!started ? (
        <button
          data-testid="start-btn"
          onClick={startSession}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        >
          Start Session
        </button>
      ) : (
        <div className="flex w-full max-w-2xl flex-col gap-4">
          {/* Chat messages */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 min-h-64 max-h-[60vh] overflow-y-auto">
            {messages
              .filter((m) => m.content !== '__START__')
              .map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg px-4 py-2 text-sm leading-relaxed ${
                    m.role === 'assistant'
                      ? 'self-start bg-white border border-gray-200 text-gray-800'
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
        </div>
      )}
    </main>
  )
}
