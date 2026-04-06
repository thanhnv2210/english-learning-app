'use server'

import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { TOPIC_GENERATION_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function generateWritingTopic(domain: string): Promise<string> {
  const { text } = await generateText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    prompt: TOPIC_GENERATION_PROMPT(domain),
  })
  return text.trim()
}
