import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { findWords } from '@/lib/db/vocabulary'
import { VOCAB_DETECTION_PROMPT, VOCAB_CARD_PROMPT } from '@/lib/ielts/vocabulary/prompts'
import type { VocabularyCard } from '@/lib/db/vocabulary'
import { OLLAMA_ENABLED, ollamaModel, ollamaDisabledResponse } from '@/lib/ai-client'

type DetectedWord = { original: string; academic: string }

export async function POST(req: NextRequest) {
  if (!OLLAMA_ENABLED) return ollamaDisabledResponse()

  const { text } = await req.json()
  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ words: [] })
  }

  // ── Step 1: AI detects improvable words ──────────────────────────────────────
  let detected: DetectedWord[] = []
  try {
    const { text: raw } = await generateText({
      model: ollamaModel(),
      prompt: VOCAB_DETECTION_PROMPT(text),
    })
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as { words: DetectedWord[] }
      detected = parsed.words ?? []
    }
  } catch {
    return NextResponse.json({ words: [] })
  }

  if (detected.length === 0) return NextResponse.json({ words: [] })

  // ── Step 2: DB lookup for all academic words ──────────────────────────────────
  const academicWords = detected.map((d) => d.academic)
  const dbHits = await findWords(academicWords)

  // ── Step 3: AI fallback for DB misses ────────────────────────────────────────
  const cards: VocabularyCard[] = []

  for (const { original, academic } of detected) {
    const dbCard = dbHits.get(academic.toLowerCase())

    if (dbCard) {
      cards.push({ ...dbCard, originalWord: original })
      continue
    }

    // AI-generate a card for words not in DB
    try {
      const { text: raw } = await generateText({
        model: ollamaModel(),
        prompt: VOCAB_CARD_PROMPT(academic, original),
      })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        cards.push({
          id: 0,
          originalWord: original,
          word: parsed.word ?? academic,
          definition: parsed.definition ?? '',
          familyWords: parsed.familyWords ?? {},
          synonyms: parsed.synonyms ?? [],
          collocations: parsed.collocations ?? [],
          examples: parsed.examples ?? { speaking: '', writing: ['', ''] },
          domains: [],
          rank: 3,
          userAdded: false,
          source: 'ai',
        })
      }
    } catch {
      // Skip words where AI card generation fails
    }
  }

  return NextResponse.json({ words: cards })
}
