'use client'

import { useState, useTransition } from 'react'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { FeedbackView } from '@/components/feedback-view'
import type { FeedbackResult } from '@/lib/db/schema'
import type { Task1Topic } from '@/app/api/writing/task1/topic/route'
import type { Task1AuditResult } from '@/app/api/writing/task1/audit/route'
import { TASK1_CHART_TYPES } from '@/lib/ielts/writing/prompts-task1'

type Stage = 'select' | 'generating' | 'writing' | 'pass1' | 'pass2' | 'done'

const DOMAIN_OPTIONS = [
  'Technology Adoption',
  'Remote Work Trends',
  'Energy & Sustainability',
  'Software Industry',
  'Digital Skills',
  'Open Source Activity',
]

const CHART_TYPE_ICONS: Record<string, string> = {
  'bar chart': '📊',
  'line graph': '📈',
  'pie chart': '🥧',
  'table': '🗃️',
}

type Props = { targetBand?: number }

export function WritingTask1({ targetBand = 6.5 }: Props) {
  const [, startTransition] = useTransition()

  const [stage, setStage] = useState<Stage>('select')
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0])
  const [chartType, setChartType] = useState<string>(TASK1_CHART_TYPES[0])
  const [topic, setTopic] = useState<Task1Topic | null>(null)
  const [response, setResponse] = useState('')
  const [audit, setAudit] = useState<Task1AuditResult | null>(null)
  const [scoreStream, setScoreStream] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  async function streamToState(url: string, body: object, onChunk: (full: string) => void): Promise<string> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.body) return ''
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let full = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      full += decoder.decode(value, { stream: true })
      onChunk(full)
    }
    return full
  }

  async function handleGenerate() {
    setStage('generating')
    const res = await fetch('/api/writing/task1/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, chartType }),
    })
    const data: Task1Topic = await res.json()
    setTopic(data)
    setStage('writing')
  }

  async function handleSubmit() {
    if (!response.trim() || !topic) return

    const transcript = [
      { id: 'question', role: 'assistant' as const, content: topic.question },
      { id: 'data', role: 'assistant' as const, content: topic.data },
      { id: 'response', role: 'user' as const, content: response },
    ]
    const saved = await saveExam({ skill: 'writing', transcript })

    // Pass 1 — Structural Audit
    setStage('pass1')
    const auditRes = await fetch('/api/writing/task1/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response, question: topic.question, data: topic.data }),
    })
    const auditData: Task1AuditResult = await auditRes.json()
    setAudit(auditData)

    // Pass 2 — Band Scoring (streamed)
    setStage('pass2')
    setScoreStream('')
    const full = await streamToState(
      '/api/writing/task1/score',
      { response, question: topic.question, data: topic.data, targetBand },
      setScoreStream,
    )

    const jsonMatch = full.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed: FeedbackResult = JSON.parse(jsonMatch[0])
        setFeedback(parsed)
        startTransition(() => saveFeedback(saved.id, parsed))
      } catch {
        // scoreStream stays visible as fallback
      }
    }

    setStage('done')
  }

  function handleReset() {
    setStage('select')
    setTopic(null)
    setResponse('')
    setAudit(null)
    setScoreStream('')
    setFeedback(null)
  }

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0
  const minWords = 150

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 xl:max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Writing — Task 1</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Target band: <span className="font-semibold text-blue-600">{targetBand}</span>
          <span className="ml-3 text-faint">Minimum 150 words · Describe the chart, include an overview</span>
        </p>
      </div>

      {/* ── Select stage ── */}
      {stage === 'select' && (
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Domain</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DOMAIN_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    domain === d
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'border-border bg-card text-foreground hover:border-blue-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Chart type</label>
            <div className="flex flex-wrap gap-2">
              {TASK1_CHART_TYPES.map((ct) => (
                <button
                  key={ct}
                  onClick={() => setChartType(ct)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
                    chartType === ct
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'border-border bg-card text-foreground hover:border-blue-300'
                  }`}
                >
                  <span>{CHART_TYPE_ICONS[ct]}</span>
                  {ct}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="self-start rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95"
          >
            Generate question
          </button>
        </div>
      )}

      {/* ── Generating ── */}
      {stage === 'generating' && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-muted-foreground">Generating chart data…</span>
        </div>
      )}

      {/* ── Writing stage ── */}
      {stage === 'writing' && topic && (
        <div className="flex flex-col gap-4">
          {/* Chart question */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800/40 dark:bg-blue-900/10">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {topic.chartType}
              </span>
              <span className="text-xs text-blue-500 dark:text-blue-400">·</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">{topic.title}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{topic.question}</p>
          </div>

          {/* Data table */}
          <div className="rounded-xl border border-border bg-muted p-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Chart data</p>
            <pre className="whitespace-pre-wrap font-mono text-xs text-foreground leading-relaxed">{topic.data}</pre>
          </div>

          {/* Writing area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Your response</label>
              <span className={`text-xs font-medium ${wordCount >= minWords ? 'text-green-600' : 'text-orange-500'}`}>
                {wordCount} / {minWords}+ words
              </span>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={12}
              placeholder="Start with an introduction that paraphrases the question. Then write an overview of the main trend or feature. Support with specific data in body paragraphs."
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-faint focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={wordCount < minWords}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for feedback
            </button>
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* ── Pass 1 in progress ── */}
      {stage === 'pass1' && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-muted-foreground">Pass 1 · Structural audit…</span>
        </div>
      )}

      {/* ── Pass 2 in progress ── */}
      {stage === 'pass2' && (
        <div className="flex flex-col gap-3">
          {audit && <AuditCard audit={audit} />}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm text-muted-foreground">Pass 2 · Scoring…</span>
            {scoreStream && (
              <pre className="ml-2 flex-1 overflow-auto text-xs text-muted-foreground">{scoreStream}</pre>
            )}
          </div>
        </div>
      )}

      {/* ── Done ── */}
      {stage === 'done' && (
        <div className="flex flex-col gap-6">
          {audit && <AuditCard audit={audit} />}

          {feedback ? (
            <FeedbackView feedback={feedback} />
          ) : scoreStream ? (
            <pre className="whitespace-pre-wrap rounded-xl border border-border bg-card p-6 text-xs text-foreground">{scoreStream}</pre>
          ) : null}

          <button
            onClick={handleReset}
            className="self-start rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Try another chart
          </button>
        </div>
      )}
    </div>
  )
}

function AuditCard({ audit }: { audit: Task1AuditResult }) {
  const checks = [
    { label: 'Introduction', ok: audit.hasIntroduction },
    { label: 'Overview paragraph', ok: audit.hasOverview },
    { label: 'Specific data cited', ok: audit.usesData },
    { label: 'No personal opinion', ok: !audit.hasPersonalOpinion },
    { label: `≥150 words (${audit.wordCount})`, ok: audit.wordCount >= 150 },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Structural audit</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              c.ok
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {c.ok ? '✓' : '✗'} {c.label}
          </span>
        ))}
      </div>
      {audit.notes.length > 0 && (
        <ul className="flex flex-col gap-1">
          {audit.notes.map((n, i) => (
            <li key={i} className="text-xs text-muted-foreground">· {n}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
