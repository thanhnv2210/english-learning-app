import { db } from '@/lib/db'
import { writingTopics } from '@/lib/db/schema'
import { eq, sql, desc } from 'drizzle-orm'

export type LibraryTopic = {
  id: number
  domain: string
  prompt: string
  taskType: string
}

export async function saveWritingTopic(data: {
  domain: string
  prompt: string
  taskType: string
}): Promise<number> {
  const [row] = await db.insert(writingTopics).values(data).returning({ id: writingTopics.id })
  return row.id
}

export async function getRandomTopicByDomain(domain: string): Promise<LibraryTopic | null> {
  const rows = await db
    .select()
    .from(writingTopics)
    .where(eq(writingTopics.domain, domain))
    .orderBy(sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

export async function getTopicsByDomain(domain: string): Promise<LibraryTopic[]> {
  return db
    .select()
    .from(writingTopics)
    .where(eq(writingTopics.domain, domain))
    .orderBy(desc(writingTopics.rank), desc(writingTopics.createdAt))
}

export async function getWritingTopicLibraryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ domain: writingTopics.domain, count: sql<number>`count(*)::int` })
    .from(writingTopics)
    .groupBy(writingTopics.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
