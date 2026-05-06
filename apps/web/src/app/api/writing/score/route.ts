import { streamText } from 'ai'
import { SCORING_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, getModelForTier, ollamaDisabledResponse } from '@/lib/ai-client'
import { getUserAIContext } from '@/lib/db/user'
import { checkWritingScoreUsage, incrementWritingScore } from '@/lib/db/usage'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { userId, tier, modelPreference } = await getUserAIContext()

  const { allowed, used, limit } = await checkWritingScoreUsage(userId, tier)
  if (!allowed) {
    return Response.json(
      {
        error: `Bạn đã dùng hết ${limit} lần chấm điểm miễn phí trong tháng này. Nâng lên VIP để dùng không giới hạn.`,
        code: 'USAGE_LIMIT',
        used,
        limit,
      },
      { status: 429 }
    )
  }

  const { essay, topic, targetBand = 6.5 } = (await req.json()) as {
    essay: string
    topic: string
    targetBand?: number
  }

  await incrementWritingScore(userId)

  const result = streamText({
    model: getModelForTier(tier, 'scoring', modelPreference),
    system: SCORING_PROMPT(targetBand),
    prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
  })

  return result.toTextStreamResponse()
}
