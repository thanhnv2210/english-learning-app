import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { READING_PASSAGE_PROMPT, type ReadingPassage } from '@/lib/ielts/reading/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
  const { domain } = (await req.json()) as { domain: string }

  const { text } = await generateText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
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
