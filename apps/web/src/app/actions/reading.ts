'use server'

import {
  saveReadingPassage,
  getRandomPassageByDomain,
  type LibraryPassage,
} from '@/lib/db/reading'
import type { ReadingQuestionRow } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/db/user'

export async function savePassageToLibrary(data: {
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
}): Promise<number> {
  const user = await getCurrentUser()
  return saveReadingPassage({ ...data, userId: user.id })
}

export async function pickRandomPassage(domain: string): Promise<LibraryPassage | null> {
  const user = await getCurrentUser()
  return getRandomPassageByDomain(domain, user.id, user.role === 'admin', user.showSystemData)
}
