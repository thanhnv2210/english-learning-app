import { db } from '@/lib/db'
import { listeningScripts } from '@/lib/db/schema'
import { and, eq, or, sql, desc } from 'drizzle-orm'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'

export type LibraryScript = {
  id: number
  userId: number | null
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
  isSystem: boolean
}

function visibilityFilter(userId: number, isAdmin: boolean, showSystemData: boolean) {
  if (isAdmin) return undefined
  return showSystemData
    ? or(eq(listeningScripts.isSystem, true), eq(listeningScripts.userId, userId))
    : and(eq(listeningScripts.isSystem, false), eq(listeningScripts.userId, userId))
}

export async function saveListeningScript(data: {
  userId: number
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}): Promise<number> {
  const [row] = await db
    .insert(listeningScripts)
    .values({ ...data, isSystem: false })
    .returning({ id: listeningScripts.id })
  return row.id
}

export async function getRandomScriptByDomain(
  domain: string,
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<LibraryScript | null> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select()
    .from(listeningScripts)
    .where(filter ? and(eq(listeningScripts.domain, domain), filter) : eq(listeningScripts.domain, domain))
    .orderBy(desc(listeningScripts.rank), desc(listeningScripts.createdAt), sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

export async function getListeningLibraryCounts(
  userId: number,
  isAdmin: boolean,
  showSystemData: boolean,
): Promise<Record<string, number>> {
  const filter = visibilityFilter(userId, isAdmin, showSystemData)
  const rows = await db
    .select({ domain: listeningScripts.domain, count: sql<number>`count(*)::int` })
    .from(listeningScripts)
    .where(filter)
    .groupBy(listeningScripts.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
