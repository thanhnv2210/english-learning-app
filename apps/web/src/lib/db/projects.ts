import { db } from '@/lib/db'
import { projects, sprints, tickets, ticketComments, projectEpics } from '@/lib/db/schema'
import { eq, and, isNull, asc, desc, sql } from 'drizzle-orm'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TicketStatus   = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketType     = 'task' | 'bug' | 'story'
export type SprintStatus   = 'planning' | 'active' | 'completed'

export type Project      = typeof projects.$inferSelect
export type Sprint       = typeof sprints.$inferSelect
export type Ticket       = typeof tickets.$inferSelect
export type TicketComment = typeof ticketComments.$inferSelect
export type ProjectEpic  = typeof projectEpics.$inferSelect

// ── Project ───────────────────────────────────────────────────────────────────

export async function getDefaultProject(userId: number): Promise<Project> {
  const existing = await db.select().from(projects).where(eq(projects.userId, userId)).limit(1)
  if (existing[0]) return existing[0]
  const [created] = await db.insert(projects).values({ name: 'My Project', key: 'PROJ', description: 'Default project', userId }).returning()
  return created
}

export async function getAllProjects(userId: number): Promise<Project[]> {
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(asc(projects.createdAt))
}

export async function getProjectById(id: number): Promise<Project | null> {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createProject(data: {
  userId: number
  name: string
  key: string
  description?: string
}): Promise<Project> {
  const [row] = await db.insert(projects).values(data).returning()
  return row
}

export async function getProjectSprints(projectKey: string): Promise<Sprint[]> {
  const proj = await db.select({ id: projects.id }).from(projects).where(eq(projects.key, projectKey)).limit(1)
  if (!proj[0]) return []
  return db.select().from(sprints).where(eq(sprints.projectId, proj[0].id)).orderBy(asc(sprints.startDate))
}

export async function updateProject(
  id: number,
  data: { name: string; description?: string | null },
): Promise<Project> {
  const [row] = await db.update(projects).set(data).where(eq(projects.id, id)).returning()
  return row
}

export async function deleteProject(id: number): Promise<void> {
  await db.delete(projects).where(eq(projects.id, id))
}

// ── Project Epics ─────────────────────────────────────────────────────────────

export async function getProjectEpics(projectId: number): Promise<ProjectEpic[]> {
  return db
    .select()
    .from(projectEpics)
    .where(eq(projectEpics.projectId, projectId))
    .orderBy(asc(projectEpics.createdAt))
}

export async function createProjectEpic(data: {
  projectId: number
  label: string
  value: string
  colorKey: string
}): Promise<ProjectEpic> {
  const [row] = await db.insert(projectEpics).values(data).returning()
  return row
}

export async function deleteProjectEpic(id: number): Promise<void> {
  await db.delete(projectEpics).where(eq(projectEpics.id, id))
}

// ── Sprints ───────────────────────────────────────────────────────────────────

export async function getSprints(projectId: number): Promise<Sprint[]> {
  return db
    .select()
    .from(sprints)
    .where(eq(sprints.projectId, projectId))
    .orderBy(desc(sprints.createdAt))
}

export async function getActiveSprint(projectId: number): Promise<Sprint | null> {
  const rows = await db
    .select()
    .from(sprints)
    .where(and(eq(sprints.projectId, projectId), eq(sprints.status, 'active')))
    .limit(1)
  return rows[0] ?? null
}

/** Active sprint first, then most recent planning sprint — for the board view. */
export async function getCurrentSprint(projectId: number): Promise<Sprint | null> {
  const active = await getActiveSprint(projectId)
  if (active) return active
  const rows = await db
    .select()
    .from(sprints)
    .where(and(eq(sprints.projectId, projectId), eq(sprints.status, 'planning')))
    .orderBy(desc(sprints.createdAt))
    .limit(1)
  return rows[0] ?? null
}

export async function createSprint(data: {
  projectId: number
  name: string
  goal?: string
  startDate?: Date
  endDate?: Date
}): Promise<Sprint> {
  const [row] = await db.insert(sprints).values(data).returning()
  return row
}

export async function updateSprintStatus(
  id: number,
  status: SprintStatus,
  dates?: { startDate?: Date; endDate?: Date },
): Promise<void> {
  await db.update(sprints).set({ status, ...dates }).where(eq(sprints.id, id))
}

/** Complete a sprint: move all non-done tickets to backlog, then mark sprint completed. */
export async function completeSprint(id: number): Promise<void> {
  await db
    .update(tickets)
    .set({ sprintId: null })
    .where(
      and(
        eq(tickets.sprintId, id),
        eq(tickets.isTemplate, false),
        sql`${tickets.status} != 'done'`,
      ),
    )
  await db.update(sprints).set({ status: 'completed' }).where(eq(sprints.id, id))
}

export async function updateSprint(
  id: number,
  data: Partial<Pick<Sprint, 'name' | 'goal' | 'startDate' | 'endDate'>>,
): Promise<Sprint> {
  const [row] = await db.update(sprints).set(data).where(eq(sprints.id, id)).returning()
  return row
}

export async function deleteSprint(id: number): Promise<void> {
  // Move sprint tickets back to backlog before deleting
  await db.update(tickets).set({ sprintId: null }).where(eq(tickets.sprintId, id))
  await db.delete(sprints).where(eq(sprints.id, id))
}

// ── Tickets ───────────────────────────────────────────────────────────────────

async function nextTicketKey(projectId: number): Promise<string> {
  const [proj] = await db
    .update(projects)
    .set({ ticketCounter: sql`${projects.ticketCounter} + 1` })
    .where(eq(projects.id, projectId))
    .returning({ key: projects.key, counter: projects.ticketCounter })
  return `${proj.key}-${proj.counter}`
}

export async function createTicket(data: {
  projectId: number
  sprintId?: number | null
  title: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  type?: TicketType
  epic?: string | null
  isTemplate?: boolean
}): Promise<Ticket> {
  const key = await nextTicketKey(data.projectId)
  const [row] = await db
    .insert(tickets)
    .values({
      ...data,
      key,
      status: data.status ?? 'todo',
      priority: data.priority ?? 'medium',
      type: data.type ?? 'task',
      isTemplate: data.isTemplate ?? false,
    })
    .returning()
  return row
}

export async function updateTicket(
  id: number,
  data: Partial<Pick<Ticket, 'title' | 'description' | 'status' | 'priority' | 'type' | 'epic' | 'sprintId' | 'order'>>,
): Promise<Ticket> {
  const [row] = await db
    .update(tickets)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tickets.id, id))
    .returning()
  return row
}

