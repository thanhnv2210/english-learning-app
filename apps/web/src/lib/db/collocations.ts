import { db } from '@/lib/db'
import { collocationEntries, userCollocations } from '@/lib/db/schema'
import { and, count, desc, eq, inArray, or, sql } from 'drizzle-orm'
import type { CollocationSkill } from '@/lib/db/schema'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

export type CollocationCard = {
  id: number
  phrase: string
  type: string
  explanation: string | null
  skills: CollocationSkill[]
  examples: string[]
  rank: number      // personal rank when savedByMe, global rank otherwise
  isSystem: boolean
  savedByMe: boolean
  createdAt: Date
}

export async function findCollocation(phrase: string): Promise<CollocationCard | null> {
  const rows = await db
    .select()
    .from(collocationEntries)
    .where(sql`lower(${collocationEntries.phrase}) = lower(${phrase})`)
    .limit(1)
  if (!rows[0]) return null
  return { ...rows[0], skills: rows[0].skills as CollocationSkill[], examples: rows[0].examples as string[], savedByMe: false }
}

export async function saveCollocation(data: {
  userId: number
  phrase: string
  type: string
  explanation?: string
  skills: CollocationSkill[]
  examples: string[]
}): Promise<CollocationCard | null> {
  const phrase = data.phrase.toLowerCase()

  // 1. Upsert into shared catalogue (createdBy only set on first insert)
  const [inserted] = await db
    .insert(collocationEntries)
    .values({ phrase, type: data.type, explanation: data.explanation, skills: data.skills, examples: data.examples, isSystem: false, createdBy: data.userId })
    .onConflictDoNothing()
    .returning()

  // 2. Resolve catalogue id (inserted or pre-existing)
  const entry = inserted ?? await findCollocationEntry(phrase)
  if (!entry) return null

  // 3. Link to user's personal list
  await saveToUserCollocations(data.userId, entry.id)

  return { ...entry, skills: entry.skills as CollocationSkill[], examples: entry.examples as string[], savedByMe: true }
}

async function findCollocationEntry(phrase: string) {
  const rows = await db
    .select()
    .from(collocationEntries)
    .where(sql`lower(${collocationEntries.phrase}) = lower(${phrase})`)
    .limit(1)
  return rows[0] ?? null
}

export async function saveToUserCollocations(userId: number, collocationId: number): Promise<void> {
  await db
    .insert(userCollocations)
    .values({ userId, collocationId })
    .onConflictDoNothing()
}

export async function isInUserCollocations(userId: number, collocationId: number): Promise<boolean> {
  const rows = await db
    .select({ collocationId: userCollocations.collocationId })
    .from(userCollocations)
    .where(and(eq(userCollocations.userId, userId), eq(userCollocations.collocationId, collocationId)))
    .limit(1)
  return rows.length > 0
}

export async function removeFromUserCollocations(userId: number, collocationId: number): Promise<void> {
  await db
    .delete(userCollocations)
    .where(and(eq(userCollocations.userId, userId), eq(userCollocations.collocationId, collocationId)))
}

export async function getAllCollocations(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<CollocationCard[]> {
  if (isAdmin) {
    const rows = await db
      .select()
      .from(collocationEntries)
      .orderBy(desc(collocationEntries.rank), desc(collocationEntries.createdAt))
    return rows.map((r) => ({ ...r, skills: r.skills as CollocationSkill[], examples: r.examples as string[], savedByMe: false }))
  }

  // Non-admin: join user_collocations to get personal rank + savedByMe flag
  const savedIds = db
    .select({ collocationId: userCollocations.collocationId })
    .from(userCollocations)
    .where(eq(userCollocations.userId, userId))

  const visFilter = showSystemData
    ? or(eq(collocationEntries.isSystem, true), inArray(collocationEntries.id, savedIds))
    : inArray(collocationEntries.id, savedIds)

  const joined = await db
    .select({ entry: collocationEntries, userRank: userCollocations.rank })
    .from(collocationEntries)
    .leftJoin(userCollocations, and(eq(userCollocations.collocationId, collocationEntries.id), eq(userCollocations.userId, userId)))
    .where(visFilter)
    .orderBy(desc(sql`coalesce(${userCollocations.rank}, ${collocationEntries.rank})`), desc(collocationEntries.createdAt))

  return joined.map(({ entry, userRank }) => ({
    ...entry,
    skills: entry.skills as CollocationSkill[],
    examples: entry.examples as string[],
    rank: userRank ?? entry.rank,
    savedByMe: userRank !== null,
  }))
}

export async function updateCollocationSkills(id: number, skills: CollocationSkill[]): Promise<void> {
  await db.update(collocationEntries).set({ skills }).where(eq(collocationEntries.id, id))
}

/** Admin-only: update the global rank on the shared catalogue. */
export async function updateCollocationRank(id: number, rank: number): Promise<void> {
  await db.update(collocationEntries).set({ rank }).where(eq(collocationEntries.id, id))
}

/** User: update the personal rank on their saved copy. */
export async function updateUserCollocationRank(userId: number, collocationId: number, rank: number): Promise<void> {
  await db
    .update(userCollocations)
    .set({ rank })
    .where(and(eq(userCollocations.userId, userId), eq(userCollocations.collocationId, collocationId)))
}

/** Admin-only: hard-delete the collocation from the shared catalogue. */
export async function deleteCollocation(id: number): Promise<void> {
  await db.delete(collocationEntries).where(eq(collocationEntries.id, id))
}

/** Returns how many users have this collocation saved. */
export async function getUserCountForCollocation(collocationId: number): Promise<number> {
  const [{ value }] = await db
    .select({ value: count() })
    .from(userCollocations)
    .where(eq(userCollocations.collocationId, collocationId))
  return value
}

/**
 * Convert collocation examples to the shared PracticeItem format.
 * Each example sentence that contains the phrase becomes one practice item.
 * Skips examples where the phrase cannot be found (case-insensitive).
 */
export async function getCollocationPracticeItems(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<PracticeItem[]> {
  const rows = await getAllCollocations(userId, isAdmin, showSystemData)
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
