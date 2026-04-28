import { generateText } from 'ai'
import { TASK1_TOPIC_GENERATION_PROMPT } from '@/lib/ielts/writing/prompts-task1'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type Task1Topic = {
  chartType: string
  title: string
  question: string
  data: string
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain, chartType } = (await req.json()) as { domain: string; chartType: string }

  let text: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: TASK1_TOPIC_GENERATION_PROMPT(domain, chartType),
    })
    text = result.text
  } catch (err) {
    console.error('[writing/task1/topic] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('writing/task1/topic', text)

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ error: 'Parse error' }, { status: 500 })

  const result: Task1Topic = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
