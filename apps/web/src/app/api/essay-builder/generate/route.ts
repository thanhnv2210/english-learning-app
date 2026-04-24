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

  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) {
    return Response.json({ error: 'Invalid AI response format' }, { status: 502 })
  }

  let parsed: { topic: string; text: string }
  try {
    // Sanitize literal control chars the AI may embed inside JSON string values
    const sanitized = match[0].replace(
      /"((?:[^"\\]|\\[\s\S])*)"/g,
      (_, inner: string) =>
        `"${inner.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`,
    )
    parsed = JSON.parse(sanitized)
  } catch {
    return Response.json({ error: 'Failed to parse AI response' }, { status: 502 })
  }

  if (!parsed.topic || !parsed.text) {
    return Response.json({ error: 'Incomplete AI response' }, { status: 502 })
  }

  return Response.json({ topic: parsed.topic, text: parsed.text })
}
