import { db } from '@/lib/db'
import { vocabularyWords, vocabularyWordDomains, writingDomains, userVocabulary } from '@/lib/db/schema'
import { asc, desc, eq, inArray, sql, and } from 'drizzle-orm'
import type { VocabWordFamily, VocabSynonym, VocabExamples, VocabPronunciation } from '@/lib/db/schema'

export type VocabularyCard = {
  id: number
  originalWord: string
  word: string
  definition: string
  wordType: string | null
  familyWords: VocabWordFamily
  synonyms: VocabSynonym[]
  collocations: string[]
  examples: VocabExamples
  pronunciation: VocabPronunciation | null
  domains: string[]
  rank: number
  userAdded: boolean
  source: 'db' | 'ai'
  aiModel: string | null  // model that generated this word, null for seeded/manual
}

/** All words in the catalogue.
 *  - Admin: all words, sorted alphabetically, using global rank.
 *  - User (showSystemData=true): all words, sorted by personal rank DESC then alpha.
 *  - User (showSystemData=false): only words saved to user_vocabulary, same sort. */
export async function getAllVocabularyWords(isAdmin = true, showSystemData = true, userId?: number): Promise<VocabularyCard[]> {
  // Admin path — simple query, no join needed
  if (isAdmin) {
    const rows = await db.select().from(vocabularyWords).orderBy(asc(vocabularyWords.word))
    if (rows.length === 0) return []
    const domains = await getAllDomainMappings()
    return rows.map((row) => toCard(row, row.word, domains.get(row.id) ?? [], 'db'))
  }

  // Non-admin: join user_vocabulary to get personal rank (left join so unowned words get rank null)
  const joined = await db
    .select({
      word: vocabularyWords,
      userRank: userVocabulary.rank,
    })
    .from(vocabularyWords)
    .leftJoin(
      userVocabulary,
      and(eq(userVocabulary.wordId, vocabularyWords.id), userId !== undefined ? eq(userVocabulary.userId, userId) : sql`false`),
    )
    .where(
      !showSystemData && userId !== undefined
        ? inArray(vocabularyWords.id, db.select({ wordId: userVocabulary.wordId }).from(userVocabulary).where(eq(userVocabulary.userId, userId)))
        : undefined,
    )
    .orderBy(desc(sql`coalesce(${userVocabulary.rank}, 1)`), asc(vocabularyWords.word))

  if (joined.length === 0) return []
  const domains = await getAllDomainMappings()
  return joined.map(({ word: row, userRank }) =>
    toCard(row, row.word, domains.get(row.id) ?? [], 'db', undefined, userRank ?? row.rank)
  )
}

async function getAllDomainMappings(): Promise<Map<number, string[]>> {
  const allMappings = await db
    .select({ wordId: vocabularyWordDomains.wordId, domainName: writingDomains.name })
    .from(vocabularyWordDomains)
    .innerJoin(writingDomains, eq(vocabularyWordDomains.domainId, writingDomains.id))

  const map = new Map<number, string[]>()
  for (const { wordId, domainName } of allMappings) {
    const list = map.get(wordId) ?? []
    list.push(domainName)
    map.set(wordId, list)
  }
  return map
}

/** Look up a single word by exact match (case-insensitive). */
export async function findWord(word: string): Promise<VocabularyCard | null> {
  const rows = await db
    .select()
    .from(vocabularyWords)
    .where(sql`lower(${vocabularyWords.word}) = lower(${word})`)
    .limit(1)

  if (!rows[0]) return null

  const domains = await getDomainsForWord(rows[0].id)
  return toCard(rows[0], word, domains, 'db')
}

/** Look up multiple words at once. Returns only those found in DB. */
export async function findWords(words: string[]): Promise<Map<string, VocabularyCard>> {
  if (words.length === 0) return new Map()

  const lower = words.map((w) => w.toLowerCase())
  const rows = await db
    .select()
    .from(vocabularyWords)
    .where(inArray(sql`lower(${vocabularyWords.word})`, lower))

  const result = new Map<string, VocabularyCard>()
  for (const row of rows) {
    const domains = await getDomainsForWord(row.id)
    const original = words.find((w) => w.toLowerCase() === row.word.toLowerCase()) ?? row.word
    result.set(row.word.toLowerCase(), toCard(row, original, domains, 'db'))
  }
  return result
}

