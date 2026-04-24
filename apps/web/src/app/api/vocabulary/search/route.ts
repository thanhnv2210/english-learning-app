import { generateText } from 'ai'
import { findWord } from '@/lib/db/vocabulary'
import { getAllDomains } from '@/lib/db/domains'
import { VOCAB_SEARCH_PROMPT } from '@/lib/ielts/vocabulary/prompts'
import type { VocabWordFamily, VocabSynonym, VocabExamples, VocabPronunciation } from '@/lib/db/schema'
import type { VocabularyCard } from '@/lib/db/vocabulary'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

export async function POST(req: Request) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

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

  let text: string
  try {
    const result = await generateText({
      model: ollamaModel(),
      prompt: VOCAB_SEARCH_PROMPT(trimmed, domainNames),
    })
    text = result.text
  } catch (err) {
    console.error('[vocabulary/search] generateText failed:', err)
    return Response.json({ error: 'Ollama request failed' }, { status: 502 })
  }

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')

  let parsed: {
    word: string
    definition: string
    familyWords: VocabWordFamily
    synonyms: VocabSynonym[]
    collocations: string[]
    examples: VocabExamples
    pronunciation?: VocabPronunciation
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
    id: 0,
    originalWord: trimmed,
    word: parsed.word ?? trimmed,
    definition: parsed.definition ?? '',
    familyWords: parsed.familyWords ?? {},
    synonyms: parsed.synonyms ?? [],
    collocations: parsed.collocations ?? [],
    examples: parsed.examples ?? { speaking: '', writing: ['', ''] },
    pronunciation: (parsed.pronunciation as VocabPronunciation) ?? null,
    domains: canonicalDomains,
    rank: 3,
    userAdded: false,
    source: 'ai',
  }

  return Response.json({ card, inLibrary: false })
}
