import { generateText } from 'ai'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'
import { WRONG_DECISION_PROMPT, parseWrongDecisionAnalysis } from '@/lib/ielts/wrong-decisions/prompts'
import type { WrongDecisionAnalysis } from '@/lib/ielts/wrong-decisions/prompts'

export type { WrongDecisionAnalysis }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const body = await req.json()
  const { skill, sourceText, question, myThought, actualAnswer } = body

  if (!skill || !question || !myThought || !actualAnswer) {
    return Response.json({ error: 'skill, question, myThought, and actualAnswer are required' }, { status: 400 })
  }

  let raw: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: WRONG_DECISION_PROMPT({ skill, sourceText, question, myThought, actualAnswer }),
    })
    raw = result.text
  } catch (err) {
    console.error('[wrong-decisions/analyse] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }

  ollamaDebug('wrong-decisions/analyse', raw)

  try {
    const parsed = parseWrongDecisionAnalysis(raw)
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }
}
