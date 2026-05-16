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
import { users } from './auth'
import { vocabularyWords, collocationEntries, idiomEntries } from './content'

// ─── User Vocabulary (personal saved words) ──────────────────────────────────

export const userVocabulary = pgTable(
  'user_vocabulary',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    wordId: integer('word_id').notNull().references(() => vocabularyWords.id, { onDelete: 'cascade' }),
    rank: integer('rank').notNull().default(1),
    savedAt: timestamp('saved_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.wordId] })]
)

// ─── User Collocations & Idioms (personal saved lists) ───────────────────────

export const userCollocations = pgTable(
  'user_collocations',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    collocationId: integer('collocation_id').notNull().references(() => collocationEntries.id, { onDelete: 'cascade' }),
    rank: integer('rank').notNull().default(1),
    savedAt: timestamp('saved_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.collocationId] })]
)

export const userIdioms = pgTable(
  'user_idioms',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    idiomId: integer('idiom_id').notNull().references(() => idiomEntries.id, { onDelete: 'cascade' }),
    rank: integer('rank').notNull().default(1),
    savedAt: timestamp('saved_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.idiomId] })]
)

// ─── Per-user skill topic favourites ─────────────────────────────────────────

export const userSkillTopics = pgTable(
  'user_skill_topics',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    skill: text('skill').notNull(),
    topicName: text('topic_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.skill, t.topicName] })]
)

// ─── Spaced Repetition (SM-2) ─────────────────────────────────────────────────

export const wordReviewStates = pgTable('word_review_states', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  wordId: integer('word_id')
    .notNull()
    .references(() => vocabularyWords.id, { onDelete: 'cascade' }),
  interval: integer('interval').notNull().default(1),
  easeFactor: real('ease_factor').notNull().default(2.5),
  repetitions: integer('repetitions').notNull().default(0),
  nextReview: timestamp('next_review').notNull().defaultNow(),
  lastReview: timestamp('last_review'),
},
(t) => [unique('word_review_states_user_word_unique').on(t.userId, t.wordId)]
)

// ─── Official IELTS Exam Results ─────────────────────────────────────────────

export const officialIeltsResults = pgTable('official_ielts_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  examDate: text('exam_date').notNull(),
  listening: real('listening').notNull(),
  reading: real('reading').notNull(),
  writing: real('writing').notNull(),
  speaking: real('speaking').notNull(),
  overall: real('overall').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Essay Builder selection config ──────────────────────────────────────────

export const essayBuilderConfigs = pgTable(
  'essay_builder_configs',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    domain: text('domain').notNull(),
    skill: text('skill').notNull(),
    selectedVocabulary: jsonb('selected_vocabulary').notNull().$type<string[]>(),
    selectedCollocations: jsonb('selected_collocations').notNull().$type<string[]>(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.domain, t.skill] })],
)

// ─── AI Essay Builder history ─────────────────────────────────────────────────

export const aiGeneratedContent = pgTable('ai_generated_content', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  skill: text('skill').notNull(),
  domain: text('domain').notNull(),
  topic: text('topic').notNull(),
  selectedVocabulary: jsonb('selected_vocabulary').notNull().$type<string[]>(),
  selectedCollocations: jsonb('selected_collocations').notNull().$type<string[]>(),
  originalGeneratedText: text('original_generated_text').notNull(),
  decoratedText: text('decorated_text').notNull(),
  targetBand: real('target_band').notNull().default(6.5),
  isFavorite: boolean('is_favorite').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const userSkillTopicsRelations = relations(userSkillTopics, ({ one }) => ({
  user: one(users, { fields: [userSkillTopics.userId], references: [users.id] }),
}))
