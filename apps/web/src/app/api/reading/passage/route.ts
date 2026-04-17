import { generateText } from 'ai'
import { READING_PASSAGE_PROMPT, type ReadingPassage } from '@/lib/ielts/reading/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain } = (await req.json()) as { domain: string }

  const { text } = await generateText({
    model: ollamaModel(),
    prompt: READING_PASSAGE_PROMPT(domain),
    maxTokens: 2000,
  })

  // Strip markdown fences if the model wraps its output
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  let passage: ReadingPassage
  try {
    passage = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse passage JSON', raw: text }, { status: 500 })
  }

  return Response.json(passage)
}
