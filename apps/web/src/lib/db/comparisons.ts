import { db } from '@/lib/db'
import { comparisonEntries } from '@/lib/db/schema'
import { and, desc, eq, or, sql } from 'drizzle-orm'
import type { ComparisonTerm, ComparisonExamplePair } from '@/lib/db/schema'

export type ComparisonCard = {
  id: number
  userId: number | null
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
  rank: number
  isSystem: boolean
  createdAt: Date
}

export async function findComparison(termA: string, termB: string): Promise<ComparisonCard | null> {
  const a = termA.toLowerCase()
  const b = termB.toLowerCase()
  const rows = await db
    .select()
    .from(comparisonEntries)
    .where(
      or(
        and(sql`lower(${comparisonEntries.termA}) = ${a}`, sql`lower(${comparisonEntries.termB}) = ${b}`),
        and(sql`lower(${comparisonEntries.termA}) = ${b}`, sql`lower(${comparisonEntries.termB}) = ${a}`),
      )
    )
    .limit(1)
  return (rows[0] as ComparisonCard) ?? null
}

export async function saveComparison(data: {
  userId: number
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
}): Promise<ComparisonCard | null> {
  const [row] = await db
    .insert(comparisonEntries)
    .values({ ...data, termA: data.termA.toLowerCase(), termB: data.termB.toLowerCase(), isSystem: false })
    .onConflictDoNothing()
    .returning()
  return (row as ComparisonCard) ?? null
}

export async function getAllComparisons(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<ComparisonCard[]> {
  const visibilityFilter = isAdmin
    ? undefined
    : showSystemData
      ? or(eq(comparisonEntries.isSystem, true), eq(comparisonEntries.userId, userId))
      : and(eq(comparisonEntries.isSystem, false), eq(comparisonEntries.userId, userId))

  return db
    .select()
    .from(comparisonEntries)
    .where(visibilityFilter)
    .orderBy(desc(comparisonEntries.rank), desc(comparisonEntries.createdAt)) as Promise<ComparisonCard[]>
}

export async function updateComparisonRank(id: number, rank: number): Promise<void> {
  await db.update(comparisonEntries).set({ rank }).where(eq(comparisonEntries.id, id))
}

export async function deleteComparison(id: number, userId: number, isAdmin: boolean): Promise<void> {
  const condition = isAdmin
    ? eq(comparisonEntries.id, id)
    : and(eq(comparisonEntries.id, id), eq(comparisonEntries.isSystem, false), eq(comparisonEntries.userId, userId))
  await db.delete(comparisonEntries).where(condition)
}
