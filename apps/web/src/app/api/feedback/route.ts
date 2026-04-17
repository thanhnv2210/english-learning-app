import { generateText } from 'ai'
import { FEEDBACK_SYSTEM_PROMPT } from '@/lib/ielts/examiner/part2-prompt'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { transcript, skill, targetBand = 6.5 } = (await req.json()) as {
    transcript: TranscriptMessage[]
    skill: string
    targetBand?: number
  }

  const transcriptText = transcript
    .filter((m) => m.content !== '__START__')
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n')

  const { text } = await generateText({
    model: ollamaModel(),
    system: FEEDBACK_SYSTEM_PROMPT,
    prompt: `Target band: ${targetBand}\nSkill: ${skill}\n\nTranscript:\n${transcriptText}`,
  })

  // Strip markdown code fences if the model wraps the JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return Response.json({ error: 'Model returned unparseable response' }, { status: 500 })
  }

  const feedback: FeedbackResult = JSON.parse(jsonMatch[0])
  return Response.json(feedback)
}
