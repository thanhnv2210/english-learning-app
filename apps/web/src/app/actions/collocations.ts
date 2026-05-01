'use server'

import { revalidatePath } from 'next/cache'
import {
  saveCollocation,
  getAllCollocations,
  updateCollocationSkills,
  updateCollocationRank,
  deleteCollocation,
  type CollocationCard,
} from '@/lib/db/collocations'
import type { CollocationSkill } from '@/lib/db/schema'

export async function saveCollocationAction(data: {
  phrase: string
  type: string
  explanation?: string
  skills: CollocationSkill[]
  examples: string[]
}): Promise<CollocationCard | null> {
  const result = await saveCollocation(data)
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
  return result
}

export async function listCollocationAction(): Promise<CollocationCard[]> {
  return getAllCollocations()
}

export async function updateCollocationSkillsAction(
  id: number,
  skills: CollocationSkill[],
): Promise<void> {
  await updateCollocationSkills(id, skills)
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
}

export async function updateCollocationRankAction(id: number, rank: number): Promise<void> {
  await updateCollocationRank(id, rank)
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
}

export async function deleteCollocationAction(id: number): Promise<void> {
  await deleteCollocation(id)
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
}
