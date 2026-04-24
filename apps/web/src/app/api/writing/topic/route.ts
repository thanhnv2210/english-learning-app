import { generateText } from 'ai'
import { TOPIC_GENERATION_PROMPT } from '@/lib/ielts/writing/prompts'
import { saveWritingTopic } from '@/lib/db/writing'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type GeneratedTopic = {
  prompt: string
  taskType: string
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain } = await req.json()
  if (!domain) return Response.json({ error: 'domain is required' }, { status: 400 })

  let text: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: TOPIC_GENERATION_PROMPT(domain),
    })
    text = result.text
  } catch (err) {
    console.error('[writing/topic] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('writing/topic', text)

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
