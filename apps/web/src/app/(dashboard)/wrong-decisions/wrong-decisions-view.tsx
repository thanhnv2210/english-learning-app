'use client'

import { useState, useMemo } from 'react'
import { useLocalBoolean } from '@/lib/hooks/use-local-boolean'
import type { WrongDecisionLog, WrongDecisionStats } from '@/lib/db/wrong-decisions'
import { SKILLS, SKILL_LABELS, SKILL_COLORS, ROLE_LABELS, roleColor } from './components/constants'
import { StatsBar, SkillBreakdown } from './components/stats-bar'
import { EntryForm } from './components/entry-form'
import { LogCard } from './components/log-card'

// ── Main view ─────────────────────────────────────────────────────────────────

export function WrongDecisionsView({
  initialLogs,
  initialStats,
}: {
  initialLogs: WrongDecisionLog[]
  initialStats: WrongDecisionStats
}) {
  const [logs, setLogs] = useState<WrongDecisionLog[]>(initialLogs)
  const [stats, setStats] = useState<WrongDecisionStats>(initialStats)
  const [showForm, setShowForm] = useLocalBoolean('wrong-decisions:log-form-open', false)
  const [skillFilter, setSkillFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  function rebuildStats(nextLogs: WrongDecisionLog[]): WrongDecisionStats {
    const bySkill: Record<string, number> = {}
    const roleCount: Record<string, number> = {}
    for (const log of nextLogs) {
      bySkill[log.skill] = (bySkill[log.skill] ?? 0) + 1
      for (const role of log.questionRoles) {
        roleCount[role] = (roleCount[role] ?? 0) + 1
      }
    }
    const byRole = Object.entries(roleCount)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
    return { total: nextLogs.length, bySkill, byRole }
  }

  function handleSaved(log: WrongDecisionLog) {
    const next = [log, ...logs]
    setLogs(next)
    setStats(rebuildStats(next))
    setShowForm(false)
  }

  function handleDelete(id: number) {
    const next = logs.filter((l) => l.id !== id)
    setLogs(next)
    setStats(rebuildStats(next))
  }

  function handleUpdate(id: number, data: Partial<WrongDecisionLog>) {
    const next = logs.map((l) => (l.id === id ? { ...l, ...data } : l))
    setLogs(next)
    setStats(rebuildStats(next))
  }

  // Question types present in current logs (for the type filter chips)
  const presentTypes = useMemo(() => {
    const types = new Set<string>()
    for (const l of logs) {
      if (l.questionType) types.add(l.questionType)
    }
    return [...types].sort()
  }, [logs])

  // Reset type filter when skill filter changes
  function setSkillFilterAndResetType(skill: string) {
    setSkillFilter(skill)
    setTypeFilter('all')
  }

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (skillFilter !== 'all' && l.skill !== skillFilter) return false
      if (typeFilter !== 'all' && l.questionType !== typeFilter) return false
      if (roleFilter !== 'all' && !l.questionRoles.includes(roleFilter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !(l.question ?? '').toLowerCase().includes(q) &&
          !(l.questionType ?? '').toLowerCase().includes(q) &&
          !(l.articleStructure ?? '').toLowerCase().includes(q) &&
          !l.myThought.toLowerCase().includes(q) &&
          !l.actualAnswer.toLowerCase().includes(q) &&
          !(l.analytic ?? '').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [logs, skillFilter, typeFilter, roleFilter, search])

  return (
    <div>
      <StatsBar stats={stats} />
      {stats.total > 0 && <SkillBreakdown bySkill={stats.bySkill} total={stats.total} />}

      {/* Log button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          + Log a wrong decision
        </button>
      )}

      {/* Entry form */}
      {showForm && (
        <EntryForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      )}

      {/* Filters */}
      {logs.length > 0 && (
        <div className="mb-4 space-y-3">
          {/* Skill filter */}
          <div className="flex flex-wrap gap-1.5">
            {['all', ...SKILLS].map((s) => {
              const isActive = skillFilter === s
              const c = s !== 'all' ? SKILL_COLORS[s] : null
              return (
                <button
                  key={s}
                  onClick={() => setSkillFilterAndResetType(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                    isActive && c
                      ? `${c.bg} ${c.text} ${c.border}`
                      : isActive
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {s === 'all' ? 'All skills' : SKILL_LABELS[s]}
                </button>
              )
            })}
          </div>

          {/* Question type filter — only show types present in logged data */}
          {presentTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTypeFilter('all')}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:opacity-70'
                }`}
              >
                All types
              </button>
              {presentTypes.map((qt) => (
                <button
                  key={qt}
                  onClick={() => setTypeFilter(typeFilter === qt ? 'all' : qt)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                    typeFilter === qt
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {qt}
                </button>
              ))}
            </div>
          )}

          {/* Role filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setRoleFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                roleFilter === 'all'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:opacity-70'
              }`}
            >
              All roles
            </button>
            {stats.byRole.map(({ role }) => {
              const rc = roleColor(role)
              const isActive = roleFilter === role
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(isActive ? 'all' : role)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                    isActive ? `${rc.bg} ${rc.text} border-transparent` : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {ROLE_LABELS[role] ?? role}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question, answer, analytic…"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Log list */}
      {filtered.length === 0 && logs.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">No wrong decisions logged yet.</p>
          <p className="mt-1 text-xs text-faint">
            Record a mistake after each practice session to build your error pattern library.
          </p>
        </div>
      )}

      {filtered.length === 0 && logs.length > 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No entries match the current filter.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((log) => (
          <LogCard
            key={log.id}
            log={log}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  )
}
