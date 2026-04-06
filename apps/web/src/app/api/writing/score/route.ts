import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { SCORING_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
  const { essay, topic, targetBand = 6.5 } = (await req.json()) as {
    essay: string
    topic: string
    targetBand?: number
  }

  const result = streamText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    system: SCORING_PROMPT(targetBand),
    prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
  })

  return result.toTextStreamResponse()
}
