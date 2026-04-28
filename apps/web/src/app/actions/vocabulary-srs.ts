'use server'

import { revalidatePath } from 'next/cache'
import { enrolWord, recordReview } from '@/lib/db/vocabulary-srs'
import type { ReviewQuality } from '@/lib/srs'

export async function enrolWordAction(wordId: number) {
  await enrolWord(wordId)
  revalidatePath('/vocabulary', 'layout')
  revalidatePath('/vocabulary/review')
}

export async function recordReviewAction(wordId: number, quality: ReviewQuality) {
  await recordReview(wordId, quality)
  // No revalidate — the review session manages state locally
}
