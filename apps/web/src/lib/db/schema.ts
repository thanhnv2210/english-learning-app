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
  favouritePages: jsonb('favourite_pages').$type<string[]>().notNull().default([]),
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

export type VocabPronunciation = {
  uk: string
  us: string
  ukAudio?: string
  usAudio?: string
}

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
  pronunciation: jsonb('pronunciation').$type<VocabPronunciation>(),
  wordType: text('word_type'),
  rank: integer('rank').notNull().default(3),
  userAdded: boolean('user_added').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('vocabulary_words_rank_check', sql`${t.rank} between 1 and 5`),
])

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

// ─── Essay Builder selection config (persisted per user × domain × skill) ────
// Replaces localStorage — enables cross-device / cross-browser persistence.
// One row per (userId, domain, skill); upserted on every selection change.

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
// Separate from mockExams — stores richer context (domain, vocab/collocation selections)

export const aiGeneratedContent = pgTable('ai_generated_content', {
  id: serial('id').primaryKey(),
  skill: text('skill').notNull(), // 'writing_task1' | 'writing_task2' | 'speaking'
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

// ─── Per-user skill topic favourites ─────────────────────────────────────────
// Generic table — one row per (user, skill, topicName).
// skill values: 'vocabulary' | 'speaking' | 'writing' | 'listening' | 'reading'
// New users get a default set seeded on first fetch (lazy init in lib/db/user-skill-topics.ts).
// TODO: implement for speaking, writing, listening, reading (backlog)

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

// ─── Wrong Decision Log ───────────────────────────────────────────────────────
// Manual journal: learner records a wrong answer, their reasoning, the correct
// answer, and AI-generated (or hand-written) analytic + prevention strategy.
// questionRoles: subset of QuestionRole values from lib/guides/question-anatomy

export const wrongDecisionLogs = pgTable('wrong_decision_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skill: text('skill').notNull(), // 'reading' | 'listening' | 'speaking' | 'writing'
  sourceText: text('source_text'),          // nullable — passage / transcript
  question: text('question').notNull(),
  myThought: text('my_thought').notNull(),
  actualAnswer: text('actual_answer').notNull(),
  questionType: text('question_type'),      // nullable — e.g. 'True/False/NG', 'Matching Headings'
  articleStructure: text('article_structure'), // nullable — reading only, e.g. 'Problem → Solution'
  analytic: text('analytic'),               // nullable — AI or manual explanation
  solution: text('solution'),               // nullable — AI or manual prevention tip
  questionRoles: jsonb('question_roles').notNull().$type<string[]>(), // QuestionRole[]
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

export const writingDomainsRelations = relations(writingDomains, ({ many }) => ({
  userPreferences: many(userDomainPreferences),
  vocabularyWordDomains: many(vocabularyWordDomains),
}))

// ─── Word Sentences ───────────────────────────────────────────────────────────

export const wordSentences = pgTable('word_sentences', {
  id: serial('id').primaryKey(),
  wordId: integer('word_id')
    .notNull()
    .references(() => vocabularyWords.id, { onDelete: 'cascade' }),
  sentence: text('sentence').notNull(),
  context: text('context').notNull(), // 'Speaking' | 'Writing' | 'News' | 'Book' | 'Podcast' | 'Other'
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Sentence Practice (game-agnostic foundation) ─────────────────────────────

export const sentencePracticeSessions = pgTable('sentence_practice_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  gameType: text('game_type').notNull(), // 'flashcard' | 'fill_blank' | 'multiple_choice' | ...
  wordId: integer('word_id').references(() => vocabularyWords.id, { onDelete: 'set null' }), // null = all words
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
  correct: boolean('correct'),   // null for non-binary game types
  timeMs: integer('time_ms'),    // response time in ms (optional)
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

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

export const vocabularyWordsRelations = relations(vocabularyWords, ({ many }) => ({
  domains: many(vocabularyWordDomains),
  sentences: many(wordSentences),
}))

export const vocabularyWordDomainsRelations = relations(vocabularyWordDomains, ({ one }) => ({
  word: one(vocabularyWords, { fields: [vocabularyWordDomains.wordId], references: [vocabularyWords.id] }),
  domain: one(writingDomains, { fields: [vocabularyWordDomains.domainId], references: [writingDomains.id] }),
}))

export const userDomainPreferencesRelations = relations(userDomainPreferences, ({ one }) => ({
  user: one(users, { fields: [userDomainPreferences.userId], references: [users.id] }),
  domain: one(writingDomains, { fields: [userDomainPreferences.domainId], references: [writingDomains.id] }),
}))

export const userSkillTopicsRelations = relations(userSkillTopics, ({ one }) => ({
  user: one(users, { fields: [userSkillTopics.userId], references: [users.id] }),
}))
