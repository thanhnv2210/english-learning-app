import { db } from '@/lib/db'
import { readingPassages, type ReadingQuestionRow } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export type LibraryPassage = {
  id: number
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
}

/** Save a generated passage to the library. Returns the new row id. */
export async function saveReadingPassage(data: {
  title: string
  domain: string
  passage: string
  questions: ReadingQuestionRow[]
}): Promise<number> {
  const [row] = await db.insert(readingPassages).values(data).returning({ id: readingPassages.id })
  return row.id
}

/** Return one random passage for a domain, or null if the library is empty for that domain. */
export async function getRandomPassageByDomain(domain: string): Promise<LibraryPassage | null> {
  const rows = await db
    .select()
    .from(readingPassages)
    .where(eq(readingPassages.domain, domain))
    .orderBy(sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

/** Count of library passages per domain — used to show availability in the UI. */
export async function getLibraryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ domain: readingPassages.domain, count: sql<number>`count(*)::int` })
    .from(readingPassages)
    .groupBy(readingPassages.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
