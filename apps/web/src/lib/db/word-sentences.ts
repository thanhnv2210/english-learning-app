import { db } from '@/lib/db'
import { wordSentences, vocabularyWords, sentencePracticeSessions, sentencePracticeResults, userVocabulary } from '@/lib/db/schema'
import { eq, desc, inArray, or, isNull, and } from 'drizzle-orm'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

export { SENTENCE_CONTEXTS } from '@/lib/ielts/vocabulary/sentence-contexts'
export type { SentenceContext } from '@/lib/ielts/vocabulary/sentence-contexts'

export type WordSentence = {
  id: number
  wordId: number
  userId: number | null
  sentence: string
  context: string
  createdAt: Date
}

export type WordSentenceWithWord = WordSentence & {
  word: string
  wordType: string | null
}

export async function getSentencesForWord(
  wordId: number,
  userId: number,
  isAdmin = false,
  showSystemData = true,
): Promise<WordSentence[]> {
  const wordFilter = eq(wordSentences.wordId, wordId)
  let visFilter
  if (!isAdmin) {
    if (showSystemData) {
      visFilter = or(isNull(wordSentences.userId), eq(wordSentences.userId, userId))
    } else {
      visFilter = eq(wordSentences.userId, userId)
    }
  }
  const rows = await db
    .select()
    .from(wordSentences)
    .where(visFilter ? and(wordFilter, visFilter) : wordFilter)
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
  userId: number
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

/** All sentences across all words — used by games and vocabulary page. */
export async function getAllSentences(
  userId?: number,
  isAdmin = true,
  showSystemData = true,
): Promise<WordSentenceWithWord[]> {
  let visFilter
  if (!isAdmin && userId !== undefined) {
    if (showSystemData) {
      visFilter = or(isNull(wordSentences.userId), eq(wordSentences.userId, userId))
    } else {
      // Only my sentences, and only for words I've saved
      const savedWordIds = db
        .select({ wordId: userVocabulary.wordId })
        .from(userVocabulary)
        .where(eq(userVocabulary.userId, userId))
      visFilter = and(
        eq(wordSentences.userId, userId),
        inArray(wordSentences.wordId, savedWordIds),
      )
    }
  }
  const rows = await db
    .select({
      id: wordSentences.id,
      wordId: wordSentences.wordId,
      userId: wordSentences.userId,
      sentence: wordSentences.sentence,
      context: wordSentences.context,
      createdAt: wordSentences.createdAt,
      word: vocabularyWords.word,
      wordType: vocabularyWords.wordType,
    })
    .from(wordSentences)
    .innerJoin(vocabularyWords, eq(wordSentences.wordId, vocabularyWords.id))
    .where(visFilter)
    .orderBy(desc(wordSentences.createdAt))
  return rows
}

/**
 * Returns sentence IDs where the most recent practice result was wrong,
 * scoped to the given user's practice sessions.
 */
export async function getWrongSentenceIds(userId: number): Promise<Set<number>> {
  const results = await db
    .select({
      sentenceId: sentencePracticeResults.sentenceId,
      correct: sentencePracticeResults.correct,
      createdAt: sentencePracticeResults.createdAt,
    })
    .from(sentencePracticeResults)
    .innerJoin(
      sentencePracticeSessions,
      eq(sentencePracticeResults.sessionId, sentencePracticeSessions.id),
    )
    .where(eq(sentencePracticeSessions.userId, userId))
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
export async function getVocabPracticeItems(
  userId?: number,
  isAdmin = true,
  showSystemData = true,
): Promise<PracticeItem[]> {
  const rows = await getAllSentences(userId, isAdmin, showSystemData)
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
export async function getWrongVocabPracticeItems(
  userId: number,
  isAdmin = true,
  showSystemData = true,
): Promise<PracticeItem[]> {
  const wrongIds = await getWrongSentenceIds(userId)
  if (wrongIds.size === 0) return []

  // Apply same visibility filter as getAllSentences
  let visFilter
  if (!isAdmin) {
    if (showSystemData) {
      visFilter = or(isNull(wordSentences.userId), eq(wordSentences.userId, userId))
    } else {
      const savedWordIds = db
        .select({ wordId: userVocabulary.wordId })
        .from(userVocabulary)
        .where(eq(userVocabulary.userId, userId))
      visFilter = and(
        eq(wordSentences.userId, userId),
        inArray(wordSentences.wordId, savedWordIds),
      )
    }
  }

  const rows = await db
    .select({
      id: wordSentences.id,
      wordId: wordSentences.wordId,
      userId: wordSentences.userId,
      sentence: wordSentences.sentence,
      context: wordSentences.context,
      createdAt: wordSentences.createdAt,
      word: vocabularyWords.word,
      wordType: vocabularyWords.wordType,
    })
    .from(wordSentences)
    .innerJoin(vocabularyWords, eq(wordSentences.wordId, vocabularyWords.id))
    .where(
      visFilter
        ? and(inArray(wordSentences.id, [...wrongIds]), visFilter)
        : inArray(wordSentences.id, [...wrongIds]),
    )

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
