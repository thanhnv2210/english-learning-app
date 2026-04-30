'use server'

import { revalidatePath } from 'next/cache'
import { addSpeakingPhrase, deleteSpeakingPhrase } from '@/lib/db/speaking-phrases'
import { getDefaultUser } from '@/lib/db/user'

export async function addSpeakingPhraseAction(data: {
  phrase: string
  category: string
  note?: string
}): Promise<{ ok: boolean }> {
  if (!data.phrase.trim()) return { ok: false }
  const user = await getDefaultUser()
  await addSpeakingPhrase({ userId: user.id, ...data })
  revalidatePath('/speaking/phrases')
  return { ok: true }
}

export async function deleteSpeakingPhraseAction(id: number): Promise<void> {
  const user = await getDefaultUser()
  await deleteSpeakingPhrase(id)
  revalidatePath('/speaking/phrases')
}
