'use client'

import type { SkillStats } from '@/lib/db/analytics'

// ── Helpers ───────────────────────────────────────────────────────────────────

const SKILL_LABELS: Record<string, string> = {
  speaking:        'Speaking (Pt 1 & 3)',
  speaking_part2:  'Speaking (Pt 2)',
  writing:         'Writing Task 2',
  reading:         'Reading',
  listening:       'Listening',
}

const SKILL_PRACTICE_HREF: Record<string, string> = {
  speaking:        '/speaking',
  speaking_part2:  '/speaking/part2',
  writing:         '/writing',
  reading:         '/reading',
  listening:       '/listening',
}

function fmt(n: number) {
  return n.toFixed(1)
}

function gapColor(gap: number): string {
  if (gap >= 0)    return 'text-green-600'
  if (gap >= -0.5) return 'text-amber-600'
  return 'text-red-500'
}

function gapBg(gap: number): string {
  if (gap >= 0)    return 'bg-green-50 border-green-200 text-green-700'
  if (gap >= -0.5) return 'bg-amber-50 border-amber-200 text-amber-700'
  return 'bg-red-50 border-red-200 text-red-600'
}

function bandBg(gap: number): string {
  if (gap >= 0)    return 'text-green-600'
  if (gap >= -0.5) return 'text-amber-500'
  return 'text-red-500'
}

function relativeDate(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return new Date(date).toLocaleDateString()
}

// ── Mini trend bar ────────────────────────────────────────────────────────────

function TrendDots({ sessions, target }: { sessions: { band: number }[]; target: number }) {
  if (sessions.length === 0) return null
  return (
    <div className="flex items-end gap-1 h-8">
      {sessions.map((s, i) => {
        const height = Math.max(20, Math.min(100, (s.band / 9) * 100))
        const color = s.band >= target ? 'bg-green-400' : s.band >= target - 0.5 ? 'bg-amber-400' : 'bg-red-400'
        return (
          <div key={i} className="flex flex-col items-center gap-0.5 group relative">
            <div
              className={`w-3 rounded-sm ${color} transition-all`}
              style={{ height: `${height}%` }}
            />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-gray-800 text-white rounded px-1 py-0.5 whitespace-nowrap z-10">
              Band {fmt(s.band)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Skill card ────────────────────────────────────────────────────────────────

function SkillCard({ stat }: { stat: SkillStats }) {
  const label = SKILL_LABELS[stat.skill] ?? stat.skill
  const href  = SKILL_PRACTICE_HREF[stat.skill] ?? '/'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {stat.sessionCount} session{stat.sessionCount !== 1 ? 's' : ''} · last {relativeDate(stat.lastPracticed)}
          </p>
        </div>
        <a
          href={href}
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Practice →
        </a>
      </div>

      {/* Band summary */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className={`text-3xl font-bold tabular-nums ${bandBg(stat.gap)}`}>
            {fmt(stat.avgBand)}
          </span>
          <span className="text-xs text-gray-400">avg band</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">target</span>
          <span className="text-lg font-semibold text-gray-600">{fmt(stat.targetBand)}</span>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${gapBg(stat.gap)}`}>
          {stat.gap >= 0 ? '+' : ''}{fmt(stat.gap)} gap
        </div>
        <div className="ml-auto">
          <TrendDots sessions={stat.recentSessions} target={stat.targetBand} />
          <p className="text-xs text-gray-400 text-center mt-1">last {stat.recentSessions.length}</p>
        </div>
      </div>

      {/* Criteria breakdown */}
      {stat.criteriaStats.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">Criteria breakdown</p>
          <div className="flex flex-col gap-1.5">
            {stat.criteriaStats.map((c) => (
              <div key={c.criterion} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-40 shrink-0 truncate">{c.criterion}</span>
                {/* Bar */}
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      c.gap >= 0 ? 'bg-green-400' : c.gap >= -0.5 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(100, (c.avg / 9) * 100)}%` }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-500"
                    style={{ left: `${Math.min(100, (c.target / 9) * 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold tabular-nums w-8 text-right ${gapColor(c.gap)}`}>
                  {fmt(c.avg)}
                </span>
                <span className="text-xs text-gray-400 w-10 text-right">/ {fmt(c.target)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Summary row ───────────────────────────────────────────────────────────────

function SummaryBar({ stats }: { stats: SkillStats[] }) {
  const totalSessions = stats.reduce((s, r) => s + r.sessionCount, 0)
  const onTarget = stats.filter((s) => s.gap >= 0).length
  const best = stats.reduce<SkillStats | null>((b, s) => (!b || s.avgBand > b.avgBand ? s : b), null)

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Total sessions', value: totalSessions },
        { label: 'Skills at target', value: `${onTarget} / ${stats.length}` },
        { label: 'Strongest skill', value: best ? (SKILL_LABELS[best.skill] ?? best.skill) : '—' },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="mt-1 text-lg font-bold text-gray-800 truncate">{value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function AnalyticsView({ stats }: { stats: SkillStats[] }) {
  if (stats.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
        <p className="text-sm font-medium text-gray-500">No graded sessions yet.</p>
        <p className="mt-1 text-xs text-gray-400">
          Complete a Speaking, Writing, Reading, or Listening session and request feedback to see your analytics.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {[
            { href: '/speaking', label: 'Speaking' },
            { href: '/writing', label: 'Writing' },
            { href: '/reading', label: 'Reading' },
            { href: '/listening', label: 'Listening' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {label} →
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <SummaryBar stats={stats} />
      {stats.map((stat) => (
        <SkillCard key={stat.skill} stat={stat} />
      ))}
    </div>
  )
}
