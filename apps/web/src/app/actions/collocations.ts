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
  return saveCollocation(data)
}

export async function listCollocationAction(): Promise<CollocationCard[]> {
  return getAllCollocations()
}

export async function updateCollocationSkillsAction(
  id: number,
  skills: CollocationSkill[],
): Promise<void> {
  return updateCollocationSkills(id, skills)
}

export async function updateCollocationRankAction(id: number, rank: number): Promise<void> {
  await updateCollocationRank(id, rank)
  revalidatePath('/collocations')
}

export async function deleteCollocationAction(id: number): Promise<void> {
  await deleteCollocation(id)
  revalidatePath('/collocations')
}
