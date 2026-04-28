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

export async function saveComparisonAction(data: {
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
}): Promise<ComparisonCard | null> {
  return saveComparison(data)
}

export async function listComparisonAction(): Promise<ComparisonCard[]> {
  return getAllComparisons()
}

export async function updateComparisonRankAction(id: number, rank: number): Promise<void> {
  await updateComparisonRank(id, rank)
  revalidatePath('/compare')
}

export async function deleteComparisonAction(id: number): Promise<void> {
  await deleteComparison(id)
  revalidatePath('/compare')
}
