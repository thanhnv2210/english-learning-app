import { db } from './index'
import { officialIeltsResults } from './schema'
import { eq, desc } from 'drizzle-orm'

export type OfficialResultInsert = {
  userId: number
  examDate: string
  listening: number
  reading: number
  writing: number
  speaking: number
  overall: number
  notes?: string | null
}

export async function getOfficialResults(userId: number) {
  return db
    .select()
    .from(officialIeltsResults)
    .where(eq(officialIeltsResults.userId, userId))
    .orderBy(desc(officialIeltsResults.examDate))
}

export async function saveOfficialResult(data: OfficialResultInsert) {
  const [row] = await db.insert(officialIeltsResults).values(data).returning()
  return row
}

export async function deleteOfficialResult(id: number) {
  await db.delete(officialIeltsResults).where(eq(officialIeltsResults.id, id))
}
