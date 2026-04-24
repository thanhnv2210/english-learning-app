import { generateText } from 'ai'
import { AUDIT_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export type AuditResult = {
  wordCount: number
  paragraphCount: number
  hasIntroduction: boolean
  hasConclusion: boolean
  taskFulfilled: boolean
  notes: string[]
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { essay, topic } = (await req.json()) as { essay: string; topic: string }

  let text: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      system: AUDIT_PROMPT,
      prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
    })
    text = result.text
  } catch (err) {
    console.error('[writing/audit] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ error: 'Parse error' }, { status: 500 })

  const result: AuditResult = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
