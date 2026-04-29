import { streamText } from 'ai'
import { TASK1_SCORING_PROMPT } from '@/lib/ielts/writing/prompts-task1'
import { OLLAMA_ENABLED, aiScoringModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { response, question, data, targetBand = 6.5 } = (await req.json()) as {
    response: string
    question: string
    data: string
    targetBand?: number
  }

  const result = streamText({
    model: aiScoringModel(),
    system: TASK1_SCORING_PROMPT(targetBand),
    prompt: `Task 1 question: ${question}\n\nChart data:\n${data}\n\nStudent response:\n${response}`,
  })

  return result.toTextStreamResponse()
}
