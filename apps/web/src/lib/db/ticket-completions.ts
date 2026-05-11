import { db } from './index'
import { ticketCompletions } from './schema'
import { and, eq } from 'drizzle-orm'

export async function getCompletionsForTicket(ticketId: number): Promise<string[]> {
  const rows = await db
    .select({ completedDate: ticketCompletions.completedDate })
    .from(ticketCompletions)
    .where(eq(ticketCompletions.ticketId, ticketId))
  return rows.map((r) => r.completedDate).sort()
}

/** Toggle a date: insert if missing, delete if present. Returns updated full list. */
export async function toggleTicketCompletion(ticketId: number, date: string): Promise<string[]> {
  const [existing] = await db
    .select({ id: ticketCompletions.id })
    .from(ticketCompletions)
    .where(and(eq(ticketCompletions.ticketId, ticketId), eq(ticketCompletions.completedDate, date)))
    .limit(1)

  if (existing) {
    await db.delete(ticketCompletions).where(eq(ticketCompletions.id, existing.id))
  } else {
    await db.insert(ticketCompletions).values({ ticketId, completedDate: date })
  }

  return getCompletionsForTicket(ticketId)
}