export async function deleteTicket(id: number): Promise<void> {
  // System tickets are protected — never delete them
  await db.delete(tickets).where(and(eq(tickets.id, id), eq(tickets.isSystem, false)))
}

export async function getSprintStats(
  sprintId: number,
): Promise<{ total: number; done: number }> {
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      done:  sql<number>`count(*) filter (where ${tickets.status} = 'done')::int`,
    })
    .from(tickets)
    .where(and(eq(tickets.sprintId, sprintId), eq(tickets.isTemplate, false)))
  return { total: rows[0]?.total ?? 0, done: rows[0]?.done ?? 0 }
}

export async function getSprintTickets(sprintId: number): Promise<Ticket[]> {
  return db
    .select()
    .from(tickets)
    .where(and(eq(tickets.sprintId, sprintId), eq(tickets.isTemplate, false)))
    .orderBy(asc(tickets.order), asc(tickets.createdAt))
}

export async function getBacklogTickets(projectId: number): Promise<Ticket[]> {
  return db
    .select()
    .from(tickets)
    .where(and(
      eq(tickets.projectId, projectId),
      isNull(tickets.sprintId),
      eq(tickets.isTemplate, false),
    ))
    .orderBy(asc(tickets.order), asc(tickets.createdAt))
}

export async function getTemplates(projectId: number): Promise<Ticket[]> {
  return db
    .select()
    .from(tickets)
    .where(and(eq(tickets.projectId, projectId), eq(tickets.isTemplate, true)))
    .orderBy(asc(tickets.createdAt))
}

export async function getTicketByKey(key: string): Promise<Ticket | null> {
  const rows = await db.select().from(tickets).where(eq(tickets.key, key)).limit(1)
  return rows[0] ?? null
}

/** Clone a template into a sprint (or backlog if sprintId is null). */
export async function cloneTemplate(templateId: number, sprintId: number | null): Promise<Ticket> {
  const [tmpl] = await db.select().from(tickets).where(eq(tickets.id, templateId)).limit(1)
  if (!tmpl) throw new Error('Template not found')
  const key = await nextTicketKey(tmpl.projectId)
  const [row] = await db
    .insert(tickets)
    .values({
      projectId: tmpl.projectId,
      sprintId,
      templateId,
      key,
      title: tmpl.title,
      description: tmpl.description,
      status: 'todo',
      priority: tmpl.priority,
      type: tmpl.type,
      epic: tmpl.epic,
      isTemplate: false,
    })
    .returning()
  return row
}

export async function reorderTickets(updates: { id: number; order: number }[]): Promise<void> {
  await Promise.all(
    updates.map(({ id, order }) =>
      db.update(tickets).set({ order }).where(eq(tickets.id, id)),
    ),
  )
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(ticketId: number): Promise<TicketComment[]> {
  return db
    .select()
    .from(ticketComments)
    .where(eq(ticketComments.ticketId, ticketId))
    .orderBy(asc(ticketComments.createdAt))
}

export async function addComment(ticketId: number, content: string): Promise<TicketComment> {
  const [row] = await db.insert(ticketComments).values({ ticketId, content }).returning()
  return row
}

export async function deleteComment(id: number): Promise<void> {
  await db.delete(ticketComments).where(eq(ticketComments.id, id))
}
