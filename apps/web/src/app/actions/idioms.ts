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

export async function saveIdiomAction(data: {
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
}): Promise<IdiomCard | null> {
  return saveIdiom(data)
}

export async function listIdiomAction(): Promise<IdiomCard[]> {
  return getAllIdioms()
}

export async function updateIdiomSkillsAction(id: number, skills: IdiomSkill[]): Promise<void> {
  await updateIdiomSkills(id, skills)
  revalidatePath('/idioms')
}

export async function updateIdiomContextsAction(id: number, contexts: IdiomContext[]): Promise<void> {
  await updateIdiomContexts(id, contexts)
  revalidatePath('/idioms')
}

export async function updateIdiomRankAction(id: number, rank: number): Promise<void> {
  await updateIdiomRank(id, rank)
  revalidatePath('/idioms')
}

export async function deleteIdiomAction(id: number): Promise<void> {
  await deleteIdiom(id)
  revalidatePath('/idioms')
}
