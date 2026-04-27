'use server'

import { revalidatePath } from 'next/cache'
import { addSentence, deleteSentence } from '@/lib/db/word-sentences'

export async function addSentenceAction(data: {
  wordId: number
  sentence: string
  context: string
}): Promise<{ ok: boolean }> {
  if (!data.sentence.trim() || !data.context) return { ok: false }
  await addSentence(data)
  revalidatePath(`/vocabulary/${data.wordId}/sentences`)
  return { ok: true }
}

export async function deleteSentenceAction(id: number, wordId: number): Promise<void> {
  await deleteSentence(id)
  revalidatePath(`/vocabulary/${wordId}/sentences`)
}
