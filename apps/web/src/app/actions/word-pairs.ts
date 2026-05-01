'use server'

import { revalidatePath } from 'next/cache'
import { getDefaultUser } from '@/lib/db/user'
import { addWordPair, deleteWordPair, updateWordPairRank, type WordPair } from '@/lib/db/word-pairs'

export async function addWordPairAction(data: {
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: string
}): Promise<WordPair> {
  const user = await getDefaultUser()
  const result = await addWordPair({ ...data, userId: user.id })
  revalidatePath('/word-pairs')
  return result
}

export async function deleteWordPairAction(id: number): Promise<void> {
  await deleteWordPair(id)
  revalidatePath('/word-pairs')
}

export async function updateWordPairRankAction(id: number, rank: number): Promise<void> {
  await updateWordPairRank(id, rank)
  revalidatePath('/word-pairs')
}
