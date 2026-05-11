'use server'

import { revalidatePath } from 'next/cache'
import { toggleTicketCompletion } from '@/lib/db/ticket-completions'

export async function toggleTicketCompletionAction(
  ticketId: number,
  date: string,         // ISO 'YYYY-MM-DD'
  ticketKey: string,    // for revalidation
): Promise<string[]> {
  const updated = await toggleTicketCompletion(ticketId, date)
  revalidatePath(`/projects/tickets/${ticketKey}`)
  return updated
}
