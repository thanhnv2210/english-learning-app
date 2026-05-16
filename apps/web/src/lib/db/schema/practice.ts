import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  jsonb,
  boolean,
  primaryKey,
  check,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { users, type TranscriptMessage, type FeedbackResult } from './auth'
import { vocabularyWords } from './content'

// ─── Cue cards (Part 2 — generated per session) ───────────────────────────────

export const cueCards = pgTable('cue_cards', {
  id: serial('id').primaryKey(),
  prompt: text('prompt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Mock exam history ────────────────────────────────────────────────────────

export const mockExams = pgTable('mock_exams', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  skill: text('skill').notNull(),
  transcript: jsonb('transcript').notNull().$type<TranscriptMessage[]>(),
  isFavorite: boolean('is_favorite').notNull().default(false),
  feedback: jsonb('feedback').$type<FeedbackResult>(),
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

// ─── Connected speech analysis history ───────────────────────────────────────

export const connectedSpeechAnalyses = pgTable('connected_speech_analyses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  originalText: text('original_text').notNull(),
  transformedText: text('transformed_text').notNull(),
  instances: jsonb('instances').notNull().$type<import('@/lib/ielts/connected-speech/prompts').ConnectedSpeechInstance[]>(),
  phenomena: jsonb('phenomena').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Read-Aloud Drill ─────────────────────────────────────────────────────────

export type DrillMistakeSaved = {
  type: 'sub' | 'del'
  original: string
  spoken?: string
  context: string
  csPhenomenon?: string
  csTip?: string
}

export type DrillCsInstance = {
  original: string
  transformed: string
  phenomenon: string
  description: string
  tip: string
}

export type DrillCsAnalysis = {
  transformedText: string
  instances: DrillCsInstance[]
}

export const drillTexts = pgTable('drill_texts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  text: text('text').notNull(),
  category: text('category').notNull().default('General'),
  difficulty: text('difficulty').notNull().default('medium'),
  rank: integer('rank').notNull().default(3),
  isSystem: boolean('is_system').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('drill_texts_rank_check', sql`${t.rank} between 1 and 5`),
])

export const drillResults = pgTable('drill_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  drillTextId: integer('drill_text_id').references(() => drillTexts.id, { onDelete: 'set null' }),
  originalText: text('original_text').notNull(),
  spokenText: text('spoken_text').notNull(),
  accuracy: integer('accuracy').notNull(),
  correctCount: integer('correct_count').notNull(),
  totalCount: integer('total_count').notNull(),
  mistakes: jsonb('mistakes').notNull().$type<DrillMistakeSaved[]>(),
  csAnalysis: jsonb('cs_analysis').$type<DrillCsAnalysis>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Wrong Decision Log ───────────────────────────────────────────────────────

export const wrongDecisionLogs = pgTable('wrong_decision_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skill: text('skill').notNull(),
  sourceText: text('source_text'),
  question: text('question').notNull(),
  myThought: text('my_thought').notNull(),
  actualAnswer: text('actual_answer').notNull(),
  questionType: text('question_type'),
  articleStructure: text('article_structure'),
  analytic: text('analytic'),
  solution: text('solution'),
  questionRoles: jsonb('question_roles').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Word Sentences ───────────────────────────────────────────────────────────

export const wordSentences = pgTable('word_sentences', {
  id: serial('id').primaryKey(),
  wordId: integer('word_id')
    .notNull()
    .references(() => vocabularyWords.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sentence: text('sentence').notNull(),
  context: text('context').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Sentence Practice ────────────────────────────────────────────────────────

export const sentencePracticeSessions = pgTable('sentence_practice_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  gameType: text('game_type').notNull(),
  wordId: integer('word_id').references(() => vocabularyWords.id, { onDelete: 'set null' }),
  completedAt: timestamp('completed_at'),
  score: integer('score'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const sentencePracticeResults = pgTable('sentence_practice_results', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id')
    .notNull()
    .references(() => sentencePracticeSessions.id, { onDelete: 'cascade' }),
  sentenceId: integer('sentence_id')
    .notNull()
    .references(() => wordSentences.id, { onDelete: 'cascade' }),
  correct: boolean('correct'),
  timeMs: integer('time_ms'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

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

export const wordSentencesRelations = relations(wordSentences, ({ one, many }) => ({
  word: one(vocabularyWords, { fields: [wordSentences.wordId], references: [vocabularyWords.id] }),
  practiceResults: many(sentencePracticeResults),
}))

export const sentencePracticeSessionsRelations = relations(sentencePracticeSessions, ({ one, many }) => ({
  user: one(users, { fields: [sentencePracticeSessions.userId], references: [users.id] }),
  word: one(vocabularyWords, { fields: [sentencePracticeSessions.wordId], references: [vocabularyWords.id] }),
  results: many(sentencePracticeResults),
}))

export const sentencePracticeResultsRelations = relations(sentencePracticeResults, ({ one }) => ({
  session: one(sentencePracticeSessions, { fields: [sentencePracticeResults.sessionId], references: [sentencePracticeSessions.id] }),
  sentence: one(wordSentences, { fields: [sentencePracticeResults.sentenceId], references: [wordSentences.id] }),
}))
