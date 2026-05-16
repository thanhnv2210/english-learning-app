import type { WrongDecisionStats } from '@/lib/db/wrong-decisions'
import { SKILLS, SKILL_LABELS, SKILL_COLORS, ROLE_LABELS } from './constants'

export function StatsBar({ stats }: { stats: WrongDecisionStats }) {
  const topSkill = Object.entries(stats.bySkill).sort(([, a], [, b]) => b - a)[0]
  const topRole = stats.byRole[0]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Total logged', value: stats.total },
        { label: 'Most errors in', value: topSkill ? SKILL_LABELS[topSkill[0]] ?? topSkill[0] : '—' },
        { label: 'Most missed role', value: topRole ? (ROLE_LABELS[topRole.role] ?? topRole.role) : '—' },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-border bg-card px-5 py-4">
          <p className="text-xs text-faint">{label}</p>
          <p className="mt-1 text-lg font-bold text-foreground truncate">{value}</p>
        </div>
      ))}
    </div>
  )
}

export function SkillBreakdown({ bySkill, total }: { bySkill: Record<string, number>; total: number }) {
  if (total === 0) return null
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Errors by skill</p>
      <div className="flex flex-col gap-2">
        {SKILLS.map((skill) => {
          const count = bySkill[skill] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const c = SKILL_COLORS[skill]
          return (
            <div key={skill} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{SKILL_LABELS[skill]}</span>
              <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.bg.replace('50', '400')}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-foreground">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
