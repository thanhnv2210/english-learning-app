import { generateText } from 'ai'
import { VOCABULARY_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type VocabSuggestion = {
  word: string
  suggestion: string
  reason: string
}

export type VocabResult = {
  informalWords: VocabSuggestion[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { essay, topic } = (await req.json()) as { essay: string; topic: string }

  let text: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      system: VOCABULARY_PROMPT,
      prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
    })
    text = result.text
  } catch (err) {
    console.error('[writing/vocabulary] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ informalWords: [] })

  const result: VocabResult = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
