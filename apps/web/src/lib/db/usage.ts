import { db } from '@/lib/db'
import { userUsage } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'

export const FREE_MONTHLY_WRITING_LIMIT = 10

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7) // 'YYYY-MM'
}

export type UsageStatus = {
  allowed: boolean
  used: number
  limit: number
}

/**
 * Check if a user is allowed to run an AI writing score.
 * VIP users are always allowed. Free users are capped at FREE_MONTHLY_WRITING_LIMIT/month.
 */
export async function checkWritingScoreUsage(userId: number, tier: string): Promise<UsageStatus> {
  if (tier === 'vip') return { allowed: true, used: 0, limit: Infinity }

  const month = currentMonth()
  const [row] = await db
    .select()
    .from(userUsage)
    .where(and(eq(userUsage.userId, userId), eq(userUsage.month, month)))

  const used = row?.writingScores ?? 0
  return { allowed: used < FREE_MONTHLY_WRITING_LIMIT, used, limit: FREE_MONTHLY_WRITING_LIMIT }
}

/**
 * Increment the writing score counter for this user and month.
 * Call this after a successful AI scoring call.
 */
export async function incrementWritingScore(userId: number): Promise<void> {
  const month = currentMonth()
  await db
    .insert(userUsage)
    .values({ userId, month, writingScores: 1 })
    .onConflictDoUpdate({
      target: [userUsage.userId, userUsage.month],
      set: { writingScores: sql`${userUsage.writingScores} + 1` },
    })
}

/**
 * Get current month usage for display (e.g. in the writing UI).
 */
export async function getWritingScoreUsage(userId: number, tier: string): Promise<UsageStatus> {
  return checkWritingScoreUsage(userId, tier)
}
