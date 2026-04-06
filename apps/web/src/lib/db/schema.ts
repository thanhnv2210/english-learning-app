import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  real,
  jsonb,
  boolean,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Existing tables ──────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  targetProfile: text('target_profile').notNull().default('IELTS_6.5'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(), // 'writing' | 'speaking'
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const feedbackResults = pgTable('feedback_results', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.id),
  criterion: text('criterion').notNull(),
  score: real('score').notNull(),
  suggestions: jsonb('suggestions').notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Mock exam history ────────────────────────────────────────────────────────

export type TranscriptMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export const mockExams = pgTable('mock_exams', {
  id: serial('id').primaryKey(),
  skill: text('skill').notNull(), // 'speaking' | 'writing'
  transcript: jsonb('transcript').notNull().$type<TranscriptMessage[]>(),
  isFavorite: boolean('is_favorite').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
})

export const examTags = pgTable(
  'exam_tags',
  {
    examId: integer('exam_id')
      .notNull()
      .references(() => mockExams.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.examId, t.tagId] })]
)

// ─── Relations (for Drizzle relational query builder) ─────────────────────────

export const mockExamsRelations = relations(mockExams, ({ many }) => ({
  examTags: many(examTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  examTags: many(examTags),
}))

export const examTagsRelations = relations(examTags, ({ one }) => ({
  exam: one(mockExams, { fields: [examTags.examId], references: [mockExams.id] }),
  tag: one(tags, { fields: [examTags.tagId], references: [tags.id] }),
}))
