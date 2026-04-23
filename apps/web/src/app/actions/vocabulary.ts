'use server'

import { revalidatePath } from 'next/cache'
import {
  saveVocabularyWord,
  deleteVocabularyWord,
  updateVocabularyRank,
  type VocabularyCard,
} from '@/lib/db/vocabulary'

export async function addWordToLibrary(card: VocabularyCard): Promise<{ ok: boolean }> {
  const result = await saveVocabularyWord({
    word: card.word,
    definition: card.definition,
    familyWords: card.familyWords,
    synonyms: card.synonyms,
    collocations: card.collocations,
    examples: card.examples,
    domainNames: card.domains,
    userAdded: true,
  })
  return { ok: result !== null }
}

export async function deleteVocabularyWordAction(id: number): Promise<void> {
  await deleteVocabularyWord(id)
  revalidatePath('/vocabulary')
}

export async function updateVocabularyRankAction(id: number, rank: number): Promise<void> {
  await updateVocabularyRank(id, rank)
  revalidatePath('/vocabulary')
}
