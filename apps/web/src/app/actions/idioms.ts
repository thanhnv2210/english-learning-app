'use server'

import { revalidatePath } from 'next/cache'
import {
  saveIdiom,
  getAllIdioms,
  updateIdiomSkills,
  updateIdiomContexts,
  updateIdiomRank,
  deleteIdiom,
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
  await updateIdiomSkills(id, skills)
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function updateIdiomContextsAction(id: number, contexts: IdiomContext[]): Promise<void> {
  await updateIdiomContexts(id, contexts)
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function updateIdiomRankAction(id: number, rank: number): Promise<void> {
  await updateIdiomRank(id, rank)
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}

export async function deleteIdiomAction(id: number): Promise<void> {
  const user = await getCurrentUser()
  await deleteIdiom(id, user.id, user.role === 'admin')
  revalidatePath('/idioms')
  revalidatePath('/idioms/practice', 'layout')
}
