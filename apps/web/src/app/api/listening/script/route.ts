import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { LISTENING_SCRIPT_PROMPT } from '@/lib/ielts/listening/prompts'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export type GeneratedScript = {
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}

export async function POST(req: Request) {
  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  const model = process.env.OLLAMA_MODEL ?? 'mistral:latest'
  const { text } = await generateText({
    model: ollama(model),
    prompt: LISTENING_SCRIPT_PROMPT(domain),
  })

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  try {
    const parsed: GeneratedScript = JSON.parse(cleaned)
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
  }
}
