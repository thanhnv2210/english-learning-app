'use server'

import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { db } from '@/lib/db'
import { cueCards } from '@/lib/db/schema'
import { CUE_CARD_GENERATION_PROMPT } from '@/lib/ielts/examiner/part2-prompt'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function generateAndSaveCueCard(topic?: {
  name: string
  description: string
  examplePrompts: string[]
}): Promise<{ id: number; prompt: string }> {
  const { text } = await generateText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'mistral:latest'),
    prompt: CUE_CARD_GENERATION_PROMPT(topic),
  })

  const [cueCard] = await db
    .insert(cueCards)
    .values({ prompt: text.trim() })
    .returning()

  return cueCard
}
