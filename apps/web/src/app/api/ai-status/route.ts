import { NextResponse } from 'next/server'
import { OLLAMA_ENABLED, OLLAMA_MODEL } from '@/lib/ai-client'
import { getCurrentUser } from '@/lib/db/user'

export async function GET() {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasOpenRouter = !hasAnthropic && !!process.env.OPENROUTER_API_KEY

  let tier = 'free'
  let modelPreference: 'auto' | 'free' = 'auto'
  try {
    const user = await getCurrentUser()
    tier = user.tier ?? 'free'
    modelPreference = (user.modelPreference ?? 'auto') as 'auto' | 'free'
  } catch {
    // unauthenticated — fall back to free defaults
  }

  // Effective provider: vip with 'auto' pref → configured cloud, otherwise → ollama
  const useCloud = tier === 'vip' && modelPreference === 'auto'
  const effectiveProvider = useCloud
    ? (hasAnthropic ? 'anthropic' : hasOpenRouter ? 'openrouter' : 'ollama')
    : 'ollama'

  const ollamaBase = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api'

  return NextResponse.json({
    tier,
    modelPreference,
    provider: effectiveProvider,
    fastModel: useCloud ? OLLAMA_MODEL : (process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    scoringModel: useCloud && hasAnthropic
      ? (process.env.ANTHROPIC_SCORING_MODEL ?? 'claude-sonnet-4-6')
      : (process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    enabled: OLLAMA_ENABLED,
    baseURL: effectiveProvider === 'anthropic'
      ? 'https://api.anthropic.com'
      : effectiveProvider === 'openrouter'
        ? 'https://openrouter.ai/api/v1'
        : ollamaBase,
  })
}
