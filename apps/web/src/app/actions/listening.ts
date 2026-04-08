'use server'

import { saveListeningScript, getRandomScriptByDomain } from '@/lib/db/listening'
import type { LibraryScript } from '@/lib/db/listening'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'

export async function saveScriptToLibrary(data: {
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}): Promise<number> {
  return saveListeningScript(data)
}

export async function pickRandomScript(domain: string): Promise<LibraryScript | null> {
  return getRandomScriptByDomain(domain)
}