/** Save a new word to the global library. Returns null if the word already exists. */
export async function saveVocabularyWord(data: {
  word: string
  definition: string
  wordType?: string | null
  familyWords: VocabWordFamily
  synonyms: VocabSynonym[]
  collocations: string[]
  examples: VocabExamples
  pronunciation?: VocabPronunciation | null
  domainNames: string[]
  userAdded?: boolean
  aiModel?: string | null
}): Promise<VocabularyCard | null> {
  const [row] = await db
    .insert(vocabularyWords)
    .values({
      word: data.word,
      definition: data.definition,
      wordType: data.wordType ?? null,
      familyWords: data.familyWords,
      synonyms: data.synonyms,
      collocations: data.collocations,
      examples: data.examples,
      pronunciation: data.pronunciation ?? null,
      userAdded: data.userAdded ?? false,
      aiModel: data.aiModel ?? null,
    })
    .onConflictDoNothing()
    .returning()

  if (!row) return null // word already existed

  // Link to domains (ignore unknown domain names)
  if (data.domainNames.length > 0) {
    const domainRows = await db
      .select({ id: writingDomains.id, name: writingDomains.name })
      .from(writingDomains)
      .where(inArray(sql`lower(${writingDomains.name})`, data.domainNames.map((d) => d.toLowerCase())))

    if (domainRows.length > 0) {
      await db
        .insert(vocabularyWordDomains)
        .values(domainRows.map((d) => ({ wordId: row.id, domainId: d.id })))
        .onConflictDoNothing()
    }
  }

  return toCard(row, row.word, data.domainNames, 'db')
}

export async function deleteVocabularyWord(id: number): Promise<void> {
  await db.delete(vocabularyWords).where(eq(vocabularyWords.id, id))
}

/** Admin-only: update the global rank on the shared catalogue. */
export async function updateVocabularyRank(id: number, rank: number): Promise<void> {
  await db.update(vocabularyWords).set({ rank }).where(eq(vocabularyWords.id, id))
}

/** User: update the personal rank on their saved copy of the word. */
export async function updateUserVocabularyRank(userId: number, wordId: number, rank: number): Promise<void> {
  await db
    .update(userVocabulary)
    .set({ rank })
    .where(and(eq(userVocabulary.userId, userId), eq(userVocabulary.wordId, wordId)))
}

export async function saveWordPronunciation(id: number, pronunciation: VocabPronunciation): Promise<void> {
  await db.update(vocabularyWords).set({ pronunciation }).where(eq(vocabularyWords.id, id))
}

export async function updateWordType(id: number, wordType: string): Promise<void> {
  await db.update(vocabularyWords).set({ wordType }).where(eq(vocabularyWords.id, id))
}

/** Save a word to a user's personal vocabulary list. No-op if already saved. */
export async function saveToUserVocabulary(userId: number, wordId: number): Promise<void> {
  await db
    .insert(userVocabulary)
    .values({ userId, wordId })
    .onConflictDoNothing()
}

/** Check if a word is in the user's personal vocabulary list. */
export async function isInUserVocabulary(userId: number, wordId: number): Promise<boolean> {
  const rows = await db
    .select({ wordId: userVocabulary.wordId })
    .from(userVocabulary)
    .where(and(eq(userVocabulary.userId, userId), eq(userVocabulary.wordId, wordId)))
    .limit(1)
  return rows.length > 0
}

async function getDomainsForWord(wordId: number): Promise<string[]> {
  const rows = await db
    .select({ name: writingDomains.name })
    .from(vocabularyWordDomains)
    .innerJoin(writingDomains, eq(vocabularyWordDomains.domainId, writingDomains.id))
    .where(eq(vocabularyWordDomains.wordId, wordId))
  return rows.map((r) => r.name)
}

function toCard(
  row: typeof vocabularyWords.$inferSelect,
  originalWord: string,
  domains: string[],
  source: 'db' | 'ai',
  aiModelOverride?: string | null,
  rankOverride?: number,
): VocabularyCard {
  return {
    id: row.id,
    originalWord,
    word: row.word,
    definition: row.definition,
    wordType: row.wordType ?? null,
    familyWords: row.familyWords as VocabWordFamily,
    synonyms: row.synonyms as VocabSynonym[],
    collocations: row.collocations as string[],
    examples: row.examples as VocabExamples,
    pronunciation: (row.pronunciation as VocabPronunciation) ?? null,
    domains,
    rank: rankOverride ?? row.rank,
    userAdded: row.userAdded,
    source,
    aiModel: aiModelOverride !== undefined ? aiModelOverride : (row.aiModel ?? null),
  }
}
