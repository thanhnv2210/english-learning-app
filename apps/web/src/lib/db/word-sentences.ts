import { db } from '@/lib/db'
import { wordSentences, vocabularyWords, sentencePracticeSessions, sentencePracticeResults } from '@/lib/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

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

export async function createPracticeSession(userId: number, gameType: string): Promise<number> {
  const [row] = await db
    .insert(sentencePracticeSessions)
    .values({ userId, gameType })
    .returning({ id: sentencePracticeSessions.id })
  return row.id
}

export async function logPracticeResult(
  sessionId: number,
  sentenceId: number,
  correct: boolean,
  timeMs?: number,
): Promise<void> {
  await db
    .insert(sentencePracticeResults)
    .values({ sessionId, sentenceId, correct, timeMs: timeMs ?? null })
}

export async function completePracticeSession(sessionId: number, score: number): Promise<void> {
  await db
    .update(sentencePracticeSessions)
    .set({ score, completedAt: new Date() })
    .where(eq(sentencePracticeSessions.id, sessionId))
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

/**
 * Returns sentence IDs where the most recent practice result was wrong.
 * Once a sentence is answered correctly, it drops off the list.
 */
export async function getWrongSentenceIds(): Promise<Set<number>> {
  const results = await db
    .select({
      sentenceId: sentencePracticeResults.sentenceId,
      correct: sentencePracticeResults.correct,
      createdAt: sentencePracticeResults.createdAt,
    })
    .from(sentencePracticeResults)
    .orderBy(desc(sentencePracticeResults.createdAt))

  const latestPerSentence = new Map<number, boolean>()
  for (const r of results) {
    if (!latestPerSentence.has(r.sentenceId)) {
      latestPerSentence.set(r.sentenceId, r.correct ?? false)
    }
  }

  return new Set(
    [...latestPerSentence.entries()]
      .filter(([, correct]) => !correct)
      .map(([id]) => id),
  )
}

/** Convert vocabulary sentences to the shared PracticeItem format. */
export async function getVocabPracticeItems(): Promise<PracticeItem[]> {
  const rows = await getAllSentences()
  return rows.map((r) => ({
    id: `vocab-${r.id}`,
    sentence: r.sentence,
    answer: r.word,
    hint: r.wordType,
    context: r.context,
    source: 'vocabulary' as const,
    sentenceId: r.id,
  }))
}

/** Sentences where the most recent attempt was wrong — for targeted review. */
export async function getWrongVocabPracticeItems(): Promise<PracticeItem[]> {
  const wrongIds = await getWrongSentenceIds()
  if (wrongIds.size === 0) return []

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
    .where(inArray(wordSentences.id, [...wrongIds]))

  return rows.map((r) => ({
    id: `vocab-wrong-${r.id}`,
    sentence: r.sentence,
    answer: r.word,
    hint: r.wordType,
    context: r.context,
    source: 'vocabulary' as const,
    sentenceId: r.id,
  }))
}
