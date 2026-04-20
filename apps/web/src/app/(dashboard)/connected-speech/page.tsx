'use client'

import { useState } from 'react'
import {
  PHENOMENON_LABELS,
  PHENOMENON_COLORS,
  PHENOMENON_META,
  getPhenomenonColor,
  type AnalysisResult,
  type Phenomenon,
  type ConnectedSpeechInstance,
} from '@/lib/ielts/connected-speech/prompts'
import {
  saveAnalysisAction,
  listRecentAnalyses,
  listByPhenomenon,
  deleteAnalysisAction,
  type SavedAnalysis,
} from '@/app/actions/connected-speech'

type ViewStyle = 'sentence' | 'phrase'
type Stage = 'input' | 'loading' | 'result'
type HistoryFilter = 'all' | Phenomenon

// Covers all 7 phenomena:
// - contraction:  "want to" → "wanna", "going to" → "gonna"
// - intrusion:    "go on" → "go /w/ on"
// - catenation:   "pick it" → "pi-kit"
// - elision:      "last night" → "las night" (/t/ dropped)
// - assimilation: "ten minutes" → "tem minutes" (/n/ → /m/ before /m/)
// - weakening:    "and", "the", "at", "a" → schwa
// - gemination:   "black coffee" → "bla(k)coffee"
const EXAMPLE_TEXT =
  "I want to go on and pick it up at the last night market, but the black coffee there is going to take ten minutes."

