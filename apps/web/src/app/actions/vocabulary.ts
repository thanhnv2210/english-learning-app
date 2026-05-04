'use server'

import { revalidatePath } from 'next/cache'
import { generateText } from 'ai'
import { ollamaModel, OLLAMA_ENABLED } from '@/lib/ai-client'
import {
  saveVocabularyWord,
  findWord,
  saveToUserVocabulary,
  deleteVocabularyWord,
  updateVocabularyRank,
  saveWordPronunciation,
  updateWordType,
  type VocabularyCard,
} from '@/lib/db/vocabulary'
import { getCurrentUser } from '@/lib/db/user'
import type { VocabPronunciation } from '@/lib/db/schema'

const VALID_TYPES = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'conjunction', 'preposition']

export async function addWordToLibrary(card: VocabularyCard): Promise<{ ok: boolean }> {
  const user = await getCurrentUser()

  // Save to shared catalogue (no-op if already exists)
  const saved = await saveVocabularyWord({
    word: card.word,
    definition: card.definition,
    wordType: card.wordType,
    familyWords: card.familyWords,
    synonyms: card.synonyms,
    collocations: card.collocations,
    examples: card.examples,
    pronunciation: card.pronunciation,
    domainNames: card.domains,
    userAdded: true,
    aiModel: card.aiModel ?? null,
  })

  // Resolve wordId — either newly inserted or already in catalogue
  const wordId = saved?.id ?? (await findWord(card.word))?.id
  if (wordId) await saveToUserVocabulary(user.id, wordId)

  revalidatePath('/vocabulary')
  revalidatePath('/essay-builder')
  return { ok: true }
}

export async function deleteVocabularyWordAction(id: number): Promise<void> {
  await deleteVocabularyWord(id)
  revalidatePath('/vocabulary')
  revalidatePath('/essay-builder')
}

export async function updateVocabularyRankAction(id: number, rank: number): Promise<void> {
  await updateVocabularyRank(id, rank)
  revalidatePath('/vocabulary')
  revalidatePath('/essay-builder')
}

export async function updateWordTypeAction(id: number, wordType: string): Promise<void> {
  await updateWordType(id, wordType)
  revalidatePath('/vocabulary')
  revalidatePath('/essay-builder')
}

export async function detectWordTypeAction(
  id: number,
  word: string,
  definition: string,
): Promise<{ wordType: string | null; error?: string }> {
  if (!OLLAMA_ENABLED) return { wordType: null, error: 'AI is disabled' }

  const prompt = `What is the primary part of speech for the English word "${word}"?
Definition: "${definition}"

Reply with ONLY one of these values — nothing else:
noun, verb, adjective, adverb, phrase, conjunction, preposition`

  try {
    const { text } = await generateText({ model: ollamaModel(), prompt })
    const result = text.trim().toLowerCase().replace(/[^a-z]/g, '')
    const wordType = VALID_TYPES.includes(result) ? result : null
    if (wordType && id > 0) {
      await updateWordType(id, wordType)
      revalidatePath('/vocabulary')
    }
    return { wordType }
  } catch {
    return { wordType: null, error: 'AI request failed' }
  }
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
