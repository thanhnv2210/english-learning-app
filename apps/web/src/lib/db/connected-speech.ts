import { db } from '@/lib/db'
import { connectedSpeechAnalyses } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import type { ConnectedSpeechInstance } from '@/lib/ielts/connected-speech/prompts'

export type SavedAnalysis = {
  id: number
  originalText: string
  transformedText: string
  instances: ConnectedSpeechInstance[]
  phenomena: string[]
  createdAt: Date
}

export async function saveAnalysis(data: {
  originalText: string
  transformedText: string
  instances: ConnectedSpeechInstance[]
}): Promise<number> {
  const phenomena = [...new Set(data.instances.map((i) => i.phenomenon))]
  const [row] = await db
    .insert(connectedSpeechAnalyses)
    .values({ ...data, phenomena })
    .returning({ id: connectedSpeechAnalyses.id })
  return row.id
}

export async function getRecentAnalyses(limit = 20): Promise<SavedAnalysis[]> {
  return db
    .select()
    .from(connectedSpeechAnalyses)
    .orderBy(desc(connectedSpeechAnalyses.createdAt))
    .limit(limit) as Promise<SavedAnalysis[]>
}

export async function getTopByPhenomenon(phenomenon: string, limit = 10): Promise<SavedAnalysis[]> {
  return db
    .select()
    .from(connectedSpeechAnalyses)
    .where(sql`${connectedSpeechAnalyses.phenomena} @> ${JSON.stringify([phenomenon])}::jsonb`)
    .orderBy(desc(connectedSpeechAnalyses.createdAt))
    .limit(limit) as Promise<SavedAnalysis[]>
}

export async function getAnalysisById(id: number): Promise<SavedAnalysis | null> {
  const rows = await db
    .select()
    .from(connectedSpeechAnalyses)
    .where(sql`${connectedSpeechAnalyses.id} = ${id}`)
    .limit(1)
  return (rows[0] as SavedAnalysis) ?? null
}

export async function deleteAnalysis(id: number): Promise<void> {
  await db
    .delete(connectedSpeechAnalyses)
    .where(sql`${connectedSpeechAnalyses.id} = ${id}`)
}
