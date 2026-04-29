'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createBankAction } from '@/app/actions/vocab-banks'
import type { VocabBankGenerateResponse } from '@/app/api/vocab-banks/generate/route'
import type { GeneratedWord } from '@/lib/ielts/vocab-banks/prompts'

type Step = 'input' | 'preview' | 'saving'

export function NewBankForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('input')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ topic: string; words: GeneratedWord[]; topicExists: boolean } | null>(null)
  const [, startTransition] = useTransition()

  async function handleGenerate() {
    const t = topic.trim()
    if (!t) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/vocab-banks/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      })
      const data: VocabBankGenerateResponse = await res.json()
      if (!data.valid) {
        setError((data as { valid: false; reason: string }).reason)
        return
      }
      setPreview({ topic: data.topic, words: data.words, topicExists: data.topicExists })
      setStep('preview')
    } catch {
      setError('Failed to reach AI service. Is Ollama running?')
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (!preview) return
    setStep('saving')
    startTransition(async () => {
      await createBankAction({
        topic: preview.topic,
        description: '',
        words: preview.words,
      })
      router.push('/vocab-banks')
    })
  }

  if (step === 'input') {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. travel, environment, technology…"
            className="rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating…' : 'Generate with AI'}
        </button>
      </div>
    )
  }

  if (step === 'preview' && preview) {
    return (
      <div className="flex flex-col gap-6">
        {preview.topicExists && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            A bank for &ldquo;{preview.topic}&rdquo; already exists. Saving will create a duplicate.
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground capitalize">{preview.topic}</h2>
            <span className="text-xs text-faint">{preview.words.length} words</span>
          </div>

          <div className="flex flex-col gap-2">
            {preview.words.map((w, i) => (
              <WordRow key={i} word={w} />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setStep('input'); setPreview(null) }}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-subtle transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Save Bank
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <p className="text-sm text-muted-foreground">Saving bank…</p>
    </div>
  )
}

function WordRow({ word }: { word: GeneratedWord }) {
  const TYPE_COLORS: Record<string, string> = {
    noun: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    verb: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    adjective: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    adverb: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    phrase: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  }
  const color = TYPE_COLORS[word.type] ?? 'bg-subtle text-muted-foreground'

  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">{word.word}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{word.type}</span>
      </div>
      <p className="text-xs text-muted-foreground">{word.meaning}</p>
      <p className="text-xs text-faint italic">&ldquo;{word.example}&rdquo;</p>
    </div>
  )
}