export default function ConnectedSpeechPage() {
  const [stage, setStage] = useState<Stage>('input')
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewStyle, setViewStyle] = useState<ViewStyle>('sentence')

  // Save state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // History panel
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const [historyRecords, setHistoryRecords] = useState<SavedAnalysis[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  async function analyse() {
    if (!text.trim()) return
    setStage('loading')
    setError(null)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/connected-speech/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data: AnalysisResult = await res.json()
      setResult(data)
      setStage('result')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStage('input')
    }
  }

  async function handleSave() {
    if (!result) return
    setSaveStatus('saving')
    try {
      await saveAnalysisAction({
        originalText: text.trim(),
        transformedText: result.transformedText,
        instances: result.instances,
      })
      setSaveStatus('saved')
    } catch {
      setSaveStatus('idle')
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    await deleteAnalysisAction(id)
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id))
  }

  async function loadHistory(filter: HistoryFilter) {
    setHistoryLoading(true)
    setHistoryFilter(filter)
    const records =
      filter === 'all' ? await listRecentAnalyses() : await listByPhenomenon(filter)
    setHistoryRecords(records)
    setHistoryLoading(false)
  }

  async function openHistory() {
    setHistoryOpen(true)
    await loadHistory('all')
  }

  function loadFromHistory(record: SavedAnalysis) {
    setText(record.originalText)
    setResult({ transformedText: record.transformedText, instances: record.instances })
    setSaveStatus('saved')
    setStage('result')
    setHistoryOpen(false)
  }

  function reset() {
    setStage('input')
    setResult(null)
    setError(null)
    setSaveStatus('idle')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connected Speech Analyser</h1>
          <p className="mt-1 text-sm text-gray-500">
            Paste any English text to identify connected speech phenomena — elision, assimilation,
            catenation, intrusion, weakening, contractions, and gemination.
          </p>
        </div>
        <button
          onClick={openHistory}
          className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          History
        </button>
      </div>

      {/* Phenomenon legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PHENOMENON_LABELS) as Phenomenon[]).map((p) => {
          const c = getPhenomenonColor(p)
          return (
            <span
              key={p}
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}
            >
              {PHENOMENON_LABELS[p]}
            </span>
          )
        })}
      </div>

      {/* Reference accordion */}
      <ReferenceSection />

      {/* Input stage */}
      {(stage === 'input' || stage === 'loading') && (
        <div className="space-y-3">
          <textarea
            className="w-full rounded-lg border border-gray-300 p-4 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={6}
            placeholder="Paste your English text here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={stage === 'loading'}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={analyse}
              disabled={!text.trim() || stage === 'loading'}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {stage === 'loading' ? 'Analysing…' : 'Analyse'}
            </button>
            <button
              onClick={() => setText(EXAMPLE_TEXT)}
              disabled={stage === 'loading'}
              className="text-sm text-blue-600 hover:underline disabled:opacity-40"
            >
              Use example text
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Result stage */}
      {stage === 'result' && result && (
        <div className="space-y-8">
          {/* Actions bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              ← Analyse another text
            </button>
            <div className="ml-auto">
              {saveStatus === 'saved' ? (
                <span className="text-sm text-green-600 font-medium">✓ Saved to history</span>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  {saveStatus === 'saving' ? 'Saving…' : 'Save to history'}
                </button>
              )}
            </div>
          </div>

          {/* Part 1 — side-by-side */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">Part 1 — Sound Changes</h2>
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm">
                <button
                  onClick={() => setViewStyle('sentence')}
                  className={`rounded-md px-3 py-1 font-medium transition-colors ${
                    viewStyle === 'sentence'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Full sentence
                </button>
                <button
                  onClick={() => setViewStyle('phrase')}
                  className={`rounded-md px-3 py-1 font-medium transition-colors ${
                    viewStyle === 'phrase'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Phrase by phrase
                </button>
              </div>
            </div>
            {viewStyle === 'sentence' ? (
              <SentenceView original={text} result={result} />
            ) : (
              <PhraseView instances={result.instances} />
            )}
          </section>

          {/* Part 2 — pronunciation tips */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Part 2 — Pronunciation Tips</h2>
            {result.instances.length === 0 ? (
              <p className="text-sm text-gray-500">No connected speech phenomena detected.</p>
            ) : (
              <TipsView instances={result.instances} />
            )}
          </section>
        </div>
      )}

      {/* History panel */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
          <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">Analysis History</h2>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Filter by phenomenon */}
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Filter by phenomenon
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => loadHistory('all')}
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                    historyFilter === 'all'
                      ? 'border-gray-400 bg-gray-100 text-gray-800'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  All (recent 20)
                </button>
                {(Object.keys(PHENOMENON_LABELS) as Phenomenon[]).map((p) => {
                  const c = getPhenomenonColor(p)
                  const isActive = historyFilter === p
                  return (
                    <button
                      key={p}
                      onClick={() => loadHistory(p)}
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                        isActive
                          ? `${c.bg} ${c.text} ${c.border}`
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {PHENOMENON_LABELS[p]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Records list */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {historyLoading ? (
                <p className="py-8 text-center text-sm text-gray-400">Loading…</p>
              ) : historyRecords.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No records found.</p>
              ) : (
                <div className="space-y-2">
                  {historyRecords.map((record) => (
                    <div
                      key={record.id}
                      className="group relative rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => loadFromHistory(record)}
                        className="w-full text-left"
                      >
                        <p className="truncate pr-6 text-sm font-medium text-gray-800">
                          {record.originalText}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(record.createdAt).toLocaleDateString()} ·{' '}
                            {record.instances.length} phenomena
                          </span>
                          <div className="flex gap-1">
                            {(record.phenomena as Phenomenon[]).map((p) => {
                              const c = getPhenomenonColor(p)
                              return (
                                <span
                                  key={p}
                                  className={`rounded-full px-1.5 py-0.5 text-xs ${c.bg} ${c.text}`}
                                >
                                  {PHENOMENON_LABELS[p]}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => handleDelete(record.id, e)}
                        className="absolute right-2 top-2 hidden rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 group-hover:block"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Reference accordion ─────────────────────────────────────────────────── */

function ReferenceSection() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Phenomenon>('elision')
  const meta = PHENOMENON_META[active]
  const c = getPhenomenonColor(active)

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>Phenomenon reference</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(PHENOMENON_META) as Phenomenon[]).map((p) => {
              const pc = getPhenomenonColor(p)
              const isActive = p === active
              return (
                <button
                  key={p}
                  onClick={() => setActive(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? `${pc.bg} ${pc.text} ${pc.border}`
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {PHENOMENON_LABELS[p]}
                </button>
              )
            })}
          </div>
          <div className={`rounded-lg border p-4 ${c.bg} ${c.border}`}>
            <h3 className={`mb-2 text-sm font-semibold ${c.text}`}>{meta.label}</h3>
            <p className="mb-4 text-sm text-gray-700">{meta.explanation}</p>
            <div className="space-y-2">
              {meta.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-4 shrink-0 font-mono text-gray-400">{i + 1}.</span>
                  <span className="w-32 shrink-0 font-mono text-gray-700">{ex.original}</span>
                  <span className="text-gray-400">→</span>
                  <span className={`w-32 shrink-0 font-mono font-semibold ${c.text}`}>
                    {ex.transformed}
                  </span>
                  <span className="text-xs italic text-gray-500">{ex.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Part 1A: Full sentence side-by-side ─────────────────────────────────── */

function SentenceView({ original, result }: { original: string; result: AnalysisResult }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Original</p>
        <p className="text-sm leading-relaxed text-gray-800">
          <HighlightedText text={original} instances={result.instances} />
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Connected Speech
        </p>
        <p className="text-sm leading-relaxed text-gray-800">
          <HighlightedText
            text={result.transformedText}
            instances={result.instances}
            useTransformed
          />
        </p>
      </div>
    </div>
  )
}

/* ── Part 1B: Phrase-by-phrase stacked ───────────────────────────────────── */

function PhraseView({ instances }: { instances: ConnectedSpeechInstance[] }) {
  if (instances.length === 0)
    return <p className="text-sm text-gray-500">No connected speech phenomena detected.</p>
  return (
    <div className="space-y-2">
      {instances.map((inst, i) => {
        const c = getPhenomenonColor(inst.phenomenon)
        return (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <span className="w-36 shrink-0 font-mono text-sm text-gray-700">{inst.original}</span>
            <span className="text-gray-400">→</span>
            <span className={`w-36 shrink-0 font-mono text-sm font-semibold ${c.text}`}>
              {inst.transformed}
            </span>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}
            >
              {PHENOMENON_LABELS[inst.phenomenon]}
            </span>
            <span className="text-xs text-gray-500">{inst.description}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Part 2: Pronunciation tips grouped by phenomenon ────────────────────── */

function TipsView({ instances }: { instances: ConnectedSpeechInstance[] }) {
  const grouped = instances.reduce<Partial<Record<Phenomenon, ConnectedSpeechInstance[]>>>(
    (acc, inst) => {
      if (!acc[inst.phenomenon]) acc[inst.phenomenon] = []
      acc[inst.phenomenon]!.push(inst)
      return acc
    },
    {}
  )
  return (
    <div className="space-y-3">
      {(Object.entries(grouped) as [Phenomenon, ConnectedSpeechInstance[]][]).map(
        ([phenomenon, insts]) => {
          const c = getPhenomenonColor(phenomenon)
          return (
            <div key={phenomenon} className={`rounded-lg border p-4 ${c.bg} ${c.border}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`text-sm font-semibold ${c.text}`}>
                  {PHENOMENON_LABELS[phenomenon]}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${c.text} opacity-70`}>
                  {insts.length} {insts.length === 1 ? 'instance' : 'instances'}
                </span>
              </div>
              <ul className="space-y-2">
                {insts.map((inst, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 font-mono font-medium ${c.text}`}>
                      {inst.original} → {inst.transformed}
                    </span>
                    <span className="text-gray-700">{inst.tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      )}
    </div>
  )
}

/* ── Inline text highlighter ─────────────────────────────────────────────── */

function HighlightedText({
  text,
  instances,
  useTransformed = false,
}: {
  text: string
  instances: ConnectedSpeechInstance[]
  useTransformed?: boolean
}) {
  type Range = { start: number; end: number; phenomenon: Phenomenon }
  const ranges: Range[] = []
  const searchIn = useTransformed
    ? instances.map((i) => i.transformed)
    : instances.map((i) => i.original)

  let cursor = 0
  const textLower = text.toLowerCase()

  instances.forEach((inst, idx) => {
    const needle = searchIn[idx].toLowerCase()
    const pos = textLower.indexOf(needle, cursor)
    if (pos !== -1) {
      ranges.push({ start: pos, end: pos + needle.length, phenomenon: inst.phenomenon })
      cursor = pos + needle.length
    }
  })

  if (ranges.length === 0) return <>{text}</>

  const parts: React.ReactNode[] = []
  let pos = 0
  for (const range of ranges) {
    if (range.start > pos) parts.push(text.slice(pos, range.start))
    const c = getPhenomenonColor(range.phenomenon)
    parts.push(
      <mark
        key={range.start}
        className={`rounded px-0.5 ${c.bg} ${c.text}`}
        title={PHENOMENON_LABELS[range.phenomenon]}
      >
        {text.slice(range.start, range.end)}
      </mark>
    )
    pos = range.end
  }
  if (pos < text.length) parts.push(text.slice(pos))
  return <>{parts}</>
}
