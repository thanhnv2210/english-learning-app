import { generateText } from 'ai'
import { TOPIC_GENERATION_PROMPT } from '@/lib/ielts/writing/prompts'
import { saveWritingTopic } from '@/lib/db/writing'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type GeneratedTopic = {
  prompt: string
  taskType: string
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  const { text } = await generateText({
    model: ollamaModel(),
    prompt: TOPIC_GENERATION_PROMPT(domain),
  })

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: GeneratedTopic
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
  }

  await saveWritingTopic({ domain, prompt: parsed.prompt, taskType: parsed.taskType })

  return Response.json(parsed)
}
