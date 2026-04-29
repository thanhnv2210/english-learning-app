'use client'

import { useState, useMemo, useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { deleteBankAction, updateBankRankAction } from '@/app/actions/vocab-banks'
import type { VocabBankWithCount } from '@/lib/db/vocab-banks'

type SortKey = 'rank_desc' | 'rank_asc' | 'alpha_asc' | 'alpha_desc' | 'words_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rank_desc', label: 'Rank: high → low' },
  { value: 'rank_asc', label: 'Rank: low → high' },
  { value: 'words_desc', label: 'Most words' },
  { value: 'alpha_asc', label: 'A → Z' },
  { value: 'alpha_desc', label: 'Z → A' },
]

function applySort(items: VocabBankWithCount[], sort: SortKey): VocabBankWithCount[] {
  const arr = [...items]
  switch (sort) {
    case 'rank_desc': return arr.sort((a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'rank_asc': return arr.sort((a, b) => a.rank - b.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'words_desc': return arr.sort((a, b) => b.wordCount - a.wordCount)
    case 'alpha_asc': return arr.sort((a, b) => a.topic.localeCompare(b.topic))
    case 'alpha_desc': return arr.sort((a, b) => b.topic.localeCompare(a.topic))
  }
}

export function BankList({ initialBanks }: { initialBanks: VocabBankWithCount[] }) {
  const [banks, setBanks] = useOptimistic(initialBanks)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('rank_desc')
  const [, startTransition] = useTransition()

  const filtered = useMemo(() => {
    let result = banks
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) => b.topic.toLowerCase().includes(q) || b.description.toLowerCase().includes(q),
      )
    }
    return applySort(result, sort)
  }, [banks, search, sort])

  function handleDelete(id: number) {
    startTransition(() => {
      setBanks((prev) => prev.filter((b) => b.id !== id))
      deleteBankAction(id)
    })
  }

  function handleRankUpdate(id: number, rank: number) {
    startTransition(() => {
      setBanks((prev) => prev.map((b) => (b.id === id ? { ...b, rank } : b)))
      updateBankRankAction(id, rank)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topic or description…"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-faint">
        Showing <span className="font-semibold text-muted-foreground">{filtered.length}</span> of {banks.length} banks
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-faint">No banks found. Create one with the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onDelete={() => handleDelete(bank.id)}
              onRankUpdate={(rank) => handleRankUpdate(bank.id, rank)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BankCard({
  bank,
  onDelete,
  onRankUpdate,
}: {
  bank: VocabBankWithCount
  onDelete: () => void
  onRankUpdate: (rank: number) => void
}) {
  const [localRank, setLocalRank] = useState(bank.rank)
  const [hoverRank, setHoverRank] = useState(0)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [, startTransition] = useTransition()

  function handleRankClick(rank: number) {
    setLocalRank(rank)
    startTransition(() => onRankUpdate(rank))
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm gap-3 hover:border-blue-300 transition-colors">
      {/* Delete button */}
      {!bank.isSystem && (
        confirmingDelete ? (
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
            <span className="text-xs text-red-600 font-medium">Delete?</span>
            <button
              onClick={onDelete}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors z-10"
            title="Delete bank"
          >
            ✕
          </button>
        )
      )}

      {/* Topic */}
      <Link href={`/vocab-banks/${bank.id}`} className="block pr-7">
        <span className="text-base font-semibold text-foreground capitalize hover:text-blue-600 transition-colors">
          {bank.topic}
        </span>
      </Link>

      {/* Description */}
      {bank.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{bank.description}</p>
      )}

      {/* Word count */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium">
          {bank.wordCount} words
        </span>
        {bank.isSystem && (
          <span className="rounded-full bg-subtle text-faint px-2.5 py-0.5 text-xs">system</span>
        )}
      </div>

      {/* Rank */}
      <div className="flex items-center gap-1.5 mt-auto">
        <span className="text-xs text-faint">Rank</span>
        <div className="flex gap-0.5" onMouseLeave={() => setHoverRank(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRankClick(star)}
              onMouseEnter={() => setHoverRank(star)}
              className="text-base leading-none transition-transform hover:scale-110"
            >
              <span className={(hoverRank || localRank) >= star ? 'text-amber-400' : 'text-border'}>★</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
