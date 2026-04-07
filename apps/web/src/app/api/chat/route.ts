import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { IELTS_PART1_EXAMINER_PROMPT } from '@/lib/ielts/examiner/prompt'
import { IELTS_PART2_EXAMINER_PROMPT, IELTS_PART3_EXAMINER_PROMPT } from '@/lib/ielts/examiner/part2-prompt'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
  const { messages, mode, cueCardPrompt } = await req.json()

  const model = process.env.OLLAMA_MODEL ?? 'mistral:latest'

  const system =
    mode === 'part2' && cueCardPrompt
      ? IELTS_PART2_EXAMINER_PROMPT(cueCardPrompt)
      : mode === 'part3' && cueCardPrompt
        ? IELTS_PART3_EXAMINER_PROMPT(cueCardPrompt)
        : IELTS_PART1_EXAMINER_PROMPT

  const result = streamText({ model: ollama(model), system, messages })
  return result.toDataStreamResponse()
}
