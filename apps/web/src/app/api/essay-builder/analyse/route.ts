import { generateText } from 'ai'
import { ESSAY_ANALYSE_PROMPT } from '@/lib/ielts/essay-builder/prompts'
import { getAllDomains } from '@/lib/db/domains'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type AnalyseResult = {
  domain: string
  skill: string
  question: string
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { text } = await req.json()
  if (!text || typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'text is required' }, { status: 400 })
  }

  const allDomains = await getAllDomains()
  const domainNames = allDomains.map((d) => d.name)

  let raw: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: ESSAY_ANALYSE_PROMPT(text.trim(), domainNames),
    })
    raw = result.text
  } catch (err) {
    console.error('[essay-builder/analyse] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('essay-builder/analyse', raw)

  const domainMatch   = raw.match(/---DOMAIN---\s*\n([\s\S]*?)\n---SKILL---/)
  const skillMatch    = raw.match(/---SKILL---\s*\n([\s\S]*?)\n---QUESTION---/)
  const questionMatch = raw.match(/---QUESTION---\s*\n([\s\S]+)/)

  const domain   = domainMatch?.[1]?.trim()
  const skill    = skillMatch?.[1]?.trim()
  const question = questionMatch?.[1]?.trim()

  if (!domain || !skill || !question) {
    console.error('[essay-builder/analyse] could not extract fields from response:', raw)
    return Response.json({ error: 'Invalid AI response format' }, { status: 502 })
  }

  // Validate domain against known list (case-insensitive)
  const canonical = domainNames.find((d) => d.toLowerCase() === domain.toLowerCase()) ?? domain

  return Response.json({ domain: canonical, skill, question } satisfies AnalyseResult)
}
