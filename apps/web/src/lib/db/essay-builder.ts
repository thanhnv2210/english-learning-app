import { db } from '@/lib/db'
import { aiGeneratedContent } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'

export type EssayBuilderRecord = {
  id: number
  skill: string
  domain: string
  topic: string
  selectedVocabulary: string[]
  selectedCollocations: string[]
  originalGeneratedText: string
  decoratedText: string
  targetBand: number
  isFavorite: boolean
  createdAt: Date
}

function toRecord(row: typeof aiGeneratedContent.$inferSelect): EssayBuilderRecord {
  return {
    id: row.id,
    skill: row.skill,
    domain: row.domain,
    topic: row.topic,
    selectedVocabulary: row.selectedVocabulary as string[],
    selectedCollocations: row.selectedCollocations as string[],
    originalGeneratedText: row.originalGeneratedText,
    decoratedText: row.decoratedText,
    targetBand: row.targetBand,
    isFavorite: row.isFavorite,
    createdAt: row.createdAt,
  }
}

export async function saveEssayBuilderRecord(
  data: Omit<EssayBuilderRecord, 'id' | 'createdAt'>,
): Promise<EssayBuilderRecord> {
  const [row] = await db.insert(aiGeneratedContent).values(data).returning()
  return toRecord(row)
}

export async function getVersionsByDomainSkill(
  domain: string,
  skill: string,
  limit = 5,
): Promise<EssayBuilderRecord[]> {
  const rows = await db
    .select()
    .from(aiGeneratedContent)
    .where(and(eq(aiGeneratedContent.domain, domain), eq(aiGeneratedContent.skill, skill)))
    .orderBy(desc(aiGeneratedContent.createdAt))
    .limit(limit)
  return rows.map(toRecord)
}

export async function getAllEssayBuilderRecords(): Promise<EssayBuilderRecord[]> {
  const rows = await db
    .select()
    .from(aiGeneratedContent)
    .orderBy(desc(aiGeneratedContent.createdAt))
  return rows.map(toRecord)
}

export async function updateEssayDecoratedText(id: number, decoratedText: string): Promise<void> {
  await db.update(aiGeneratedContent).set({ decoratedText }).where(eq(aiGeneratedContent.id, id))
}

export async function updateEssaySelections(
  id: number,
  selectedVocabulary: string[],
  selectedCollocations: string[],
): Promise<void> {
  await db
    .update(aiGeneratedContent)
    .set({ selectedVocabulary, selectedCollocations })
    .where(eq(aiGeneratedContent.id, id))
}

export async function toggleEssayFavorite(id: number, isFavorite: boolean): Promise<void> {
  await db.update(aiGeneratedContent).set({ isFavorite }).where(eq(aiGeneratedContent.id, id))
}

export async function deleteEssayBuilderRecord(id: number): Promise<void> {
  await db.delete(aiGeneratedContent).where(eq(aiGeneratedContent.id, id))
}
