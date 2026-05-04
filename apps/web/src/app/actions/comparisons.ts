'use server'

import { revalidatePath } from 'next/cache'
import {
  saveComparison,
  getAllComparisons,
  updateComparisonRank,
  deleteComparison,
  type ComparisonCard,
} from '@/lib/db/comparisons'
import type { ComparisonTerm, ComparisonExamplePair } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/db/user'

export async function saveComparisonAction(data: {
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
}): Promise<ComparisonCard | null> {
  const user = await getCurrentUser()
  return saveComparison({ ...data, userId: user.id })
}

export async function listComparisonAction(): Promise<ComparisonCard[]> {
  const user = await getCurrentUser()
  return getAllComparisons(user.id, user.role === 'admin', user.showSystemData)
}

export async function updateComparisonRankAction(id: number, rank: number): Promise<void> {
  await updateComparisonRank(id, rank)
  revalidatePath('/compare')
}

export async function deleteComparisonAction(id: number): Promise<void> {
  const user = await getCurrentUser()
  await deleteComparison(id, user.id, user.role === 'admin')
  revalidatePath('/compare')
}
