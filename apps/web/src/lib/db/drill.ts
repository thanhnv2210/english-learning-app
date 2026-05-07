import { db } from '@/lib/db'
import { drillTexts, drillResults, type DrillMistakeSaved } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export type DrillText = typeof drillTexts.$inferSelect
export type DrillResult = typeof drillResults.$inferSelect

export async function getAllDrillTexts(): Promise<DrillText[]> {
  return db
    .select()
    .from(drillTexts)
    .orderBy(drillTexts.rank, drillTexts.category, drillTexts.createdAt)
}

export async function saveDrillResult(data: {
  userId: number
  drillTextId?: number
  originalText: string
  spokenText: string
  accuracy: number
  correctCount: number
  totalCount: number
  mistakes: DrillMistakeSaved[]
}): Promise<DrillResult> {
  const [result] = await db.insert(drillResults).values(data).returning()
  return result
}

export async function getDrillResults(userId: number): Promise<DrillResult[]> {
  return db
    .select()
    .from(drillResults)
    .where(eq(drillResults.userId, userId))
    .orderBy(desc(drillResults.createdAt))
    .limit(30)
}
