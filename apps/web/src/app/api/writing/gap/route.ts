import { streamText } from 'ai'
import { GAP_ANALYSIS_PROMPT } from '@/lib/ielts/writing/prompts'
import type { FeedbackResult } from '@/lib/db/schema'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { essay, topic, feedback, targetBand = 6.5 } = (await req.json()) as {
    essay: string
    topic: string
    feedback: FeedbackResult
    targetBand?: number
  }

  const scoresSummary = feedback.criteria
    .map((c) => `${c.criterion}: ${c.score} (target ${c.targetScore})`)
    .join('\n')

  const result = streamText({
    model: ollamaModel(),
    system: GAP_ANALYSIS_PROMPT(targetBand),
    prompt: `Essay topic: ${topic}\n\nCurrent scores:\n${scoresSummary}\n\nEssay:\n${essay}`,
  })

  return result.toTextStreamResponse()
}
