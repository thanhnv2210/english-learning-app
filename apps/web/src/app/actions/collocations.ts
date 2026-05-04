'use server'

import { revalidatePath } from 'next/cache'
import {
  saveCollocation,
  getAllCollocations,
  updateCollocationSkills,
  updateCollocationRank,
  updateUserCollocationRank,
  deleteCollocation,
  removeFromUserCollocations,
  getUserCountForCollocation,
  type CollocationCard,
} from '@/lib/db/collocations'
import type { CollocationSkill } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/db/user'

export async function saveCollocationAction(data: {
  phrase: string
  type: string
  explanation?: string
  skills: CollocationSkill[]
  examples: string[]
}): Promise<CollocationCard | null> {
  const user = await getCurrentUser()
  const result = await saveCollocation({ ...data, userId: user.id })
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
  return result
}

export async function listCollocationAction(): Promise<CollocationCard[]> {
  const user = await getCurrentUser()
  return getAllCollocations(user.id, user.role === 'admin', user.showSystemData)
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
  const user = await getCurrentUser()
  if (user.role === 'admin') {
    await updateCollocationRank(id, rank)
  } else {
    await updateUserCollocationRank(user.id, id, rank)
  }
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
}

export async function deleteCollocationAction(id: number): Promise<void> {
  const user = await getCurrentUser()
  if (user.role === 'admin') {
    await deleteCollocation(id)
  } else {
    await removeFromUserCollocations(user.id, id)
  }
  revalidatePath('/collocations')
  revalidatePath('/collocations/practice', 'layout')
  revalidatePath('/essay-builder')
}

export async function getCollocationUserCountAction(id: number): Promise<number> {
  return getUserCountForCollocation(id)
}
