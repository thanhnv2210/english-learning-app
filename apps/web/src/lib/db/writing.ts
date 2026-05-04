import { db } from '@/lib/db'
import { writingTopics } from '@/lib/db/schema'
import { and, eq, or, sql, desc } from 'drizzle-orm'

export type LibraryTopic = {
  id: number
  userId: number | null
  domain: string
  prompt: string
  taskType: string
  isSystem: boolean
}

function visibilityFilter(userId: number, isAdmin: boolean, showSystemData: boolean) {
  if (isAdmin) return undefined
  return showSystemData
    ? or(eq(writingTopics.isSystem, true), eq(writingTopics.userId, userId))
    : and(eq(writingTopics.isSystem, false), eq(writingTopics.userId, userId))
}

export async function saveWritingTopic(data: {
  userId: number
  domain: string
  prompt: string
  taskType: string
}): Promise<number> {
  const [row] = await db
    .insert(writingTopics)
    .values({ ...data, isSystem: false })
    .returning({ id: writingTopics.id })
  return row.id
}

export async function getRandomTopicByDomain(
  domain: string,
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<LibraryTopic | null> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select()
    .from(writingTopics)
    .where(filter ? and(eq(writingTopics.domain, domain), filter) : eq(writingTopics.domain, domain))
    .orderBy(sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

export async function getTopicsByDomain(
  domain: string,
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<LibraryTopic[]> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  return db
    .select()
    .from(writingTopics)
    .where(filter ? and(eq(writingTopics.domain, domain), filter) : eq(writingTopics.domain, domain))
    .orderBy(desc(writingTopics.rank), desc(writingTopics.createdAt))
}

export async function getWritingTopicLibraryCounts(
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<Record<string, number>> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select({ domain: writingTopics.domain, count: sql<number>`count(*)::int` })
    .from(writingTopics)
    .where(filter)
    .groupBy(writingTopics.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
