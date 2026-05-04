import { db } from '@/lib/db'
import { readingPassages, type ReadingQuestionRow } from '@/lib/db/schema'
import { and, eq, or, sql, desc } from 'drizzle-orm'

export type LibraryPassage = {
  id: number
  userId: number | null
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
  isSystem: boolean
}

function visibilityFilter(userId: number, isAdmin: boolean, showSystemData: boolean) {
  if (isAdmin) return undefined
  return showSystemData
    ? or(eq(readingPassages.isSystem, true), eq(readingPassages.userId, userId))
    : and(eq(readingPassages.isSystem, false), eq(readingPassages.userId, userId))
}

/** Save a generated passage to the library. Returns the new row id. */
export async function saveReadingPassage(data: {
  userId: number
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
}): Promise<number> {
  const [row] = await db
    .insert(readingPassages)
    .values({ ...data, isSystem: false })
    .returning({ id: readingPassages.id })
  return row.id
}

/** Return one random passage for a domain, filtered by visibility. */
export async function getRandomPassageByDomain(
  domain: string,
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<LibraryPassage | null> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select()
    .from(readingPassages)
    .where(filter ? and(eq(readingPassages.domain, domain), filter) : eq(readingPassages.domain, domain))
    .orderBy(desc(readingPassages.rank), desc(readingPassages.createdAt), sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

/** Count of library passages per domain — filtered by visibility. */
export async function getLibraryCounts(
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<Record<string, number>> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select({ domain: readingPassages.domain, count: sql<number>`count(*)::int` })
    .from(readingPassages)
    .where(filter)
    .groupBy(readingPassages.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
