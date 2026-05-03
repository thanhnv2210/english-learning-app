'use client'

import { useState } from 'react'
import type { VocabularyCard } from '@/lib/db/vocabulary'

type Props = { text: string }

export function VocabularyDrawer({ text }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [cards, setCards] = useState<VocabularyCard[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleOpen() {
    setIsOpen(true)
    if (cards !== null) return // already loaded

    setIsLoading(true)
    try {
      const res = await fetch('/api/vocabulary/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      setCards(data.words ?? [])
    } catch {
      setCards([])
    } finally {
      setIsLoading(false)
    }
  }

  const count = cards?.length ?? 0

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
      >
        <span>Vocabulary</span>
        {cards !== null && (
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
            {count}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Drawer panel ── */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Vocabulary Builder</h2>
            <p className="text-xs text-faint">Words you can upgrade for a higher band score</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-faint transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <p className="animate-pulse text-sm text-faint">Analysing vocabulary…</p>
            </div>
          )}

          {!isLoading && cards !== null && cards.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <p className="text-2xl">🎯</p>
              <p className="text-sm font-medium text-foreground">Strong vocabulary detected</p>
              <p className="text-xs text-faint">No significant improvements found — well done!</p>
            </div>
          )}

          {!isLoading && cards && cards.length > 0 && (
            <div className="flex flex-col gap-6">
              {cards.map((card, i) => (
                <WordCard key={i} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function WordCard({ card }: { card: VocabularyCard }) {
  const [showExamples, setShowExamples] = useState(false)

  const synonyms = card.synonyms.filter((s) => s.type === 'synonym').slice(0, 3)
  const antonyms = card.synonyms.filter((s) => s.type === 'antonym').slice(0, 2)
  const familyEntries = Object.entries(card.familyWords).filter(([, v]) => v)

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Word header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-red-100 dark:bg-red-900/20 px-2 py-0.5 font-mono text-xs text-red-700 dark:text-red-300">
            {card.originalWord}
          </span>
          <span className="text-xs text-faint">→</span>
          <span className="rounded bg-emerald-100 dark:bg-emerald-900/20 px-2 py-0.5 font-mono text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {card.word}
          </span>
          {card.source === 'ai' && (
            <span className="rounded bg-purple-100 dark:bg-purple-900/20 px-1.5 py-0.5 text-xs text-purple-600 dark:text-purple-300">
              AI
            </span>
          )}
        </div>
      </div>

      {/* Definition */}
      <p className="mb-3 text-sm leading-relaxed text-foreground">{card.definition}</p>

      {/* Family words */}
      {familyEntries.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {familyEntries.map(([pos, form]) => (
            <span key={pos} className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-muted-foreground">
              <span className="text-faint">{pos}: </span>
              {form}
            </span>
          ))}
        </div>
      )}

      {/* Synonyms / Antonyms */}
      {(synonyms.length > 0 || antonyms.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {synonyms.length > 0 && (
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Synonyms: </span>
              {synonyms.map((s) => s.word).join(', ')}
            </span>
          )}
          {antonyms.length > 0 && (
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Antonyms: </span>
              {antonyms.map((s) => s.word).join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Collocations */}
      {card.collocations.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium text-gray-600">Common collocations</p>
          <div className="flex flex-wrap gap-1.5">
            {card.collocations.map((c, i) => (
              <span key={i} className="rounded bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Domain tags */}
      {card.domains.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {card.domains.map((d) => (
            <span key={d} className="rounded-full bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Examples toggle */}
      <button
        onClick={() => setShowExamples((v) => !v)}
        className="text-xs font-medium text-blue-500 hover:text-blue-700"
      >
        {showExamples ? 'Hide examples ▲' : 'Show examples ▼'}
      </button>

      {showExamples && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="rounded-lg bg-subtle p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Speaking (informal)</p>
            <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{card.examples.speaking}&rdquo;</p>
          </div>
          {card.examples.writing.map((ex, i) => (
            <div key={i} className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="mb-1 text-xs font-semibold text-blue-500 dark:text-blue-400">Writing Task 2 ({i === 0 ? 'example 1' : 'example 2'})</p>
              <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{ex}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
