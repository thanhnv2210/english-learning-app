import { generateText } from 'ai'
import { saveWordPronunciation } from '@/lib/db/vocabulary'
import { VOCAB_PRONUNCIATION_PROMPT } from '@/lib/ielts/vocabulary/prompts'
import { OLLAMA_ENABLED, ollamaModel } from '@/lib/ai-client'
import type { VocabPronunciation } from '@/lib/db/schema'

// ── Free Dictionary API ───────────────────────────────────────────────────────

type FreeDictPhonetic = {
  text?: string
  audio?: string
}

type FreeDictEntry = {
  phonetics: FreeDictPhonetic[]
}

async function fetchFromFreeDictionary(word: string): Promise<VocabPronunciation | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) return null

    const data: FreeDictEntry[] = await res.json()
    const phonetics = data[0]?.phonetics ?? []

    // The API pattern: UK entry comes first (audio is typically empty string),
    // US entry has a '-us.mp3' audio URL. Some words have explicit '-uk.mp3' too.
    const hasAudio = (p: FreeDictPhonetic) => !!p.audio
    const isUs = (p: FreeDictPhonetic) => !!p.audio && p.audio.includes('-us')
    const isUk = (p: FreeDictPhonetic) => !!p.audio && (p.audio.includes('-uk') || p.audio.includes('-gb'))

    const usEntry = phonetics.find(isUs)
    const ukAudioEntry = phonetics.find(isUk)

    // UK IPA: prefer entry with explicit UK audio, then first entry with text that isn't the US entry
    const ukTextEntry = phonetics.find((p) => isUk(p) && p.text)
      ?? phonetics.find((p) => p.text && !isUs(p))

    // US IPA: prefer entry with -us audio, then last entry with text as fallback
    const usTextEntry = phonetics.find((p) => isUs(p) && p.text)
      ?? [...phonetics].reverse().find((p) => p.text && !isUk(p))

    const uk = ukTextEntry?.text ?? ''
    const us = usTextEntry?.text ?? ''

    if (!uk && !us) return null

    return {
      uk: uk || us,   // if UK IPA is missing, show US as fallback
      us: us || uk,
      ukAudio: (ukAudioEntry ?? (hasAudio(ukTextEntry ?? {}) ? ukTextEntry : undefined))?.audio || undefined,
      usAudio: usEntry?.audio || undefined,
    }
  } catch {
    return null
  }
}

// ── AI fallback ───────────────────────────────────────────────────────────────

async function fetchFromAI(word: string): Promise<VocabPronunciation | null> {
  if (!OLLAMA_ENABLED) return null

  try {
    const { text: raw } = await generateText({
      model: ollamaModel(),
      prompt: VOCAB_PRONUNCIATION_PROMPT(word),
    })

    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null

    const parsed: VocabPronunciation = JSON.parse(match[0])
    return parsed.uk && parsed.us ? parsed : null
  } catch {
    return null
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const { wordId, word } = await req.json()
  if (!word || typeof word !== 'string') {
    return Response.json({ error: 'word is required' }, { status: 400 })
  }

  const pronunciation =
    (await fetchFromFreeDictionary(word)) ??
    (await fetchFromAI(word))

  if (!pronunciation) {
    return Response.json({ error: 'Could not retrieve pronunciation' }, { status: 502 })
  }

  if (typeof wordId === 'number' && wordId > 0) {
    await saveWordPronunciation(wordId, pronunciation)
  }

  return Response.json(pronunciation)
}
