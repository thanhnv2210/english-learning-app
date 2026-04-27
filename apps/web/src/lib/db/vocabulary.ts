import { db } from '@/lib/db'
import { vocabularyWords, vocabularyWordDomains, writingDomains } from '@/lib/db/schema'
import { asc, eq, inArray, sql } from 'drizzle-orm'
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
}

/** All words in the catalogue, ordered alphabetically. Uses 2 queries (no N+1). */
export async function getAllVocabularyWords(): Promise<VocabularyCard[]> {
  const rows = await db.select().from(vocabularyWords).orderBy(asc(vocabularyWords.word))
  if (rows.length === 0) return []

  const allMappings = await db
    .select({ wordId: vocabularyWordDomains.wordId, domainName: writingDomains.name })
    .from(vocabularyWordDomains)
    .innerJoin(writingDomains, eq(vocabularyWordDomains.domainId, writingDomains.id))

  const domainsByWordId = new Map<number, string[]>()
  for (const { wordId, domainName } of allMappings) {
    const list = domainsByWordId.get(wordId) ?? []
    list.push(domainName)
    domainsByWordId.set(wordId, list)
  }

  return rows.map((row) => toCard(row, row.word, domainsByWordId.get(row.id) ?? [], 'db'))
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

export async function updateVocabularyRank(id: number, rank: number): Promise<void> {
  await db.update(vocabularyWords).set({ rank }).where(eq(vocabularyWords.id, id))
}

export async function saveWordPronunciation(id: number, pronunciation: VocabPronunciation): Promise<void> {
  await db.update(vocabularyWords).set({ pronunciation }).where(eq(vocabularyWords.id, id))
}

export async function updateWordType(id: number, wordType: string): Promise<void> {
  await db.update(vocabularyWords).set({ wordType }).where(eq(vocabularyWords.id, id))
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
    rank: row.rank,
    userAdded: row.userAdded,
    source,
  }
}
