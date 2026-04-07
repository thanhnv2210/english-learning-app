'use server'

import {
  saveReadingPassage,
  getRandomPassageByDomain,
  type LibraryPassage,
} from '@/lib/db/reading'
import type { ReadingQuestionRow } from '@/lib/db/schema'

export async function savePassageToLibrary(data: {
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
}): Promise<number> {
  return saveReadingPassage(data)
}

export async function pickRandomPassage(domain: string): Promise<LibraryPassage | null> {
  return getRandomPassageByDomain(domain)
}
