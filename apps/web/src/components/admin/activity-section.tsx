'use client'

import { useState, useMemo } from 'react'
import { ACTIVITY_META, type ActivityEvent, type ActivityType, type CostTier } from '@/lib/ielts/engagement/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay() + 1) // Monday
  return d.toISOString().slice(0, 10)
}

function getMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

function lastNWeeks(n: number): string[] {
  const keys: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    keys.push(getWeekKey(d))
  }
  // deduplicate preserving order
  return [...new Set(keys)]
}

function lastNMonths(n: number): string[] {
  const keys: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(d.toISOString().slice(0, 7))
  }
  return keys
}

function formatPeriodLabel(key: string, mode: 'week' | 'month'): string {
  if (mode === 'month') {
    const [y, m] = key.split('-')
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  const d = new Date(key)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const TIER_COLORS: Record<CostTier, string> = {
  free: 'bg-emerald-400',
  low:  'bg-amber-400',
  high: 'bg-red-400',
}

const TIER_TEXT: Record<CostTier, string> = {
  free: 'text-emerald-600 dark:text-emerald-400',
  low:  'text-amber-600 dark:text-amber-400',
  high: 'text-red-600 dark:text-red-400',
}

const TIER_BADGE: Record<CostTier, string> = {
  free: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  low:  'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

// ── Types ─────────────────────────────────────────────────────────────────────

type UserMeta = { id: number; name: string | null; email: string }

type Props = {
  events: ActivityEvent[]
  users: UserMeta[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ActivitySection({ events, users }: Props) {
  const [mode, setMode] = useState<'week' | 'month'>('week')
  const [expandedUser, setExpandedUser] = useState<number | null>(null)

  const periods = mode === 'week' ? lastNWeeks(8) : lastNMonths(6)
  const getKey = mode === 'week' ? getWeekKey : getMonthKey

  // ── System-wide totals per period × cost tier ──────────────────────────────
  const systemChart = useMemo(() => {
    const map: Record<string, Record<CostTier, number>> = {}
    for (const period of periods) map[period] = { free: 0, low: 0, high: 0 }
    for (const ev of events) {
      const key = getKey(ev.date)
      if (map[key]) {
        const tier = ACTIVITY_META[ev.actionType].costTier
        map[key][tier]++
      }
    }
    const maxTotal = Math.max(...periods.map((p) => {
      const b = map[p]
      return b.free + b.low + b.high
    }), 1)
    return { map, maxTotal }
  }, [events, periods, getKey])

  // ── Per-user totals ────────────────────────────────────────────────────────
  const userTotals = useMemo(() => {
    // total across all time for ranking
    const allTime: Record<number, Record<CostTier, number>> = {}
    const currentPeriod: Record<number, Record<CostTier, number>> = {}
    const currentKey = getKey(new Date())

    for (const ev of events) {
      if (!allTime[ev.userId]) allTime[ev.userId] = { free: 0, low: 0, high: 0 }
      allTime[ev.userId][ACTIVITY_META[ev.actionType].costTier]++

      if (getKey(ev.date) === currentKey) {
        if (!currentPeriod[ev.userId]) currentPeriod[ev.userId] = { free: 0, low: 0, high: 0 }
        currentPeriod[ev.userId][ACTIVITY_META[ev.actionType].costTier]++
      }
    }

    return users
      .map((u) => {
        const at = allTime[u.id] ?? { free: 0, low: 0, high: 0 }
        const cp = currentPeriod[u.id] ?? { free: 0, low: 0, high: 0 }
        return {
          ...u,
          allTimeTotal: at.free + at.low + at.high,
          allTimeFree: at.free,
          allTimeLow: at.low,
          allTimeHigh: at.high,
          currentFree: cp.free,
          currentLow: cp.low,
          currentHigh: cp.high,
        }
      })
      .filter((u) => u.allTimeTotal > 0)
      .sort((a, b) => b.allTimeTotal - a.allTimeTotal)
  }, [events, users, getKey])

  // ── Per-user per-period breakdown (for expanded row) ──────────────────────
  function getUserPeriodData(userId: number) {
    const userEvents = events.filter((e) => e.userId === userId)
    const byPeriod: Record<string, Record<ActivityType, number>> = {}
    for (const period of periods) byPeriod[period] = {} as Record<ActivityType, number>
    for (const ev of userEvents) {
      const key = getKey(ev.date)
      if (byPeriod[key]) {
        byPeriod[key][ev.actionType] = (byPeriod[key][ev.actionType] ?? 0) + 1
      }
    }
    return byPeriod
  }

  // ── System-wide totals by action type ─────────────────────────────────────
  const actionTypeTotals = useMemo(() => {
    const map: Record<ActivityType, number> = {} as Record<ActivityType, number>
    for (const ev of events) {
      map[ev.actionType] = (map[ev.actionType] ?? 0) + 1
    }
    return (Object.entries(map) as [ActivityType, number][])
      .sort((a, b) => b[1] - a[1])
  }, [events])

  const totalEvents = events.length
  const freeTotal = events.filter((e) => ACTIVITY_META[e.actionType].costTier === 'free').length
  const lowTotal  = events.filter((e) => ACTIVITY_META[e.actionType].costTier === 'low').length
  const highTotal = events.filter((e) => ACTIVITY_META[e.actionType].costTier === 'high').length

  return (
    <div className="flex flex-col gap-6">

      {/* Header + period toggle */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Activity Breakdown</h2>
          <p className="text-xs text-faint mt-0.5">
            {totalEvents} total actions across {users.length} users
          </p>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
          {(['week', 'month'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {m === 'week' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Cost tier summary */}
      <div className="grid grid-cols-3 gap-3">
        {([['free', freeTotal, 'Free actions'], ['low', lowTotal, 'Low-cost (Haiku)'], ['high', highTotal, 'High-cost (Sonnet)']] as const).map(
          ([tier, n, label]) => (
            <div key={tier} className="rounded-xl border border-border bg-card px-4 py-3">
              <p className={`text-2xl font-bold ${TIER_TEXT[tier]}`}>{n}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          )
        )}
      </div>

      {/* System-wide chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-4">
          Activity per {mode} — last {mode === 'week' ? '8 weeks' : '6 months'}
        </p>
        <div className="flex items-end gap-1.5 h-28">
          {periods.map((period) => {
            const b = systemChart.map[period]
            const total = b.free + b.low + b.high
            const heightPct = systemChart.maxTotal > 0 ? (total / systemChart.maxTotal) * 100 : 0
            return (
              <div key={period} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full rounded-t flex flex-col justify-end overflow-hidden"
                  style={{ height: `${Math.max(heightPct, total > 0 ? 4 : 0)}%`, minHeight: total > 0 ? '4px' : '0' }}
                  title={`Free: ${b.free}  Low: ${b.low}  High: ${b.high}`}
                >
                  {b.high > 0 && (
                    <div className={`w-full ${TIER_COLORS.high}`} style={{ flex: b.high }} />
                  )}
                  {b.low > 0 && (
                    <div className={`w-full ${TIER_COLORS.low}`} style={{ flex: b.low }} />
                  )}
                  {b.free > 0 && (
                    <div className={`w-full ${TIER_COLORS.free}`} style={{ flex: b.free }} />
                  )}
                </div>
                {total > 0 && (
                  <span className="text-[10px] text-faint tabular-nums">{total}</span>
                )}
                {/* Tooltip */}
                {total > 0 && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col gap-0.5 rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-lg text-[10px] whitespace-nowrap z-10">
                    {b.high > 0 && <span className={TIER_TEXT.high}>High: {b.high}</span>}
                    {b.low > 0  && <span className={TIER_TEXT.low}>Low: {b.low}</span>}
                    {b.free > 0 && <span className={TIER_TEXT.free}>Free: {b.free}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {/* X-axis labels */}
        <div className="flex gap-1.5 mt-1">
          {periods.map((period) => (
            <div key={period} className="flex-1 text-center text-[9px] text-faint truncate">
              {formatPeriodLabel(period, mode)}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
          {(['free', 'low', 'high'] as CostTier[]).map((tier) => (
            <span key={tier} className="flex items-center gap-1">
              <span className={`inline-block w-2.5 h-2.5 rounded-sm ${TIER_COLORS[tier]}`} />
              {tier === 'free' ? 'Free' : tier === 'low' ? 'Low (Haiku)' : 'High (Sonnet)'}
            </span>
          ))}
        </div>
      </div>

      {/* Action type breakdown */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-3">
          All-time by action type
        </p>
        <div className="flex flex-col gap-1.5">
          {actionTypeTotals.map(([type, n]) => {
            const meta = ACTIVITY_META[type]
            const pct = totalEvents > 0 ? (n / totalEvents) * 100 : 0
            return (
              <div key={type} className="flex items-center gap-3">
                <span className="w-36 text-xs text-muted-foreground shrink-0">{meta.label}</span>
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TIER_COLORS[meta.costTier]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-foreground tabular-nums">{n}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${TIER_BADGE[meta.costTier]}`}>
                  {meta.costTier}
                </span>
              </div>
            )
          })}
          {actionTypeTotals.length === 0 && (
            <p className="text-sm text-faint py-4 text-center">No activity recorded yet.</p>
          )}
        </div>
      </div>

      {/* Per-user table */}
      {userTotals.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">
              Per-user totals (all time · current {mode})
            </p>
          </div>
          <div className="divide-y divide-border">
            {userTotals.map((u) => {
              const isExpanded = expandedUser === u.id
              const periodData = isExpanded ? getUserPeriodData(u.id) : null

              return (
                <div key={u.id}>
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-subtle transition-colors"
                  >
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {u.name ?? u.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-faint truncate">{u.email}</p>
                    </div>

                    {/* All-time tier pills */}
                    <div className="flex items-center gap-2 shrink-0">
                      {u.allTimeFree > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE.free}`}>
                          {u.allTimeFree} free
                        </span>
                      )}
                      {u.allTimeLow > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE.low}`}>
                          {u.allTimeLow} low
                        </span>
                      )}
                      {u.allTimeHigh > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE.high}`}>
                          {u.allTimeHigh} high
                        </span>
                      )}
                    </div>

                    {/* Current period */}
                    <div className="w-20 text-right shrink-0">
                      <p className="text-xs text-faint">this {mode}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {u.currentFree + u.currentLow + u.currentHigh || '—'}
                      </p>
                    </div>

                    <span className="text-faint text-xs shrink-0">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded: per-period mini chart */}
                  {isExpanded && periodData && (
                    <div className="border-t border-border px-5 py-4 bg-subtle">
                      <div className="flex gap-1.5 items-end h-16 mb-1">
                        {periods.map((period) => {
                          const d = periodData[period]
                          const counts: Record<CostTier, number> = { free: 0, low: 0, high: 0 }
                          for (const [type, n] of Object.entries(d) as [ActivityType, number][]) {
                            counts[ACTIVITY_META[type].costTier] += n
                          }
                          const total = counts.free + counts.low + counts.high
                          const maxInPeriods = Math.max(...periods.map((p) => {
                            const pd = periodData[p]
                            return Object.entries(pd as Record<ActivityType, number>).reduce((s, [, n]) => s + (n as number), 0)
                          }), 1)
                          const h = total > 0 ? Math.max((total / maxInPeriods) * 100, 8) : 0
                          return (
                            <div key={period} className="flex-1 flex flex-col items-center gap-0.5">
                              {total > 0 && (
                                <div
                                  className="w-full rounded-t flex flex-col overflow-hidden"
                                  style={{ height: `${h}%` }}
                                  title={`${total} actions`}
                                >
                                  {counts.high > 0 && <div className={`w-full ${TIER_COLORS.high}`} style={{ flex: counts.high }} />}
                                  {counts.low > 0  && <div className={`w-full ${TIER_COLORS.low}`}  style={{ flex: counts.low  }} />}
                                  {counts.free > 0 && <div className={`w-full ${TIER_COLORS.free}`} style={{ flex: counts.free }} />}
                                </div>
                              )}
                              <span className="text-[9px] text-faint">{total || ''}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex gap-1.5">
                        {periods.map((p) => (
                          <div key={p} className="flex-1 text-center text-[9px] text-faint truncate">
                            {formatPeriodLabel(p, mode)}
                          </div>
                        ))}
                      </div>
                      {/* Action type detail */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(Object.keys(ACTIVITY_META) as ActivityType[])
                          .map((type) => {
                            const total = events.filter((e) => e.userId === u.id && e.actionType === type).length
                            return { type, total }
                          })
                          .filter((x) => x.total > 0)
                          .sort((a, b) => b.total - a.total)
                          .map(({ type, total }) => (
                            <span key={type} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TIER_BADGE[ACTIVITY_META[type].costTier]}`}>
                              {ACTIVITY_META[type].label}: {total}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
