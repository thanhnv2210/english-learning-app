'use server'

import { saveVocabularyWord } from '@/lib/db/vocabulary'
import type { VocabularyCard } from '@/lib/db/vocabulary'

export async function addWordToLibrary(card: VocabularyCard): Promise<{ ok: boolean }> {
  const result = await saveVocabularyWord({
    word: card.word,
    definition: card.definition,
    familyWords: card.familyWords,
    synonyms: card.synonyms,
    collocations: card.collocations,
    examples: card.examples,
    domainNames: card.domains,
  })
  return { ok: result !== null }
}
