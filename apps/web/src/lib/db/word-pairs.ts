import { db } from '@/lib/db'
import { wordPairs } from '@/lib/db/schema'
import { eq, or, desc } from 'drizzle-orm'

export { WORD_PAIR_CATEGORIES, CATEGORY_COLORS } from '@/lib/ielts/word-pairs/categories'
export type { WordPairCategory } from '@/lib/ielts/word-pairs/categories'

export type WordPair = {
  id: number
  userId: number | null
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: string
  isSystem: boolean
  rank: number
  createdAt: Date
}

/** Returns system pairs + pairs owned by the given user, by rank desc then newest first. */
export async function getWordPairs(userId: number): Promise<WordPair[]> {
  return db
    .select()
    .from(wordPairs)
    .where(or(eq(wordPairs.userId, userId), eq(wordPairs.isSystem, true)))
    .orderBy(desc(wordPairs.rank), desc(wordPairs.createdAt))
}

export async function addWordPair(data: {
  userId: number
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: string
}): Promise<WordPair> {
  const [row] = await db
    .insert(wordPairs)
    .values({
      userId: data.userId,
      wordA: data.wordA.trim(),
      wordB: data.wordB.trim(),
      explanation: data.explanation.trim(),
      examples: data.examples,
      category: data.category,
    })
    .returning()
  return row
}

export async function deleteWordPair(id: number): Promise<void> {
  await db.delete(wordPairs).where(eq(wordPairs.id, id))
}

export async function updateWordPairRank(id: number, rank: number): Promise<void> {
  await db.update(wordPairs).set({ rank }).where(eq(wordPairs.id, id))
}
