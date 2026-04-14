import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { SAMPLE_RESPONSE_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export type SampleResponse = {
  essay: string
  mainIdeas: string[]
  collocations: { phrase: string; usage: string }[]
}

export async function POST(req: Request) {
  const { topic, targetBand } = await req.json()
  if (!topic) return Response.json({ error: 'topic is required' }, { status: 400 })

  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'
  const result = streamText({
    model: ollama(model),
    system: SAMPLE_RESPONSE_PROMPT(targetBand ?? 6.5),
    prompt: `Essay topic: ${topic}`,
  })

  return result.toTextStreamResponse()
}
