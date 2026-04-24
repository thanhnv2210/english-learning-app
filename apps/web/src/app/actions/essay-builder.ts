'use server'

import { revalidatePath } from 'next/cache'
import {
  saveEssayBuilderRecord,
  getVersionsByDomainSkill,
  updateEssayDecoratedText,
  updateEssaySelections,
  toggleEssayFavorite,
  deleteEssayBuilderRecord,
  getEssayBuilderConfig,
  upsertEssayBuilderConfig,
  type EssayBuilderRecord,
  type EssayBuilderConfig,
} from '@/lib/db/essay-builder'

export async function getVersionsAction(domain: string, skill: string): Promise<EssayBuilderRecord[]> {
  return getVersionsByDomainSkill(domain, skill, 5)
}

export async function getEssayBuilderConfigAction(
  domain: string,
  skill: string,
): Promise<EssayBuilderConfig | null> {
  return getEssayBuilderConfig(domain, skill)
}

export async function saveEssayBuilderConfigAction(
  domain: string,
  skill: string,
  selectedVocabulary: string[],
  selectedCollocations: string[],
): Promise<void> {
  await upsertEssayBuilderConfig(domain, skill, selectedVocabulary, selectedCollocations)
}

export async function saveEssayAction(
  data: Omit<EssayBuilderRecord, 'id' | 'createdAt'>,
): Promise<EssayBuilderRecord> {
  const record = await saveEssayBuilderRecord(data)
  revalidatePath('/essay-builder')
  return record
}

export async function updateDecoratedTextAction(id: number, decoratedText: string): Promise<void> {
  await updateEssayDecoratedText(id, decoratedText)
  revalidatePath('/essay-builder')
}

export async function updateEssaySelectionsAction(
  id: number,
  selectedVocabulary: string[],
  selectedCollocations: string[],
): Promise<void> {
  await updateEssaySelections(id, selectedVocabulary, selectedCollocations)
  revalidatePath('/essay-builder')
}

export async function toggleEssayFavoriteAction(id: number, isFavorite: boolean): Promise<void> {
  await toggleEssayFavorite(id, isFavorite)
  revalidatePath('/essay-builder')
}

export async function deleteEssayAction(id: number): Promise<void> {
  await deleteEssayBuilderRecord(id)
  revalidatePath('/essay-builder')
}
