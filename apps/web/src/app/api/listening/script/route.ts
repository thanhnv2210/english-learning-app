import { generateText } from 'ai'
import { LISTENING_SCRIPT_PROMPT } from '@/lib/ielts/listening/prompts'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type GeneratedScript = {
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  const { text } = await generateText({
    model: ollamaModel(),
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
