import { streamText } from 'ai'
import { OUTLINE_CRITIQUE_PROMPT } from '@/lib/ielts/writing/prompts'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { topic, outline } = (await req.json()) as {
    topic: string
    outline: {
      introduction: string
      body1: string
      body2: string
      conclusion: string
    }
  }

  const outlineText = [
    `Introduction thesis: ${outline.introduction}`,
    `Body 1 argument: ${outline.body1}`,
    `Body 2 argument: ${outline.body2}`,
    `Conclusion stance: ${outline.conclusion}`,
  ].join('\n')

  const result = streamText({
    model: ollamaModel(),
    system: OUTLINE_CRITIQUE_PROMPT(topic),
    prompt: outlineText,
  })

  return result.toTextStreamResponse()
}
