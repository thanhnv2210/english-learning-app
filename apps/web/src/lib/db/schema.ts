import { pgTable, serial, text, timestamp, real, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  targetProfile: text('target_profile').notNull().default('IELTS_6.5'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  type: text('type').notNull(), // 'writing' | 'speaking'
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const feedbackResults = pgTable('feedback_results', {
  id: serial('id').primaryKey(),
  sessionId: serial('session_id').references(() => sessions.id),
  criterion: text('criterion').notNull(), // 'Task Response' | 'Coherence' | 'Lexical Resource' | 'Grammatical Range'
  score: real('score').notNull(),
  suggestions: jsonb('suggestions').notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
