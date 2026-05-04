import { generateText } from 'ai'
import { WORD_PAIRS_SEARCH_PROMPT } from '@/lib/ielts/word-pairs/prompts'
import type { WordPairResult } from '@/lib/ielts/word-pairs/prompts'
import { getWordPairsForWord, findWordPair } from '@/lib/db/word-pairs'
import { getCurrentUser } from '@/lib/db/user'
import { OLLAMA_ENABLED, OLLAMA_MODEL, ollamaModel, ollamaDisabledResponse, ollamaDebug } from '@/lib/ai-client'

export type DbPairEntry = {
  id: number
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: string
}

export type AiPairEntry = WordPairResult & { inLibrary: boolean }

export type WordPairsSearchResponse = {
  query: string
  dbPairs: DbPairEntry[]
  aiPairs: AiPairEntry[]
  aiModel: string
}

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { query } = await req.json()
  if (!query || typeof query !== 'string' || !query.trim()) {
    return Response.json({ error: 'query is required' }, { status: 400 })
  }

  const normalized = query.trim().toLowerCase()
  const user = await getCurrentUser()

  // 1. Check DB first
  const dbRows = await getWordPairsForWord(user.id, user.role === 'admin', user.showSystemData, normalized)
  const dbPairs: DbPairEntry[] = dbRows.map((r) => ({
    id: r.id,
    wordA: r.wordA,
    wordB: r.wordB,
    explanation: r.explanation,
    examples: r.examples,
    category: r.category,
  }))

  // 2. Ask AI for additional pairs
  const prompt = WORD_PAIRS_SEARCH_PROMPT(normalized)
  let raw: string
  try {
    const result = await generateText({ model: ollamaModel(), prompt })
    raw = result.text
  } catch (err) {
    console.error('[word-pairs/search] generateText failed:', err)
    return Response.json({ error: 'AI request failed' }, { status: 502 })
  }
  ollamaDebug('word-pairs/search', raw)

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw }, { status: 502 })
  }

  const { pairs: rawAiPairs } = parsed as { pairs: WordPairResult[] }
  if (!Array.isArray(rawAiPairs)) {
    return Response.json({ error: 'Unexpected AI response shape', raw }, { status: 500 })
  }

  // 3. Filter out AI pairs already covered by DB results, mark inLibrary on the rest
  const dbKeys = new Set(
    dbRows.flatMap((r) => [
      `${r.wordA}|${r.wordB}`,
      `${r.wordB}|${r.wordA}`,
    ]),
  )

  const aiPairs: AiPairEntry[] = await Promise.all(
    rawAiPairs
      .filter((p) => !dbKeys.has(`${p.wordA}|${p.wordB}`) && !dbKeys.has(`${p.wordB}|${p.wordA}`))
      .map(async (p) => {
        const existing = await findWordPair(user.id, p.wordA, p.wordB)
        return { ...p, inLibrary: !!existing }
      }),
  )

  return Response.json({
    query: normalized,
    dbPairs,
    aiPairs,
    aiModel: OLLAMA_MODEL,
  } satisfies WordPairsSearchResponse)
}
