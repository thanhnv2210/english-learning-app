import { generateText } from 'ai'
import { VOCAB_BANK_WORD_LOOKUP_PROMPT } from '@/lib/ielts/vocab-banks/prompts'
import type { GeneratedWord } from '@/lib/ielts/vocab-banks/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type WordLookupResponse =
  | { valid: true; word: GeneratedWord }
  | { valid: false; reason: string }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { word, topic } = await req.json()
  if (!word || !topic || typeof word !== 'string' || typeof topic !== 'string') {
    return Response.json({ error: 'word and topic are required' }, { status: 400 })
  }

  const prompt = VOCAB_BANK_WORD_LOOKUP_PROMPT(word.trim(), topic.trim())

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[vocab-banks/lookup-word] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('vocab-banks/lookup-word', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const data = parsed as { valid: boolean; reason?: string } & Partial<GeneratedWord>

  if (!data.valid) {
    return Response.json({ valid: false, reason: data.reason ?? 'Not a valid word.' } satisfies WordLookupResponse)
  }

  return Response.json({
    valid: true,
    word: {
      word: data.word ?? word.trim(),
      type: data.type ?? 'noun',
      meaning: data.meaning ?? '',
      example: data.example ?? '',
    },
  } satisfies WordLookupResponse)
}
