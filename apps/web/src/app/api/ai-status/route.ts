import { NextResponse } from 'next/server'
import { OLLAMA_ENABLED, OLLAMA_MODEL } from '@/lib/ai-client'

export async function GET() {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasOpenRouter = !hasAnthropic && !!process.env.OPENROUTER_API_KEY

  const provider = hasAnthropic ? 'anthropic' : hasOpenRouter ? 'openrouter' : 'ollama'

  return NextResponse.json({
    provider,
    fastModel: OLLAMA_MODEL,
    scoringModel: hasAnthropic
      ? (process.env.ANTHROPIC_SCORING_MODEL ?? 'claude-sonnet-4-6')
      : OLLAMA_MODEL,
    enabled: OLLAMA_ENABLED,
    ...(hasAnthropic && { baseURL: 'https://api.anthropic.com' }),
    ...(hasOpenRouter && { baseURL: 'https://openrouter.ai/api/v1' }),
    ...(!hasAnthropic && !hasOpenRouter && { baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api' }),
  })
}
