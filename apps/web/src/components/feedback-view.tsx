'use client'

import type { FeedbackResult } from '@/lib/db/schema'

type Props = {
  feedback: FeedbackResult
}

export function FeedbackView({ feedback }: Props) {
  const gap = (feedback.targetBand - feedback.overallBand).toFixed(1)
  const needsWork = feedback.overallBand < feedback.targetBand

  return (
    <div className="flex flex-col gap-4">
      {/* Overall band */}
      <div className={`rounded-xl p-4 ${needsWork ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Overall Band</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{feedback.overallBand}</span>
          <span className="mb-0.5 text-sm text-gray-500 dark:text-gray-400">
            / target <strong>{feedback.targetBand}</strong>
            {needsWork && (
              <span className="ml-2 text-amber-600 font-medium">({gap} to go)</span>
            )}
          </span>
        </div>
      </div>

      {/* Per-criterion */}
      {feedback.criteria.map((c) => {
        const criterionGap = c.targetScore - c.score
        const color = criterionGap <= 0 ? 'green' : criterionGap <= 0.5 ? 'amber' : 'red'
        const badgeClass = {
          green: 'bg-green-100 text-green-700',
          amber: 'bg-amber-100 text-amber-700',
          red: 'bg-red-100 text-red-700',
        }[color]

        return (
          <div key={c.criterion} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.criterion}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeClass}`}>
                {c.score} / {c.targetScore}
              </span>
            </div>

            {c.keyPoints.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {c.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-0.5 shrink-0 text-amber-400">▸</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
