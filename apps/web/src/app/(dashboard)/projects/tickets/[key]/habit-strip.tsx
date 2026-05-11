'use client'

import { useState, useTransition } from 'react'
import { toggleTicketCompletionAction } from '@/app/actions/ticket-completions'

type Props = {
  ticketId: number
  ticketKey: string
  sprintStart: string   // ISO 'YYYY-MM-DD'
  sprintEnd: string     // ISO 'YYYY-MM-DD'
  initialCompletions: string[]
}

// Build every ISO date string between start (inclusive) and end (exclusive of end+1)
function buildDays(start: string, end: string): string[] {
  const days: string[] = []
  const cur = new Date(start + 'T00:00:00')
  const last = new Date(end + 'T00:00:00')
  while (cur <= last) {
    days.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function toLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function longestCurrentStreak(completedSet: Set<string>, days: string[]): number {
  const today = toLocalISODate(new Date())
  let streak = 0
  // Walk backwards from today
  for (let i = days.indexOf(today); i >= 0; i--) {
    if (completedSet.has(days[i])) streak++
    else break
  }
  return streak
}

const WEEK_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function HabitStrip({ ticketId, ticketKey, sprintStart, sprintEnd, initialCompletions }: Props) {
  const [completions, setCompletions] = useState<Set<string>>(new Set(initialCompletions))
  const [, startTransition] = useTransition()

  const days = buildDays(sprintStart, sprintEnd)
  const today = toLocalISODate(new Date())
  const todayDone = completions.has(today)
  const streak = longestCurrentStreak(completions, days)
  const total = completions.size

  // Pad front so week starts on Sunday
  const firstDow = new Date(days[0] + 'T00:00:00').getDay()
  const paddedDays: (string | null)[] = [...Array(firstDow).fill(null), ...days]
  // Pad end to fill last row
  const remainder = paddedDays.length % 7
  if (remainder > 0) {
    for (let i = 0; i < 7 - remainder; i++) paddedDays.push(null)
  }

  function toggle(date: string) {
    const next = new Set(completions)
    if (next.has(date)) next.delete(date)
    else next.add(date)
    setCompletions(next)

    startTransition(async () => {
      const updated = await toggleTicketCompletionAction(ticketId, date, ticketKey)
      setCompletions(new Set(updated))
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Stats row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">/ {days.length} days completed</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 dark:bg-amber-900/30">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{streak} day streak</span>
          </div>
        )}
        <div className="ml-auto">
          {today >= sprintStart && today <= sprintEnd && (
            <button
              onClick={() => toggle(today)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                todayDone
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {todayDone ? '✓ Done today' : 'Mark today'}
            </button>
          )}
        </div>
      </div>

      {/* Week-day header */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-faint">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((date, i) => {
          if (!date) {
            return <div key={`pad-${i}`} />
          }

          const done = completions.has(date)
          const isToday = date === today
          const isPast = date < today
          const isFuture = date > today
          const inRange = date >= sprintStart && date <= sprintEnd

          const dayNum = parseInt(date.slice(8), 10)
          const isFirstOfMonth = dayNum === 1

          return (
            <button
              key={date}
              onClick={() => inRange ? toggle(date) : undefined}
              title={date}
              disabled={!inRange}
              className={[
                'relative aspect-square rounded-md text-[11px] font-medium transition-all',
                'flex flex-col items-center justify-center gap-0.5',
                done
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : isToday
                    ? 'ring-2 ring-blue-500 bg-muted text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30'
                    : isPast && inRange
                      ? 'bg-muted text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/20'
                      : isFuture
                        ? 'bg-subtle text-faint cursor-default'
                        : 'bg-muted text-faint cursor-default',
              ].join(' ')}
            >
              <span>{dayNum}</span>
              {isFirstOfMonth && (
                <span className="text-[8px] leading-none opacity-70">
                  {new Date(date + 'T00:00:00').toLocaleString('default', { month: 'short' })}
                </span>
              )}
              {isToday && !done && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] text-faint">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500" /> Done</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-muted ring-2 ring-blue-500" /> Today</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-muted" /> Missed</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-subtle" /> Upcoming</span>
      </div>
    </div>
  )
}
