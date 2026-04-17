'use client'

import { useState } from 'react'
import type { SpeakingGuide } from '@/lib/guides/speaking'

const PART_COLORS: Record<string, { border: string; text: string; step: string; dot: string; badge: string; badgeText: string }> = {
  part1: {
    border: 'border-green-200',
    text: 'text-green-700',
    step: 'bg-green-600',
    dot: 'bg-green-400',
    badge: 'bg-green-100 text-green-700',
    badgeText: 'Part 1',
  },
  part2: {
    border: 'border-blue-200',
    text: 'text-blue-700',
    step: 'bg-blue-600',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-700',
    badgeText: 'Part 2',
  },
  part3: {
    border: 'border-purple-200',
    text: 'text-purple-700',
    step: 'bg-purple-600',
    dot: 'bg-purple-400',
    badge: 'bg-purple-100 text-purple-700',
    badgeText: 'Part 3',
  },
}

export function SpeakingGuideClient({ guides }: { guides: SpeakingGuide[] }) {
  const [openId, setOpenId] = useState<string>(guides[0]?.id ?? '')

  return (
    <div className="flex flex-col gap-2">
      {guides.map((guide) => {
        const isOpen = openId === guide.id
        const colors = PART_COLORS[guide.id] ?? PART_COLORS['part1']

        return (
          <div
            key={guide.id}
            className={`rounded-xl border transition-colors ${
              isOpen ? `${colors.border} bg-white` : 'border-gray-200 bg-white'
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? '' : guide.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.badge}`}>
                  {colors.badgeText}
                </span>
                <span className={`text-sm font-semibold ${isOpen ? colors.text : 'text-gray-800'}`}>
                  {guide.name}
                </span>
              </div>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-gray-100 px-5 pb-6 pt-5">
                <p className="text-sm leading-relaxed text-gray-600">{guide.description}</p>

                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">TIME</span>
                  <p className="text-xs leading-relaxed text-amber-800">{guide.timeAllowed}</p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step-by-Step Approach
                  </p>
                  <ol className="flex flex-col gap-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${colors.step} text-[10px] font-bold text-white`}>
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
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
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
