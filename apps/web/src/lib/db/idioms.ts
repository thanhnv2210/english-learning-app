import { db } from '@/lib/db'
import { idiomEntries } from '@/lib/db/schema'
import { and, desc, eq, or, sql } from 'drizzle-orm'
import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'
import type { PracticeItem } from '@/lib/ielts/vocabulary/practice-types'

export type IdiomCard = {
  id: number
  userId: number | null
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
  rank: number
  isSystem: boolean
  createdAt: Date
}

export async function findIdiom(idiom: string): Promise<IdiomCard | null> {
  const rows = await db
    .select()
    .from(idiomEntries)
    .where(sql`lower(${idiomEntries.idiom}) = lower(${idiom})`)
    .limit(1)
  return (rows[0] as IdiomCard) ?? null
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
  const [row] = await db
    .insert(idiomEntries)
    .values({ ...data, idiom: data.idiom.toLowerCase(), isSystem: false })
    .onConflictDoNothing()
    .returning()
  return (row as IdiomCard) ?? null
}

export async function getAllIdioms(userId: number, isAdmin: boolean, showSystemData: boolean): Promise<IdiomCard[]> {
  const visibilityFilter = isAdmin
    ? undefined
    : showSystemData
      ? or(eq(idiomEntries.isSystem, true), eq(idiomEntries.userId, userId))
      : and(eq(idiomEntries.isSystem, false), eq(idiomEntries.userId, userId))

  return db
    .select()
    .from(idiomEntries)
    .where(visibilityFilter)
    .orderBy(desc(idiomEntries.rank), desc(idiomEntries.createdAt)) as Promise<IdiomCard[]>
}

export async function updateIdiomSkills(id: number, skills: IdiomSkill[]): Promise<void> {
  await db.update(idiomEntries).set({ skills }).where(eq(idiomEntries.id, id))
}

export async function updateIdiomContexts(id: number, contexts: IdiomContext[]): Promise<void> {
  await db.update(idiomEntries).set({ contexts }).where(eq(idiomEntries.id, id))
}

export async function updateIdiomRank(id: number, rank: number): Promise<void> {
  await db.update(idiomEntries).set({ rank }).where(eq(idiomEntries.id, id))
}

export async function deleteIdiom(id: number, userId: number, isAdmin: boolean): Promise<void> {
  const condition = isAdmin
    ? eq(idiomEntries.id, id)
    : and(eq(idiomEntries.id, id), eq(idiomEntries.isSystem, false), eq(idiomEntries.userId, userId))
  await db.delete(idiomEntries).where(condition)
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
