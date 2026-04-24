import { generateText } from 'ai'
import { ESSAY_BUILDER_PROMPT, type EssayBuilderSkill } from '@/lib/ielts/essay-builder/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { skill, domain, vocabulary, collocations, targetBand } = await req.json()

  if (!skill || !domain) {
    return Response.json({ error: 'skill and domain are required' }, { status: 400 })
  }

  let raw: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: ESSAY_BUILDER_PROMPT(
        skill as EssayBuilderSkill,
        domain,
        vocabulary ?? [],
        collocations ?? [],
        targetBand ?? 6.5,
      ),
    })
    raw = result.text
  } catch (err) {
    console.error('[essay-builder] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed. Is Ollama running?' }, { status: 502 })
  }
  ollamaDebug('essay-builder/generate', raw)

  // Parse delimiter format:  ---TOPIC--- / ---TEXT---
  const topicMatch = raw.match(/---TOPIC---\s*\n([\s\S]*?)\n---TEXT---/)
  const textMatch  = raw.match(/---TEXT---\s*\n([\s\S]+)/)

  const topic = topicMatch?.[1]?.trim()
  const text  = textMatch?.[1]?.trim()

  if (!topic || !text) {
    console.error('[essay-builder] could not extract topic/text from response:', raw)
    return Response.json({ error: 'Invalid AI response format' }, { status: 502 })
  }

  return Response.json({ topic, text })
}
