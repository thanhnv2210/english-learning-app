import { generateText } from 'ai'
import { COLLOCATION_ESSAY_PROMPT } from '@/lib/ielts/collocations/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { phrases, topic } = await req.json()
  if (!Array.isArray(phrases) || phrases.length < 2) {
    return Response.json({ error: 'At least 2 phrases required' }, { status: 400 })
  }
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return Response.json({ error: 'topic is required' }, { status: 400 })
  }

  const prompt = COLLOCATION_ESSAY_PROMPT(phrases, topic.trim())

  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[collocations/essay] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('collocations/essay', raw)

  const topicMatch = raw.match(/---TOPIC---\s*([\s\S]*?)\s*---ESSAY---/)
  const essayMatch = raw.match(/---ESSAY---\s*([\s\S]+)/)

  if (!essayMatch) {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  return Response.json({
    topic: topicMatch?.[1]?.trim() ?? topic,
    essay: essayMatch[1].trim(),
  })
}
