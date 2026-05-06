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
  unique,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ─── Existing tables ──────────────────────────────────────────────────────────

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
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
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
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }), // who first added this entry
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
  aiModel: text('ai_model'),  // model that generated this word, null for seeded/manual
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
  type: 'tfng' | 'short_answer' | 'multiple_choice' | 'matching_headings'
  question: string
  options?: string[]  // present for multiple_choice and matching_headings
  answer: string
}

export const readingPassages = pgTable('reading_passages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  passage: text('passage').notNull(),
  questions: jsonb('questions').notNull().$type<ReadingQuestionRow[]>(),
  rank: integer('rank').notNull().default(1),
  isSystem: boolean('is_system').notNull().default(true),
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
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(),
  title: text('title').notNull(),
  transcript: jsonb('transcript').notNull().$type<ListeningTurn[]>(),
  questions: jsonb('questions').notNull().$type<ListeningQuestion[]>(),
  rank: integer('rank').notNull().default(1),
  isSystem: boolean('is_system').notNull().default(true),
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
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(),
  prompt: text('prompt').notNull(),
  taskType: text('task_type').notNull(), // 'opinion' | 'discussion' | 'problem_solution' | 'two_part'
  rank: integer('rank').notNull().default(1),
  isSystem: boolean('is_system').notNull().default(true),
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

// ─── Vocabulary Banks ─────────────────────────────────────────────────────────
// Lightweight topic-focused word sets (e.g. "travel", "library", "hospital").
// Separate from the AWL vocabulary_words catalogue.

export const vocabBanks = pgTable('vocab_banks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  topic: text('topic').notNull().unique(),
  description: text('description').notNull().default(''),
  isSystem: boolean('is_system').notNull().default(false),
  rank: integer('rank').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('vocab_banks_rank_check', sql`${t.rank} between 1 and 5`),
])

