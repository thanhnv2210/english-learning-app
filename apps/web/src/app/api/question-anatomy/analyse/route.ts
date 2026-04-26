import { generateText } from 'ai'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'
import { QUESTION_ANATOMY_PROMPT, parseQuestionAnatomyResult } from '@/lib/ielts/question-anatomy/prompts'
import type { QuestionAnatomyResult } from '@/lib/ielts/question-anatomy/prompts'

export type { QuestionAnatomyResult }

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const body = await req.json()
  const { question, skill } = body as { question?: string; skill?: string }

  if (!question?.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 })
  }

  const skillLabel = skill ?? 'Reading'

  let raw: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: QUESTION_ANATOMY_PROMPT(question.trim(), skillLabel),
    })
    raw = result.text
  } catch (err) {
    console.error('[question-anatomy/analyse] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }

  ollamaDebug('question-anatomy/analyse', raw)

  try {
    const parsed = parseQuestionAnatomyResult(raw)
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }
}
