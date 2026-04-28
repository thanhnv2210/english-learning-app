import { generateText } from 'ai'
import { COMPARISON_PROMPT } from '@/lib/ielts/comparisons/prompts'
import type { ComparisonResult } from '@/lib/ielts/comparisons/prompts'
import { findComparison } from '@/lib/db/comparisons'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type CompareResponse =
  | { valid: true; result: ComparisonResult & { inLibrary: boolean } }
  | { valid: false; reason: string }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { termA, termB } = await req.json()
  if (!termA || !termB || typeof termA !== 'string' || typeof termB !== 'string') {
    return Response.json({ error: 'termA and termB are required' }, { status: 400 })
  }

  const a = termA.trim().toLowerCase()
  const b = termB.trim().toLowerCase()

  if (a === b) {
    return Response.json({ valid: false, reason: 'Enter two different terms to compare.' } satisfies CompareResponse)
  }

  const prompt = COMPARISON_PROMPT(a, b)

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[compare] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('compare', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const data = parsed as { valid: boolean; reason?: string } & Partial<ComparisonResult>

  if (!data.valid) {
    return Response.json({
      valid: false,
      reason: data.reason ?? 'These terms are not comparable.',
    } satisfies CompareResponse)
  }

  const result: ComparisonResult = {
    termA: data.termA ?? a,
    termB: data.termB ?? b,
    category: data.category ?? 'other',
    keyDifference: data.keyDifference ?? '',
    dimensionA: data.dimensionA ?? { register: 'neutral', ieltsWriting: '', ieltsSpeaking: '' },
    dimensionB: data.dimensionB ?? { register: 'neutral', ieltsWriting: '', ieltsSpeaking: '' },
    examples: data.examples ?? [],
  }

  const existing = await findComparison(result.termA, result.termB)

  return Response.json({
    valid: true,
    result: { ...result, inLibrary: !!existing },
  } satisfies CompareResponse)
}
