import { generateText } from 'ai'
import { VOCAB_BANK_GENERATE_PROMPT } from '@/lib/ielts/vocab-banks/prompts'
import type { GeneratedWord } from '@/lib/ielts/vocab-banks/prompts'
import { findBankByTopic } from '@/lib/db/vocab-banks'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type VocabBankGenerateResponse =
  | { valid: true; topic: string; words: GeneratedWord[]; topicExists: boolean }
  | { valid: false; reason: string }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { topic } = await req.json()
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return Response.json({ error: 'topic is required' }, { status: 400 })
  }

  const normalized = topic.trim().toLowerCase()
  const prompt = VOCAB_BANK_GENERATE_PROMPT(normalized)

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[vocab-banks/generate] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('vocab-banks/generate', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const data = parsed as { topic?: string; words?: GeneratedWord[] }
  if (!Array.isArray(data.words) || data.words.length === 0) {
    return Response.json({ error: 'Unexpected AI response shape', raw }, { status: 502 })
  }

  const topicExists = !!(await findBankByTopic(normalized))

  return Response.json({
    valid: true,
    topic: data.topic ?? normalized,
    words: data.words,
    topicExists,
  } satisfies VocabBankGenerateResponse)
}
