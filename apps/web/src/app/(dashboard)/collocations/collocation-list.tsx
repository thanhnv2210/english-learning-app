'use client'

import { useState, useMemo, useTransition, useOptimistic, useEffect } from 'react'
import { PaginationBar } from '@/components/pagination-bar'
import { deleteCollocationAction, getCollocationUserCountAction, updateCollocationSkillsAction, updateCollocationRankAction } from '@/app/actions/collocations'
import type { CollocationCard } from '@/lib/db/collocations'
import type { CollocationSkill } from '@/lib/db/schema'

// ── Essay generator types ─────────────────────────────────────────────────────
type EssayState =
  | { status: 'idle' }
  | { status: 'prompting' }
  | { status: 'loading' }
  | { status: 'done'; topic: string; essay: string }
  | { status: 'error'; message: string }

const ALL_SKILLS: CollocationSkill[] = ['Writing_1', 'Writing_2', 'Speaking']

const SKILL_COLORS: Record<CollocationSkill, string> = {
  Writing_1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Writing_2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Speaking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const SKILL_LABELS: Record<CollocationSkill, string> = {
  Writing_1: 'Writing Task 1',
  Writing_2: 'Writing Task 2',
  Speaking: 'Speaking',
}

type Props = {
  initialItems: CollocationCard[]
  isAdmin?: boolean
}

const PAGE_SIZE = 20

type SortKey = 'rank_desc' | 'rank_asc' | 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rank_desc', label: 'Rank: high → low' },
  { value: 'rank_asc',  label: 'Rank: low → high' },
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc',  label: 'Oldest first' },
  { value: 'alpha_asc', label: 'A → Z' },
  { value: 'alpha_desc',label: 'Z → A' },
]

