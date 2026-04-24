import { db } from '@/lib/db'
import { mockExams, type FeedbackResult } from '@/lib/db/schema'
import { desc, isNotNull } from 'drizzle-orm'

export type CriterionStat = {
  criterion: string
  avg: number
  target: number
  gap: number
}

export type SessionPoint = {
  date: Date
  band: number
}

export type SkillStats = {
  skill: string
  sessionCount: number
  lastPracticed: Date
  avgBand: number
  targetBand: number
  gap: number
  criteriaStats: CriterionStat[]
  recentSessions: SessionPoint[] // last 5, oldest first
}

const SKILL_ORDER = ['speaking', 'speaking_part2', 'writing', 'reading', 'listening']

export async function getAnalyticsStats(): Promise<SkillStats[]> {
  const rows = await db
    .select({ skill: mockExams.skill, feedback: mockExams.feedback, createdAt: mockExams.createdAt })
    .from(mockExams)
    .where(isNotNull(mockExams.feedback))
    .orderBy(desc(mockExams.createdAt))

  // Group by skill
  const bySkill = new Map<string, { feedback: FeedbackResult; createdAt: Date }[]>()
  for (const row of rows) {
    if (!row.feedback) continue
    const list = bySkill.get(row.skill) ?? []
    list.push({ feedback: row.feedback as FeedbackResult, createdAt: row.createdAt })
    bySkill.set(row.skill, list)
  }

  const stats: SkillStats[] = []

  for (const [skill, sessions] of bySkill) {
    const sessionCount = sessions.length
    const lastPracticed = sessions[0].createdAt // already sorted desc
    const targetBand = sessions[0].feedback.targetBand

    const avgBand = sessions.reduce((s, r) => s + r.feedback.overallBand, 0) / sessionCount

    // Per-criterion averages
    const criteriaMap = new Map<string, { scores: number[]; target: number }>()
    for (const { feedback } of sessions) {
      for (const c of feedback.criteria) {
        const entry = criteriaMap.get(c.criterion) ?? { scores: [], target: c.targetScore }
        entry.scores.push(c.score)
        criteriaMap.set(c.criterion, entry)
      }
    }
    const criteriaStats: CriterionStat[] = Array.from(criteriaMap.entries()).map(([criterion, { scores, target }]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return { criterion, avg, target, gap: avg - target }
    })

    // Last 5 sessions for trend, oldest first
    const recentSessions: SessionPoint[] = sessions
      .slice(0, 5)
      .reverse()
      .map((s) => ({ date: s.createdAt, band: s.feedback.overallBand }))

    stats.push({
      skill,
      sessionCount,
      lastPracticed,
      avgBand,
      targetBand,
      gap: avgBand - targetBand,
      criteriaStats,
      recentSessions,
    })
  }

  // Sort by canonical skill order
  stats.sort((a, b) => {
    const ai = SKILL_ORDER.indexOf(a.skill)
    const bi = SKILL_ORDER.indexOf(b.skill)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return stats
}
