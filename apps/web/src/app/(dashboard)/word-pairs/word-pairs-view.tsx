'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useLocalBoolean } from '@/lib/hooks/use-local-boolean'
import { addWordPairAction, deleteWordPairAction } from '@/app/actions/word-pairs'
import { WORD_PAIR_CATEGORIES, CATEGORY_COLORS } from '@/lib/ielts/word-pairs/categories'
import type { WordPair } from '@/lib/db/word-pairs'
import type { WordPairsSearchResponse, AiPairEntry } from '@/app/api/word-pairs/search/route'

type Props = { initialPairs: WordPair[] }

// ── Library list helpers ──────────────────────────────────────────────────────

type PairGroup = {
  wordA: string
  entries: { pair: WordPair; otherWord: string }[]
}

/** Group pairs by wordA for the "A vs B (cat) vs C (cat)" display. */
function buildGroups(pairs: WordPair[]): PairGroup[] {
  const map = new Map<string, WordPair[]>()
  for (const p of pairs) {
    const existing = map.get(p.wordA) ?? []
    map.set(p.wordA, [...existing, p])
  }
  return Array.from(map.entries()).map(([wordA, ps]) => ({
    wordA,
    entries: ps.map((p) => ({ pair: p, otherWord: p.wordB })),
  }))
}

// ── Search result helpers ─────────────────────────────────────────────────────

type SearchEntry =
  | { source: 'db'; id: number; word: string; category: string; explanation: string; examples: string[] }
  | { source: 'ai'; idx: number; word: string; category: string; explanation: string; examples: string[]; inLibrary: boolean; raw: AiPairEntry }

