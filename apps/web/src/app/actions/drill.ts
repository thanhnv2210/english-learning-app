'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/db/user'
import { saveDrillResult, getDrillResults } from '@/lib/db/drill'
import type { DrillMistakeSaved } from '@/lib/db/schema'

export async function saveDrillResultAction(data: {
  drillTextId?: number
  originalText: string
  spokenText: string
  accuracy: number
  correctCount: number
  totalCount: number
  mistakes: DrillMistakeSaved[]
}) {
  const user = await getCurrentUser()
  const result = await saveDrillResult({ userId: user.id, ...data })
  revalidatePath('/speaking/drill')
  return result
}

export async function getDrillHistoryAction() {
  const user = await getCurrentUser()
  return getDrillResults(user.id)
}
