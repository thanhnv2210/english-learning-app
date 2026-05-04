import { db } from '@/lib/db'
import { idiomEntries, userIdioms } from '@/lib/db/schema'
import { and, count, desc, eq, inArray, or, sql } from 'drizzle-orm'
import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

export type IdiomCard = {
  id: number
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
  rank: number      // personal rank when savedByMe, global rank otherwise
  isSystem: boolean
  savedByMe: boolean
  createdAt: Date
}

export async function findIdiom(idiom: string): Promise<IdiomCard | null> {
  const rows = await db
    .select()
    .from(idiomEntries)
    .where(sql`lower(${idiomEntries.idiom}) = lower(${idiom})`)
    .limit(1)
  if (!rows[0]) return null
  return { ...rows[0], skills: rows[0].skills as IdiomSkill[], contexts: rows[0].contexts as IdiomContext[], examples: rows[0].examples as string[], savedByMe: false }
}

export async function saveIdiom(data: {
  userId: number
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
}): Promise<IdiomCard | null> {
  const idiom = data.idiom.toLowerCase()

  // 1. Upsert into shared catalogue (createdBy only set on first insert)
  const [inserted] = await db
    .insert(idiomEntries)
    .values({ idiom, meaning: data.meaning, register: data.register, skills: data.skills, contexts: data.contexts, examples: data.examples, isSystem: false, createdBy: data.userId })
    .onConflictDoNothing()
    .returning()

  // 2. Resolve catalogue id (inserted or pre-existing)
  const entry = inserted ?? await findIdiomEntry(idiom)
  if (!entry) return null

  // 3. Link to user's personal list
  await saveToUserIdioms(data.userId, entry.id)

  return { ...entry, skills: entry.skills as IdiomSkill[], contexts: entry.contexts as IdiomContext[], examples: entry.examples as string[], savedByMe: true }
}

async function findIdiomEntry(idiom: string) {
  const rows = await db
    .select()
    .from(idiomEntries)
    .where(sql`lower(${idiomEntries.idiom}) = lower(${idiom})`)
    .limit(1)
  return rows[0] ?? null
}

export async function saveToUserIdioms(userId: number, idiomId: number): Promise<void> {
  await db.insert(userIdioms).values({ userId, idiomId }).onConflictDoNothing()
}

export async function isInUserIdioms(userId: number, idiomId: number): Promise<boolean> {
  const rows = await db
    .select({ idiomId: userIdioms.idiomId })
    .from(userIdioms)
    .where(and(eq(userIdioms.userId, userId), eq(userIdioms.idiomId, idiomId)))
    .limit(1)
  return rows.length > 0
}

export async function removeFromUserIdioms(userId: number, idiomId: number): Promise<void> {
  await db.delete(userIdioms).where(and(eq(userIdioms.userId, userId), eq(userIdioms.idiomId, idiomId)))
}

export async function getAllIdioms(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<IdiomCard[]> {
  if (isAdmin) {
    const rows = await db
      .select()
      .from(idiomEntries)
      .orderBy(desc(idiomEntries.rank), desc(idiomEntries.createdAt))
    return rows.map((r) => ({ ...r, skills: r.skills as IdiomSkill[], contexts: r.contexts as IdiomContext[], examples: r.examples as string[], savedByMe: false }))
  }

  const savedIds = db
    .select({ idiomId: userIdioms.idiomId })
    .from(userIdioms)
    .where(eq(userIdioms.userId, userId))

  const visFilter = showSystemData
    ? or(eq(idiomEntries.isSystem, true), inArray(idiomEntries.id, savedIds))
    : inArray(idiomEntries.id, savedIds)

  const joined = await db
    .select({ entry: idiomEntries, userRank: userIdioms.rank })
    .from(idiomEntries)
    .leftJoin(userIdioms, and(eq(userIdioms.idiomId, idiomEntries.id), eq(userIdioms.userId, userId)))
    .where(visFilter)
    .orderBy(desc(sql`coalesce(${userIdioms.rank}, ${idiomEntries.rank})`), desc(idiomEntries.createdAt))

  return joined.map(({ entry, userRank }) => ({
    ...entry,
    skills: entry.skills as IdiomSkill[],
    contexts: entry.contexts as IdiomContext[],
    examples: entry.examples as string[],
    rank: userRank ?? entry.rank,
    savedByMe: userRank !== null,
  }))
}

export async function updateIdiomSkills(id: number, skills: IdiomSkill[]): Promise<void> {
  await db.update(idiomEntries).set({ skills }).where(eq(idiomEntries.id, id))
}

export async function updateIdiomContexts(id: number, contexts: IdiomContext[]): Promise<void> {
  await db.update(idiomEntries).set({ contexts }).where(eq(idiomEntries.id, id))
}

/** Admin-only: update the global rank on the shared catalogue. */
export async function updateIdiomRank(id: number, rank: number): Promise<void> {
  await db.update(idiomEntries).set({ rank }).where(eq(idiomEntries.id, id))
}

/** User: update the personal rank on their saved copy. */
export async function updateUserIdiomRank(userId: number, idiomId: number, rank: number): Promise<void> {
  await db
    .update(userIdioms)
    .set({ rank })
    .where(and(eq(userIdioms.userId, userId), eq(userIdioms.idiomId, idiomId)))
}

/** Admin-only: hard-delete the idiom from the shared catalogue. */
export async function deleteIdiom(id: number): Promise<void> {
  await db.delete(idiomEntries).where(eq(idiomEntries.id, id))
}

/** Returns how many users have this idiom saved. */
export async function getUserCountForIdiom(idiomId: number): Promise<number> {
  const [{ value }] = await db
    .select({ value: count() })
    .from(userIdioms)
    .where(eq(userIdioms.idiomId, idiomId))
  return value
}

/**
 * Convert idiom examples to the shared PracticeItem format.
 * Each example sentence that contains the idiom becomes one practice item.
 */
export async function getIdiomPracticeItems(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<PracticeItem[]> {
  const rows = await getAllIdioms(userId, isAdmin, showSystemData)
  const items: PracticeItem[] = []

  for (const row of rows) {
    for (let i = 0; i < row.examples.length; i++) {
      const ex = row.examples[i]
      if (!ex || !ex.toLowerCase().includes(row.idiom.toLowerCase())) continue
      const context = row.contexts[0] ?? 'Speaking'
      items.push({
        id: `idiom-${row.id}-${i}`,
        sentence: ex,
        answer: row.idiom,
        hint: row.register,
        context,
        source: 'idiom' as const,
      })
    }
  }

  return items
}
