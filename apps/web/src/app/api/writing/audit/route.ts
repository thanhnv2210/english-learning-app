import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { AUDIT_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export type AuditResult = {
  wordCount: number
  paragraphCount: number
  hasIntroduction: boolean
  hasConclusion: boolean
  taskFulfilled: boolean
  notes: string[]
}

export async function POST(req: Request) {
  const { essay, topic } = (await req.json()) as { essay: string; topic: string }

  const { text } = await generateText({
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    system: AUDIT_PROMPT,
    prompt: `Essay topic: ${topic}\n\nEssay:\n${essay}`,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return Response.json({ error: 'Parse error' }, { status: 500 })

  const result: AuditResult = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
