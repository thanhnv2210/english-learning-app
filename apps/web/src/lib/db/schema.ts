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
  check,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ─── Existing tables ──────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  // e.g. 'IELTS_Academic_6.5', 'IELTS_Academic_7.5', 'Business_Fluent'
  targetProfile: text('target_profile').notNull().default('IELTS_Academic_6.5'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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

// ─── Cue cards (Part 2 — generated per session) ───────────────────────────────

export const cueCards = pgTable('cue_cards', {
  id: serial('id').primaryKey(),
  prompt: text('prompt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Mock exam history ────────────────────────────────────────────────────────

export const mockExams = pgTable('mock_exams', {
  id: serial('id').primaryKey(),
  // 'speaking' = Part 1 | 'speaking_part2' = Part 2 | 'writing'
  skill: text('skill').notNull(),
  transcript: jsonb('transcript').notNull().$type<TranscriptMessage[]>(),
  isFavorite: boolean('is_favorite').notNull().default(false),
  // Nullable — populated after user requests feedback
  feedback: jsonb('feedback').$type<FeedbackResult>(),
  // Only set for Part 2 sessions
  cueCardId: integer('cue_card_id').references(() => cueCards.id),
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

// ─── Vocabulary word catalogue ────────────────────────────────────────────────

export type VocabWordFamily = {
  noun?: string | null
  verb?: string | null
  adjective?: string | null
  adverb?: string | null
}

export type VocabSynonym = {
  word: string
  type: 'synonym' | 'antonym'
}

export type VocabExamples = {
  speaking: string
  writing: [string, string]
}

export const vocabularyWords = pgTable('vocabulary_words', {
  id: serial('id').primaryKey(),
  word: text('word').notNull().unique(),
  definition: text('definition').notNull(),
  familyWords: jsonb('family_words').notNull().$type<VocabWordFamily>(),
  synonyms: jsonb('synonyms').notNull().$type<VocabSynonym[]>(),
  collocations: jsonb('collocations').notNull().$type<string[]>(),
  examples: jsonb('examples').notNull().$type<VocabExamples>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const vocabularyWordDomains = pgTable(
  'vocabulary_word_domains',
  {
    wordId: integer('word_id')
      .notNull()
      .references(() => vocabularyWords.id, { onDelete: 'cascade' }),
    domainId: integer('domain_id')
      .notNull()
      .references(() => writingDomains.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.wordId, t.domainId] })]
)

// ─── Reading passage library ──────────────────────────────────────────────────

// Inline type — keeps schema.ts free of lib/ielts imports
export type ReadingQuestionRow = {
  id: number
  type: 'tfng' | 'short_answer'
  question: string
  answer: string
}

export const readingPassages = pgTable('reading_passages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  passage: text('passage').notNull(),
  questions: jsonb('questions').notNull().$type<ReadingQuestionRow[]>(),
  rank: integer('rank').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('reading_passages_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Listening script library ─────────────────────────────────────────────────

export type ListeningTurn = {
  speaker: 'A' | 'B'
  text: string
}

export type ListeningQuestion = {
  id: number
  sentence: string  // e.g. "The team chose ___ as the primary database."
  answer: string    // 1–3 exact words from the transcript
}

export const listeningScripts = pgTable('listening_scripts', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull(),
  title: text('title').notNull(),
  transcript: jsonb('transcript').notNull().$type<ListeningTurn[]>(),
  questions: jsonb('questions').notNull().$type<ListeningQuestion[]>(),
  rank: integer('rank').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('listening_scripts_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Speaking Part 1 topic catalogue ─────────────────────────────────────────

export const speakingTopics = pgTable('speaking_topics', {
  id: serial('id').primaryKey(),
  rank: integer('rank').notNull().unique(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  exampleQuestions: jsonb('example_questions').notNull().$type<string[]>(),
})

// ─── Speaking Part 2 topic catalogue ─────────────────────────────────────────
// Seed-managed via: pnpm db:seed:speaking-part2-topics
// TODO: Replace seed-based management with an Admin UI once user/role-based
//       access control is implemented (Phase 4+). The admin panel should allow
//       authorised users to reorder, edit, and add Part 2 topic categories
//       without a code deploy.

export const speakingPart2Topics = pgTable('speaking_part2_topics', {
  id: serial('id').primaryKey(),
  rank: integer('rank').notNull().unique(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  examplePrompts: jsonb('example_prompts').notNull().$type<string[]>(),
})

// ─── Writing topic library ────────────────────────────────────────────────────

export const writingTopics = pgTable('writing_topics', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull(),
  prompt: text('prompt').notNull(),
  taskType: text('task_type').notNull(), // 'opinion' | 'discussion' | 'problem_solution' | 'two_part'
  rank: integer('rank').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('writing_topics_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Writing domain catalogue ─────────────────────────────────────────────────

export const writingDomains = pgTable('writing_domains', {
  id: serial('id').primaryKey(),
  rank: integer('rank').notNull().unique(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  category: text('category').notNull(),
})

// ─── Per-user domain selection ────────────────────────────────────────────────

export const userDomainPreferences = pgTable(
  'user_domain_preferences',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    domainId: integer('domain_id')
      .notNull()
      .references(() => writingDomains.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.domainId] })]
)

// ─── Connected speech analysis history ───────────────────────────────────────

export const connectedSpeechAnalyses = pgTable('connected_speech_analyses', {
  id: serial('id').primaryKey(),
  originalText: text('original_text').notNull(),
  transformedText: text('transformed_text').notNull(),
  instances: jsonb('instances').notNull().$type<import('@/lib/ielts/connected-speech/prompts').ConnectedSpeechInstance[]>(),
  phenomena: jsonb('phenomena').notNull().$type<string[]>(), // deduplicated list for filtering
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Collocation entry library ────────────────────────────────────────────────

export type CollocationSkill = 'Writing_1' | 'Writing_2' | 'Speaking'

export const collocationEntries = pgTable('collocation_entries', {
  id: serial('id').primaryKey(),
  phrase: text('phrase').notNull().unique(),
  type: text('type').notNull(),
  explanation: text('explanation'),
  skills: jsonb('skills').notNull().$type<CollocationSkill[]>(),
  examples: jsonb('examples').notNull().$type<string[]>(),
  rank: integer('rank').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('collocation_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Relations ────────────────────────────────────────────────────────────────

export const cueCardsRelations = relations(cueCards, ({ many }) => ({
  exams: many(mockExams),
}))

export const mockExamsRelations = relations(mockExams, ({ many, one }) => ({
  examTags: many(examTags),
  cueCard: one(cueCards, { fields: [mockExams.cueCardId], references: [cueCards.id] }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  examTags: many(examTags),
}))

export const examTagsRelations = relations(examTags, ({ one }) => ({
  exam: one(mockExams, { fields: [examTags.examId], references: [mockExams.id] }),
  tag: one(tags, { fields: [examTags.tagId], references: [tags.id] }),
}))

export const writingDomainsRelations = relations(writingDomains, ({ many }) => ({
  userPreferences: many(userDomainPreferences),
  vocabularyWordDomains: many(vocabularyWordDomains),
}))

export const vocabularyWordsRelations = relations(vocabularyWords, ({ many }) => ({
  domains: many(vocabularyWordDomains),
}))

export const vocabularyWordDomainsRelations = relations(vocabularyWordDomains, ({ one }) => ({
  word: one(vocabularyWords, { fields: [vocabularyWordDomains.wordId], references: [vocabularyWords.id] }),
  domain: one(writingDomains, { fields: [vocabularyWordDomains.domainId], references: [writingDomains.id] }),
}))

export const userDomainPreferencesRelations = relations(userDomainPreferences, ({ one }) => ({
  user: one(users, { fields: [userDomainPreferences.userId], references: [users.id] }),
  domain: one(writingDomains, { fields: [userDomainPreferences.domainId], references: [writingDomains.id] }),
}))
