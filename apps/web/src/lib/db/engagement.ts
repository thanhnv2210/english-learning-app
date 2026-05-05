import { db } from '@/lib/db'
import { users, sentencePracticeSessions, wrongDecisionLogs } from '@/lib/db/schema'
import { desc, count, gte, eq } from 'drizzle-orm'

export type EngagementTier = 'new' | 'active' | 'at-risk' | 'churned'

export type EngagementRow = {
  id: number
  email: string
  name: string | null
  image: string | null
  status: string
  tier: string
  lastActiveAt: Date | null
  createdAt: Date
  engagementTier: EngagementTier
  daysSinceActive: number | null
  activityThisWeek: number
  totalActivity: number
  skillsTouched: string[]
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000

function getEngagementTier(lastActiveAt: Date | null, createdAt: Date): EngagementTier {
  const now = Date.now()
  if (now - createdAt.getTime() < THREE_DAYS) return 'new'
  if (!lastActiveAt) return 'churned'
  const elapsed = now - lastActiveAt.getTime()
  if (elapsed <= SEVEN_DAYS) return 'active'
  if (elapsed <= TWENTY_ONE_DAYS) return 'at-risk'
  return 'churned'
}

export async function getEngagementData(): Promise<EngagementRow[]> {
  const weekAgo = new Date(Date.now() - SEVEN_DAYS)

  const [allUsers, practiceTotals, practiceWeek, wrongTotals, wrongWeek, wrongSkills] =
    await Promise.all([
      db.select().from(users).orderBy(desc(users.lastActiveAt)),

      db.select({ userId: sentencePracticeSessions.userId, count: count() })
        .from(sentencePracticeSessions)
        .groupBy(sentencePracticeSessions.userId),

      db.select({ userId: sentencePracticeSessions.userId, count: count() })
        .from(sentencePracticeSessions)
        .where(gte(sentencePracticeSessions.createdAt, weekAgo))
        .groupBy(sentencePracticeSessions.userId),

      db.select({ userId: wrongDecisionLogs.userId, count: count() })
        .from(wrongDecisionLogs)
        .groupBy(wrongDecisionLogs.userId),

      db.select({ userId: wrongDecisionLogs.userId, count: count() })
        .from(wrongDecisionLogs)
        .where(gte(wrongDecisionLogs.createdAt, weekAgo))
        .groupBy(wrongDecisionLogs.userId),

      db.select({ userId: wrongDecisionLogs.userId, skill: wrongDecisionLogs.skill })
        .from(wrongDecisionLogs),
    ])

  const practiceTotalMap = Object.fromEntries(practiceTotals.map((r) => [r.userId, r.count]))
  const practiceWeekMap = Object.fromEntries(practiceWeek.map((r) => [r.userId, r.count]))
  const wrongTotalMap = Object.fromEntries(wrongTotals.map((r) => [r.userId, r.count]))
  const wrongWeekMap = Object.fromEntries(wrongWeek.map((r) => [r.userId, r.count]))

  // Deduplicated skills per user
  const skillsMap: Record<number, Set<string>> = {}
  for (const { userId, skill } of wrongSkills) {
    if (!userId) continue
    if (!skillsMap[userId]) skillsMap[userId] = new Set()
    skillsMap[userId].add(skill)
  }

  return allUsers.map((u) => {
    const now = Date.now()
    const daysSinceActive = u.lastActiveAt
      ? Math.floor((now - u.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      status: u.status,
      tier: u.tier,
      lastActiveAt: u.lastActiveAt,
      createdAt: u.createdAt,
      engagementTier: getEngagementTier(u.lastActiveAt, u.createdAt),
      daysSinceActive,
      activityThisWeek: (practiceWeekMap[u.id] ?? 0) + (wrongWeekMap[u.id] ?? 0),
      totalActivity: (practiceTotalMap[u.id] ?? 0) + (wrongTotalMap[u.id] ?? 0),
      skillsTouched: Array.from(skillsMap[u.id] ?? []),
    }
  })
}

export type EngagementSummary = {
  total: number
  newUsers: number
  active: number
  atRisk: number
  churned: number
}

export function summariseEngagement(rows: EngagementRow[]): EngagementSummary {
  return {
    total: rows.length,
    newUsers: rows.filter((r) => r.engagementTier === 'new').length,
    active: rows.filter((r) => r.engagementTier === 'active').length,
    atRisk: rows.filter((r) => r.engagementTier === 'at-risk').length,
    churned: rows.filter((r) => r.engagementTier === 'churned').length,
  }
}
