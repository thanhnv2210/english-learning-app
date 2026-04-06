'use client'

import type { useTimer } from '@/lib/ielts/timer/use-timer'

type TimerHook = ReturnType<typeof useTimer>

type Props = {
  timer: TimerHook
  label?: string
  onStart?: () => void
}

export function TimerControl({ timer, label = 'Timer', onStart }: Props) {
  const { fmt, active, enabled, remaining, start, stop, toggleEnabled } = timer

  const urgentColor = remaining <= 30 ? 'text-red-500' : remaining <= 60 ? 'text-amber-500' : 'text-gray-700'

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
      {/* Enable toggle */}
      <button
        onClick={toggleEnabled}
        title={enabled ? 'Disable timer' : 'Enable timer'}
        className={`text-xs font-medium transition-colors ${enabled ? 'text-blue-600' : 'text-gray-400'}`}
      >
        {label} {enabled ? '●' : '○'}
      </button>

      {enabled && (
        <>
          {/* Countdown display */}
          <span className={`font-mono font-bold tabular-nums ${urgentColor}`}>{fmt}</span>

          {/* Start / Pause */}
          {!active ? (
            <button
              onClick={() => { start(); onStart?.() }}
              className="rounded px-2 py-0.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              {remaining === 0 ? 'Restart' : 'Start'}
            </button>
          ) : (
            <button
              onClick={stop}
              className="rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Pause
            </button>
          )}
        </>
      )}
    </div>
  )
}
