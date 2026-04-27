import { db } from '@/lib/db'
import { wordSentences, vocabularyWords } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export { SENTENCE_CONTEXTS } from '@/lib/ielts/vocabulary/sentence-contexts'
export type { SentenceContext } from '@/lib/ielts/vocabulary/sentence-contexts'

export type WordSentence = {
  id: number
  wordId: number
  sentence: string
  context: string
  createdAt: Date
}

export type WordSentenceWithWord = WordSentence & {
  word: string
  wordType: string | null
}

export async function getSentencesForWord(wordId: number): Promise<WordSentence[]> {
  const rows = await db
    .select()
    .from(wordSentences)
    .where(eq(wordSentences.wordId, wordId))
    .orderBy(desc(wordSentences.createdAt))
  return rows
}

export async function getWordById(id: number) {
  const rows = await db
    .select()
    .from(vocabularyWords)
    .where(eq(vocabularyWords.id, id))
    .limit(1)
  return rows[0] ?? null
}

export async function addSentence(data: {
  wordId: number
  sentence: string
  context: string
}): Promise<WordSentence> {
  const [row] = await db
    .insert(wordSentences)
    .values(data)
    .returning()
  return row
}

export async function deleteSentence(id: number): Promise<void> {
  await db.delete(wordSentences).where(eq(wordSentences.id, id))
}

/** All sentences across all words — used by games for random sampling. */
export async function getAllSentences(): Promise<WordSentenceWithWord[]> {
  const rows = await db
    .select({
      id: wordSentences.id,
      wordId: wordSentences.wordId,
      sentence: wordSentences.sentence,
      context: wordSentences.context,
      createdAt: wordSentences.createdAt,
      word: vocabularyWords.word,
      wordType: vocabularyWords.wordType,
    })
    .from(wordSentences)
    .innerJoin(vocabularyWords, eq(wordSentences.wordId, vocabularyWords.id))
    .orderBy(desc(wordSentences.createdAt))
  return rows
}
