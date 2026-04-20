import { generateText } from 'ai'
import {
  COLLOCATION_BY_WORD_PROMPT,
  COLLOCATION_BY_PHRASE_PROMPT,
} from '@/lib/ielts/collocations/prompts'
import type { CollocationResult } from '@/lib/ielts/collocations/prompts'
import { findCollocation } from '@/lib/db/collocations'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

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

  const trimmed = query.trim()

  const prompt =
    mode === 'word'
      ? COLLOCATION_BY_WORD_PROMPT(trimmed)
      : COLLOCATION_BY_PHRASE_PROMPT(trimmed)

  const { text: raw } = await generateText({
    model: ollamaModel(),
    prompt,
  })

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 500 })
  }

  if (mode === 'word') {
    const { collocations } = parsed as { collocations: CollocationResult[] }
    if (!Array.isArray(collocations)) {
      return Response.json({ error: 'Unexpected AI response shape', raw }, { status: 500 })
    }

    const results = await Promise.all(
      collocations.map(async (c) => {
        const existing = await findCollocation(c.phrase)
        return { ...c, inLibrary: !!existing }
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
    phrase: data.phrase ?? trimmed,
    type: data.type ?? 'other',
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
