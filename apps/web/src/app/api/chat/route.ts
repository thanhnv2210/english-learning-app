import { streamText } from 'ai'
import { IELTS_PART1_EXAMINER_PROMPT } from '@/lib/ielts/examiner/prompt'
import { IELTS_PART2_EXAMINER_PROMPT, IELTS_PART3_EXAMINER_PROMPT } from '@/lib/ielts/examiner/part2-prompt'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { messages, mode, cueCardPrompt, topic } = await req.json()

  const system =
    mode === 'part2' && cueCardPrompt
      ? IELTS_PART2_EXAMINER_PROMPT(cueCardPrompt)
      : mode === 'part3' && cueCardPrompt
        ? IELTS_PART3_EXAMINER_PROMPT(cueCardPrompt)
        : IELTS_PART1_EXAMINER_PROMPT(topic ?? undefined)

  const result = streamText({ model: ollamaModel(), system, messages })
  return result.toDataStreamResponse()
}
