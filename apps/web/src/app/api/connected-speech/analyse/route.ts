import { generateText } from 'ai'
import { CONNECTED_SPEECH_PROMPT } from '@/lib/ielts/connected-speech/prompts'
import type { AnalysisResult } from '@/lib/ielts/connected-speech/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type { AnalysisResult }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { text } = await req.json()
  if (!text || typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'text is required' }, { status: 400 })
  }

  const { text: raw } = await generateText({
    model: ollamaModel(),
    prompt: CONNECTED_SPEECH_PROMPT(text.trim()),
  })

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  try {
    const parsed: AnalysisResult = JSON.parse(cleaned)
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 500 })
  }
}
