'use server'

import { generateText } from 'ai'
import { db } from '@/lib/db'
import { cueCards } from '@/lib/db/schema'
import { CUE_CARD_GENERATION_PROMPT } from '@/lib/ielts/examiner/part2-prompt'
import { OLLAMA_ENABLED, ollamaModel } from '@/lib/ai-client'

export async function generateAndSaveCueCard(topic?: {
  name: string
  description: string
  examplePrompts: string[]
}): Promise<{ id: number; prompt: string }> {
  if (!OLLAMA_ENABLED) throw new Error('AI features are currently unavailable. Set OLLAMA_BASE_URL and NEXT_PUBLIC_OLLAMA_ENABLED=true to enable.')

  const { text } = await generateText({
    model: ollamaModel(),
    prompt: CUE_CARD_GENERATION_PROMPT(topic),
  })

  const [cueCard] = await db
    .insert(cueCards)
    .values({ prompt: text.trim() })
    .returning()

  return cueCard
}
