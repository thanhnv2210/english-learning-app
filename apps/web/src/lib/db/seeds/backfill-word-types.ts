/**
 * Migration: backfill word_type for all vocabulary words that have NULL word_type.
 *
 * Run with:
 *   pnpm db:backfill:word-types
 *
 * Uses Ollama to determine the part of speech for each word.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { isNull, eq } from 'drizzle-orm'
import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import * as schema from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})
const model = ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b')

const VALID_TYPES = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'conjunction', 'preposition']

async function detectWordType(word: string, definition: string): Promise<string | null> {
  const prompt = `What is the primary part of speech for the English word "${word}"?
Definition: "${definition}"

Reply with ONLY one of these values — nothing else:
noun, verb, adjective, adverb, phrase, conjunction, preposition`

  try {
    const { text } = await generateText({ model, prompt })
    const result = text.trim().toLowerCase().replace(/[^a-z]/g, '')
    return VALID_TYPES.includes(result) ? result : null
  } catch {
    return null
  }
}

async function main() {
  console.log('Fetching words with no word type...')

  const words = await db
    .select({
      id: schema.vocabularyWords.id,
      word: schema.vocabularyWords.word,
      definition: schema.vocabularyWords.definition,
    })
    .from(schema.vocabularyWords)
    .where(isNull(schema.vocabularyWords.wordType))

  console.log(`Found ${words.length} words to update.\n`)

  let updated = 0
  let failed = 0

  for (const row of words) {
    process.stdout.write(`  ${row.word} → `)
    const wordType = await detectWordType(row.word, row.definition)

    if (wordType) {
      await db
        .update(schema.vocabularyWords)
        .set({ wordType })
        .where(eq(schema.vocabularyWords.id, row.id))
      console.log(wordType)
      updated++
    } else {
      console.log('(skipped — unclear result)')
      failed++
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${failed}`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
