import { generateText } from 'ai'
import { TASK1_AUDIT_PROMPT } from '@/lib/ielts/writing/prompts-task1'
import { OLLAMA_ENABLED, aiScoringModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type Task1AuditResult = {
  wordCount: number
  paragraphCount: number
  hasIntroduction: boolean
  hasOverview: boolean
  usesData: boolean
  hasPersonalOpinion: boolean
  notes: string[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { response, question, data } = (await req.json()) as {
    response: string
    question: string
    data: string
  }

  let text: string
  try {
    const result = await generateText({
      model: aiScoringModel(),
      system: TASK1_AUDIT_PROMPT,
      prompt: `Task 1 question: ${question}\n\nChart data:\n${data}\n\nStudent response:\n${response}`,
    })
    text = result.text
  } catch (err) {
    console.error('[writing/task1/audit] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }
  ollamaDebug('writing/task1/audit', text)

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ error: 'Parse error' }, { status: 500 })

  const result: Task1AuditResult = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
