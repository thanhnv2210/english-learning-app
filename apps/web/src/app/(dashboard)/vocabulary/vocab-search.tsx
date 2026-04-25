'use client'

import { useState, useTransition } from 'react'
import { addWordToLibrary } from '@/app/actions/vocabulary'
import { WordCard } from './vocabulary-list'
import type { VocabularyCard } from '@/lib/db/vocabulary'

type Status = 'idle' | 'searching' | 'found' | 'new' | 'added' | 'error'

export function VocabSearch() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [card, setCard] = useState<VocabularyCard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, startAddTransition] = useTransition()

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const word = query.trim()
    if (!word) return

    setStatus('searching')
    setCard(null)
    setError(null)

    try {
      const res = await fetch('/api/vocabulary/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      })
      if (!res.ok) throw new Error('Server error')
      const data: { card: VocabularyCard; inLibrary: boolean } = await res.json()
      setCard(data.card)
      setStatus(data.inLibrary ? 'found' : 'new')
    } catch {
      setError('Could not look up the word. Please try again.')
      setStatus('error')
    }
  }

  function handleAdd() {
    if (!card) return
    startAddTransition(async () => {
      await addWordToLibrary(card)
      setStatus('added')
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Look up a word</h2>
        <p className="text-xs text-faint mt-0.5">
          Search any IELTS Academic word — the system will generate a full card and auto-detect its topic domain.
        </p>
      </div>

      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. mitigate, proliferate, infrastructure…"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={!query.trim() || status === 'searching'}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {status === 'searching' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Error */}
      {status === 'error' && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Spinner */}
      {status === 'searching' && (
        <p className="text-xs text-faint animate-pulse text-center py-4">
          Generating vocabulary card…
        </p>
      )}

      {/* Result card */}
      {card && (status === 'found' || status === 'new' || status === 'added') && (
        <div className="flex flex-col gap-3">
          {/* Status banner */}
          <div className="flex items-center justify-between gap-3">
            {status === 'found' && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ Already in library
              </span>
            )}
            {status === 'new' && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  AI generated · not yet saved
                </span>
                {card.domains.length > 0 && (
                  <span className="text-xs text-faint">
                    Detected domains: {card.domains.join(', ')}
                  </span>
                )}
              </div>
            )}
            {status === 'added' && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ Added to library
              </span>
            )}

            {status === 'new' && (
              <button
                onClick={handleAdd}
                disabled={isAdding}
                className="shrink-0 rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isAdding ? 'Saving…' : 'Add to Library'}
              </button>
            )}
          </div>

          <WordCard word={card} />
        </div>
      )}
    </div>
  )
}
