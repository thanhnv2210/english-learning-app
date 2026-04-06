import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { OUTLINE_CRITIQUE_PROMPT } from '@/lib/ielts/writing/prompts'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
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
    model: ollama(process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'),
    system: OUTLINE_CRITIQUE_PROMPT(topic),
    prompt: outlineText,
  })

  return result.toTextStreamResponse()
}
