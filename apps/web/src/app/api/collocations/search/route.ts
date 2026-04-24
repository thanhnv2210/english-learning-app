import { generateText } from 'ai'
import {
  COLLOCATION_BY_WORD_PROMPT,
  COLLOCATION_BY_PHRASE_PROMPT,
} from '@/lib/ielts/collocations/prompts'
import type { CollocationResult } from '@/lib/ielts/collocations/prompts'
import { findCollocation } from '@/lib/db/collocations'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type CollocationSearchResponse =
  | { mode: 'word'; results: (CollocationResult & { inLibrary: boolean })[] }
  | { mode: 'phrase'; result: CollocationResult & { inLibrary: boolean }; valid: true }
  | { mode: 'phrase'; valid: false; reason: string }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { query, mode } = await req.json()
  if (!query || typeof query !== 'string' || !query.trim()) {
    return Response.json({ error: 'query is required' }, { status: 400 })
  }
  if (mode !== 'word' && mode !== 'phrase') {
    return Response.json({ error: 'mode must be "word" or "phrase"' }, { status: 400 })
  }

  const normalized = query.trim().toLowerCase()

  const prompt =
    mode === 'word'
      ? COLLOCATION_BY_WORD_PROMPT(normalized)
      : COLLOCATION_BY_PHRASE_PROMPT(normalized)

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[collocations/search] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('collocations/search', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  if (mode === 'word') {
    const { collocations } = parsed as { collocations: CollocationResult[] }
    if (!Array.isArray(collocations)) {
      return Response.json({ error: 'Unexpected AI response shape', raw }, { status: 500 })
    }

    const results = await Promise.all(
      collocations.map(async (c) => {
        const phrase = c.phrase.toLowerCase()
        const existing = await findCollocation(phrase)
        return { ...c, phrase, inLibrary: !!existing }
      }),
    )

    return Response.json({ mode: 'word', results } satisfies CollocationSearchResponse)
  }

  // phrase mode
  const data = parsed as { valid: boolean; reason?: string } & Partial<CollocationResult>

  if (!data.valid) {
    return Response.json({
      mode: 'phrase',
      valid: false,
      reason: data.reason ?? 'Not a valid collocation.',
    } satisfies CollocationSearchResponse)
  }

  const result: CollocationResult = {
    phrase: (data.phrase ?? normalized).toLowerCase(),
    type: data.type ?? 'other',
    explanation: data.explanation ?? '',
    suggestedSkills: data.suggestedSkills ?? [],
    examples: data.examples ?? [],
  }

  const existing = await findCollocation(result.phrase)

  return Response.json({
    mode: 'phrase',
    valid: true,
    result: { ...result, inLibrary: !!existing },
  } satisfies CollocationSearchResponse)
}
