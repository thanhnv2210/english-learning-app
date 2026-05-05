import { db } from '@/lib/db'
import { wordReviewStates, vocabularyWords } from '@/lib/db/schema'
import { and, eq, lte, sql } from 'drizzle-orm'
import { sm2, type ReviewQuality } from '@/lib/srs'

export type { ReviewQuality } from '@/lib/srs'
export { sm2 } from '@/lib/srs'

export type ReviewState = typeof wordReviewStates.$inferSelect
export type ReviewWord = typeof vocabularyWords.$inferSelect & {
  reviewState: ReviewState | null
}

/** Get all words due for review (nextReview <= now), with word data. */
export async function getDueReviewWords(userId: number, limit = 20): Promise<ReviewWord[]> {
  const now = new Date()
  const rows = await db
    .select()
    .from(vocabularyWords)
    .innerJoin(wordReviewStates, and(
      eq(wordReviewStates.wordId, vocabularyWords.id),
      eq(wordReviewStates.userId, userId),
    ))
    .where(lte(wordReviewStates.nextReview, now))
    .limit(limit)

  return rows.map((r) => ({ ...r.vocabulary_words, reviewState: r.word_review_states }))
}

/** Count of words due for review right now. */
export async function getDueReviewCount(userId: number): Promise<number> {
  const now = new Date()
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(wordReviewStates)
    .where(and(eq(wordReviewStates.userId, userId), lte(wordReviewStates.nextReview, now)))
  return row?.count ?? 0
}

/** Enrol a word for SRS (idempotent — does nothing if already enrolled). */
export async function enrolWord(userId: number, wordId: number): Promise<void> {
  await db
    .insert(wordReviewStates)
    .values({ userId, wordId })
    .onConflictDoNothing()
}

/** Record a review result and update SRS state. */
export async function recordReview(userId: number, wordId: number, quality: ReviewQuality): Promise<void> {
  const existing = await db
    .select()
    .from(wordReviewStates)
    .where(and(eq(wordReviewStates.userId, userId), eq(wordReviewStates.wordId, wordId)))
    .limit(1)

  const current = existing[0] ?? { interval: 1, easeFactor: 2.5, repetitions: 0 }
  const next = sm2(quality, current)

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + next.interval)

  if (existing[0]) {
    await db
      .update(wordReviewStates)
      .set({
        interval: next.interval,
        easeFactor: next.easeFactor,
        repetitions: next.repetitions,
        nextReview: nextReviewDate,
        lastReview: new Date(),
      })
      .where(and(eq(wordReviewStates.userId, userId), eq(wordReviewStates.wordId, wordId)))
  } else {
    await db.insert(wordReviewStates).values({
      userId,
      wordId,
      interval: next.interval,
      easeFactor: next.easeFactor,
      repetitions: next.repetitions,
      nextReview: nextReviewDate,
      lastReview: new Date(),
    })
  }
}

/** Total number of words enrolled in SRS for this user. */
export async function getEnrolledCount(userId: number): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(wordReviewStates)
    .where(eq(wordReviewStates.userId, userId))
  return row?.count ?? 0
}