function applySort(items: CollocationCard[], sort: SortKey): CollocationCard[] {
  const arr = [...items]
  switch (sort) {
    case 'rank_desc': return arr.sort((a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'rank_asc':  return arr.sort((a, b) => a.rank - b.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'date_desc': return arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'date_asc':  return arr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    case 'alpha_asc': return arr.sort((a, b) => a.phrase.localeCompare(b.phrase))
    case 'alpha_desc':return arr.sort((a, b) => b.phrase.localeCompare(a.phrase))
  }
}

export function CollocationList({ initialItems, isAdmin = false }: Props) {
  const [items, setItems] = useOptimistic(initialItems)
  const [search, setSearch] = useState('')
  const [activeSkill, setActiveSkill] = useState<CollocationSkill | 'all_skills' | null>(null)
  const [activeRank, setActiveRank] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('rank_desc')
  const [showDesc, setShowDesc] = useState(true)
  const [showRank, setShowRank] = useState(true)
  const [showSkill, setShowSkill] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Essay generator state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [essayTopic, setEssayTopic] = useState('')
  const [essayState, setEssayState] = useState<EssayState>({ status: 'idle' })

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function exitSelectMode() {
    setSelectMode(false)
    setSelectedIds(new Set())
    setEssayState({ status: 'idle' })
  }

  async function handleGenerateEssay() {
    const phrases = items.filter((c) => selectedIds.has(c.id)).map((c) => c.phrase)
    if (phrases.length < 2) return
    setEssayState({ status: 'loading' })
    try {
      const res = await fetch('/api/collocations/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrases, topic: essayTopic }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setEssayState({ status: 'done', topic: data.topic, essay: data.essay })
    } catch (err) {
      setEssayState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to generate essay' })
    }
  }

  const filtered = useMemo(() => {
    let result = items
    if (activeSkill === 'all_skills') {
      result = result.filter((c) => ALL_SKILLS.every((s) => c.skills.includes(s)))
    } else if (activeSkill) {
      result = result.filter((c) => c.skills.includes(activeSkill))
    }
    if (activeRank !== null) {
      result = result.filter((c) => c.rank === activeRank)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const primary = result.filter(
        (c) => c.phrase.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
      )
      const secondary = result.filter(
        (c) => !c.phrase.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q) &&
          c.examples.some((e) => e.toLowerCase().includes(q))
      )
      return [...applySort(primary, sort), ...applySort(secondary, sort)]
    }
    return applySort(result, sort)
  }, [items, activeSkill, activeRank, search, sort])

  const secondaryMatchIds = useMemo(() => {
    if (!search.trim()) return new Set<number>()
    const q = search.toLowerCase()
    return new Set(
      items
        .filter((c) => !c.phrase.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q) && c.examples.some((e) => e.toLowerCase().includes(q)))
        .map((c) => c.id)
    )
  }, [items, search])

  useEffect(() => { setCurrentPage(1) }, [activeSkill, activeRank, search, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((c) => c.id !== id))
    deleteCollocationAction(id)
  }

  function handleSkillsUpdate(id: number, skills: CollocationSkill[]) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, skills } : c)))
    updateCollocationSkillsAction(id, skills)
  }

  function handleRankUpdate(id: number, rank: number) {
    setItems((prev) =>
      [...prev.map((c) => (c.id === id ? { ...c, rank } : c))].sort(
        (a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    )
    updateCollocationRankAction(id, rank)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">Saved Collocations</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDesc}
              onChange={(e) => setShowDesc(e.target.checked)}
              className="rounded border-border accent-blue-600 w-3.5 h-3.5"
            />
            <span className="text-xs font-medium text-muted-foreground">Show descriptions</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showRank}
              onChange={(e) => setShowRank(e.target.checked)}
              className="rounded border-border accent-blue-600 w-3.5 h-3.5"
            />
            <span className="text-xs font-medium text-muted-foreground">Show rank</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSkill}
              onChange={(e) => setShowSkill(e.target.checked)}
              className="rounded border-border accent-blue-600 w-3.5 h-3.5"
            />
            <span className="text-xs font-medium text-muted-foreground">Show skills</span>
          </label>
          <span className="text-xs text-faint">{items.length} saved</span>
          {items.length >= 2 && (
            <button
              onClick={() => { setSelectMode((v) => !v); if (selectMode) exitSelectMode() }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-subtle text-muted-foreground hover:bg-border'
              }`}
            >
              {selectMode ? 'Cancel' : 'Essay from collocations'}
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-faint">No collocations saved yet. Search above to add some.</p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search phrase, type, or example…"
                className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400 min-h-[44px]"
              />
              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-full sm:w-auto appearance-none cursor-pointer rounded-lg border border-border bg-input text-foreground pl-3 pr-8 py-2 min-h-[44px] text-sm outline-none focus:border-blue-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
                  <svg className="h-4 w-4 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" active={activeSkill === null} onClick={() => setActiveSkill(null)} />
              {ALL_SKILLS.map((skill) => (
                <FilterChip
                  key={skill}
                  label={SKILL_LABELS[skill]}
                  active={activeSkill === skill}
                  onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                />
              ))}
              <FilterChip
                label="All 3 Skills"
                active={activeSkill === 'all_skills'}
                onClick={() => setActiveSkill(activeSkill === 'all_skills' ? null : 'all_skills')}
                highlight
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-faint shrink-0">Rank</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRank(activeRank === r ? null : r)}
                    title={`Filter by rank ${r}`}
                    className={`flex items-center gap-0.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
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

          {/* Essay generator panel */}
          {selectMode && (
            <div className="rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800/40 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Select ≥2 collocations, enter a topic, then generate a sample IELTS essay.
                </p>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {selectedIds.size} selected
                </span>
              </div>
              <input
                type="text"
                value={essayTopic}
                onChange={(e) => setEssayTopic(e.target.value)}
                placeholder="Essay topic, e.g. Technology is changing how people work and communicate."
                className="rounded-lg border border-blue-300 bg-white dark:bg-card px-4 py-2 text-sm outline-none focus:border-blue-500 text-foreground placeholder:text-faint"
              />
              <button
                onClick={handleGenerateEssay}
                disabled={selectedIds.size < 2 || !essayTopic.trim() || essayState.status === 'loading'}
                className="self-start rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {essayState.status === 'loading' ? 'Generating…' : `Generate Essay (${selectedIds.size} collocations)`}
              </button>
              {essayState.status === 'error' && (
                <p className="text-sm text-red-600">{essayState.message}</p>
              )}
              {essayState.status === 'done' && (
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">Generated Essay</p>
                  <p className="text-sm font-semibold text-foreground">{essayState.topic}</p>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    <EssayWithHighlights
                      essay={essayState.essay}
                      phrases={items.filter((c) => selectedIds.has(c.id)).map((c) => c.phrase)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
                    {items.filter((c) => selectedIds.has(c.id)).map((c) => (
                      <span key={c.id} className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium">
                        {c.phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm text-faint">No collocations match your filter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {paginated.map((card) => (
                  <SavedCard
                    key={card.id}
                    card={card}
                    onDelete={card.savedByMe || isAdmin ? () => handleDelete(card.id) : undefined}
                    onSkillsUpdate={(skills) => handleSkillsUpdate(card.id, skills)}
                    onRankUpdate={(rank) => handleRankUpdate(card.id, rank)}
                    selectMode={selectMode}
                    selected={selectedIds.has(card.id)}
                    onToggleSelect={() => toggleSelect(card.id)}
                    isSecondaryMatch={secondaryMatchIds.has(card.id)}
                    showDesc={showDesc}
                    showRank={showRank}
                    showSkill={showSkill}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
              <PaginationBar
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SavedCard({
  card,
  onDelete,
  onSkillsUpdate,
  onRankUpdate,
  selectMode = false,
  selected = false,
  onToggleSelect,
  isSecondaryMatch = false,
  showDesc = false,
  showRank = true,
  showSkill = true,
  isAdmin = false,
}: {
  card: CollocationCard
  onDelete?: () => void
  onSkillsUpdate: (skills: CollocationSkill[]) => void
  onRankUpdate: (rank: number) => void
  selectMode?: boolean
  selected?: boolean
  onToggleSelect?: () => void
  isSecondaryMatch?: boolean
  showDesc?: boolean
  showRank?: boolean
  showSkill?: boolean
  isAdmin?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [localSkills, setLocalSkills] = useState<CollocationSkill[]>(card.skills)
  const [localRank, setLocalRank] = useState(card.rank)
  const [hoverRank, setHoverRank] = useState(0)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [loadingCount, setLoadingCount] = useState(false)
  const [, startTransition] = useTransition()

  function handleRankClick(rank: number) {
    setLocalRank(rank)
    startTransition(() => onRankUpdate(rank))
  }

  function toggleSkill(skill: CollocationSkill) {
    const updated = localSkills.includes(skill)
      ? localSkills.filter((s) => s !== skill)
      : [...localSkills, skill]
    setLocalSkills(updated)
    startTransition(() => onSkillsUpdate(updated))
  }

  return (
    <div
      className={`group relative flex flex-col rounded-xl border bg-card p-4 shadow-sm gap-3 transition-colors ${
        selectMode
          ? selected
            ? 'border-blue-500 ring-2 ring-blue-400/30 cursor-pointer'
            : 'border-border hover:border-blue-300 cursor-pointer'
          : 'border-border'
      }`}
      onClick={selectMode ? onToggleSelect : undefined}
    >
      {/* Select checkbox overlay */}
      {selectMode && (
        <div className={`absolute top-3 left-3 flex items-center justify-center w-5 h-5 rounded border-2 transition-colors pointer-events-none ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-border bg-card'
        }`}>
          {selected && <span className="text-white text-xs leading-none">✓</span>}
        </div>
      )}

      {/* Delete button — two-step confirmation (hidden in select mode) */}
      {!selectMode && onDelete && (
        confirmingDelete ? (
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 flex-wrap justify-end max-w-[200px]">
            {isAdmin && (
              <span className="w-full text-right text-xs text-red-500">
                {loadingCount ? 'Checking…' : userCount === 0 ? 'No users have this.' : `${userCount} user${userCount === 1 ? '' : 's'} have this saved.`}
              </span>
            )}
            <span className="text-xs text-red-600 font-medium">Delete?</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              disabled={isAdmin && loadingCount}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmingDelete(false); setUserCount(null) }}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={async (e) => {
              e.stopPropagation()
              setConfirmingDelete(true)
              if (isAdmin) {
                setLoadingCount(true)
                const n = await getCollocationUserCountAction(card.id)
                setUserCount(n)
                setLoadingCount(false)
              }
            }}
            className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
            title="Delete"
          >
            ✕
          </button>
        )
      )}

      {/* Phrase + type */}
      <div className={`flex flex-col gap-1 pr-7 ${selectMode ? 'pl-7' : ''}`}>
        <span className="text-base font-semibold text-foreground">{card.phrase}</span>
        <span className="text-xs text-faint bg-subtle rounded-full px-2 py-0.5 w-fit">
          {card.type}
        </span>
      </div>

      {/* Explanation */}
      {showDesc && card.explanation && (
        <p className="text-sm leading-relaxed text-muted-foreground">{card.explanation}</p>
      )}

      {/* Rank */}
      {showRank && (
        <div className={`flex items-center gap-1.5 ${selectMode ? 'pointer-events-none opacity-60' : ''}`}>
          <span className="text-xs text-faint">Rank</span>
          <div className="flex gap-0.5" onMouseLeave={() => setHoverRank(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRankClick(star)}
                onMouseEnter={() => setHoverRank(star)}
                title={`Rank ${star}`}
                className="text-base leading-none transition-transform hover:scale-110"
              >
                <span className={(hoverRank || localRank) >= star ? 'text-amber-400' : 'text-border'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {showSkill && <div className={`flex flex-col gap-1 ${selectMode ? 'pointer-events-none opacity-60' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {card.skills.length === 0 ? (
              <span className="text-xs text-faint italic">No skills tagged</span>
            ) : (
              localSkills.map((skill) => (
                <span
                  key={skill}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SKILL_COLORS[skill]}`}
                >
                  {SKILL_LABELS[skill]}
                </span>
              ))
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => setEditingSkills((v) => !v)}
              className="shrink-0 text-xs text-faint hover:text-blue-500 transition-colors ml-auto"
            >
              {editingSkills ? 'Done' : 'Edit'}
            </button>
          )}
        </div>

        {isAdmin && editingSkills && (
          <div className="flex gap-2 flex-wrap mt-1">
            {ALL_SKILLS.map((skill) => {
              const active = localSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? `${SKILL_COLORS[skill]} border-transparent`
                      : 'bg-card text-faint border-border hover:bg-subtle'
                  }`}
                >
                  {SKILL_LABELS[skill]}
                </button>
              )
            })}
          </div>
        )}
      </div>}

      {/* Examples */}
      {card.examples.length > 0 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
            className="self-start text-xs font-medium text-blue-500 hover:text-blue-700"
          >
            {expanded ? 'Hide examples ▲' : 'Show examples ▼'}
          </button>
          {expanded && (
            <div className="flex flex-col gap-2">
              {card.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-muted p-3">
                  <p className="text-xs leading-relaxed text-foreground italic">
                    &ldquo;<HighlightedExample text={ex} phrase={card.phrase} />&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isSecondaryMatch && (
        <p className="text-xs text-faint italic">↳ matched in example</p>
      )}
    </div>
  )
}

// ── HighlightedExample ────────────────────────────────────────────────────────
// Splits the example sentence on the collocation phrase (case-insensitive) and
// wraps each match in a highlight span, preserving original casing.

function HighlightedExample({ text, phrase }: { text: string; phrase: string }) {
  if (!phrase) return <>{text}</>

  const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === phrase.toLowerCase() ? (
          <mark
            key={i}
            className="not-italic bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded px-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

// ── EssayWithHighlights ───────────────────────────────────────────────────────
// Highlights all selected collocation phrases in the generated essay.

function EssayWithHighlights({ essay, phrases }: { essay: string; phrases: string[] }) {
  if (!phrases.length) return <>{essay}</>

  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = essay.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        phrases.some((p) => p.toLowerCase() === part.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded px-0.5 font-semibold not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function FilterChip({
  label,
  active,
  onClick,
  highlight = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? highlight
            ? 'bg-amber-500 text-white'
            : 'bg-blue-600 text-white'
          : highlight
            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            : 'bg-subtle text-muted-foreground hover:bg-border'
      }`}
    >
      {label}
    </button>
  )
}
