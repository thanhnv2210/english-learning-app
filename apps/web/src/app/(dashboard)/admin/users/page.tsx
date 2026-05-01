import { db } from '@/lib/db'
import { users, wrongDecisionLogs, sentencePracticeSessions } from '@/lib/db/schema'
import { desc, count } from 'drizzle-orm'
import { UsersTable } from './users-table'

export const dynamic = 'force-dynamic'

export type UserRow = {
  id: number
  email: string
  name: string | null
  image: string | null
  tier: string
  modelPreference: string
  targetProfile: string
  createdAt: Date
  wrongDecisionCount: number
  practiceSessionCount: number
  authProvider: 'google' | 'credentials'
}

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  const [wrongCounts, practiceCounts] = await Promise.all([
    db.select({ userId: wrongDecisionLogs.userId, count: count() })
      .from(wrongDecisionLogs)
      .groupBy(wrongDecisionLogs.userId),
    db.select({ userId: sentencePracticeSessions.userId, count: count() })
      .from(sentencePracticeSessions)
      .groupBy(sentencePracticeSessions.userId),
  ])

  const wrongMap = Object.fromEntries(wrongCounts.map((r) => [r.userId, r.count]))
  const practiceMap = Object.fromEntries(practiceCounts.map((r) => [r.userId, r.count]))

  const rows: UserRow[] = allUsers.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    tier: u.tier,
    modelPreference: u.modelPreference,
    targetProfile: u.targetProfile,
    createdAt: u.createdAt,
    wrongDecisionCount: wrongMap[u.id] ?? 0,
    practiceSessionCount: practiceMap[u.id] ?? 0,
    authProvider: u.image ? 'google' : 'credentials',
  }))

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Admin
          </span>
          <span className="text-xs text-faint">{allUsers.length} user{allUsers.length !== 1 ? 's' : ''}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage registered users, tiers, and model preferences.
        </p>
      </div>

      <UsersTable users={rows} />
    </div>
  )
}
