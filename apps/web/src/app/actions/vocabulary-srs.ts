'use server'

import { revalidatePath } from 'next/cache'
import { enrolWord, recordReview } from '@/lib/db/vocabulary-srs'
import { getCurrentUser } from '@/lib/db/user'
import type { ReviewQuality } from '@/lib/srs'

export async function enrolWordAction(wordId: number) {
  const user = await getCurrentUser()
  await enrolWord(user.id, wordId)
  revalidatePath('/vocabulary', 'layout')
  revalidatePath('/vocabulary/review')
}

export async function recordReviewAction(wordId: number, quality: ReviewQuality) {
  const user = await getCurrentUser()
  await recordReview(user.id, wordId, quality)
  // No revalidate — the review session manages state locally
}
