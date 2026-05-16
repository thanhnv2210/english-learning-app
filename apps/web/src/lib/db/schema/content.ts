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
import { users } from './auth'

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
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
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
  aiModel: text('ai_model'),
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

export type ReadingQuestionRow = {
  id: number
  type: 'tfng' | 'short_answer' | 'multiple_choice' | 'matching_headings'
  question: string
  options?: string[]
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
  sentence: string
  answer: string
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

// ─── Speaking topic catalogues ────────────────────────────────────────────────

export const speakingTopics = pgTable('speaking_topics', {
  id: serial('id').primaryKey(),
  rank: integer('rank').notNull().unique(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  exampleQuestions: jsonb('example_questions').notNull().$type<string[]>(),
})

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
  taskType: text('task_type').notNull(),
  rank: integer('rank').notNull().default(1),
  isSystem: boolean('is_system').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('writing_topics_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Collocation entry library ────────────────────────────────────────────────

export type CollocationSkill = 'Writing_1' | 'Writing_2' | 'Speaking'

export const collocationEntries = pgTable('collocation_entries', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
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

// ─── Idiom entry library ──────────────────────────────────────────────────────

export type IdiomSkill = 'Writing_1' | 'Writing_2' | 'Speaking'
export type IdiomContext = 'Speaking' | 'Writing' | 'News' | 'Book' | 'Podcast' | 'Other'

export const idiomEntries = pgTable('idiom_entries', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  idiom: text('idiom').notNull().unique(),
  meaning: text('meaning').notNull(),
  register: text('register').notNull().default('neutral'),
  skills: jsonb('skills').notNull().$type<IdiomSkill[]>(),
  contexts: jsonb('contexts').notNull().$type<IdiomContext[]>(),
  examples: jsonb('examples').notNull().$type<string[]>(),
  rank: integer('rank').notNull().default(3),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('idiom_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Word / phrase comparison library ────────────────────────────────────────

export type ComparisonTerm = {
  register: string
  ieltsWriting: string
  ieltsSpeaking: string
  intensity?: number
  note?: string
}

export type ComparisonExamplePair = {
  context: string
  withA: string
  withB: string
}

export const comparisonEntries = pgTable('comparison_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  termA: text('term_a').notNull(),
  termB: text('term_b').notNull(),
  category: text('category').notNull(),
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

// ─── Vocabulary Banks ─────────────────────────────────────────────────────────

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
  type: text('type').notNull(),
  meaning: text('meaning').notNull(),
  example: text('example').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Grammar Trap entry library ───────────────────────────────────────────────

export type GrammarTrapCategory =
  | 'uncountable'
  | 'always_plural'
  | 'false_singular'
  | 'number_agreement'
  | 'collective'

export type GrammarTrapExample = { wrong: string; correct: string }

export const grammarTrapEntries = pgTable('grammar_trap_entries', {
  id: serial('id').primaryKey(),
  phrase: text('phrase').notNull().unique(),
  correction: text('correction').notNull(),
  category: text('category').notNull(),
  explanation: text('explanation').notNull(),
  examples: jsonb('examples').notNull().$type<GrammarTrapExample[]>().default([]),
  rank: integer('rank').notNull().default(3),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('grammar_trap_entries_rank_check', sql`${t.rank} between 1 and 5`),
])

// ─── Word Pairs ───────────────────────────────────────────────────────────────

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

// ─── Speaking Phrase Bank ─────────────────────────────────────────────────────

export const speakingPhrases = pgTable('speaking_phrases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  phrase: text('phrase').notNull(),
  category: text('category').notNull().default('Other'),
  skill: text('skill').notNull().default('speaking'),
  note: text('note'),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

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

export const vocabBanksRelations = relations(vocabBanks, ({ many }) => ({
  words: many(vocabBankWords),
}))

export const vocabBankWordsRelations = relations(vocabBankWords, ({ one }) => ({
  bank: one(vocabBanks, { fields: [vocabBankWords.bankId], references: [vocabBanks.id] }),
}))
