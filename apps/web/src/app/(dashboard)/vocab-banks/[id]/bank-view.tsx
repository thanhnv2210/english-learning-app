'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { addWordAction, removeWordAction } from '@/app/actions/vocab-banks'
import type { VocabBank, VocabBankWord } from '@/lib/db/vocab-banks'
import type { WordLookupResponse } from '@/app/api/vocab-banks/lookup-word/route'

const TYPE_COLORS: Record<string, { tag: string; dot: string; label: string }> = {
  noun:      { tag: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',       dot: 'bg-blue-500',   label: 'noun' },
  verb:      { tag: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800', dot: 'bg-green-500', label: 'verb' },
  adjective: { tag: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800', dot: 'bg-purple-500', label: 'adj' },
  adverb:    { tag: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800', dot: 'bg-orange-500', label: 'adv' },
  phrase:    { tag: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800', dot: 'bg-amber-500',  label: 'phr' },
}
const FALLBACK_COLORS = { tag: 'bg-subtle text-muted-foreground border-border', dot: 'bg-gray-400', label: '—' }

const TYPE_FILTER_OPTIONS = ['all', 'noun', 'verb', 'adjective', 'adverb', 'phrase'] as const
type TypeFilter = typeof TYPE_FILTER_OPTIONS[number]

export function BankView({ bank, initialWords }: { bank: VocabBank; initialWords: VocabBankWord[] }) {
  const [words, setWords] = useOptimistic(initialWords)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showWords, setShowWords] = useState(true)
  const [, startTransition] = useTransition()

  const filtered = words.filter((w) => {
    if (typeFilter !== 'all' && w.type !== typeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
    }
    return true
  })

  const selected = selectedId != null ? words.find((w) => w.id === selectedId) ?? null : null

  function handleRemove(wordId: number) {
    startTransition(() => {
      setWords((prev) => prev.filter((w) => w.id !== wordId))
      if (selectedId === wordId) setSelectedId(null)
      removeWordAction(wordId, bank.id)
    })
  }

  function handleAdd(word: VocabBankWord) {
    startTransition(() => {
      setWords((prev) => [...prev, word])
    })
  }

  function handleTagClick(id: number) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats bar */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{words.length}</span> words
        </span>
        {/* Type legend */}
        <div className="flex gap-3 flex-wrap">
          {Object.entries(TYPE_COLORS).map(([type, c]) => (
            <span key={type} className="flex items-center gap-1 text-xs text-faint">
              <span className={`inline-block w-2 h-2 rounded-full ${c.dot}`} />
              {c.label}
            </span>
          ))}
        </div>
        {bank.isSystem && (
          <span className="ml-auto rounded-full bg-subtle text-faint px-2.5 py-0.5 text-xs">system bank</span>
        )}
      </div>

      {/* Add word */}
      <AddWordPanel bankId={bank.id} topic={bank.topic} onAdd={handleAdd} />

      {/* Word cloud section */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        {/* Section header with toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setShowWords((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-blue-600 transition-colors"
            >
              <span className="text-xs text-faint">{showWords ? '▼' : '▶'}</span>
              Word Cloud
            </button>
            {words.length > 0 && (
              <span className="text-xs text-faint shrink-0">{filtered.length} / {words.length}</span>
            )}
          </div>

          {showWords && words.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter…"
                className="w-36 rounded-lg border border-border bg-input text-foreground px-3 py-1.5 text-xs outline-none focus:border-blue-400"
              />
            </div>
          )}
        </div>

        {showWords && (
          <>
            {/* Type filter chips */}
            {words.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {TYPE_FILTER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize ${
                      typeFilter === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-subtle text-muted-foreground hover:bg-border'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            {words.length === 0 ? (
              <p className="text-sm text-faint text-center py-4">No words yet. Add one above.</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-faint text-center py-4">No words match your filter.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filtered.map((w) => {
                  const c = TYPE_COLORS[w.type] ?? FALLBACK_COLORS
                  const isSelected = selectedId === w.id
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleTagClick(w.id)}
                      className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                        isSelected
                          ? `${c.tag} ring-2 ring-offset-1 ring-blue-400 scale-105`
                          : `${c.tag} hover:scale-105 hover:shadow-sm`
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
                      {w.word}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Detail panel for selected word */}
            {selected && (
              <WordDetail
                word={selected}
                onClose={() => setSelectedId(null)}
                onRemove={() => handleRemove(selected.id)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function WordDetail({
  word,
  onClose,
  onRemove,
}: {
  word: VocabBankWord
  onClose: () => void
  onRemove: () => void
}) {
  const c = TYPE_COLORS[word.type] ?? FALLBACK_COLORS
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-muted p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground">{word.word}</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.tag}`}>
            {word.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-xs text-faint hover:text-foreground transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{word.meaning}</p>

      <div className="rounded-lg bg-card border border-border p-3">
        <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{word.example}&rdquo;</p>
      </div>

      <div className="flex justify-end">
        {confirmingDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium">Remove this word?</span>
            <button
              onClick={onRemove}
              className="rounded px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes, remove
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded px-3 py-1 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Remove word
          </button>
        )}
      </div>
    </div>
  )
}

function AddWordPanel({
  bankId,
  topic,
  onAdd,
}: {
  bankId: number
  topic: string
  onAdd: (word: VocabBankWord) => void
}) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  async function handleLookup() {
    const w = input.trim()
    if (!w) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/vocab-banks/lookup-word', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ word: w, topic }),
      })
      const data: WordLookupResponse = await res.json()
      if (!data.valid) {
        setError(data.reason)
        return
      }
      setInput('')
      startTransition(async () => {
        const saved = await addWordAction({
          bankId,
          word: data.word.word,
          type: data.word.type,
          meaning: data.word.meaning,
          example: data.word.example,
        })
        onAdd(saved)
      })
    } catch {
      setError('Failed to reach AI service. Is Ollama running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">Add a word</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          placeholder="e.g. itinerary, commute, habitat…"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
          disabled={loading}
        />
        <button
          onClick={handleLookup}
          disabled={!input.trim() || loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '…' : 'Add'}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
