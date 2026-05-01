'use client'

import { useState, useMemo, useTransition, useOptimistic } from 'react'
import {
  deleteIdiomAction,
  updateIdiomSkillsAction,
  updateIdiomContextsAction,
  updateIdiomRankAction,
} from '@/app/actions/idioms'
import type { IdiomCard } from '@/lib/db/idioms'
import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'

const ALL_SKILLS: IdiomSkill[] = ['Writing_1', 'Writing_2', 'Speaking']
const ALL_CONTEXTS: IdiomContext[] = ['Speaking', 'Writing', 'News', 'Book', 'Podcast', 'Other']

const SKILL_COLORS: Record<IdiomSkill, string> = {
  Writing_1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Writing_2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Speaking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const SKILL_LABELS: Record<IdiomSkill, string> = {
  Writing_1: 'Writing Task 1',
  Writing_2: 'Writing Task 2',
  Speaking: 'Speaking',
}

const CONTEXT_COLORS: Record<IdiomContext, string> = {
  Speaking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Writing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  News: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Book: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Podcast: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Other: 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400',
}

type SortKey = 'rank_desc' | 'rank_asc' | 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rank_desc', label: 'Rank: high → low' },
  { value: 'rank_asc',  label: 'Rank: low → high' },
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc',  label: 'Oldest first' },
  { value: 'alpha_asc', label: 'A → Z' },
  { value: 'alpha_desc', label: 'Z → A' },
]

