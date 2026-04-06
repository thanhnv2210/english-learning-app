import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { GAP_ANALYSIS_PROMPT } from '@/lib/ielts/writing/prompts'
import type { FeedbackResult } from '@/lib/db/schema'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
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
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    system: GAP_ANALYSIS_PROMPT(targetBand),
    prompt: `Essay topic: ${topic}\n\nCurrent scores:\n${scoresSummary}\n\nEssay:\n${essay}`,
  })

  return result.toTextStreamResponse()
}
