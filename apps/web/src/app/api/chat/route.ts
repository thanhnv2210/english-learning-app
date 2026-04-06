import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { IELTS_PART1_EXAMINER_PROMPT } from '@/lib/ielts/examiner/prompt'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const model = process.env.OLLAMA_MODEL ?? 'mistral:latest'

  const result = streamText({
    model: ollama(model),
    system: IELTS_PART1_EXAMINER_PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
