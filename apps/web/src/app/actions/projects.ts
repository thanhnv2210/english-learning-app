'use server'

import { revalidatePath } from 'next/cache'
import {
  createTicket, updateTicket, deleteTicket, cloneTemplate, reorderTickets,
  createSprint, updateSprintStatus, deleteSprint,
  addComment, deleteComment,
  type TicketStatus, type TicketPriority, type TicketType, type SprintStatus,
} from '@/lib/db/projects'

const REVALIDATE = () => revalidatePath('/projects', 'layout')

// ── Tickets ───────────────────────────────────────────────────────────────────

export async function createTicketAction(data: {
  projectId: number
  sprintId?: number | null
  title: string
  description?: string
  priority?: TicketPriority
  type?: TicketType
  epic?: string | null
  isTemplate?: boolean
}) {
  await createTicket(data)
  REVALIDATE()
}

export async function updateTicketAction(
  id: number,
  data: Partial<{ title: string; description: string; status: TicketStatus; priority: TicketPriority; type: TicketType; epic: string | null; sprintId: number | null; order: number }>,
) {
  await updateTicket(id, data)
  REVALIDATE()
}

export async function deleteTicketAction(id: number) {
  await deleteTicket(id)
  REVALIDATE()
}

export async function cloneTemplateAction(templateId: number, sprintId: number | null) {
  await cloneTemplate(templateId, sprintId)
  REVALIDATE()
}

export async function reorderTicketsAction(updates: { id: number; order: number }[]) {
  await reorderTickets(updates)
  // no revalidate — optimistic UI handles it
}

// ── Sprints ───────────────────────────────────────────────────────────────────

export async function createSprintAction(data: {
  projectId: number
  name: string
  goal?: string
  startDate?: Date
  endDate?: Date
}) {
  const sprint = await createSprint(data)
  REVALIDATE()
  return sprint
}

export async function updateSprintStatusAction(id: number, status: SprintStatus) {
  await updateSprintStatus(id, status)
  REVALIDATE()
}

export async function deleteSprintAction(id: number) {
  await deleteSprint(id)
  REVALIDATE()
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function addCommentAction(ticketId: number, content: string) {
  await addComment(ticketId, content)
  revalidatePath(`/projects/tickets`, 'layout')
}

export async function deleteCommentAction(id: number) {
  await deleteComment(id)
  revalidatePath(`/projects/tickets`, 'layout')
}
