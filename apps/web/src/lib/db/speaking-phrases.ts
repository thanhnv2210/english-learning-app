import { db } from '@/lib/db'
import { speakingPhrases } from '@/lib/db/schema'
import { eq, or, and, desc } from 'drizzle-orm'

export { PHRASE_CATEGORIES, SPEAKING_PHRASE_CATEGORIES, WRITING_PHRASE_CATEGORIES } from '@/lib/ielts/speaking/phrase-categories'
export type { PhraseCategory, SpeakingPhraseCategory, WritingPhraseCategory } from '@/lib/ielts/speaking/phrase-categories'

export type SpeakingPhrase = {
  id: number
  userId: number | null
  phrase: string
  category: string
  skill: string
  note: string | null
  isSystem: boolean
  createdAt: Date
}

/** Returns system phrases + phrases owned by the given user for a given skill, newest first. */
export async function getPhrases(userId: number, skill: 'speaking' | 'writing'): Promise<SpeakingPhrase[]> {
  return db
    .select()
    .from(speakingPhrases)
    .where(
      and(
        eq(speakingPhrases.skill, skill),
        or(eq(speakingPhrases.userId, userId), eq(speakingPhrases.isSystem, true)),
      )
    )
    .orderBy(desc(speakingPhrases.createdAt))
}

export async function addPhrase(data: {
  userId: number
  phrase: string
  category: string
  skill: 'speaking' | 'writing'
  note?: string
}): Promise<SpeakingPhrase> {
  const [row] = await db
    .insert(speakingPhrases)
    .values({
      userId: data.userId,
      phrase: data.phrase,
      category: data.category,
      skill: data.skill,
      note: data.note ?? null,
    })
    .returning()
  return row
}

export async function deletePhrase(id: number): Promise<void> {
  await db
    .delete(speakingPhrases)
    .where(eq(speakingPhrases.id, id))
}
