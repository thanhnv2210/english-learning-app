'use client'

import { useState } from 'react'
import type { ReadingGuide, PeelPart } from '@/lib/guides/reading'

const PEEL_STYLES: Record<PeelPart, { bg: string; border: string; text: string; badge: string; label: string }> = {
  'P':             { bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-300',    badge: 'bg-blue-600',                 label: 'P — Point'              },
  'E-evidence':    { bg: 'bg-green-50 dark:bg-green-900/20',  border: 'border-green-200 dark:border-green-800',  text: 'text-green-800 dark:text-green-300',  badge: 'bg-green-600',                label: 'E — Evidence'           },
  'E-explanation': { bg: 'bg-orange-50 dark:bg-orange-900/20',border: 'border-orange-200 dark:border-orange-800',text: 'text-orange-800 dark:text-orange-300',badge: 'bg-orange-500',               label: 'E — Explanation'        },
  'E-example':     { bg: 'bg-purple-50 dark:bg-purple-900/20',border: 'border-purple-200 dark:border-purple-800',text: 'text-purple-800 dark:text-purple-300',badge: 'bg-purple-600',               label: 'E — Example'            },
  'L':             { bg: 'bg-muted',                          border: 'border-border',                           text: 'text-muted-foreground',               badge: 'bg-subtle',  label: 'L — Link'               },
  'intro':         { bg: 'bg-rose-50 dark:bg-rose-900/20',    border: 'border-rose-200 dark:border-rose-800',    text: 'text-rose-800 dark:text-rose-300',    badge: 'bg-rose-500',                 label: 'Intro — Hook paragraph' },
  'conclusion':    { bg: 'bg-teal-50 dark:bg-teal-900/20',    border: 'border-teal-200 dark:border-teal-800',    text: 'text-teal-800 dark:text-teal-300',    badge: 'bg-teal-600',                 label: 'Conclusion — Advice'    },
}

export function ReadingGuide({ guides }: { guides: ReadingGuide[] }) {
  const [openId, setOpenId] = useState<string>(guides[0]?.id ?? '')

  return (
    <div className="flex flex-col gap-2">
      {guides.map((guide) => {
        const isOpen = openId === guide.id
        return (
          <div
            key={guide.id}
            className={`rounded-xl border transition-colors bg-card ${
              isOpen ? 'border-blue-200 dark:border-blue-800' : 'border-border'
            }`}
          >
            {/* Header */}
            <button
              onClick={() => setOpenId(isOpen ? '' : guide.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2">
                {guide.id === 'peel' && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                    Meta-strategy
                  </span>
                )}
                <span className={`text-sm font-semibold ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-foreground'}`}>
                  {guide.name}
                </span>
              </div>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-faint`}>
                ▼
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-border px-5 pb-6 pt-5">
                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">{guide.description}</p>

                {/* Answer format badge — re-used as PEEL legend for the peel guide */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {guide.id === 'peel' ? 'PEEL LEGEND' : 'ANSWER FORMAT'}
                  </span>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">{guide.answerFormat}</p>
                </div>

                {/* Step-by-step */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Step-by-Step Approach
                  </p>
                  <ol className="flex flex-col gap-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-foreground">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Strategies */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Key Strategies
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.strategies.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long-text tip */}
                {guide.tip && (
                  <div className="flex gap-3 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-base leading-none">💡</span>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                        {guide.tip.label}
                      </p>
                      <p className="text-sm leading-relaxed text-teal-900 dark:text-teal-300">{guide.tip.text}</p>
                    </div>
                  </div>
                )}

                {/* Decision trap pro tip */}
                {guide.decisionTip && (
                  <div className="flex gap-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-base leading-none">⚠️</span>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                        {guide.decisionTip.label}
                      </p>
                      <p className="text-sm leading-relaxed text-orange-900 dark:text-orange-300">{guide.decisionTip.text}</p>
                    </div>
                  </div>
                )}

                {/* Common mistakes */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Common Mistakes to Avoid
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.mistakes.map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                        <span className="mt-0.5 shrink-0 text-xs text-red-400">✕</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PEEL sample analysis */}
                {guide.sampleAnalysis && guide.sampleAnalysis.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sample Analysis — 5 Real IELTS-Style Questions
                    </p>
                    <div className="flex flex-col gap-3">
                      {guide.sampleAnalysis.map((q) => {
                        const s = PEEL_STYLES[q.peelPart]
                        return (
                          <div
                            key={q.num}
                            className={`rounded-lg border p-4 ${s.bg} ${s.border}`}
                          >
                            {/* Question row */}
                            <div className="mb-3 flex flex-wrap items-start gap-2">
                              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${s.badge}`}>
                                {q.num}
                              </span>
                              <p className={`flex-1 text-sm font-medium ${s.text}`}>
                                {q.question}
                              </p>
                            </div>

                            {/* PEEL badge */}
                            <div className="mb-2 flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${s.badge}`}>
                                {s.label}
                              </span>
                              <span className="text-xs text-muted-foreground">zone</span>
                            </div>

                            {/* Look-for */}
                            <div className="mb-1.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Look for · </span>
                              <span className="text-xs italic text-muted-foreground">{q.lookFor}</span>
                            </div>

                            {/* Hint */}
                            <p className={`text-xs leading-relaxed ${s.text}`}>{q.hint}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

