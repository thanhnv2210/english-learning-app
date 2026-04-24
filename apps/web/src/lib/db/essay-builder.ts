import { db } from '@/lib/db'
import { aiGeneratedContent, essayBuilderConfigs } from '@/lib/db/schema'
import { getDefaultUser } from '@/lib/db/user'
import { and, desc, eq } from 'drizzle-orm'

// ── Essay Builder selection config ────────────────────────────────────────────

export type EssayBuilderConfig = {
  selectedVocabulary: string[]
  selectedCollocations: string[]
}

export async function getEssayBuilderConfig(
  domain: string,
  skill: string,
): Promise<EssayBuilderConfig | null> {
  const user = await getDefaultUser()
  const [row] = await db
    .select()
    .from(essayBuilderConfigs)
    .where(
      and(
        eq(essayBuilderConfigs.userId, user.id),
        eq(essayBuilderConfigs.domain, domain),
        eq(essayBuilderConfigs.skill, skill),
      ),
    )
    .limit(1)
  if (!row) return null
  return {
    selectedVocabulary: row.selectedVocabulary as string[],
    selectedCollocations: row.selectedCollocations as string[],
  }
}

export async function upsertEssayBuilderConfig(
  domain: string,
  skill: string,
  selectedVocabulary: string[],
  selectedCollocations: string[],
): Promise<void> {
  const user = await getDefaultUser()
  await db
    .insert(essayBuilderConfigs)
    .values({ userId: user.id, domain, skill, selectedVocabulary, selectedCollocations, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [essayBuilderConfigs.userId, essayBuilderConfigs.domain, essayBuilderConfigs.skill],
      set: { selectedVocabulary, selectedCollocations, updatedAt: new Date() },
    })
}

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
