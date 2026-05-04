'use server'

import { revalidatePath } from 'next/cache'
import {
  createBank,
  deleteBank,
  updateBankRank,
  addWordToBank,
  addWordsToBank,
  removeWordFromBank,
  type VocabBank,
  type VocabBankWord,
} from '@/lib/db/vocab-banks'
import { getCurrentUser } from '@/lib/db/user'

export async function createBankAction(data: {
  topic: string
  description: string
  words: { word: string; type: string; meaning: string; example: string }[]
}): Promise<VocabBank> {
  const user = await getCurrentUser()
  const bank = await createBank({ userId: user.id, topic: data.topic, description: data.description })
  await addWordsToBank(bank.id, data.words)
  revalidatePath('/vocab-banks')
  return bank
}

export async function deleteBankAction(id: number): Promise<void> {
  const user = await getCurrentUser()
  await deleteBank(id, user.id, user.role === 'admin')
  revalidatePath('/vocab-banks')
}

export async function updateBankRankAction(id: number, rank: number): Promise<void> {
  await updateBankRank(id, rank)
  revalidatePath('/vocab-banks')
}

export async function addWordAction(data: {
  bankId: number
  word: string
  type: string
  meaning: string
  example: string
}): Promise<VocabBankWord> {
  const word = await addWordToBank(data)
  revalidatePath(`/vocab-banks/${data.bankId}`)
  return word
}

export async function removeWordAction(wordId: number, bankId: number): Promise<void> {
  await removeWordFromBank(wordId)
  revalidatePath(`/vocab-banks/${bankId}`)
}
