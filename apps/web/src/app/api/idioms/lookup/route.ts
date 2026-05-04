import { generateText } from 'ai'
import { IDIOM_LOOKUP_PROMPT } from '@/lib/ielts/idioms/prompts'
import type { IdiomLookupResult } from '@/lib/ielts/idioms/prompts'
import { findIdiom, isInUserIdioms } from '@/lib/db/idioms'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'
import { getCurrentUser } from '@/lib/db/user'

export type IdiomLookupResponse =
  | { valid: true; result: IdiomLookupResult & { inLibrary: boolean } }
  | { valid: false; reason: string }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { query } = await req.json()
  if (!query || typeof query !== 'string' || !query.trim()) {
    return Response.json({ error: 'query is required' }, { status: 400 })
  }

  const normalized = query.trim().toLowerCase()
  const prompt = IDIOM_LOOKUP_PROMPT(normalized)

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[idioms/lookup] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('idioms/lookup', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const data = parsed as { valid: boolean; reason?: string } & Partial<IdiomLookupResult>

  if (!data.valid) {
    return Response.json({
      valid: false,
      reason: data.reason ?? 'Not a recognised idiom.',
    } satisfies IdiomLookupResponse)
  }

  const result: IdiomLookupResult = {
    idiom: (data.idiom ?? normalized).toLowerCase(),
    meaning: data.meaning ?? '',
    register: data.register ?? 'neutral',
    suggestedSkills: data.suggestedSkills ?? [],
    suggestedContexts: data.suggestedContexts ?? [],
    examples: data.examples ?? [],
  }

  const user = await getCurrentUser()
  const existing = await findIdiom(result.idiom)
  const inLibrary = existing ? await isInUserIdioms(user.id, existing.id) : false

  return Response.json({
    valid: true,
    result: { ...result, inLibrary },
  } satisfies IdiomLookupResponse)
}
