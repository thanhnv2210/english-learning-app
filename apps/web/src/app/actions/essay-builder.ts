'use server'

import { revalidatePath } from 'next/cache'
import {
  saveEssayBuilderRecord,
  updateEssayDecoratedText,
  toggleEssayFavorite,
  deleteEssayBuilderRecord,
  type EssayBuilderRecord,
} from '@/lib/db/essay-builder'

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

export async function toggleEssayFavoriteAction(id: number, isFavorite: boolean): Promise<void> {
  await toggleEssayFavorite(id, isFavorite)
  revalidatePath('/essay-builder')
}

export async function deleteEssayAction(id: number): Promise<void> {
  await deleteEssayBuilderRecord(id)
  revalidatePath('/essay-builder')
}
