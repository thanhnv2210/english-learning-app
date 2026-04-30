'use server'

import { revalidatePath } from 'next/cache'
import { addPhrase, deletePhrase } from '@/lib/db/speaking-phrases'
import { getDefaultUser } from '@/lib/db/user'

export async function addPhraseAction(data: {
  phrase: string
  category: string
  skill: 'speaking' | 'writing'
  note?: string
}): Promise<{ ok: boolean }> {
  if (!data.phrase.trim()) return { ok: false }
  const user = await getDefaultUser()
  await addPhrase({ userId: user.id, ...data })
  revalidatePath(`/${data.skill}/phrases`)
  return { ok: true }
}

export async function deletePhraseAction(id: number, skill: 'speaking' | 'writing'): Promise<void> {
  await deletePhrase(id)
  revalidatePath(`/${skill}/phrases`)
}
