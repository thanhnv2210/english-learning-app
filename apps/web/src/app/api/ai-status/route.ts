import { NextResponse } from 'next/server'
import { OLLAMA_ENABLED, OLLAMA_MODEL } from '@/lib/ai-client'

export async function GET() {
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY

  return NextResponse.json({
    provider: hasOpenRouter ? 'openrouter' : 'ollama',
    model: OLLAMA_MODEL,
    enabled: OLLAMA_ENABLED,
    ...(hasOpenRouter
      ? { baseURL: 'https://openrouter.ai/api/v1' }
      : { baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api' }),
  })
}