function applySort(items: IdiomCard[], sort: SortKey): IdiomCard[] {
  const arr = [...items]
  switch (sort) {
    case 'rank_desc': return arr.sort((a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'rank_asc':  return arr.sort((a, b) => a.rank - b.rank || b.createdAt.getTime() - a.createdAt.getTime())
    case 'date_desc': return arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'date_asc':  return arr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    case 'alpha_asc': return arr.sort((a, b) => a.idiom.localeCompare(b.idiom))
    case 'alpha_desc': return arr.sort((a, b) => b.idiom.localeCompare(a.idiom))
  }
}

export function IdiomList({ initialItems }: { initialItems: IdiomCard[] }) {
  const [items, setItems] = useOptimistic(initialItems)
  const [search, setSearch] = useState('')
  const [activeSkill, setActiveSkill] = useState<IdiomSkill | null>(null)
  const [activeContext, setActiveContext] = useState<IdiomContext | null>(null)
  const [activeRank, setActiveRank] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('rank_desc')

  const filtered = useMemo(() => {
    let result = items
    if (activeSkill) result = result.filter((c) => c.skills.includes(activeSkill))
    if (activeContext) result = result.filter((c) => c.contexts.includes(activeContext))
    if (activeRank !== null) result = result.filter((c) => c.rank === activeRank)
    if (search.trim()) {
      const q = search.toLowerCase()
      const primary = result.filter(
        (c) => c.idiom.toLowerCase().includes(q) || c.meaning.toLowerCase().includes(q)
      )
      const secondary = result.filter(
        (c) => !c.idiom.toLowerCase().includes(q) && !c.meaning.toLowerCase().includes(q) &&
          c.examples.some((e) => e.toLowerCase().includes(q))
      )
      return [...applySort(primary, sort), ...applySort(secondary, sort)]
    }
    return applySort(result, sort)
  }, [items, activeSkill, activeContext, activeRank, search, sort])

  const secondaryMatchIds = useMemo(() => {
    if (!search.trim()) return new Set<number>()
    const q = search.toLowerCase()
    return new Set(
      items
        .filter((c) => !c.idiom.toLowerCase().includes(q) && !c.meaning.toLowerCase().includes(q) && c.examples.some((e) => e.toLowerCase().includes(q)))
        .map((c) => c.id)
    )
  }, [items, search])

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((c) => c.id !== id))
    deleteIdiomAction(id)
  }

  function handleSkillsUpdate(id: number, skills: IdiomSkill[]) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, skills } : c)))
    updateIdiomSkillsAction(id, skills)
  }

  function handleContextsUpdate(id: number, contexts: IdiomContext[]) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, contexts } : c)))
    updateIdiomContextsAction(id, contexts)
  }

  function handleRankUpdate(id: number, rank: number) {
    setItems((prev) =>
      [...prev.map((c) => (c.id === id ? { ...c, rank } : c))].sort(
        (a, b) => b.rank - a.rank || b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    )
    updateIdiomRankAction(id, rank)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">Saved Idioms</h2>
        <span className="text-xs text-faint">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-faint">No idioms saved yet. Look one up above to add it.</p>
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
                placeholder="Search idiom, meaning, or example…"
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

            {/* Skill filter */}
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All skills" active={activeSkill === null} onClick={() => setActiveSkill(null)} />
              {ALL_SKILLS.map((skill) => (
                <FilterChip
                  key={skill}
                  label={SKILL_LABELS[skill]}
                  active={activeSkill === skill}
                  onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                />
              ))}
            </div>

            {/* Context filter */}
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All contexts" active={activeContext === null} onClick={() => setActiveContext(null)} />
              {ALL_CONTEXTS.map((ctx) => (
                <FilterChip
                  key={ctx}
                  label={ctx}
                  active={activeContext === ctx}
                  onClick={() => setActiveContext(activeContext === ctx ? null : ctx)}
                />
              ))}
            </div>

            {/* Rank filter */}
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

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm text-faint">No idioms match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((card) => (
                <IdiomCard
                  key={card.id}
                  card={card}
                  onDelete={() => handleDelete(card.id)}
                  onSkillsUpdate={(skills) => handleSkillsUpdate(card.id, skills)}
                  onContextsUpdate={(contexts) => handleContextsUpdate(card.id, contexts)}
                  onRankUpdate={(rank) => handleRankUpdate(card.id, rank)}
                  isSecondaryMatch={secondaryMatchIds.has(card.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function IdiomCard({
  card,
  onDelete,
  onSkillsUpdate,
  onContextsUpdate,
  onRankUpdate,
  isSecondaryMatch = false,
}: {
  card: IdiomCard
  onDelete: () => void
  onSkillsUpdate: (skills: IdiomSkill[]) => void
  onContextsUpdate: (contexts: IdiomContext[]) => void
  onRankUpdate: (rank: number) => void
  isSecondaryMatch?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [editingContexts, setEditingContexts] = useState(false)
  const [localSkills, setLocalSkills] = useState<IdiomSkill[]>(card.skills)
  const [localContexts, setLocalContexts] = useState<IdiomContext[]>(card.contexts)
  const [localRank, setLocalRank] = useState(card.rank)
  const [hoverRank, setHoverRank] = useState(0)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [, startTransition] = useTransition()

  function handleRankClick(rank: number) {
    setLocalRank(rank)
    startTransition(() => onRankUpdate(rank))
  }

  function toggleSkill(skill: IdiomSkill) {
    const updated = localSkills.includes(skill)
      ? localSkills.filter((s) => s !== skill)
      : [...localSkills, skill]
    setLocalSkills(updated)
    startTransition(() => onSkillsUpdate(updated))
  }

  function toggleContext(ctx: IdiomContext) {
    const updated = localContexts.includes(ctx)
      ? localContexts.filter((c) => c !== ctx)
      : [...localContexts, ctx]
    setLocalContexts(updated)
    startTransition(() => onContextsUpdate(updated))
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm gap-3">
      {/* Delete button — hidden for system/seed idioms */}
      {!card.isSystem && (
        confirmingDelete ? (
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
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
            className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
            title="Delete"
          >
            ✕
          </button>
        )
      )}

      {/* Idiom + register */}
      <div className="flex flex-col gap-1 pr-7">
        <span className="text-base font-semibold text-foreground">{card.idiom}</span>
        <span className="text-xs text-faint bg-subtle rounded-full px-2 py-0.5 w-fit capitalize">
          {card.register}
        </span>
      </div>

      {/* Meaning */}
      <p className="text-sm leading-relaxed text-muted-foreground">{card.meaning}</p>

      {/* Rank */}
      <div className="flex items-center gap-1.5">
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

      {/* Skills */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {localSkills.length === 0 ? (
              <span className="text-xs text-faint italic">No skills tagged</span>
            ) : (
              localSkills.map((skill) => (
                <span key={skill} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SKILL_COLORS[skill]}`}>
                  {SKILL_LABELS[skill]}
                </span>
              ))
            )}
          </div>
          <button
            onClick={() => setEditingSkills((v) => !v)}
            className="shrink-0 text-xs text-faint hover:text-blue-500 transition-colors ml-auto"
          >
            {editingSkills ? 'Done' : 'Edit'}
          </button>
        </div>
        {editingSkills && (
          <div className="flex gap-2 flex-wrap mt-1">
            {ALL_SKILLS.map((skill) => {
              const active = localSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active ? `${SKILL_COLORS[skill]} border-transparent` : 'bg-card text-faint border-border hover:bg-subtle'
                  }`}
                >
                  {SKILL_LABELS[skill]}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Contexts */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {localContexts.length === 0 ? (
              <span className="text-xs text-faint italic">No contexts tagged</span>
            ) : (
              localContexts.map((ctx) => (
                <span key={ctx} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTEXT_COLORS[ctx]}`}>
                  {ctx}
                </span>
              ))
            )}
          </div>
          <button
            onClick={() => setEditingContexts((v) => !v)}
            className="shrink-0 text-xs text-faint hover:text-blue-500 transition-colors ml-auto"
          >
            {editingContexts ? 'Done' : 'Edit'}
          </button>
        </div>
        {editingContexts && (
          <div className="flex gap-2 flex-wrap mt-1">
            {ALL_CONTEXTS.map((ctx) => {
              const active = localContexts.includes(ctx)
              return (
                <button
                  key={ctx}
                  onClick={() => toggleContext(ctx)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active ? `${CONTEXT_COLORS[ctx]} border-transparent` : 'bg-card text-faint border-border hover:bg-subtle'
                  }`}
                >
                  {ctx}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Examples */}
      {card.examples.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-xs font-medium text-blue-500 hover:text-blue-700"
          >
            {expanded ? 'Hide examples ▲' : 'Show examples ▼'}
          </button>
          {expanded && (
            <div className="flex flex-col gap-2">
              {card.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-muted p-3">
                  <p className="text-xs leading-relaxed text-foreground italic">
                    &ldquo;<HighlightedExample text={ex} phrase={card.idiom} />&rdquo;
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
            className="not-italic bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded px-0.5 font-semibold"
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

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-subtle text-muted-foreground hover:bg-border'
      }`}
    >
      {label}
    </button>
  )
}
