import { db } from '@/lib/db'
import { wordPairs } from '@/lib/db/schema'
import { eq, or, and, desc } from 'drizzle-orm'

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

export async function getWordPairs(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<WordPair[]> {
  const visibilityFilter = isAdmin
    ? undefined
    : showSystemData
      ? or(eq(wordPairs.isSystem, true), eq(wordPairs.userId, userId))
      : and(eq(wordPairs.isSystem, false), eq(wordPairs.userId, userId))

  return db
    .select()
    .from(wordPairs)
    .where(visibilityFilter)
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

/** All pairs in the library where either wordA or wordB matches the query word. */
export async function getWordPairsForWord(userId: number, isAdmin: boolean, showSystemData: boolean, word: string): Promise<WordPair[]> {
  const w = word.toLowerCase()
  const visibilityFilter = isAdmin
    ? undefined
    : showSystemData
      ? or(eq(wordPairs.isSystem, true), eq(wordPairs.userId, userId))
      : and(eq(wordPairs.isSystem, false), eq(wordPairs.userId, userId))

  return db
    .select()
    .from(wordPairs)
    .where(
      and(
        or(eq(wordPairs.wordA, w), eq(wordPairs.wordB, w)),
        visibilityFilter,
      ),
    )
    .orderBy(desc(wordPairs.rank), desc(wordPairs.createdAt))
}

/** Check if a pair (in either direction) already exists in the library. */
export async function findWordPair(
  userId: number,
  wordA: string,
  wordB: string,
): Promise<WordPair | null> {
  const a = wordA.toLowerCase()
  const b = wordB.toLowerCase()
  const rows = await db
    .select()
    .from(wordPairs)
    .where(
      or(
        and(eq(wordPairs.wordA, a), eq(wordPairs.wordB, b)),
        and(eq(wordPairs.wordA, b), eq(wordPairs.wordB, a)),
      ),
    )
    .limit(1)
  return rows[0] ?? null
}
