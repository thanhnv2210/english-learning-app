import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { TOPIC_GENERATION_PROMPT } from '@/lib/ielts/writing/prompts'
import { saveWritingTopic } from '@/lib/db/writing'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export type GeneratedTopic = {
  prompt: string
  taskType: string
}

export async function POST(req: Request) {
  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'
  const { text } = await generateText({
    model: ollama(model),
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
