import { generateText } from 'ai'
import { GRAMMAR_TRAP_GENERATE_PROMPT } from '@/lib/ielts/grammar-traps/prompts'
import type { GrammarTrapGenerateResult } from '@/lib/ielts/grammar-traps/prompts'
import { saveGrammarTrap } from '@/lib/db/grammar-traps'
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
      prompt: GRAMMAR_TRAP_GENERATE_PROMPT(input.trim()),
    })
    raw = result.text
  } catch (err) {
    console.error('[grammar-traps/generate] generateText failed:', err)
    return Response.json({ error: 'AI request failed' }, { status: 502 })
  }
  ollamaDebug('grammar-traps/generate', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
  let parsed: GrammarTrapGenerateResult
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const saved = await saveGrammarTrap({
    phrase: parsed.phrase,
    correction: parsed.correction,
    category: parsed.category,
    explanation: parsed.explanation,
    examples: parsed.examples ?? [],
  })

  return Response.json({ entry: saved })
}