/** Build a unified list of interchangeable words from both DB and AI results. */
function buildSearchEntries(
  query: string,
  dbPairs: WordPairsSearchResponse['dbPairs'],
  aiPairs: AiPairEntry[],
): SearchEntry[] {
  const db: SearchEntry[] = dbPairs.map((p) => ({
    source: 'db',
    id: p.id,
    word: p.wordA === query ? p.wordB : p.wordA,
    category: p.category,
    explanation: p.explanation,
    examples: p.examples,
  }))
  const ai: SearchEntry[] = aiPairs.map((p, idx) => ({
    source: 'ai',
    idx,
    word: p.wordA === query ? p.wordB : p.wordA,
    category: p.category,
    explanation: p.explanation,
    examples: p.examples,
    inLibrary: p.inLibrary,
    raw: p,
  }))
  return [...db, ...ai]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WordPairsView({ initialPairs }: Props) {
  const [pairs, setPairsOptimistic] = useOptimistic(initialPairs)
  const [, startTransition] = useTransition()

  // Collapsible sections (persisted in localStorage, default closed)
  const [aiSearchOpen, setAiSearchOpen] = useLocalBoolean('word-pairs:ai-search-open', false)
  const [addFormOpen, setAddFormOpen] = useLocalBoolean('word-pairs:add-form-open', false)

  // Manual add form
  const [wordA, setWordA] = useState('')
  const [wordB, setWordB] = useState('')
  const [explanation, setExplanation] = useState('')
  const [category, setCategory] = useState<string>(WORD_PAIR_CATEGORIES[0])
  const [isAdding, setIsAdding] = useState(false)

  // Library list
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [localSearch, setLocalSearch] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [expandedPairId, setExpandedPairId] = useState<number | null>(null)

  // AI search
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchData, setSearchData] = useState<WordPairsSearchResponse | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchEntries, setSearchEntries] = useState<SearchEntry[]>([])
  const [expandedEntryKey, setExpandedEntryKey] = useState<string | null>(null)
  const [savingIdxs, setSavingIdxs] = useState<Set<number>>(new Set())

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchData(null)
    setSearchEntries([])
    setSearchError(null)
    setExpandedEntryKey(null)
    try {
      const res = await fetch('/api/word-pairs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      })
      const data: WordPairsSearchResponse = await res.json()
      if (!res.ok) {
        setSearchError((data as { error?: string }).error ?? 'Search failed')
      } else {
        setSearchData(data)
        setSearchEntries(buildSearchEntries(data.query, data.dbPairs, data.aiPairs))
      }
    } catch {
      setSearchError('Network error — please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  async function handleSaveEntry(entry: SearchEntry & { source: 'ai' }) {
    setSavingIdxs((prev) => new Set(prev).add(entry.idx))
    const saved = await addWordPairAction({
      wordA: entry.raw.wordA,
      wordB: entry.raw.wordB,
      explanation: entry.raw.explanation,
      examples: entry.raw.examples,
      category: entry.raw.category,
    })
    startTransition(() => {
      setPairsOptimistic((prev) => [saved, ...prev])
    })
    setSearchEntries((prev) =>
      prev.map((e) =>
        e.source === 'ai' && e.idx === entry.idx ? { ...e, inLibrary: true } : e,
      ),
    )
    setSavingIdxs((prev) => { const s = new Set(prev); s.delete(entry.idx); return s })
  }

  async function handleSaveAll() {
    const unsaved = searchEntries.filter(
      (e): e is SearchEntry & { source: 'ai' } => e.source === 'ai' && !e.inLibrary,
    )
    // Mark all saved immediately (optimistic)
    setSearchEntries((prev) =>
      prev.map((e) => (e.source === 'ai' && !e.inLibrary ? { ...e, inLibrary: true } : e)),
    )
    // Persist each in the background
    for (const entry of unsaved) {
      const saved = await addWordPairAction({
        wordA: entry.raw.wordA,
        wordB: entry.raw.wordB,
        explanation: entry.raw.explanation,
        examples: entry.raw.examples,
        category: entry.raw.category,
      })
      startTransition(() => {
        setPairsOptimistic((prev) => [saved, ...prev])
      })
    }
  }

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

  // Build grouped library list
  const localQ = localSearch.trim().toLowerCase()
  const filtered = pairs.filter((p) => {
    if (activeFilter !== 'All' && p.category !== activeFilter) return false
    if (!localQ) return true
    return (
      p.wordA.includes(localQ) ||
      p.wordB.includes(localQ) ||
      p.explanation.toLowerCase().includes(localQ)
    )
  })
  const groups = buildGroups(filtered)
  const usedCategories = Array.from(new Set(pairs.map((p) => p.category)))

  const unsavedCount = searchEntries.filter(
    (e): e is SearchEntry & { source: 'ai' } => e.source === 'ai' && !e.inLibrary,
  ).length

  return (
    <div className="flex flex-col gap-6">

      {/* ── AI Search ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setAiSearchOpen(!aiSearchOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-subtle transition-colors"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">AI Search</h2>
            <span className="text-xs text-faint">— checks your library first, then asks AI</span>
          </div>
          <span className="text-faint text-xs shrink-0">{aiSearchOpen ? '▲' : '▼'}</span>
        </button>
        {aiSearchOpen && <div className="px-5 pb-5 flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a word (e.g. onward, analyze, whilst)…"
            className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-violet-400 placeholder:text-faint"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim() || isSearching}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors shrink-0"
          >
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {searchError && <p className="text-sm text-red-500">{searchError}</p>}

        {searchData && searchEntries.length === 0 && (
          <p className="text-sm text-faint italic">
            No interchangeable pairs found for &ldquo;{searchData.query}&rdquo;.
          </p>
        )}

        {searchData && searchEntries.length > 0 && (
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Header — query vs chips */}
            <div className="px-4 py-3 bg-subtle flex flex-wrap items-center gap-x-1.5 gap-y-2">
              <span className="text-sm font-bold text-foreground">{searchData.query}</span>
              {searchEntries.map((entry) => {
                const key = entry.source === 'db' ? `db-${entry.id}` : `ai-${entry.idx}`
                const isActive = expandedEntryKey === key
                return (
                  <button
                    key={key}
                    onClick={() => setExpandedEntryKey(isActive ? null : key)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                      isActive
                        ? 'border-violet-400 bg-violet-600 text-white'
                        : 'border-border bg-card text-foreground hover:border-violet-300'
                    }`}
                  >
                    <span className="font-bold">vs {entry.word}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      isActive ? 'bg-violet-500 text-white' : CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS['Other']
                    }`}>
                      {entry.category}
                    </span>
                    {(entry.source === 'db' || (entry.source === 'ai' && entry.inLibrary)) && (
                      <span className="text-[10px] text-green-600 font-semibold">✓</span>
                    )}
                  </button>
                )
              })}
              {/* Save All New */}
              {unsavedCount > 0 && (
                <button
                  onClick={handleSaveAll}
                  className="ml-auto rounded-lg bg-violet-600 text-white px-3 py-1 text-xs font-semibold hover:bg-violet-700 transition-colors shrink-0"
                >
                  Save All New ({unsavedCount})
                </button>
              )}
            </div>

            {/* Expanded entry detail */}
            {expandedEntryKey && (() => {
              const entry = searchEntries.find((e) =>
                expandedEntryKey === (e.source === 'db' ? `db-${e.id}` : `ai-${e.idx}`),
              )
              if (!entry) return null
              const isAi = entry.source === 'ai'
              return (
                <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">
                      {searchData.query}
                      <span className="text-faint font-normal mx-1">vs</span>
                      {entry.word}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {searchData.aiModel && (
                        <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[10px] font-mono font-medium">
                          {isAi ? searchData.aiModel : 'library'}
                        </span>
                      )}
                      {isAi && !entry.inLibrary && (
                        <button
                          onClick={() => handleSaveEntry(entry)}
                          disabled={savingIdxs.has(entry.idx)}
                          className="rounded-lg bg-violet-600 text-white px-3 py-1 text-xs font-semibold hover:bg-violet-700 disabled:opacity-40 transition-colors"
                        >
                          {savingIdxs.has(entry.idx) ? 'Saving…' : '+ Save'}
                        </button>
                      )}
                      {isAi && entry.inLibrary && (
                        <span className="rounded-lg bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                          Saved
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{entry.explanation}</p>
                  {entry.examples.length > 0 && (
                    <ul className="flex flex-col gap-1">
                      {entry.examples.map((ex, j) => (
                        <li key={j} className="text-xs text-muted-foreground italic leading-relaxed pl-3 border-l-2 border-violet-300">
                          {ex}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })()}
          </div>
        )}
        </div>}
      </div>

      {/* ── Manual add form ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setAddFormOpen(!addFormOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-subtle transition-colors"
        >
          <h2 className="text-sm font-semibold text-foreground">Add a word pair</h2>
          <span className="text-faint text-xs shrink-0">{addFormOpen ? '▲' : '▼'}</span>
        </button>
        {addFormOpen && <div className="px-5 pb-5 flex flex-col gap-3">
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
        </div>}
      </div>

      {/* ── Library search ───────────────────────────────��───────────────── */}
      {pairs.length > 0 && (
        <div className="relative">
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search your library…"
            className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2.5 pl-9 text-sm outline-none focus:border-violet-400 placeholder:text-faint"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint text-sm pointer-events-none">⌕</span>
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* ── Category filter chips ─────────────────────────────────────────── */}
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

      {/* ── Library list (grouped) ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-faint">
              {pairs.length === 0
                ? 'No word pairs yet. Add one above.'
                : localQ
                  ? `No pairs matching "${localSearch}".`
                  : `No pairs in "${activeFilter}".`}
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const isExpanded = expandedGroup === group.wordA
            return (
              <div key={group.wordA} className="group/card rounded-xl border border-border bg-card overflow-hidden">
                {/* Group header row */}
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.wordA)}
                  className="w-full flex flex-wrap items-center gap-x-1.5 gap-y-2 px-4 py-3 text-left hover:bg-subtle transition-colors"
                >
                  <span className="text-sm font-bold text-foreground shrink-0">{group.wordA}</span>
                  {group.entries.map(({ pair, otherWord }) => (
                    <span key={pair.id} className="flex items-center gap-1">
                      <span className="text-faint text-xs font-normal">vs</span>
                      <span className="text-sm font-semibold text-violet-600">{otherWord}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[pair.category] ?? CATEGORY_COLORS['Other']}`}>
                        {pair.category}
                      </span>
                    </span>
                  ))}
                  <span className="ml-auto text-faint text-xs shrink-0">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded: detail per pair */}
                {isExpanded && (
                  <div className="border-t border-border divide-y divide-border">
                    {group.entries.map(({ pair, otherWord }) => {
                      const isPairExpanded = expandedPairId === pair.id
                      return (
                        <div key={pair.id} className="group/pair">
                          <button
                            onClick={() => setExpandedPairId(isPairExpanded ? null : pair.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-subtle transition-colors"
                          >
                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[pair.category] ?? CATEGORY_COLORS['Other']}`}>
                              {pair.category}
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {group.wordA}
                              <span className="text-faint font-normal text-xs mx-1">vs</span>
                              <span className="text-violet-600">{otherWord}</span>
                            </span>
                            <span className="ml-auto flex items-center gap-2 shrink-0">
                              {!pair.isSystem && (
                                confirmingDelete === pair.id ? (
                                  <span
                                    className="flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="text-xs text-red-600 font-medium">Delete?</span>
                                    <button
                                      onClick={() => handleDelete(pair.id)}
                                      className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                    >Yes</button>
                                    <button
                                      onClick={() => setConfirmingDelete(null)}
                                      className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
                                    >No</button>
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmingDelete(pair.id) }}
                                    className="hidden group-hover/pair:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
                                    title="Delete"
                                  >✕</button>
                                )
                              )}
                              <span className="text-faint text-xs">{isPairExpanded ? '▲' : '▼'}</span>
                            </span>
                          </button>
                          {isPairExpanded && (
                            <div className="px-4 pb-3 flex flex-col gap-2">
                              <p className="text-sm leading-relaxed text-foreground">{pair.explanation}</p>
                              {pair.examples.length > 0 && (
                                <ul className="flex flex-col gap-1.5">
                                  {pair.examples.map((ex, i) => (
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
                    })}
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
