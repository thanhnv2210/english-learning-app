import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  real,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('student'),            // 'student' | 'admin'
  status: text('status').notNull().default('active'),         // 'active' | 'pending'
  tier: text('tier').notNull().default('free'),              // 'free' | 'vip'
  modelPreference: text('model_preference').notNull().default('auto'), // 'auto' | 'free'
  // e.g. 'IELTS_Academic_6.5', 'IELTS_Academic_7.5', 'Business_Fluent'
  targetProfile: text('target_profile').notNull().default('IELTS_Academic_6.5'),
  favouritePages: jsonb('favourite_pages').$type<string[]>().notNull().default([]),
  showSystemData: boolean('show_system_data').notNull().default(true),
  lastActiveAt: timestamp('last_active_at'),
  consentedAt: timestamp('consented_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  returningUser: boolean('returning_user').notNull().default(false),
  unlockedPages: jsonb('unlocked_pages').$type<string[]>().notNull().default([]),
  bio: text('bio'),
  onboardingReasons: jsonb('onboarding_reasons').$type<string[]>(),
  weakSkills: jsonb('weak_skills').$type<string[]>(),
})

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(),
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

// ─── Shared types ─────────────────────────────────────────────────────────────

export type TranscriptMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type FeedbackCriterion = {
  criterion: string
  score: number
  targetScore: number
  keyPoints: string[]
}

export type FeedbackResult = {
  overallBand: number
  targetBand: number
  criteria: FeedbackCriterion[]
}
