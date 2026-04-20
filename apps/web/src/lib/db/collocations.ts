import { db } from '@/lib/db'
import { collocationEntries } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import type { CollocationSkill } from '@/lib/db/schema'

export type CollocationCard = {
  id: number
  phrase: string
  type: string
  skills: CollocationSkill[]
  examples: string[]
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
  skills: CollocationSkill[]
  examples: string[]
}): Promise<CollocationCard | null> {
  const [row] = await db
    .insert(collocationEntries)
    .values(data)
    .onConflictDoNothing()
    .returning()
  return (row as CollocationCard) ?? null
}

export async function getAllCollocations(): Promise<CollocationCard[]> {
  return db
    .select()
    .from(collocationEntries)
    .orderBy(desc(collocationEntries.createdAt)) as Promise<CollocationCard[]>
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

export async function deleteCollocation(id: number): Promise<void> {
  await db.delete(collocationEntries).where(eq(collocationEntries.id, id))
}
