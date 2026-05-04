import { db } from '@/lib/db'
import { vocabBanks, vocabBankWords } from '@/lib/db/schema'
import { and, desc, eq, or, sql } from 'drizzle-orm'

export type VocabBankWord = {
  id: number
  bankId: number
  word: string
  type: string
  meaning: string
  example: string
  createdAt: Date
}

export type VocabBank = {
  id: number
  userId: number | null
  topic: string
  description: string
  isSystem: boolean
  rank: number
  createdAt: Date
}

export type VocabBankWithCount = VocabBank & { wordCount: number }

// ── Banks ─────────────────────────────────────────────────────────────────────

export async function getAllBanks(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<VocabBankWithCount[]> {
  const visibilityFilter = isAdmin
    ? undefined
    : showSystemData
      ? or(eq(vocabBanks.isSystem, true), eq(vocabBanks.userId, userId))
      : and(eq(vocabBanks.isSystem, false), eq(vocabBanks.userId, userId))

  const rows = await db
    .select({
      id: vocabBanks.id,
      userId: vocabBanks.userId,
      topic: vocabBanks.topic,
      description: vocabBanks.description,
      isSystem: vocabBanks.isSystem,
      rank: vocabBanks.rank,
      createdAt: vocabBanks.createdAt,
      wordCount: sql<number>`cast(count(${vocabBankWords.id}) as int)`,
    })
    .from(vocabBanks)
    .leftJoin(vocabBankWords, eq(vocabBankWords.bankId, vocabBanks.id))
    .where(visibilityFilter)
    .groupBy(vocabBanks.id)
    .orderBy(desc(vocabBanks.rank), desc(vocabBanks.createdAt))
  return rows as VocabBankWithCount[]
}

export async function getBankById(id: number): Promise<VocabBank | null> {
  const rows = await db.select().from(vocabBanks).where(eq(vocabBanks.id, id)).limit(1)
  return (rows[0] as VocabBank) ?? null
}

export async function findBankByTopic(topic: string): Promise<VocabBank | null> {
  const rows = await db
    .select()
    .from(vocabBanks)
    .where(sql`lower(${vocabBanks.topic}) = lower(${topic})`)
    .limit(1)
  return (rows[0] as VocabBank) ?? null
}

export async function createBank(data: { userId: number; topic: string; description: string }): Promise<VocabBank> {
  const [row] = await db
    .insert(vocabBanks)
    .values({ userId: data.userId, topic: data.topic.trim(), description: data.description, isSystem: false })
    .returning()
  return row as VocabBank
}

export async function deleteBank(id: number, userId: number, isAdmin: boolean): Promise<void> {
  // isSystem banks cannot be deleted by non-admins
  const condition = isAdmin
    ? eq(vocabBanks.id, id)
    : and(eq(vocabBanks.id, id), eq(vocabBanks.isSystem, false), eq(vocabBanks.userId, userId))
  await db.delete(vocabBanks).where(condition)
}

export async function updateBankRank(id: number, rank: number): Promise<void> {
  await db.update(vocabBanks).set({ rank }).where(eq(vocabBanks.id, id))
}

// ── Words ─────────────────────────────────────────────────────────────────────

export async function getWordsByBankId(bankId: number): Promise<VocabBankWord[]> {
  return db
    .select()
    .from(vocabBankWords)
    .where(eq(vocabBankWords.bankId, bankId))
    .orderBy(vocabBankWords.createdAt) as Promise<VocabBankWord[]>
}

export async function addWordToBank(data: {
  bankId: number
  word: string
  type: string
  meaning: string
  example: string
}): Promise<VocabBankWord> {
  const [row] = await db.insert(vocabBankWords).values(data).returning()
  return row as VocabBankWord
}

export async function addWordsToBank(
  bankId: number,
  words: { word: string; type: string; meaning: string; example: string }[],
): Promise<void> {
  if (words.length === 0) return
  await db.insert(vocabBankWords).values(words.map((w) => ({ ...w, bankId })))
}

export async function removeWordFromBank(wordId: number): Promise<void> {
  await db.delete(vocabBankWords).where(eq(vocabBankWords.id, wordId))
}