export const vocabBankWords = pgTable('vocab_bank_words', {
  id: serial('id').primaryKey(),
  bankId: integer('bank_id').notNull().references(() => vocabBanks.id, { onDelete: 'cascade' }),
  word: text('word').notNull(),
  type: text('type').notNull(), // noun | verb | adjective | adverb | phrase
  meaning: text('meaning').notNull(),
  example: text('example').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const vocabBanksRelations = relations(vocabBanks, ({ many }) => ({
  words: many(vocabBankWords),
}))

export const vocabBankWordsRelations = relations(vocabBankWords, ({ one }) => ({
  bank: one(vocabBanks, { fields: [vocabBankWords.bankId], references: [vocabBanks.id] }),
}))

// ─── Word / phrase comparison library ────────────────────────────────────────

export type ComparisonTerm = {
  register: string       // 'formal' | 'informal' | 'neutral'
  ieltsWriting: string   // short note e.g. "Preferred in Task 2", "Avoid — too informal"
  ieltsSpeaking: string  // short note e.g. "Natural in Part 2/3"
  intensity?: number     // 1–5 for degree words; omit for others
  note?: string          // any extra nuance for this term alone
}

export type ComparisonExamplePair = {
  context: string   // shared topic e.g. "Discussing economic growth"
  withA: string     // full sentence using termA
  withB: string     // full sentence using termB
}

export const comparisonEntries = pgTable('comparison_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  termA: text('term_a').notNull(),
  termB: text('term_b').notNull(),
  category: text('category').notNull(), // 'adverb' | 'verb' | 'noun' | 'adjective' | 'conjunction' | 'preposition' | 'phrase'
  keyDifference: text('key_difference').notNull(),
  dimensionA: jsonb('dimension_a').notNull().$type<ComparisonTerm>(),
  dimensionB: jsonb('dimension_b').notNull().$type<ComparisonTerm>(),
  examples: jsonb('examples').notNull().$type<ComparisonExamplePair[]>(),
  rank: integer('rank').notNull().default(3),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('comparison_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Idiom entry library ──────────────────────────────────────────────────────

export type IdiomSkill = 'Writing_1' | 'Writing_2' | 'Speaking'
export type IdiomContext = 'Speaking' | 'Writing' | 'News' | 'Book' | 'Podcast' | 'Other'

export const idiomEntries = pgTable('idiom_entries', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }), // who first added this entry
  idiom: text('idiom').notNull().unique(),
  meaning: text('meaning').notNull(),
  register: text('register').notNull().default('neutral'), // 'formal' | 'informal' | 'neutral'
  skills: jsonb('skills').notNull().$type<IdiomSkill[]>(),
  contexts: jsonb('contexts').notNull().$type<IdiomContext[]>(),
  examples: jsonb('examples').notNull().$type<string[]>(),
  rank: integer('rank').notNull().default(3),
  isSystem: boolean('is_system').notNull().default(false), // protected seed data — cannot be deleted
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('idiom_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Collocation entry library ────────────────────────────────────────────────

export type CollocationSkill = 'Writing_1' | 'Writing_2' | 'Speaking'

export const collocationEntries = pgTable('collocation_entries', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }), // who first added this entry
  phrase: text('phrase').notNull().unique(),
  type: text('type').notNull(),
  explanation: text('explanation'),
  skills: jsonb('skills').notNull().$type<CollocationSkill[]>(),
  examples: jsonb('examples').notNull().$type<string[]>(),
  rank: integer('rank').notNull().default(3),
  isSystem: boolean('is_system').notNull().default(false),
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

// ─── Grammar Trap entry library ───────────────────────────────────────────────
// Noun form errors: uncountable nouns, number agreement, false singulars, etc.

export type GrammarTrapCategory =
  | 'uncountable'       // words with no plural: staff, advice, furniture
  | 'always_plural'     // words with no singular: scissors, trousers
  | 'false_singular'    // look plural but are singular: news, economics
  | 'number_agreement'  // plural required after numbers > 1: "3 dollars" not "3 dollar"
  | 'collective'        // team, government, committee

export type GrammarTrapExample = { wrong: string; correct: string }

export const grammarTrapEntries = pgTable('grammar_trap_entries', {
  id: serial('id').primaryKey(),
  phrase: text('phrase').notNull().unique(),        // trap form e.g. "staffs"
  correction: text('correction').notNull(),          // correct form e.g. "staff"
  category: text('category').notNull(),              // GrammarTrapCategory
  explanation: text('explanation').notNull(),
  examples: jsonb('examples').notNull().$type<GrammarTrapExample[]>().default([]),
  rank: integer('rank').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('grammar_trap_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

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
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }), // null = system sentence
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

// ─── User Vocabulary (personal saved words) ──────────────────────────────────
// Junction table: tracks which vocabulary_words each user has saved.
// vocabulary_words is a shared catalogue; this table scopes it per user.

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

// ─── Spaced Repetition (SM-2) ─────────────────────────────────────────────────
// One row per (user, word). Tracks SRS state per user.
// Rows are created on first enrol. nextReview defaults to now → due immediately.

export const wordReviewStates = pgTable('word_review_states', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  wordId: integer('word_id')
    .notNull()
    .references(() => vocabularyWords.id, { onDelete: 'cascade' }),
  interval: integer('interval').notNull().default(1),       // days until next review
  easeFactor: real('ease_factor').notNull().default(2.5),   // SM-2 multiplier
  repetitions: integer('repetitions').notNull().default(0), // consecutive correct streak
  nextReview: timestamp('next_review').notNull().defaultNow(),
  lastReview: timestamp('last_review'),
},
(t) => [unique('word_review_states_user_word_unique').on(t.userId, t.wordId)]
)

// ─── Speaking Phrase Bank ─────────────────────────────────────────────────────
// ─── Word Pairs ───────────────────────────────────────────────────────────────
// Interchangeable word pairs with explanation of difference.
// category: 'regional' | 'register' | 'formality' | 'spelling' | 'context' | 'other'

export const wordPairs = pgTable('word_pairs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  wordA: text('word_a').notNull(),
  wordB: text('word_b').notNull(),
  explanation: text('explanation').notNull(),
  examples: jsonb('examples').$type<string[]>().notNull().default([]),
  category: text('category').notNull().default('Other'),
  isSystem: boolean('is_system').notNull().default(false),
  rank: integer('rank').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// User-curated bank of sentences/phrases to mimic for speaking practice.
// category: 'opinion' | 'agreeing' | 'disagreeing' | 'buying-time' | 'describing' | 'part2-opener' | 'speculation' | 'example' | 'other'

export const speakingPhrases = pgTable('speaking_phrases', {
  id: serial('id').primaryKey(),
  // null for system/seed phrases shared across all users
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  phrase: text('phrase').notNull(),
  category: text('category').notNull().default('Other'),
  skill: text('skill').notNull().default('speaking'), // 'speaking' | 'writing'
  note: text('note'),
  isSystem: boolean('is_system').notNull().default(false),
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

// ─── User feedback & bug reports ─────────────────────────────────────────────
// type: 'bug' | 'suggestion' | 'question' | 'praise'
// status: 'new' | 'read' | 'resolved'

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: text('type').notNull().default('suggestion'), // bug | suggestion | question | praise
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),    // new | read | resolved
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Page config (tags + disable) ────────────────────────────────────────────
// One row per page href. Only pages with non-default config have rows.
// tag: 'new' | 'beta' | 'soon' | 'updated' | null
// isDisabled: hidden from sidebar nav (page still accessible by URL)

export const pageConfigs = pgTable('page_configs', {
  href: text('href').primaryKey(),
  tag: text('tag'),
  isDisabled: boolean('is_disabled').notNull().default(false),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Monthly AI usage tracking ───────────────────────────────────────────────
// One row per (user, month). Incremented on each AI scoring call.
// Free-tier users are capped at FREE_MONTHLY_SCORING_LIMIT per month.

export const userUsage = pgTable(
  'user_usage',
  {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    month: text('month').notNull(), // 'YYYY-MM'
    writingScores: integer('writing_scores').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.month] })]
)

// ─── Campaign configuration ───────────────────────────────────────────────────
// Single-row table — always upserted on id = 1.
// isActive=false → signups completely closed.
// isActive=true + userLimit reached → new signups land as status='pending'.

export const campaignConfigs = pgTable('campaign_configs', {
  id: serial('id').primaryKey(),
  isActive: boolean('is_active').notNull().default(false),
  userLimit: integer('user_limit').notNull().default(100),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Project Management ───────────────────────────────────────────────────────

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),       // short code e.g. "PROJ"
  description: text('description'),
  ticketCounter: integer('ticket_counter').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

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
  status: text('status').notNull().default('todo'), // todo | in_progress | in_review | done
  priority: text('priority').notNull().default('medium'), // low | medium | high | critical
  type: text('type').notNull().default('task'),           // task | bug | story
  epic: text('epic'),                                             // writing | reading | listening | speaking | cross-skill | null
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

export const projectsRelations = relations(projects, ({ many }) => ({
  sprints: many(sprints),
  tickets: many(tickets),
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
