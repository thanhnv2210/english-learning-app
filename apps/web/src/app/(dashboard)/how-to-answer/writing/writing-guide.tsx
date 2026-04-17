'use client'

import { useState } from 'react'
import type { WritingGuide } from '@/lib/guides/writing'

function GuideAccordion({ guides, accentColor }: { guides: WritingGuide[]; accentColor: 'blue' | 'purple' }) {
  const [openId, setOpenId] = useState<string>(guides[0]?.id ?? '')

  const activeBorder = accentColor === 'blue' ? 'border-blue-200' : 'border-purple-200'
  const activeText = accentColor === 'blue' ? 'text-blue-700' : 'text-purple-700'
  const dotColor = accentColor === 'blue' ? 'bg-blue-400' : 'bg-purple-400'
  const stepBg = accentColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'

  return (
    <div className="flex flex-col gap-2">
      {guides.map((guide) => {
        const isOpen = openId === guide.id
        return (
          <div
            key={guide.id}
            className={`rounded-xl border transition-colors ${
              isOpen ? `${activeBorder} bg-white` : 'border-gray-200 bg-white'
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? '' : guide.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className={`text-sm font-semibold ${isOpen ? activeText : 'text-gray-800'}`}>
                {guide.name}
              </span>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-gray-100 px-5 pb-6 pt-5">
                <p className="text-sm leading-relaxed text-gray-600">{guide.description}</p>

                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">FORMAT</span>
                  <p className="text-xs leading-relaxed text-amber-800">{guide.answerFormat}</p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step-by-Step Approach
                  </p>
                  <ol className="flex flex-col gap-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${stepBg} text-[10px] font-bold text-white`}>
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-gray-700">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Key Strategies
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.strategies.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

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
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function WritingGuideClient({
  task1Guides,
  task2Guides,
}: {
  task1Guides: WritingGuide[]
  task2Guides: WritingGuide[]
}) {
  return (
    <div className="flex flex-col gap-10">
      {/* Task 1 */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Task 1 — Describing Visual Data</h2>
          <p className="mt-1 text-sm text-gray-500">
            At least 150 words · 20 minutes recommended · Factual report — no opinion
          </p>
        </div>
        <GuideAccordion guides={task1Guides} accentColor="blue" />
      </section>

      {/* Task 2 */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Task 2 — Essay</h2>
          <p className="mt-1 text-sm text-gray-500">
            At least 250 words · 40 minutes recommended · Worth twice as much as Task 1
          </p>
        </div>
        <GuideAccordion guides={task2Guides} accentColor="purple" />
      </section>
    </div>
  )
}
