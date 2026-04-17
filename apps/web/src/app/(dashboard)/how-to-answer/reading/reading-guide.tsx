'use client'

import { useState } from 'react'
import type { ReadingGuide } from '@/lib/guides/reading'

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
              <span className={`text-sm font-semibold ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
                {guide.name}
              </span>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                ▼
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-gray-100 px-5 pb-6 pt-5">
                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">{guide.description}</p>

                {/* Answer format badge */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">ANSWER FORMAT</span>
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
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
