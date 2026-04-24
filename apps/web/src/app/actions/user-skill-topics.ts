'use server'

import { revalidatePath } from 'next/cache'
import { toggleSkillFavorite } from '@/lib/db/user-skill-topics'

export async function toggleVocabFavoriteAction(topicName: string): Promise<void> {
  await toggleSkillFavorite('vocabulary', topicName)
  revalidatePath('/vocabulary')
}
