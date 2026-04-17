import { streamText } from 'ai'
import { SAMPLE_RESPONSE_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type SampleResponse = {
  essay: string
  mainIdeas: string[]
  collocations: { phrase: string; usage: string }[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { topic, targetBand } = await req.json()
  if (!topic) return Response.json({ error: 'topic is required' }, { status: 400 })

  const result = streamText({
    model: ollamaModel(),
    system: SAMPLE_RESPONSE_PROMPT(targetBand ?? 6.5),
    prompt: `Essay topic: ${topic}`,
  })

  return result.toTextStreamResponse()
}
