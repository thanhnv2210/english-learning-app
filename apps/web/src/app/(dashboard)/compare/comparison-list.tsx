'use client'

import { useState, useMemo, useTransition, useOptimistic } from 'react'
import { deleteComparisonAction, updateComparisonRankAction } from '@/app/actions/comparisons'
import type { ComparisonCard } from '@/lib/db/comparisons'

const REGISTER_COLORS: Record<string, string> = {
  formal:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  informal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  neutral:  'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400',
}

const CATEGORY_COLORS: Record<string, string> = {
  adverb:      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  verb:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  noun:        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  adjective:   'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  conjunction: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  preposition: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  phrase:      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

type SortKey = 'rank_desc' | 'rank_asc' | 'date_desc' | 'alpha_asc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rank_desc', label: 'Rank: high → low' },
  { value: 'rank_asc',  label: 'Rank: low → high' },
  { value: 'date_desc', label: 'Newest first' },
  { value: 'alpha_asc', label: 'A → Z (term A)' },
]

function applySort(items: ComparisonCard[], sort: SortKey): ComparisonCard[] {
  const arr = [...items]
  switch (sort) {
    case 'rank_desc': return arr.sort((a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'rank_asc':  return arr.sort((a, b) => a.rank - b.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'date_desc': return arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'alpha_asc': return arr.sort((a, b) => a.termA.localeCompare(b.termA))
  }
}

const ALL_CATEGORIES = ['adverb', 'verb', 'noun', 'adjective', 'conjunction', 'preposition', 'phrase']

export function ComparisonList({ initialItems }: { initialItems: ComparisonCard[] }) {
  const [items, setItems] = useOptimistic(initialItems)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeRank, setActiveRank] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('rank_desc')

  const filtered = useMemo(() => {
    let result = items
    if (activeCategory) result = result.filter((c) => c.category === activeCategory)
    if (activeRank !== null) result = result.filter((c) => c.rank === activeRank)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.termA.toLowerCase().includes(q) ||
          c.termB.toLowerCase().includes(q) ||
          c.keyDifference.toLowerCase().includes(q),
      )
    }
    return applySort(result, sort)
  }, [items, activeCategory, activeRank, search, sort])

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((c) => c.id !== id))
    deleteComparisonAction(id)
  }

  function handleRankUpdate(id: number, rank: number) {
    setItems((prev) =>
      [...prev.map((c) => (c.id === id ? { ...c, rank } : c))].sort(
        (a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    )
    updateComparisonRankAction(id, rank)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">Comparison Library</h2>
        <span className="text-xs text-faint">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-faint">No comparisons saved yet. Use the search above to add one.</p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search term or key difference…"
                className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
              {ALL_CATEGORIES.map((cat) => (
                <FilterChip
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-faint shrink-0">Rank</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRank(activeRank === r ? null : r)}
                    className={`flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      activeRank === r
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-border bg-card text-muted-foreground hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    {'★'.repeat(r)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-faint">
            Showing <span className="font-semibold text-muted-foreground">{filtered.length}</span> of {items.length}
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((card) => (
              <ComparisonCard
                key={card.id}
                card={card}
                onDelete={() => handleDelete(card.id)}
                onRankUpdate={(rank) => handleRankUpdate(card.id, rank)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ComparisonCard({
  card,
  onDelete,
  onRankUpdate,
}: {
  card: ComparisonCard
  onDelete: () => void
  onRankUpdate: (rank: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [localRank, setLocalRank] = useState(card.rank)
  const [hoverRank, setHoverRank] = useState(0)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [, startTransition] = useTransition()

  function handleRankClick(rank: number) {
    setLocalRank(rank)
    startTransition(() => onRankUpdate(rank))
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm gap-3">
      {/* Delete — hidden for system entries */}
      {!card.isSystem && (
        confirmingDelete ? (
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
            <span className="text-xs text-red-600 font-medium">Delete?</span>
            <button onClick={onDelete} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">Yes</button>
            <button onClick={() => setConfirmingDelete(false)} className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors">No</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
          >✕</button>
        )
      )}

      {/* Header: terms + category */}
      <div className="flex items-center gap-2 pr-7 flex-wrap">
        <span className="text-base font-bold text-blue-600">{card.termA}</span>
        <span className="text-xs text-faint">vs</span>
        <span className="text-base font-bold text-violet-600">{card.termB}</span>
        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[card.category] ?? 'bg-subtle text-muted-foreground'}`}>
          {card.category}
        </span>
      </div>

      {/* Key difference */}
      <p className="text-sm leading-relaxed text-muted-foreground">{card.keyDifference}</p>

      {/* Register chips */}
      <div className="flex gap-2 flex-wrap">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REGISTER_COLORS[card.dimensionA.register] ?? REGISTER_COLORS.neutral}`}>
          {card.termA}: {card.dimensionA.register}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REGISTER_COLORS[card.dimensionB.register] ?? REGISTER_COLORS.neutral}`}>
          {card.termB}: {card.dimensionB.register}
        </span>
      </div>

      {/* Rank */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-faint">Rank</span>
        <div className="flex gap-0.5" onMouseLeave={() => setHoverRank(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRankClick(star)} onMouseEnter={() => setHoverRank(star)} className="text-base leading-none transition-transform hover:scale-110">
              <span className={(hoverRank || localRank) >= star ? 'text-amber-400' : 'text-border'}>★</span>
            </button>
          ))}
        </div>
      </div>

      {/* Expand for full detail */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-xs font-medium text-blue-500 hover:text-blue-700"
      >
        {expanded ? 'Hide detail ▲' : 'Show full comparison ▼'}
      </button>

      {expanded && (
        <>
          {/* Side-by-side IELTS fit */}
          <div className="grid grid-cols-2 gap-2">
            {([
              { term: card.termA, dim: card.dimensionA },
              { term: card.termB, dim: card.dimensionB },
            ] as const).map(({ term, dim }) => (
              <div key={term} className="rounded-lg bg-muted border border-border p-3 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground">{term}</span>
                {dim.intensity !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-faint">Intensity</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <span key={n} className={`text-xs ${(dim.intensity ?? 0) >= n ? 'text-blue-500' : 'text-border'}`}>●</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-xs text-muted-foreground"><span className="text-faint">Writing: </span>{dim.ieltsWriting}</div>
                <div className="text-xs text-muted-foreground"><span className="text-faint">Speaking: </span>{dim.ieltsSpeaking}</div>
                {dim.note && <p className="text-xs text-faint italic border-t border-border pt-1 mt-0.5">{dim.note}</p>}
              </div>
            ))}
          </div>

          {/* Example pairs */}
          {card.examples.length > 0 && (
            <div className="flex flex-col gap-2">
              {card.examples.map((pair, i) => (
                <div key={i} className="rounded-lg bg-muted border border-border p-3 flex flex-col gap-1.5">
                  <p className="text-xs text-faint italic">{pair.context}</p>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-xs font-bold text-blue-600 w-12">{card.termA}</span>
                    <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{pair.withA}&rdquo;</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-xs font-bold text-violet-600 w-12">{card.termB}</span>
                    <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{pair.withB}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-subtle text-muted-foreground hover:bg-border'
      }`}
    >
      {label}
    </button>
  )
}
