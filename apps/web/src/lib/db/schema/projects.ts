import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  unique,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  key: text('key').notNull(),                // short code e.g. "PROJ"; unique per user
  description: text('description'),
  ticketCounter: integer('ticket_counter').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.key)])

export const sprints = pgTable('sprints', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  goal: text('goal'),
  status: text('status').notNull().default('planning'), // planning | active | completed
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  sprintId: integer('sprint_id').references(() => sprints.id, { onDelete: 'set null' }),
  templateId: integer('template_id'),       // FK to tickets.id — set after table defined via relation
  key: text('key').notNull().unique(),       // e.g. "PROJ-1"
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'),
  priority: text('priority').notNull().default('medium'),
  type: text('type').notNull().default('task'),
  epic: text('epic'),
  isTemplate: boolean('is_template').notNull().default(false),
  isSystem: boolean('is_system').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ticketComments = pgTable('ticket_comments', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Ticket Completions (habit tracker for recurring tasks) ───────────────────

export const ticketCompletions = pgTable(
  'ticket_completions',
  {
    id: serial('id').primaryKey(),
    ticketId: integer('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
    completedDate: text('completed_date').notNull(), // ISO 'YYYY-MM-DD'
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.ticketId, t.completedDate)],
)

export const projectEpics = pgTable('project_epics', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  value: text('value').notNull(),   // slug, unique per project
  colorKey: text('color_key').notNull().default('rose'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ many }) => ({
  sprints: many(sprints),
  tickets: many(tickets),
  epics: many(projectEpics),
}))

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  project: one(projects, { fields: [sprints.projectId], references: [projects.id] }),
  tickets: many(tickets),
}))

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  project: one(projects, { fields: [tickets.projectId], references: [projects.id] }),
  sprint: one(sprints, { fields: [tickets.sprintId], references: [sprints.id] }),
  comments: many(ticketComments),
}))

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketComments.ticketId], references: [tickets.id] }),
}))
