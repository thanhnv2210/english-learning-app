'use server'

import { revalidatePath } from 'next/cache'
import {
  saveVocabularyWord,
  deleteVocabularyWord,
  updateVocabularyRank,
  saveWordPronunciation,
  type VocabularyCard,
} from '@/lib/db/vocabulary'
import type { VocabPronunciation } from '@/lib/db/schema'

export async function addWordToLibrary(card: VocabularyCard): Promise<{ ok: boolean }> {
  const result = await saveVocabularyWord({
    word: card.word,
    definition: card.definition,
    familyWords: card.familyWords,
    synonyms: card.synonyms,
    collocations: card.collocations,
    examples: card.examples,
    pronunciation: card.pronunciation,
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

// Merges UK/US IPA text with any existing audio URLs so API-fetched audio is preserved
export async function updateWordPronunciationAction(
  id: number,
  uk: string,
  us: string,
  existing: VocabPronunciation | null,
): Promise<void> {
  const pronunciation: VocabPronunciation = {
    uk,
    us,
    ukAudio: existing?.ukAudio,
    usAudio: existing?.usAudio,
  }
  await saveWordPronunciation(id, pronunciation)
  revalidatePath('/vocabulary')
}
