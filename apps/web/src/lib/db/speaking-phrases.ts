import { db } from '@/lib/db'
import { speakingPhrases } from '@/lib/db/schema'
import { eq, or, desc } from 'drizzle-orm'

export { PHRASE_CATEGORIES } from '@/lib/ielts/speaking/phrase-categories'
export type { PhraseCategory } from '@/lib/ielts/speaking/phrase-categories'

export type SpeakingPhrase = {
  id: number
  userId: number | null
  phrase: string
  category: string
  note: string | null
  isSystem: boolean
  createdAt: Date
}

/** Returns system phrases + phrases owned by the given user, newest first. */
export async function getSpeakingPhrases(userId: number): Promise<SpeakingPhrase[]> {
  return db
    .select()
    .from(speakingPhrases)
    .where(or(eq(speakingPhrases.userId, userId), eq(speakingPhrases.isSystem, true)))
    .orderBy(desc(speakingPhrases.createdAt))
}

export async function addSpeakingPhrase(data: {
  userId: number
  phrase: string
  category: string
  note?: string
}): Promise<SpeakingPhrase> {
  const [row] = await db
    .insert(speakingPhrases)
    .values({
      userId: data.userId,
      phrase: data.phrase,
      category: data.category,
      note: data.note ?? null,
    })
    .returning()
  return row
}

export async function deleteSpeakingPhrase(id: number): Promise<void> {
  await db
    .delete(speakingPhrases)
    .where(eq(speakingPhrases.id, id))
}
