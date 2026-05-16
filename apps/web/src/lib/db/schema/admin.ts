import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { users } from './auth'

// ─── User feedback & bug reports ─────────────────────────────────────────────

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: text('type').notNull().default('suggestion'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Page config (tags + disable) ────────────────────────────────────────────

export const pageConfigs = pgTable('page_configs', {
  href: text('href').primaryKey(),
  tag: text('tag'),
  isDisabled: boolean('is_disabled').notNull().default(false),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Monthly AI usage tracking ───────────────────────────────────────────────

export const userUsage = pgTable(
  'user_usage',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    month: text('month').notNull(),
    writingScores: integer('writing_scores').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.month] })]
)

// ─── Campaign configuration ───────────────────────────────────────────────────

export const campaignConfigs = pgTable('campaign_configs', {
  id: serial('id').primaryKey(),
  isActive: boolean('is_active').notNull().default(false),
  userLimit: integer('user_limit').notNull().default(100),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Partner inquiries ────────────────────────────────────────────────────────

export const partnerInquiries = pgTable('partner_inquiries', {
  id:        serial('id').primaryKey(),
  email:     text('email').notNull(),
  phone:     text('phone').notNull(),
  tag:       text('tag').notNull().default('other'),
  message:   text('message').notNull(),
  status:    text('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
