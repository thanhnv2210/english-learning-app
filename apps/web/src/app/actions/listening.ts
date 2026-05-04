'use server'

import { saveListeningScript, getRandomScriptByDomain } from '@/lib/db/listening'
import type { LibraryScript } from '@/lib/db/listening'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/db/user'

export async function saveScriptToLibrary(data: {
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}): Promise<number> {
  const user = await getCurrentUser()
  return saveListeningScript({ ...data, userId: user.id })
}

export async function pickRandomScript(domain: string): Promise<LibraryScript | null> {
  const user = await getCurrentUser()
  return getRandomScriptByDomain(domain, user.id, user.role === 'admin', user.showSystemData)
}
