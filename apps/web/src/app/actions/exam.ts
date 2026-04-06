'use server'

import { db } from '@/lib/db'
import { mockExams, tags, examTags, type TranscriptMessage } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function saveExam(input: {
  skill: string
  transcript: TranscriptMessage[]
  tagNames?: string[]
}) {
  const [exam] = await db
    .insert(mockExams)
    .values({ skill: input.skill, transcript: input.transcript })
    .returning()

  if (input.tagNames?.length) {
    await linkTags(exam.id, input.tagNames)
  }

  revalidatePath('/history')
  return { id: exam.id }
}

export async function toggleFavorite(examId: number) {
  const [exam] = await db.select().from(mockExams).where(eq(mockExams.id, examId))
  if (!exam) return
  await db
    .update(mockExams)
    .set({ isFavorite: !exam.isFavorite })
    .where(eq(mockExams.id, examId))
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
  await db
    .delete(examTags)
    .where(and(eq(examTags.examId, examId), eq(examTags.tagId, tagId)))
  revalidatePath('/history')
}

// ─── Internal helper ──────────────────────────────────────────────────────────

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
