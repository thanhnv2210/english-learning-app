import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { findWord } from '@/lib/db/vocabulary'
import { getAllDomains } from '@/lib/db/domains'
import { VOCAB_SEARCH_PROMPT } from '@/lib/ielts/vocabulary/prompts'
import type { VocabWordFamily, VocabSynonym, VocabExamples } from '@/lib/db/schema'
import type { VocabularyCard } from '@/lib/db/vocabulary'

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api',
})

export async function POST(req: Request) {
  const { word } = await req.json()
  if (!word || typeof word !== 'string') {
    return Response.json({ error: 'word is required' }, { status: 400 })
  }

  const trimmed = word.trim()

  // 1. Check the DB first
  const existing = await findWord(trimmed)
  if (existing) {
    return Response.json({ card: existing, inLibrary: true })
  }

  // 2. Not in DB — generate with AI
  const allDomains = await getAllDomains()
  const domainNames = allDomains.map((d) => d.name)

  const model = process.env.OLLAMA_MODEL ?? 'mistral:latest'
  const { text } = await generateText({
    model: ollama(model),
    prompt: VOCAB_SEARCH_PROMPT(trimmed, domainNames),
  })

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: {
    word: string
    definition: string
    familyWords: VocabWordFamily
    synonyms: VocabSynonym[]
    collocations: string[]
    examples: VocabExamples
    suggestedDomains: string[]
  }

  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
  }

  // Validate suggested domains against known list (case-insensitive)
  const knownLower = new Set(domainNames.map((d) => d.toLowerCase()))
  const validatedDomains = (parsed.suggestedDomains ?? []).filter((d) =>
    knownLower.has(d.toLowerCase())
  )
  // Remap to canonical casing from DB
  const canonicalDomains = validatedDomains.map(
    (d) => domainNames.find((n) => n.toLowerCase() === d.toLowerCase()) ?? d
  )

  const card: VocabularyCard = {
    originalWord: trimmed,
    word: parsed.word ?? trimmed,
    definition: parsed.definition ?? '',
    familyWords: parsed.familyWords ?? {},
    synonyms: parsed.synonyms ?? [],
    collocations: parsed.collocations ?? [],
    examples: parsed.examples ?? { speaking: '', writing: ['', ''] },
    domains: canonicalDomains,
    source: 'ai',
  }

  return Response.json({ card, inLibrary: false })
}
