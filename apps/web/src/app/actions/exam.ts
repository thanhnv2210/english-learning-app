'use server'

import { db } from '@/lib/db'
import { mockExams, tags, examTags, type TranscriptMessage, type FeedbackResult } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/db/user'

// ─── Create / update exam ─────────────────────────────────────────────────────

export async function saveExam(input: {
  skill: string
  transcript: TranscriptMessage[]
  tagNames?: string[]
  cueCardId?: number
}) {
  const user = await getCurrentUser()
  const [exam] = await db
    .insert(mockExams)
    .values({
      userId: user.id,
      skill: input.skill,
      transcript: input.transcript,
      cueCardId: input.cueCardId,
    })
    .returning()

  if (input.tagNames?.length) {
    await linkTags(exam.id, input.tagNames)
  }

  revalidatePath('/history')
  return { id: exam.id }
}

export async function updateExamTranscript(examId: number, transcript: TranscriptMessage[]) {
  const user = await getCurrentUser()
  await db.update(mockExams).set({ transcript })
    .where(and(eq(mockExams.id, examId), eq(mockExams.userId, user.id)))
  revalidatePath('/history')
}

export async function saveFeedback(examId: number, feedback: FeedbackResult) {
  const user = await getCurrentUser()
  await db.update(mockExams).set({ feedback })
    .where(and(eq(mockExams.id, examId), eq(mockExams.userId, user.id)))
  revalidatePath('/history')
}

// ─── Favorites & tags ─────────────────────────────────────────────────────────

export async function toggleFavorite(examId: number) {
  const user = await getCurrentUser()
  const [exam] = await db.select().from(mockExams)
    .where(and(eq(mockExams.id, examId), eq(mockExams.userId, user.id)))
  if (!exam) return
  await db.update(mockExams).set({ isFavorite: !exam.isFavorite })
    .where(and(eq(mockExams.id, examId), eq(mockExams.userId, user.id)))
  revalidatePath('/history')
}

export async function addTagToExam(examId: number, tagName: string) {
  const trimmed = tagName.trim().toLowerCase()
  if (!trimmed) return

  const [tag] = await db
    .insert(tags)
    .values({ name: trimmed })
    .onConflictDoUpdate({ target: tags.name, set: { name: trimmed } })
    .returning()

  await db.insert(examTags).values({ examId, tagId: tag.id }).onConflictDoNothing()
  revalidatePath('/history')
}

export async function removeTagFromExam(examId: number, tagId: number) {
  await db.delete(examTags).where(and(eq(examTags.examId, examId), eq(examTags.tagId, tagId)))
  revalidatePath('/history')
}

// ─── Internal ─────────────────────────────────────────────────────────────────

async function linkTags(examId: number, tagNames: string[]) {
  for (const name of tagNames) {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) continue
    const [tag] = await db
      .insert(tags)
      .values({ name: trimmed })
      .onConflictDoUpdate({ target: tags.name, set: { name: trimmed } })
      .returning()
    await db.insert(examTags).values({ examId, tagId: tag.id }).onConflictDoNothing()
  }
}
