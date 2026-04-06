import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { VOCABULARY_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export type VocabSuggestion = {
  word: string
  suggestion: string
  reason: string
}

export type VocabResult = {
  informalWords: VocabSuggestion[]
}

export async function POST(req: Request) {
  const { essay, topic } = (await req.json()) as { essay: string; topic: string }

  const { text } = await generateText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    system: VOCABULARY_PROMPT,
    prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ informalWords: [] })

  const result: VocabResult = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
