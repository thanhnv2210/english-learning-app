import { db } from '@/lib/db'
import { listeningScripts } from '@/lib/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'

export type LibraryScript = {
  id: number
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}

export async function saveListeningScript(data: {
  domain: string
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}): Promise<number> {
  const [row] = await db.insert(listeningScripts).values(data).returning({ id: listeningScripts.id })
  return row.id
}

export async function getRandomScriptByDomain(domain: string): Promise<LibraryScript | null> {
  const rows = await db
    .select()
    .from(listeningScripts)
    .where(eq(listeningScripts.domain, domain))
    .orderBy(desc(listeningScripts.rank), desc(listeningScripts.createdAt), sql`RANDOM()`)
    .limit(1)
  return rows[0] ?? null
}

export async function getListeningLibraryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ domain: listeningScripts.domain, count: sql<number>`count(*)::int` })
    .from(listeningScripts)
    .groupBy(listeningScripts.domain)
  return Object.fromEntries(rows.map((r) => [r.domain, r.count]))
}
