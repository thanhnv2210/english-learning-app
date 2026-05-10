'use server'

import { revalidatePath } from 'next/cache'
import {
  createTicket, updateTicket, deleteTicket, cloneTemplate, reorderTickets,
  createSprint, updateSprint, updateSprintStatus, deleteSprint,
  addComment, deleteComment,
  createProject, deleteProject,
  createProjectEpic, deleteProjectEpic,
  type TicketStatus, type TicketPriority, type TicketType, type SprintStatus,
} from '@/lib/db/projects'

const REVALIDATE = () => revalidatePath('/projects', 'layout')

// ── Projects ──────────────────────────────────────────────────────────────────

export async function createProjectAction(data: { name: string; key: string; description?: string }) {
  const project = await createProject(data)
  REVALIDATE()
  return project
}

export async function deleteProjectAction(id: number) {
  await deleteProject(id)
  REVALIDATE()
}

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
  const ticket = await createTicket(data)
  REVALIDATE()
  return ticket
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
  const ticket = await cloneTemplate(templateId, sprintId)
  REVALIDATE()
  return ticket
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

export async function updateSprintAction(
  id: number,
  data: { name?: string; goal?: string | null; startDate?: Date | null; endDate?: Date | null },
) {
  await updateSprint(id, data)
  REVALIDATE()
}

export async function updateSprintStatusAction(
  id: number,
  status: SprintStatus,
  dates?: { startDate?: Date; endDate?: Date },
) {
  await updateSprintStatus(id, status, dates)
  REVALIDATE()
}

export async function deleteSprintAction(id: number) {
  await deleteSprint(id)
  REVALIDATE()
}

// ── Epics ─────────────────────────────────────────────────────────────────────

export async function createEpicAction(data: {
  projectId: number
  label: string
  value: string
  colorKey: string
}) {
  const epic = await createProjectEpic(data)
  REVALIDATE()
  return epic
}

export async function deleteEpicAction(id: number) {
  await deleteProjectEpic(id)
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
