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
} from '@/app/actions/connected-speech'
import type { SavedAnalysis } from '@/lib/db/connected-speech'

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

// 30 IELTS collocations organised by the three most common connected-speech patterns.
// Clicking any phrase auto-fills the analyser input so users always have a starting point.
type QuickCategory = {
  category: string
  tag: string            // short label shown on the chip
  phenomenon: Phenomenon
  description: string
  phrases: { original: string; sounds: string }[]
}

const QUICK_EXAMPLES: QuickCategory[] = [
  {
    category: 'The Slide',
    tag: 'Catenation',
    phenomenon: 'catenation',
    description:
      'A consonant at the end of one word slides onto the vowel at the start of the next — the boundary disappears and they sound like a single word.',
    phrases: [
      { original: 'Pick it up',  sounds: 'Pi-ki-tup'    },
      { original: 'Wake up',     sounds: 'Way-kup'       },
      { original: 'Ask about',   sounds: 'As-kabout'     },
      { original: 'Fill in',     sounds: 'Fil-lin'       },
      { original: 'Check out',   sounds: 'Che-kout'      },
      { original: 'An apple',    sounds: 'A-napple'      },
      { original: 'Sign up',     sounds: 'Si-nup'        },
      { original: 'Look at',     sounds: 'Loo-kat'       },
      { original: 'Talk about',  sounds: 'Tal-kabout'    },
      { original: 'Think of',    sounds: 'Thin-kof'      },
    ],
  },
  {
    category: 'The Drop',
    tag: 'Elision',
    phenomenon: 'elision',
    description:
      'A /t/ or /d/ between two consonants is silently removed to keep speech flowing — the surrounding words stay clear but the stop sound vanishes.',
    phrases: [
      { original: 'Next week',         sounds: 'Nex-week'        },
      { original: 'Must be',           sounds: 'Mus-be'          },
      { original: 'Best friend',       sounds: 'Bes-friend'      },
      { original: 'Old man',           sounds: 'Ol-man'          },
      { original: 'Just now',          sounds: 'Jus-now'         },
      { original: 'Last night',        sounds: 'Las-night'       },
      { original: 'Stand by',          sounds: 'Stan-by'         },
      { original: 'Handbag',           sounds: 'Ham-bag'         },
      { original: 'Facts and figures', sounds: 'Fax-an-figures'  },
      { original: 'Sandwich',          sounds: 'San-wich'        },
    ],
  },
  {
    category: 'The Weak Form',
    tag: 'Weakening',
    phenomenon: 'weakening',
    description:
      'Small grammar words (to, of, and, a, have) lose their full vowel and collapse to a short "uh" /ə/ sound — they are still there, just quiet and fast.',
    phrases: [
      { original: 'What type of sugar',  sounds: 'Wut-ty-puh sugar'  },
      { original: 'Want to leave',       sounds: 'Wan-tuh leave'      },
      { original: 'Have to go',          sounds: 'Hav-tuh go'         },
      { original: 'Going to finish',     sounds: 'Gonna finish'       },
      { original: 'Fish and chips',      sounds: "Fish 'n' chips"     },
      { original: 'Should have known',   sounds: 'Shud-uv known'      },
      { original: 'Kind of difficult',   sounds: 'Kin-duh difficult'  },
      { original: 'A lot of people',     sounds: 'A lo-tuh people'    },
      { original: 'Out of time',         sounds: 'Ou-tuh time'        },
      { original: 'A pair of glasses',   sounds: 'A pai-ruh glasses'  },
    ],
  },
]

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
    <div className="mx-auto max-w-5xl space-y-6 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Connected Speech Analyser</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste any English text to identify connected speech phenomena — elision, assimilation,
            catenation, intrusion, weakening, contractions, and gemination.
          </p>
        </div>
        <button
          onClick={openHistory}
          className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
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

      {/* Quick Start — 30 IELTS collocations */}
      {stage === 'input' && (
        <QuickStartSection onSelect={setText} />
      )}

      {/* Input stage */}
      {(stage === 'input' || stage === 'loading') && (
        <div className="space-y-3">
          <textarea
            className="w-full rounded-lg border border-border bg-card p-4 text-sm text-foreground placeholder:text-faint focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
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
                  className="rounded-lg border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-40"
                >
                  {saveStatus === 'saving' ? 'Saving…' : 'Save to history'}
                </button>
              )}
            </div>
          </div>

          {/* Part 1 — side-by-side */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Part 1 — Sound Changes</h2>
              <div className="flex rounded-lg border border-border bg-muted p-0.5 text-sm">
                <button
                  onClick={() => setViewStyle('sentence')}
                  className={`rounded-md px-3 py-1 font-medium transition-colors ${
                    viewStyle === 'sentence'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Full sentence
                </button>
                <button
                  onClick={() => setViewStyle('phrase')}
                  className={`rounded-md px-3 py-1 font-medium transition-colors ${
                    viewStyle === 'phrase'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
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
            <h2 className="text-base font-semibold text-foreground">Part 2 — Pronunciation Tips</h2>
            {result.instances.length === 0 ? (
              <p className="text-sm text-muted-foreground">No connected speech phenomena detected.</p>
            ) : (
              <TipsView instances={result.instances} />
            )}
          </section>
        </div>
      )}

      {/* History panel */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
          <div className="flex h-full w-full max-w-lg flex-col bg-card shadow-xl">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Analysis History</h2>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-faint hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Filter by phenomenon */}
            <div className="border-b border-border px-5 py-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Filter by phenomenon
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => loadHistory('all')}
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                    historyFilter === 'all'
                      ? 'border-border bg-subtle text-foreground'
                      : 'border-border text-muted-foreground hover:opacity-70'
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
                          : 'border-border text-muted-foreground hover:opacity-70'
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
                <p className="py-8 text-center text-sm text-faint">Loading…</p>
              ) : historyRecords.length === 0 ? (
                <p className="py-8 text-center text-sm text-faint">No records found.</p>
              ) : (
                <div className="space-y-2">
                  {historyRecords.map((record) => (
                    <div
                      key={record.id}
                      className="group relative rounded-lg border border-border bg-card p-3 hover:bg-muted transition-colors"
                    >
                      <button
                        onClick={() => loadFromHistory(record)}
                        className="w-full text-left"
                      >
                        <p className="truncate pr-6 text-sm font-medium text-foreground">
                          {record.originalText}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs text-faint">
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
                        className="absolute right-2 top-2 hidden rounded p-1 text-faint hover:bg-red-50 hover:text-red-500 group-hover:block"
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

/* ── Quick Start — IELTS collocation examples ────────────────────────────── */

function QuickStartSection({ onSelect }: { onSelect: (phrase: string) => void }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            30 Common IELTS Collocations — click any phrase to analyse it
          </span>
          <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">
            (organised by connected-speech pattern)
          </span>
        </div>
        <span className="shrink-0 text-xs text-blue-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-blue-100 dark:border-blue-900 px-4 pb-4 pt-3 space-y-4">
          {QUICK_EXAMPLES.map((cat) => {
            const c = getPhenomenonColor(cat.phenomenon)
            return (
              <div key={cat.category}>
                {/* Category header */}
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}>
                    {cat.tag}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{cat.category}</span>
                  <span className="text-xs text-muted-foreground">— {cat.description}</span>
                </div>

                {/* Phrase chips */}
                <div className="flex flex-wrap gap-2">
                  {cat.phrases.map((p) => (
                    <button
                      key={p.original}
                      onClick={() => onSelect(p.original)}
                      title={`Sounds like: ${p.sounds}`}
                      className="group flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-left transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <span className="text-xs font-medium text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400">
                        {p.original}
                      </span>
                      <span className="text-[10px] text-faint group-hover:text-blue-400 dark:group-hover:text-blue-500">
                        → {p.sounds}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          <p className="text-xs text-blue-600 pt-1">
            💡 Hover over a chip to see how it sounds. Click to load it into the analyser.
          </p>
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
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        <span>Phenomenon reference</span>
        <span className="text-faint">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t border-border p-4">
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
                      : 'border-border bg-muted text-muted-foreground hover:opacity-70'
                  }`}
                >
                  {PHENOMENON_LABELS[p]}
                </button>
              )
            })}
          </div>
          <div className={`rounded-lg border p-4 ${c.bg} ${c.border}`}>
            <h3 className={`mb-2 text-sm font-semibold ${c.text}`}>{meta.label}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{meta.explanation}</p>
            <div className="space-y-2">
              {meta.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-4 shrink-0 font-mono text-faint">{i + 1}.</span>
                  <span className="w-32 shrink-0 font-mono text-muted-foreground">{ex.original}</span>
                  <span className="text-faint">→</span>
                  <span className={`w-32 shrink-0 font-mono font-semibold ${c.text}`}>
                    {ex.transformed}
                  </span>
                  <span className="text-xs italic text-muted-foreground">{ex.note}</span>
                </div>
              ))}
            </div>
            {meta.grammarTip && (
              <div className="mt-4 flex gap-2 rounded-md border border-white/60 bg-white/50 px-3 py-2.5">
                <span className="mt-0.5 shrink-0 text-sm">🎯</span>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    IELTS listening &amp; speaking
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{meta.grammarTip}</p>
                </div>
              </div>
            )}
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
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Original</p>
        <p className="text-sm leading-relaxed text-foreground">
          <HighlightedText text={original} instances={result.instances} />
        </p>
      </div>
      <div className="rounded-lg border border-border bg-muted p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">
          Connected Speech
        </p>
        <p className="text-sm leading-relaxed text-foreground">
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
    return <p className="text-sm text-muted-foreground">No connected speech phenomena detected.</p>
  return (
    <div className="space-y-2">
      {instances.map((inst, i) => {
        const c = getPhenomenonColor(inst.phenomenon)
        return (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <span className="w-36 shrink-0 font-mono text-sm text-muted-foreground">{inst.original}</span>
            <span className="text-faint">→</span>
            <span className={`w-36 shrink-0 font-mono text-sm font-semibold ${c.text}`}>
              {inst.transformed}
            </span>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}
            >
              {PHENOMENON_LABELS[inst.phenomenon]}
            </span>
            <span className="text-xs text-muted-foreground">{inst.description}</span>
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
                    <span className="text-muted-foreground">{inst.tip}</span>
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
