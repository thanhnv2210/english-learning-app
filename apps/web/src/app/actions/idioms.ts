'use server'

import { revalidatePath } from 'next/cache'
import {
  saveIdiom,
  getAllIdioms,
  updateIdiomSkills,
  updateIdiomContexts,
  updateIdiomRank,
  updateUserIdiomRank,
  deleteIdiom,
  removeFromUserIdioms,
  getUserCountForIdiom,
  type IdiomCard,
} from '@/lib/db/idioms'
import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/db/user'

export async function saveIdiomAction(data: {
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
}): Promise<IdiomCard | null> {
  const user = await getCurrentUser()
  const result = await saveIdiom({ ...data, userId: user.id })
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
  return result
}

export async function listIdiomAction(): Promise<IdiomCard[]> {
  const user = await getCurrentUser()
  return getAllIdioms(user.id, user.role === 'admin', user.showSystemData)
}

export async function updateIdiomSkillsAction(id: number, skills: IdiomSkill[]): Promise<void> {
  const user = await getCurrentUser()
  if (user.role !== 'admin') return
  await updateIdiomSkills(id, skills)
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function updateIdiomContextsAction(id: number, contexts: IdiomContext[]): Promise<void> {
  const user = await getCurrentUser()
  if (user.role !== 'admin') return
  await updateIdiomContexts(id, contexts)
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function updateIdiomRankAction(id: number, rank: number): Promise<void> {
  const user = await getCurrentUser()
  if (user.role === 'admin') {
    await updateIdiomRank(id, rank)
  } else {
    await updateUserIdiomRank(user.id, id, rank)
  }
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function deleteIdiomAction(id: number): Promise<void> {
  const user = await getCurrentUser()
  if (user.role === 'admin') {
    await deleteIdiom(id)
  } else {
    await removeFromUserIdioms(user.id, id)
  }
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function getIdiomUserCountAction(id: number): Promise<number> {
  return getUserCountForIdiom(id)
}
