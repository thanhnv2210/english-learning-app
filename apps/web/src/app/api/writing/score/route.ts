import { streamText } from 'ai'
import { SCORING_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, getModelForTier, ollamaDisabledResponse } from '@/lib/ai-client'
import { getUserAIContext } from '@/lib/db/user'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { tier, modelPreference } = await getUserAIContext()

  const { essay, topic, targetBand = 6.5 } = (await req.json()) as {
    essay: string
    topic: string
    targetBand?: number
  }

  const result = streamText({
    model: getModelForTier(tier, 'scoring', modelPreference),
    system: SCORING_PROMPT(targetBand),
    prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
  })

  return result.toTextStreamResponse()
}
