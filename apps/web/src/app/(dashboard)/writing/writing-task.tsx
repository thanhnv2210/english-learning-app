'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { generateWritingTopic } from '@/app/actions/writing'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { FeedbackView } from '@/components/feedback-view'
import { WRITING_DOMAINS } from '@/lib/ielts/writing/prompts'
import type { FeedbackResult } from '@/lib/db/schema'

type Stage = 'select' | 'generating' | 'writing' | 'evaluating' | 'done'

type Props = {
  targetBand?: number
}

export function WritingTask({ targetBand = 6.5 }: Props) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('select')
  const [domain, setDomain] = useState<string>('')
  const [topic, setTopic] = useState('')
  const [essay, setEssay] = useState('')
  const [streamedText, setStreamedText] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [, startTransition] = useTransition()

  async function handleGenerateTopic() {
    if (!domain) return
    setStage('generating')
    const generated = await generateWritingTopic(domain)
    setTopic(generated)
    setStage('writing')
  }

  async function handleSubmitEssay() {
    if (!essay.trim() || !topic) return
    setStage('evaluating')
    setStreamedText('')

    // Save the writing session first
    const transcript = [
      { id: 'topic', role: 'assistant' as const, content: topic },
      { id: 'essay', role: 'user' as const, content: essay },
    ]
    const saved = await saveExam({ skill: 'writing', transcript })

    // Stream evaluation
    const res = await fetch('/api/writing/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ essay, topic, targetBand }),
    })

    if (!res.body) return

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let full = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      full += chunk
      setStreamedText(full)
    }

    // Parse feedback from streamed JSON
    const jsonMatch = full.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed: FeedbackResult = JSON.parse(jsonMatch[0])
        setFeedback(parsed)
        startTransition(() => saveFeedback(saved.id, parsed))
      } catch {
        // leave streamedText visible
      }
    }

    setStage('done')
  }

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Writing — Task 2</h1>
        <p className="mt-1 text-sm text-gray-500">
          Target band: <span className="font-semibold text-blue-600">{targetBand}</span>
        </p>
      </div>

      {/* ── Domain selector ── */}
      {stage === 'select' && (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-700">Choose a topic domain:</p>
          <div className="grid grid-cols-2 gap-2">
            {WRITING_DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`rounded-lg border px-4 py-3 text-sm text-left transition-colors ${
                  domain === d
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerateTopic}
            disabled={!domain}
            className="mt-2 self-end rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Generate Topic →
          </button>
        </div>
      )}

      {/* ── Generating ── */}
      {stage === 'generating' && (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-10">
          <p className="text-sm text-gray-400 animate-pulse">Generating essay topic…</p>
        </div>
      )}

      {/* ── Writing ── */}
      {stage === 'writing' && topic && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-2">Essay Topic</p>
            <p className="text-sm text-gray-800 leading-relaxed">{topic}</p>
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here… (aim for 250–300 words)"
              rows={14}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${wordCount < 250 ? 'text-amber-500' : 'text-green-600'}`}>
                {wordCount} words {wordCount < 250 ? `(${250 - wordCount} more to reach minimum)` : '✓'}
              </span>
              <button
                onClick={handleSubmitEssay}
                disabled={wordCount < 50}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Submit for Evaluation →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Evaluating (streaming) ── */}
      {stage === 'evaluating' && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-700 animate-pulse">Evaluating your essay…</p>
          {streamedText && (
            <pre className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {streamedText}
            </pre>
          )}
        </div>
      )}

      {/* ── Done ── */}
      {stage === 'done' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">Your Essay Topic</p>
            <p className="text-xs text-gray-700 leading-relaxed">{topic}</p>
          </div>

          {feedback ? (
            <>
              <h2 className="text-base font-semibold text-gray-800">Evaluation</h2>
              <FeedbackView feedback={feedback} />
            </>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500 mb-2">Raw evaluation output:</p>
              <pre className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {streamedText}
              </pre>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setStage('select')
                setEssay('')
                setTopic('')
                setDomain('')
                setFeedback(null)
                setStreamedText('')
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              New Essay
            </button>
            <button
              onClick={() => router.push('/history')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              View in History →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
