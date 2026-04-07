import { db } from '@/lib/db'
import { vocabularyWords, vocabularyWordDomains, writingDomains } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import type { VocabWordFamily, VocabSynonym, VocabExamples } from '@/lib/db/schema'

export type VocabularyCard = {
  originalWord: string
  word: string
  definition: string
  familyWords: VocabWordFamily
  synonyms: VocabSynonym[]
  collocations: string[]
  examples: VocabExamples
  domains: string[]
  source: 'db' | 'ai'
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
    .where(sql`lower(${vocabularyWords.word}) = ANY(${lower})`)

  const result = new Map<string, VocabularyCard>()
  for (const row of rows) {
    const domains = await getDomainsForWord(row.id)
    const original = words.find((w) => w.toLowerCase() === row.word.toLowerCase()) ?? row.word
    result.set(row.word.toLowerCase(), toCard(row, original, domains, 'db'))
  }
  return result
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
    originalWord,
    word: row.word,
    definition: row.definition,
    familyWords: row.familyWords as VocabWordFamily,
    synonyms: row.synonyms as VocabSynonym[],
    collocations: row.collocations as string[],
    examples: row.examples as VocabExamples,
    domains,
    source,
  }
}
