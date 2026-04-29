import { generateText } from 'ai'
import { GRAMMAR_CHECK_PROMPT } from '@/lib/ielts/grammar-traps/prompts'
import type { GrammarCheckResult } from '@/lib/ielts/grammar-traps/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { input } = await req.json()
  if (!input || typeof input !== 'string' || !input.trim()) {
    return Response.json({ error: 'input is required' }, { status: 400 })
  }

  let raw: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: GRAMMAR_CHECK_PROMPT(input.trim()),
    })
    raw = result.text
  } catch (err) {
    console.error('[grammar-traps/check] generateText failed:', err)
    return Response.json({ error: 'AI request failed' }, { status: 502 })
  }
  ollamaDebug('grammar-traps/check', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
  let parsed: GrammarCheckResult
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  return Response.json(parsed)
}
