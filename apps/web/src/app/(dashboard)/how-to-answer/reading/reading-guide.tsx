'use client'

import { useState } from 'react'
import type { ReadingGuide, PeelPart } from '@/lib/guides/reading'

const PEEL_STYLES: Record<PeelPart, { bg: string; border: string; text: string; badge: string; label: string }> = {
  'P':             { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   badge: 'bg-blue-600',   label: 'P — Point'              },
  'E-evidence':    { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  badge: 'bg-green-600',  label: 'E — Evidence'           },
  'E-explanation': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-500', label: 'E — Explanation'        },
  'E-example':     { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-600', label: 'E — Example'            },
  'L':             { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-600',   badge: 'bg-gray-400',   label: 'L — Link'               },
  'intro':         { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-800',   badge: 'bg-rose-500',   label: 'Intro — Hook paragraph' },
  'conclusion':    { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-800',   badge: 'bg-teal-600',   label: 'Conclusion — Advice'    },
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
            className={`rounded-xl border transition-colors ${
              isOpen ? 'border-blue-200 bg-white' : 'border-gray-200 bg-white'
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
                <span className={`text-sm font-semibold ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
                  {guide.name}
                </span>
              </div>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                ▼
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-gray-100 px-5 pb-6 pt-5">
                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">{guide.description}</p>

                {/* Answer format badge — re-used as PEEL legend for the peel guide */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">
                    {guide.id === 'peel' ? 'PEEL LEGEND' : 'ANSWER FORMAT'}
                  </span>
                  <p className="text-xs leading-relaxed text-amber-800">{guide.answerFormat}</p>
                </div>

                {/* Step-by-step */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step-by-Step Approach
                  </p>
                  <ol className="flex flex-col gap-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-gray-700">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Strategies */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Key Strategies
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.strategies.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long-text tip */}
                {guide.tip && (
                  <div className="flex gap-3 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-base leading-none">💡</span>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-700">
                        {guide.tip.label}
                      </p>
                      <p className="text-sm leading-relaxed text-teal-900">{guide.tip.text}</p>
                    </div>
                  </div>
                )}

                {/* Decision trap pro tip */}
                {guide.decisionTip && (
                  <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-base leading-none">⚠️</span>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                        {guide.decisionTip.label}
                      </p>
                      <p className="text-sm leading-relaxed text-orange-900">{guide.decisionTip.text}</p>
                    </div>
                  </div>
                )}

                {/* Common mistakes */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Common Mistakes to Avoid
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.mistakes.map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className="mt-0.5 shrink-0 text-xs text-red-400">✕</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PEEL sample analysis */}
                {guide.sampleAnalysis && guide.sampleAnalysis.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                              <span className="text-xs text-gray-500">zone</span>
                            </div>

                            {/* Look-for */}
                            <div className="mb-1.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Look for · </span>
                              <span className="text-xs italic text-gray-600">{q.lookFor}</span>
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
