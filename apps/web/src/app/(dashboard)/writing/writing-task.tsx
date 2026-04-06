'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { generateWritingTopic } from '@/app/actions/writing'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { FeedbackView } from '@/components/feedback-view'
import { WRITING_DOMAINS } from '@/lib/ielts/writing/prompts'
import type { FeedbackResult } from '@/lib/db/schema'
import type { AuditResult } from '@/app/api/writing/audit/route'
import type { VocabResult } from '@/app/api/writing/vocabulary/route'

type Stage =
  | 'select'
  | 'generating'
  | 'drafting'
  | 'critiquing'
  | 'writing'
  | 'pass1'
  | 'pass2'
  | 'pass3'
  | 'done'

type GapCriterion = {
  criterion: string
  currentBand: number
  targetBand: number
  requiredChanges: string[]
}

type Props = { targetBand?: number }

export function WritingTask({ targetBand = 6.5 }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // ── Flow state ──
  const [stage, setStage] = useState<Stage>('select')
  const [draftingMode, setDraftingMode] = useState(false)
  const [domain, setDomain] = useState('')
  const [topic, setTopic] = useState('')
  const [essay, setEssay] = useState('')

  // ── Outline (drafting mode) ──
  const [outline, setOutline] = useState({ introduction: '', body1: '', body2: '', conclusion: '' })
  const [outlineCritique, setOutlineCritique] = useState('')

  // ── Pass results ──
  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [vocab, setVocab] = useState<VocabResult | null>(null)
  const [scoreStream, setScoreStream] = useState('')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  // ── Gap analysis (on-demand) ──
  const [gapStream, setGapStream] = useState('')
  const [gapResult, setGapResult] = useState<GapCriterion[] | null>(null)
  const [isLoadingGap, setIsLoadingGap] = useState(false)

  // ── Helpers ──
  async function streamToState(
    url: string,
    body: object,
    onChunk: (full: string) => void,
  ): Promise<string> {
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

  // ── Topic generation ──
  async function handleGenerateTopic() {
    if (!domain) return
    setStage('generating')
    const generated = await generateWritingTopic(domain)
    setTopic(generated)
    setStage(draftingMode ? 'drafting' : 'writing')
  }

  // ── Outline critique ──
  async function handleCritiqueOutline() {
    const filled = Object.values(outline).every((v) => v.trim())
    if (!filled) return
    setStage('critiquing')
    setOutlineCritique('')
    await streamToState(
      '/api/writing/outline',
      { topic, outline },
      setOutlineCritique,
    )
    // Critique done — user reads and then proceeds to write
  }

  // ── Essay evaluation (3 passes) ──
  async function handleSubmitEssay() {
    if (!essay.trim() || !topic) return

    const transcript = [
      { id: 'topic', role: 'assistant' as const, content: topic },
      // Outline entries — only present when drafting mode was used
      ...(draftingMode && outlineCritique
        ? [
            { id: 'outline_introduction', role: 'user' as const, content: outline.introduction },
            { id: 'outline_body1', role: 'user' as const, content: outline.body1 },
            { id: 'outline_body2', role: 'user' as const, content: outline.body2 },
            { id: 'outline_conclusion', role: 'user' as const, content: outline.conclusion },
            { id: 'outline_critique', role: 'assistant' as const, content: outlineCritique },
          ]
        : []),
      { id: 'essay', role: 'user' as const, content: essay },
    ]
    const saved = await saveExam({ skill: 'writing', transcript })

    // Pass 1 — Structural Audit
    setStage('pass1')
    const auditRes = await fetch('/api/writing/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ essay, topic }),
    })
    const auditData: AuditResult = await auditRes.json()
    setAudit(auditData)

    // Pass 2 — Vocabulary Analysis
    setStage('pass2')
    const vocabRes = await fetch('/api/writing/vocabulary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ essay, topic }),
    })
    const vocabData: VocabResult = await vocabRes.json()
    setVocab(vocabData)

    // Pass 3 — Scoring (streamed)
    setStage('pass3')
    setScoreStream('')
    const full = await streamToState(
      '/api/writing/score',
      { essay, topic, targetBand },
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

  // ── Gap analysis ──
  async function handleGapAnalysis() {
    if (!feedback || !essay || !topic) return
    setIsLoadingGap(true)
    setGapStream('')
    setGapResult(null)

    const full = await streamToState(
      '/api/writing/gap',
      { essay, topic, feedback, targetBand },
      setGapStream,
    )

    const jsonMatch = full.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed: { criteria: GapCriterion[] } = JSON.parse(jsonMatch[0])
        setGapResult(parsed.criteria)
      } catch {
        // gapStream stays visible
      }
    }
    setIsLoadingGap(false)
  }

  function handleReset() {
    setStage('select')
    setDomain('')
    setTopic('')
    setEssay('')
    setOutline({ introduction: '', body1: '', body2: '', conclusion: '' })
    setOutlineCritique('')
    setAudit(null)
    setVocab(null)
    setScoreStream('')
    setFeedback(null)
    setGapStream('')
    setGapResult(null)
  }

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0
  const outlineFilled = Object.values(outline).every((v) => v.trim())

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
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  domain === d
                    ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Drafting mode toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
            <div
              onClick={() => setDraftingMode((v) => !v)}
              className={`relative h-5 w-9 rounded-full transition-colors ${draftingMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${draftingMode ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Drafting Mode</p>
              <p className="text-xs text-gray-400">Outline your essay first — AI critiques structure before you write</p>
            </div>
          </label>

          <button
            onClick={handleGenerateTopic}
            disabled={!domain}
            className="mt-1 self-end rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
          >
            Generate Topic →
          </button>
        </div>
      )}

      {/* ── Generating topic ── */}
      {stage === 'generating' && (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-10">
          <p className="animate-pulse text-sm text-gray-400">Generating essay topic…</p>
        </div>
      )}

      {/* ── Drafting Mode: outline fields ── */}
      {(stage === 'drafting' || stage === 'critiquing') && (
        <div className="flex flex-col gap-4">
          <TopicCard topic={topic} />
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-800">Your Outline</p>
            {(
              [
                { key: 'introduction', label: 'Introduction thesis', placeholder: 'State your position on the topic…' },
                { key: 'body1', label: 'Body 1 argument', placeholder: 'First main point supporting your position…' },
                { key: 'body2', label: 'Body 2 argument', placeholder: 'Second distinct point or counter-argument…' },
                { key: 'conclusion', label: 'Conclusion stance', placeholder: 'Restate position and summarise arguments…' },
              ] as const
            ).map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">{label}</label>
                <textarea
                  value={outline[key]}
                  onChange={(e) => setOutline((o) => ({ ...o, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={2}
                  disabled={stage === 'critiquing'}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            ))}

            {stage === 'drafting' && (
              <button
                onClick={handleCritiqueOutline}
                disabled={!outlineFilled}
                className="self-end rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Critique My Outline →
              </button>
            )}
          </div>

          {/* Streaming critique */}
          {(stage === 'critiquing' || outlineCritique) && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                {stage === 'critiquing' && !outlineCritique ? 'Critiquing outline…' : 'Outline Critique'}
              </p>
              {outlineCritique ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{outlineCritique}</p>
              ) : (
                <p className="animate-pulse text-sm text-amber-400">Analysing structure…</p>
              )}
              {stage === 'critiquing' && outlineCritique && (
                <button
                  onClick={() => setStage('writing')}
                  className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Proceed to Write Essay →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Essay writing ── */}
      {stage === 'writing' && (
        <div className="flex flex-col gap-4">
          <TopicCard topic={topic} />
          {draftingMode && outlineCritique && (
            <details className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
              <summary className="cursor-pointer font-medium">View outline critique</summary>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed">{outlineCritique}</p>
            </details>
          )}
          <div className="flex flex-col gap-2">
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here… (aim for 250–300 words)"
              rows={14}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${wordCount < 250 ? 'text-amber-500' : 'text-green-600'}`}>
                {wordCount} words{wordCount < 250 ? ` — ${250 - wordCount} more to reach minimum` : ' ✓'}
              </span>
              <button
                onClick={handleSubmitEssay}
                disabled={wordCount < 50}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Submit for Evaluation →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Multi-pass progress ── */}
      {(stage === 'pass1' || stage === 'pass2' || stage === 'pass3') && (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-semibold text-gray-800">Evaluating your essay</p>

          <div className="flex flex-col gap-3">
            <PassRow
              label="Pass 1 — Structural Audit"
              status={stage === 'pass1' ? 'running' : 'done'}
              result={audit ? `${audit.wordCount} words · ${audit.paragraphCount} paragraphs · Task fulfilled: ${audit.taskFulfilled ? 'Yes' : 'No'}` : undefined}
            />
            <PassRow
              label="Pass 2 — Vocabulary Analysis"
              status={stage === 'pass1' ? 'waiting' : stage === 'pass2' ? 'running' : 'done'}
              result={vocab ? `${vocab.informalWords.length} suggestion${vocab.informalWords.length !== 1 ? 's' : ''}` : undefined}
            />
            <PassRow
              label="Pass 3 — Band Scoring"
              status={stage === 'pass3' ? 'running' : 'waiting'}
            />
          </div>

          {stage === 'pass3' && scoreStream && (
            <pre className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600 whitespace-pre-wrap">
              {scoreStream}
            </pre>
          )}
        </div>
      )}

      {/* ── Done: full results ── */}
      {stage === 'done' && (
        <div className="flex flex-col gap-6">
          <TopicCard topic={topic} />

          {/* Pass 1 summary */}
          {audit && <AuditPanel audit={audit} />}

          {/* Pass 3: band scores */}
          {feedback ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-gray-800">Band Scores</h2>
              <FeedbackView feedback={feedback} />
            </div>
          ) : (
            <pre className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-xs text-gray-600 whitespace-pre-wrap">
              {scoreStream}
            </pre>
          )}

          {/* Pass 2: vocabulary */}
          {vocab && <VocabPanel vocab={vocab} />}

          {/* Gap analysis (on-demand) */}
          {feedback && (
            <GapPanel
              gapResult={gapResult}
              gapStream={gapStream}
              isLoading={isLoadingGap}
              onRequest={handleGapAnalysis}
              targetBand={targetBand}
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            >
              New Essay
            </button>
            <button
              onClick={() => router.push('/history')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            >
              View in History →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TopicCard({ topic }: { topic: string }) {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">Essay Topic</p>
      <p className="text-sm leading-relaxed text-gray-800">{topic}</p>
    </div>
  )
}

function PassRow({
  label,
  status,
  result,
}: {
  label: string
  status: 'waiting' | 'running' | 'done'
  result?: string
}) {
  const icon =
    status === 'done' ? '✓' : status === 'running' ? '…' : '○'
  const color =
    status === 'done'
      ? 'text-green-600'
      : status === 'running'
        ? 'text-blue-500 animate-pulse'
        : 'text-gray-300'

  return (
    <div className="flex items-center gap-3">
      <span className={`w-4 text-center text-sm font-bold ${color}`}>{icon}</span>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${status === 'waiting' ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
        {result && <span className="text-xs text-gray-400">{result}</span>}
      </div>
    </div>
  )
}

function AuditPanel({ audit }: { audit: AuditResult }) {
  const checks = [
    { label: 'Word count', value: `${audit.wordCount}`, ok: audit.wordCount >= 250 },
    { label: 'Paragraphs', value: `${audit.paragraphCount}`, ok: audit.paragraphCount >= 4 },
    { label: 'Introduction', value: audit.hasIntroduction ? 'Present' : 'Missing', ok: audit.hasIntroduction },
    { label: 'Conclusion', value: audit.hasConclusion ? 'Present' : 'Missing', ok: audit.hasConclusion },
    { label: 'Task fulfilled', value: audit.taskFulfilled ? 'Yes' : 'Partial', ok: audit.taskFulfilled },
  ]
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-gray-800">Structural Audit</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {checks.map(({ label, value, ok }) => (
          <div key={label} className="flex flex-col rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-xs text-gray-400">{label}</span>
            <span className={`text-sm font-semibold ${ok ? 'text-green-600' : 'text-amber-600'}`}>{value}</span>
          </div>
        ))}
      </div>
      {audit.notes.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {audit.notes.map((n, i) => (
            <li key={i} className="text-xs text-gray-500">· {n}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VocabPanel({ vocab }: { vocab: VocabResult }) {
  if (vocab.informalWords.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-semibold text-gray-800">Vocabulary</p>
        <p className="mt-1 text-xs text-green-600">No informal words detected — strong academic register.</p>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-gray-800">Vocabulary Replacer</p>
      <div className="flex flex-col gap-2">
        {vocab.informalWords.map(({ word, suggestion, reason }, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-mono text-red-700">{word}</span>
              <span className="text-xs text-gray-400">→</span>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-mono text-green-700">{suggestion}</span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400 max-w-xs">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GapPanel({
  gapResult,
  gapStream,
  isLoading,
  onRequest,
  targetBand,
}: {
  gapResult: GapCriterion[] | null
  gapStream: string
  isLoading: boolean
  onRequest: () => void
  targetBand: number
}) {
  if (!gapResult && !gapStream && !isLoading) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white p-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Gap Analysis</p>
          <p className="text-xs text-gray-400">Exactly what to change to reach Band {targetBand}</p>
        </div>
        <button
          onClick={onRequest}
          className="rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          Show Gap Analysis
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
      <p className="mb-3 text-sm font-semibold text-purple-800">
        Gap Analysis — Path to Band {targetBand}
      </p>

      {isLoading && !gapStream && (
        <p className="animate-pulse text-sm text-purple-400">Analysing gaps…</p>
      )}

      {isLoading && gapStream && !gapResult && (
        <pre className="max-h-48 overflow-y-auto rounded-lg bg-white p-3 font-mono text-xs text-gray-600 whitespace-pre-wrap">
          {gapStream}
        </pre>
      )}

      {gapResult !== null && (
        <>
          {gapResult.length === 0 ? (
            <p className="text-sm text-green-700">All criteria meet Band {targetBand}.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {gapResult.map(({ criterion, currentBand, targetBand: tb, requiredChanges }) => (
                <div key={criterion}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-700">{criterion}</span>
                    <span className="text-xs text-gray-400">
                      {currentBand} → {tb}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {requiredChanges.map((change, i) => (
                      <li key={i} className="text-xs leading-relaxed text-gray-700">· {change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
