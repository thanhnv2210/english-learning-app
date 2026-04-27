import { db } from '@/lib/db'
import { collocationEntries } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import type { CollocationSkill } from '@/lib/db/schema'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

export type CollocationCard = {
  id: number
  phrase: string
  type: string
  explanation: string | null
  skills: CollocationSkill[]
  examples: string[]
  rank: number
  createdAt: Date
}

export async function findCollocation(phrase: string): Promise<CollocationCard | null> {
  const rows = await db
    .select()
    .from(collocationEntries)
    .where(sql`lower(${collocationEntries.phrase}) = lower(${phrase})`)
    .limit(1)
  return (rows[0] as CollocationCard) ?? null
}

export async function saveCollocation(data: {
  phrase: string
  type: string
  explanation?: string
  skills: CollocationSkill[]
  examples: string[]
}): Promise<CollocationCard | null> {
  const [row] = await db
    .insert(collocationEntries)
    .values({ ...data, phrase: data.phrase.toLowerCase() })
    .onConflictDoNothing()
    .returning()
  return (row as CollocationCard) ?? null
}

export async function getAllCollocations(): Promise<CollocationCard[]> {
  return db
    .select()
    .from(collocationEntries)
    .orderBy(desc(collocationEntries.rank), desc(collocationEntries.createdAt)) as Promise<CollocationCard[]>
}

export async function updateCollocationSkills(
  id: number,
  skills: CollocationSkill[],
): Promise<void> {
  await db
    .update(collocationEntries)
    .set({ skills })
    .where(eq(collocationEntries.id, id))
}

export async function updateCollocationRank(id: number, rank: number): Promise<void> {
  await db
    .update(collocationEntries)
    .set({ rank })
    .where(eq(collocationEntries.id, id))
}

export async function deleteCollocation(id: number): Promise<void> {
  await db.delete(collocationEntries).where(eq(collocationEntries.id, id))
}

/**
 * Convert collocation examples to the shared PracticeItem format.
 * Each example sentence that contains the phrase becomes one practice item.
 * Skips examples where the phrase cannot be found (case-insensitive).
 */
export async function getCollocationPracticeItems(): Promise<PracticeItem[]> {
  const rows = await getAllCollocations()
  const items: PracticeItem[] = []

  for (const row of rows) {
    for (let i = 0; i < row.examples.length; i++) {
      const ex = row.examples[i]
      if (!ex || !ex.toLowerCase().includes(row.phrase.toLowerCase())) continue
      const skill = row.skills[0] ?? 'Writing'
      const context = skill === 'Speaking' ? 'Speaking' : 'Writing'
      items.push({
        id: `colloc-${row.id}-${i}`,
        sentence: ex,
        answer: row.phrase,
        hint: row.type,
        context,
        source: 'collocation' as const,
      })
    }
  }

  return items
}
