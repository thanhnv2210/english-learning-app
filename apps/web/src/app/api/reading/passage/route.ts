import { generateText } from 'ai'
import {
  READING_PASSAGE_PROMPT,
  READING_PASSAGE_HEADINGS_MC_PROMPT,
  type ReadingPassage,
  type QuestionStyle,
} from '@/lib/ielts/reading/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { domain, questionStyle = 'classic' } = (await req.json()) as {
    domain: string
    questionStyle?: QuestionStyle
  }

  const prompt =
    questionStyle === 'headings_mc'
      ? READING_PASSAGE_HEADINGS_MC_PROMPT(domain)
      : READING_PASSAGE_PROMPT(domain)

  let text: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt, maxTokens: 2500 })
    text = result.text
  } catch (err) {
    console.error('[reading/passage] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('reading/passage', text)

  // Strip markdown fences if the model wraps its output
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  let passage: ReadingPassage
  try {
    passage = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse passage JSON', raw: text }, { status: 502 })
  }

  return Response.json(passage)
}
