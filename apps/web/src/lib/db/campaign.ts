import { db } from '@/lib/db'
import { campaignConfigs, users } from '@/lib/db/schema'
import { eq, count, asc, inArray } from 'drizzle-orm'

export type CampaignConfig = typeof campaignConfigs.$inferSelect

export type CampaignStats = {
  activeCount: number
  pendingCount: number
  userLimit: number
  spotsRemaining: number
}

export async function getCampaignConfig(): Promise<CampaignConfig | null> {
  const [config] = await db.select().from(campaignConfigs).limit(1)
  return config ?? null
}

export async function upsertCampaignConfig(data: {
  isActive: boolean
  userLimit: number
}): Promise<CampaignConfig> {
  const existing = await getCampaignConfig()
  if (existing) {
    const [updated] = await db
      .update(campaignConfigs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(campaignConfigs.id, existing.id))
      .returning()
    return updated
  }
  const [created] = await db.insert(campaignConfigs).values(data).returning()
  return created
}

export async function getCampaignStats(): Promise<CampaignStats> {
  const config = await getCampaignConfig()
  const [{ value: activeCount }] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.status, 'active'))
  const [{ value: pendingCount }] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.status, 'pending'))

  const userLimit = config?.userLimit ?? 0
  return {
    activeCount,
    pendingCount,
    userLimit,
    spotsRemaining: Math.max(0, userLimit - activeCount),
  }
}

/**
 * Approve the oldest pending users up to fill available slots under newLimit.
 * Returns the number of users approved.
 */
export async function autoApprovePendingUsers(newLimit: number): Promise<number> {
  const [{ value: activeCount }] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.status, 'active'))

  const slots = newLimit - activeCount
  if (slots <= 0) return 0

  const pending = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.status, 'pending'))
    .orderBy(asc(users.createdAt))
    .limit(slots)

  if (pending.length === 0) return 0

  await db
    .update(users)
    .set({ status: 'active' })
    .where(inArray(users.id, pending.map((u) => u.id)))

  return pending.length
}
