'use server'

import { revalidatePath } from 'next/cache'
import {
  addSentence,
  deleteSentence,
  createPracticeSession,
  logPracticeResult,
  completePracticeSession,
} from '@/lib/db/word-sentences'
import { getDefaultUser } from '@/lib/db/user'

export async function addSentenceAction(data: {
  wordId: number
  sentence: string
  context: string
}): Promise<{ ok: boolean }> {
  if (!data.sentence.trim() || !data.context) return { ok: false }
  await addSentence(data)
  revalidatePath(`/vocabulary/${data.wordId}/sentences`)
  return { ok: true }
}

export async function deleteSentenceAction(id: number, wordId: number): Promise<void> {
  await deleteSentence(id)
  revalidatePath(`/vocabulary/${wordId}/sentences`)
}

export async function createPracticeSessionAction(gameType: string): Promise<number> {
  const user = await getDefaultUser()
  return createPracticeSession(user.id, gameType)
}

export async function logPracticeResultAction(
  sessionId: number,
  sentenceId: number,
  correct: boolean,
  timeMs?: number,
): Promise<void> {
  await logPracticeResult(sessionId, sentenceId, correct, timeMs)
}

export async function completePracticeSessionAction(sessionId: number, score: number): Promise<void> {
  await completePracticeSession(sessionId, score)
}
