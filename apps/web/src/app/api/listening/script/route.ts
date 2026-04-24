import { generateText } from 'ai'
import { LISTENING_SCRIPT_PROMPT } from '@/lib/ielts/listening/prompts'
import type { ListeningTurn, ListeningQuestion } from '@/lib/db/schema'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type GeneratedScript = {
  title: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  let text: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt: LISTENING_SCRIPT_PROMPT(domain) })
    text = result.text
  } catch (err) {
    console.error('[listening/script] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('listening/script', text)

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  try {
    const parsed: GeneratedScript = JSON.parse(cleaned)
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
  }
}
