import { getEngagementData, summariseEngagement, type EngagementTier, type EngagementRow } from '@/lib/db/engagement'

export const dynamic = 'force-dynamic'

const TIER_CONFIG: Record<EngagementTier, { label: string; className: string }> = {
  new:      { label: 'New',      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  active:   { label: 'Active',   className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'at-risk':{ label: 'At-risk',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  churned:  { label: 'Churned',  className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

const SKILL_LABEL: Record<string, string> = {
  reading: 'Reading', listening: 'Listening', speaking: 'Speaking', writing: 'Writing',
}

function relativeTime(date: Date | null): string {
  if (!date) return '—'
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function Avatar({ user }: { user: Pick<EngagementRow, 'name' | 'email' | 'image'> }) {
  const initial = (user.name || user.email)[0].toUpperCase()
  if (user.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt="" className="h-8 w-8 rounded-full shrink-0 ring-1 ring-border" />
  }
  return (
    <div className="h-8 w-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
      {initial}
    </div>
  )
}

export default async function AdminEngagementPage() {
  const rows = await getEngagementData()
  const summary = summariseEngagement(rows)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Admin
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Engagement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activity is tracked from dashboard visits, sentence practice, and wrong decision logs.
          Writing and speaking sessions are not yet per-user.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total users', value: summary.total, className: 'text-foreground' },
          { label: 'Active (≤7d)', value: summary.active, className: 'text-emerald-500' },
          { label: 'At-risk (8–21d)', value: summary.atRisk, className: 'text-amber-500' },
          { label: 'Churned (>21d)', value: summary.churned, className: 'text-red-500' },
        ].map(({ label, value, className }) => (
          <div key={label} className="rounded-xl border border-border bg-card px-5 py-4">
            <p className={`text-2xl font-bold ${className}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* New users callout */}
      {summary.newUsers > 0 && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 text-sm text-blue-700 dark:text-blue-400">
          {summary.newUsers} user{summary.newUsers !== 1 ? 's' : ''} joined in the last 3 days — not yet classified.
        </div>
      )}

      {/* User table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-subtle">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Last active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">This week</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => {
                const tier = TIER_CONFIG[row.engagementTier]
                return (
                  <tr key={row.id} className="hover:bg-subtle transition-colors">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={row} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {row.name ?? row.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{row.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Engagement tier */}
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.className}`}>
                        {tier.label}
                      </span>
                    </td>

                    {/* Last active */}
                    <td className="px-4 py-3">
                      <span className={`text-sm ${
                        row.daysSinceActive === null ? 'text-faint' :
                        row.daysSinceActive <= 1 ? 'text-emerald-500' :
                        row.daysSinceActive <= 7 ? 'text-foreground' :
                        row.daysSinceActive <= 21 ? 'text-amber-500' :
                        'text-red-500'
                      }`}>
                        {relativeTime(row.lastActiveAt)}
                      </span>
                    </td>

                    {/* Activity this week */}
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        row.activityThisWeek > 0 ? 'text-foreground' : 'text-faint'
                      }`}>
                        {row.activityThisWeek > 0 ? row.activityThisWeek : '—'}
                      </span>
                    </td>

                    {/* Total activity */}
                    <td className="px-4 py-3">
                      <span className={`text-sm ${row.totalActivity > 0 ? 'text-foreground' : 'text-faint'}`}>
                        {row.totalActivity > 0 ? row.totalActivity : '—'}
                      </span>
                    </td>

                    {/* Skills touched */}
                    <td className="px-4 py-3">
                      {row.skillsTouched.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.skillsTouched.map((s) => (
                            <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {SKILL_LABEL[s] ?? s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-faint text-sm">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-faint">
        Tier rules: New = joined ≤3d ago · Active = last seen ≤7d · At-risk = 8–21d · Churned = &gt;21d or never returned.
        Activity counts sentence practice sessions and wrong decision logs only.
      </p>
    </div>
  )
}
