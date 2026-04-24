'use client'

import { useState, useMemo, useOptimistic, useTransition, useRef, useEffect } from 'react'
import { deleteVocabularyWordAction, updateVocabularyRankAction, updateWordPronunciationAction } from '@/app/actions/vocabulary'
import { toggleVocabFavoriteAction } from '@/app/actions/user-skill-topics'
import type { VocabularyCard } from '@/lib/db/vocabulary'

// ── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = 'rank_desc' | 'rank_asc' | 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'alpha_asc',  label: 'A → Z' },
  { value: 'alpha_desc', label: 'Z → A' },
  { value: 'rank_desc',  label: 'Rank: high → low' },
  { value: 'rank_asc',   label: 'Rank: low → high' },
  { value: 'date_desc',  label: 'Newest first' },
  { value: 'date_asc',   label: 'Oldest first' },
]

function applySort(items: VocabularyCard[], sort: SortKey): VocabularyCard[] {
  const arr = [...items]
  switch (sort) {
    case 'alpha_asc':  return arr.sort((a, b) => a.word.localeCompare(b.word))
    case 'alpha_desc': return arr.sort((a, b) => b.word.localeCompare(a.word))
    case 'rank_desc':  return arr.sort((a, b) => b.rank - a.rank || a.word.localeCompare(b.word))
    case 'rank_asc':   return arr.sort((a, b) => a.rank - b.rank || a.word.localeCompare(b.word))
    case 'date_desc':  return arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    case 'date_asc':   return arr.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  words: VocabularyCard[]
  domains: string[]
  favoriteDomains: string[]
}

export function VocabularyList({ words, domains, favoriteDomains }: Props) {
  const [items, setItems] = useOptimistic(words)
  const [search, setSearch] = useState('')
  const [activeDomain, setActiveDomain] = useState<string | null>(null)
  const [activeRank, setActiveRank] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('alpha_asc')

  // Favourite domain management
  const [localFavorites, setLocalFavorites] = useState<string[]>(favoriteDomains ?? [])
  const [, startFavTransition] = useTransition()
  const [showMoreDomains, setShowMoreDomains] = useState(false)
  const moreDomainsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreDomainsRef.current && !moreDomainsRef.current.contains(e.target as Node)) {
        setShowMoreDomains(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleToggleFavorite(domain: string) {
    setLocalFavorites((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain],
    )
    startFavTransition(() => toggleVocabFavoriteAction(domain))
  }

  // Domains split into pinned (favourites present in the actual domain list) and others
  const pinnedDomains = localFavorites.filter((d) => domains.includes(d))
  const otherDomains = domains.filter((d) => !localFavorites.includes(d))

  const filtered = useMemo(() => {
    let result = items

    if (activeDomain === '__general__') {
      result = result.filter((w) => w.domains.length === 0)
    } else if (activeDomain) {
      result = result.filter((w) => w.domains.includes(activeDomain))
    }

    if (activeRank !== null) {
      result = result.filter((w) => w.rank === activeRank)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q),
      )
    }

    return applySort(result, sort)
  }, [items, activeDomain, activeRank, search, sort])

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((w) => w.id !== id))
    deleteVocabularyWordAction(id)
  }

  function handleRankUpdate(id: number, rank: number) {
    setItems((prev) =>
      prev.map((w) => (w.id === id ? { ...w, rank } : w)),
    )
    updateVocabularyRankAction(id, rank)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Filter bar ── */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
        {/* Search + Sort */}
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search word or definition…"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-blue-400 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Domain filter chips — favourites first, others behind ··· */}
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={activeDomain === null} onClick={() => setActiveDomain(null)} />
          <FilterChip label="General" active={activeDomain === '__general__'} onClick={() => setActiveDomain('__general__')} />

          {pinnedDomains.map((d) => (
            <DomainChip
              key={d}
              label={d}
              active={activeDomain === d}
              pinned
              onSelect={() => setActiveDomain(activeDomain === d ? null : d)}
              onTogglePin={() => handleToggleFavorite(d)}
            />
          ))}

          {otherDomains.length > 0 && (
            <div ref={moreDomainsRef} className="relative">
              <button
                onClick={() => setShowMoreDomains((v) => !v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  showMoreDomains || otherDomains.includes(activeDomain ?? '')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ···
              </button>
              {showMoreDomains && (
                <div className="absolute left-0 top-full mt-1 z-10 w-52 rounded-xl border border-gray-200 bg-white shadow-lg p-2 flex flex-col gap-0.5">
                  {otherDomains.map((d) => (
                    <div key={d} className="group flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveDomain(activeDomain === d ? null : d)
                          setShowMoreDomains(false)
                        }}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                          activeDomain === d ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(d)}
                        title="Pin to favourites"
                        className="shrink-0 p-1 text-gray-300 hover:text-amber-400 transition-colors"
                      >
                        ☆
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rank filter chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 shrink-0">Rank</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setActiveRank(activeRank === r ? null : r)}
                title={`Filter by rank ${r}`}
                className={`flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  activeRank === r
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                {'★'.repeat(r)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{' '}
        {words.length} words
      </p>

      {/* ── Word grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-400">No words match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((word) => (
            <WordCard
              key={word.word}
              word={word}
              onDelete={word.userAdded ? () => handleDelete(word.id) : undefined}
              onRankUpdate={(rank) => handleRankUpdate(word.id, rank)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── WordCard ──────────────────────────────────────────────────────────────────

export function WordCard({
  word,
  onDelete,
  onRankUpdate,
}: {
  word: VocabularyCard
  onDelete?: () => void
  onRankUpdate?: (rank: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [localRank, setLocalRank] = useState(word.rank)
  const [hoverRank, setHoverRank] = useState(0)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [, startTransition] = useTransition()
  const [pronunciation, setPronunciation] = useState(word.pronunciation)
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] = useState(false)
  const [editingPronunciation, setEditingPronunciation] = useState(false)
  const [editUk, setEditUk] = useState('')
  const [editUs, setEditUs] = useState('')
  const [isSavingPronunciation, setIsSavingPronunciation] = useState(false)

  function handleRankClick(rank: number) {
    setLocalRank(rank)
    startTransition(() => onRankUpdate?.(rank))
  }

  function openPronunciationEdit() {
    setEditUk(pronunciation?.uk ?? '')
    setEditUs(pronunciation?.us ?? '')
    setEditingPronunciation(true)
  }

  async function handleSavePronunciation() {
    if (!editUk.trim() && !editUs.trim()) return
    setIsSavingPronunciation(true)
    try {
      const uk = editUk.trim()
      const us = editUs.trim()
      setPronunciation((prev) => ({ uk, us, ukAudio: prev?.ukAudio, usAudio: prev?.usAudio }))
      setEditingPronunciation(false)
      if (word.id > 0) {
        await updateWordPronunciationAction(word.id, uk, us, pronunciation)
      }
    } finally {
      setIsSavingPronunciation(false)
    }
  }

  async function handleGeneratePronunciation() {
    setIsGeneratingPronunciation(true)
    try {
      const res = await fetch('/api/vocabulary/pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: word.id, word: word.word }),
      })
      if (res.ok) {
        const data = await res.json()
        setPronunciation(data)
      }
    } finally {
      setIsGeneratingPronunciation(false)
    }
  }

  const synonyms = word.synonyms.filter((s) => s.type === 'synonym').slice(0, 3)
  const antonyms = word.synonyms.filter((s) => s.type === 'antonym').slice(0, 2)
  const familyEntries = Object.entries(word.familyWords).filter(([, v]) => v)

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Delete — two-step, only for user-added words */}
      {onDelete && (
        confirmingDelete ? (
          <div className="absolute top-3 right-4 flex items-center gap-1.5">
            <span className="text-xs text-red-600 font-medium">Delete?</span>
            <button
              onClick={onDelete}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="absolute top-4 right-4 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
            title="Delete"
          >
            ✕
          </button>
        )
      )}

      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2 pr-8">
        <h3 className="text-lg font-bold text-gray-900">{word.word}</h3>
        {word.userAdded && (
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-600 font-medium">
            Added
          </span>
        )}
        {word.domains.length === 0 && !word.userAdded && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            General
          </span>
        )}
      </div>

      {/* Domain tags */}
      {word.domains.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {word.domains.map((d) => (
            <span key={d} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Pronunciation */}
      {editingPronunciation ? (
        <div className="mb-2 flex flex-col gap-1.5">
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-400 w-5">UK</span>
              <input
                type="text"
                value={editUk}
                onChange={(e) => setEditUk(e.target.value)}
                placeholder="/ɪnˈfluəns/"
                className="w-36 rounded border border-gray-200 px-2 py-1 font-mono text-xs text-gray-700 outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-400 w-5">US</span>
              <input
                type="text"
                value={editUs}
                onChange={(e) => setEditUs(e.target.value)}
                placeholder="/ˈɪnfluəns/"
                className="w-36 rounded border border-gray-200 px-2 py-1 font-mono text-xs text-gray-700 outline-none focus:border-blue-400"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSavePronunciation}
              disabled={isSavingPronunciation || (!editUk.trim() && !editUs.trim())}
              className="rounded px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSavingPronunciation ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditingPronunciation(false)}
              className="rounded px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : pronunciation ? (
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <PronunciationChip label="UK" ipa={pronunciation.uk} audioUrl={pronunciation.ukAudio} />
          <PronunciationChip label="US" ipa={pronunciation.us} audioUrl={pronunciation.usAudio} />
          {!pronunciation.ukAudio && !pronunciation.usAudio && (
            <button
              onClick={handleGeneratePronunciation}
              disabled={isGeneratingPronunciation}
              title="Refresh from dictionary API"
              className="text-xs text-gray-300 hover:text-blue-400 disabled:opacity-40 transition-colors"
            >
              {isGeneratingPronunciation ? '…' : '↻'}
            </button>
          )}
          <button
            onClick={openPronunciationEdit}
            title="Edit pronunciation manually"
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            ✎
          </button>
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-3">
          <button
            onClick={handleGeneratePronunciation}
            disabled={isGeneratingPronunciation}
            className="text-xs text-gray-400 hover:text-blue-500 disabled:opacity-50 transition-colors"
          >
            {isGeneratingPronunciation ? 'Fetching…' : '+ pronunciation'}
          </button>
          <span className="text-xs text-gray-200">·</span>
          <button
            onClick={openPronunciationEdit}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            enter manually
          </button>
        </div>
      )}

      {/* Definition */}
      <p className="mb-3 text-sm leading-relaxed text-gray-600">{word.definition}</p>

      {/* Family words */}
      {familyEntries.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {familyEntries.map(([pos, form]) => (
            <span key={pos} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              <span className="text-gray-400">{pos}: </span>
              {form}
            </span>
          ))}
        </div>
      )}

      {/* Synonyms / antonyms */}
      {(synonyms.length > 0 || antonyms.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {synonyms.length > 0 && (
            <span>
              <span className="font-medium text-gray-700">Syn: </span>
              {synonyms.map((s) => s.word).join(', ')}
            </span>
          )}
          {antonyms.length > 0 && (
            <span>
              <span className="font-medium text-gray-700">Ant: </span>
              {antonyms.map((s) => s.word).join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Collocations */}
      {word.collocations.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {word.collocations.map((c, i) => (
            <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Rank */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs text-gray-400">Rank</span>
        <div className="flex gap-0.5" onMouseLeave={() => setHoverRank(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRankClick(star)}
              onMouseEnter={() => setHoverRank(star)}
              title={`Rank ${star}`}
              className="text-base leading-none transition-transform hover:scale-110"
            >
              <span className={(hoverRank || localRank) >= star ? 'text-amber-400' : 'text-gray-200'}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Examples toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-auto self-start text-xs font-medium text-blue-500 hover:text-blue-700"
      >
        {expanded ? 'Hide examples ▲' : 'Show examples ▼'}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">Speaking</p>
            <p className="text-xs leading-relaxed text-gray-700 italic">
              &ldquo;{word.examples.speaking}&rdquo;
            </p>
          </div>
          {word.examples.writing.map((ex, i) => (
            <div key={i} className="rounded-lg bg-blue-50 p-3">
              <p className="mb-1 text-xs font-semibold text-blue-500">
                Writing Task 2 — example {i + 1}
              </p>
              <p className="text-xs leading-relaxed text-gray-700 italic">
                &ldquo;{ex}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PronunciationChip ─────────────────────────────────────────────────────────

function PronunciationChip({
  label,
  ipa,
  audioUrl,
}: {
  label: string
  ipa: string
  audioUrl?: string
}) {
  function play() {
    if (!audioUrl) return
    new Audio(audioUrl).play()
  }

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <span className="font-medium text-gray-400">{label}</span>
      <span className="font-mono tracking-wide text-gray-700">{ipa}</span>
      {audioUrl && (
        <button
          onClick={play}
          title={`Play ${label} pronunciation`}
          className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
        >
          ▶
        </button>
      )}
    </span>
  )
}

// ── FilterChip ────────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

// ── DomainChip ────────────────────────────────────────────────────────────────
// Favourite domain chip — shows a ★ unpin button on hover

function DomainChip({
  label,
  active,
  pinned,
  onSelect,
  onTogglePin,
}: {
  label: string
  active: boolean
  pinned: boolean
  onSelect: () => void
  onTogglePin: () => void
}) {
  return (
    <div className="group flex items-center gap-0.5">
      <button
        onClick={onSelect}
        className={`rounded-l-full rounded-r-none border-r-0 px-3 py-1 text-xs font-medium transition-colors ${
          active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${pinned ? 'rounded-r-none' : 'rounded-full'}`}
      >
        {label}
      </button>
      <button
        onClick={onTogglePin}
        title="Unpin from favourites"
        className={`rounded-r-full py-1 pl-1 pr-2 text-xs transition-colors ${
          active
            ? 'bg-blue-600 text-blue-200 hover:text-white'
            : 'bg-gray-100 text-amber-400 opacity-0 group-hover:opacity-100 hover:text-amber-600'
        }`}
      >
        ★
      </button>
    </div>
  )
}
