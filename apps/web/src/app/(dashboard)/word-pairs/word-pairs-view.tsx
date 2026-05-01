'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { addWordPairAction, deleteWordPairAction } from '@/app/actions/word-pairs'
import { WORD_PAIR_CATEGORIES, CATEGORY_COLORS } from '@/lib/ielts/word-pairs/categories'
import type { WordPair } from '@/lib/db/word-pairs'

type Props = {
  initialPairs: WordPair[]
}

export function WordPairsView({ initialPairs }: Props) {
  const [pairs, setPairsOptimistic] = useOptimistic(initialPairs)
  const [, startTransition] = useTransition()

  const [wordA, setWordA] = useState('')
  const [wordB, setWordB] = useState('')
  const [explanation, setExplanation] = useState('')
  const [category, setCategory] = useState<string>(WORD_PAIR_CATEGORIES[0])
  const [isAdding, setIsAdding] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!wordA.trim() || !wordB.trim() || !explanation.trim()) return
    setIsAdding(true)
    const optimistic: WordPair = {
      id: Date.now(),
      userId: 0,
      wordA: wordA.trim(),
      wordB: wordB.trim(),
      explanation: explanation.trim(),
      examples: [],
      category,
      isSystem: false,
      rank: 3,
      createdAt: new Date(),
    }
    startTransition(() => {
      setPairsOptimistic((prev) => [optimistic, ...prev])
    })
    setWordA('')
    setWordB('')
    setExplanation('')
    await addWordPairAction({
      wordA: optimistic.wordA,
      wordB: optimistic.wordB,
      explanation: optimistic.explanation,
      examples: [],
      category,
    })
    setIsAdding(false)
  }

  function handleDelete(id: number) {
    startTransition(() => {
      setPairsOptimistic((prev) => prev.filter((p) => p.id !== id))
    })
    deleteWordPairAction(id)
    setConfirmingDelete(null)
  }

  const filtered = activeFilter === 'All'
    ? pairs
    : pairs.filter((p) => p.category === activeFilter)

  const usedCategories = Array.from(new Set(pairs.map((p) => p.category)))

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Add a word pair</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              value={wordA}
              onChange={(e) => setWordA(e.target.value)}
              placeholder="Word A (e.g. onward)"
              className="rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-violet-400 placeholder:text-faint"
            />
            <input
              value={wordB}
              onChange={(e) => setWordB(e.target.value)}
              placeholder="Word B (e.g. onwards)"
              className="rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-violet-400 placeholder:text-faint"
            />
          </div>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain the difference — region, register, context, spelling…"
            rows={3}
            className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-violet-400 resize-none placeholder:text-faint"
          />
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-violet-400"
            >
              {WORD_PAIR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!wordA.trim() || !wordB.trim() || !explanation.trim() || isAdding}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
            >
              {isAdding ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Category filter chips */}
      {pairs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('All')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'All'
                ? 'bg-violet-600 text-white'
                : 'bg-subtle text-muted-foreground hover:bg-border'
            }`}
          >
            All ({pairs.length})
          </button>
          {usedCategories.map((cat) => {
            const count = pairs.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-subtle text-muted-foreground hover:bg-border'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Pairs list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-faint">
              {pairs.length === 0
                ? 'No word pairs yet. Add one above.'
                : `No pairs in "${activeFilter}".`}
            </p>
          </div>
        ) : (
          filtered.map((p) => {
            const isExpanded = expandedId === p.id
            return (
              <div
                key={p.id}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-subtle transition-colors"
                >
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS['Other']}`}
                  >
                    {p.category}
                  </span>
                  <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <span className="text-violet-600">{p.wordA}</span>
                    <span className="text-faint text-xs font-normal">vs</span>
                    <span className="text-violet-600">{p.wordB}</span>
                  </span>
                  <span className="ml-auto flex items-center gap-2 shrink-0">
                    {!p.isSystem && (
                      confirmingDelete === p.id ? (
                        <span
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-xs text-red-600 font-medium">Delete?</span>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmingDelete(null)}
                            className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmingDelete(p.id) }}
                          className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
                          title="Delete"
                        >
                          ✕
                        </button>
                      )
                    )}
                    <span className="text-faint text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </span>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3 flex flex-col gap-3">
                    <p className="text-sm leading-relaxed text-foreground">{p.explanation}</p>
                    {p.examples.length > 0 && (
                      <ul className="flex flex-col gap-1.5">
                        {p.examples.map((ex, i) => (
                          <li key={i} className="text-xs text-muted-foreground italic leading-relaxed pl-3 border-l-2 border-violet-300">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
