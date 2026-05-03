'use client'

import type { useTimer } from '@/lib/ielts/timer/use-timer'

type TimerHook = ReturnType<typeof useTimer>

type Props = {
  timer: TimerHook
  partLabel?: string        // e.g. "Part 3"
  onMoveOn: () => void      // called when user chooses to proceed
}

export function TimerAlertModal({ timer, partLabel = 'Next Part', onMoveOn }: Props) {
  const { fired, addTime } = timer

  if (!fired) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <p className="text-lg font-bold text-foreground">Time&apos;s up!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your 2-minute slot has ended. Would you like to continue or move on?
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => addTime(120)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Add 2 More Minutes
          </button>
          <button
            onClick={onMoveOn}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Move to {partLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
