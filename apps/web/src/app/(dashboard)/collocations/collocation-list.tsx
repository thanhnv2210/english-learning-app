'use client'

import { useState, useMemo, useTransition, useOptimistic } from 'react'
import { deleteCollocationAction, updateCollocationSkillsAction } from '@/app/actions/collocations'
import type { CollocationCard } from '@/lib/db/collocations'
import type { CollocationSkill } from '@/lib/db/schema'

const ALL_SKILLS: CollocationSkill[] = ['Writing_1', 'Writing_2', 'Speaking']

const SKILL_COLORS: Record<CollocationSkill, string> = {
  Writing_1: 'bg-blue-100 text-blue-700',
  Writing_2: 'bg-purple-100 text-purple-700',
  Speaking: 'bg-green-100 text-green-700',
}

const SKILL_LABELS: Record<CollocationSkill, string> = {
  Writing_1: 'Writing Task 1',
  Writing_2: 'Writing Task 2',
  Speaking: 'Speaking',
}

type Props = {
  initialItems: CollocationCard[]
}

export function CollocationList({ initialItems }: Props) {
  const [items, setItems] = useOptimistic(initialItems)
  const [search, setSearch] = useState('')
  const [activeSkill, setActiveSkill] = useState<CollocationSkill | null>(null)

  const filtered = useMemo(() => {
    let result = items
    if (activeSkill) {
      result = result.filter((c) => c.skills.includes(activeSkill))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.phrase.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.examples.some((e) => e.toLowerCase().includes(q)),
      )
    }
    return result
  }, [items, activeSkill, search])

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((c) => c.id !== id))
    deleteCollocationAction(id)
  }

  function handleSkillsUpdate(id: number, skills: CollocationSkill[]) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, skills } : c)))
    updateCollocationSkillsAction(id, skills)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-800">Saved Collocations</h2>
        <span className="text-xs text-gray-400">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-400">No collocations saved yet. Search above to add some.</p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phrase, type, or example…"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
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
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {items.length}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-sm text-gray-400">No collocations match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((card) => (
                <SavedCard
                  key={card.id}
                  card={card}
                  onDelete={() => handleDelete(card.id)}
                  onSkillsUpdate={(skills) => handleSkillsUpdate(card.id, skills)}
                />
              ))}
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
}: {
  card: CollocationCard
  onDelete: () => void
  onSkillsUpdate: (skills: CollocationSkill[]) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [localSkills, setLocalSkills] = useState<CollocationSkill[]>(card.skills)
  const [, startTransition] = useTransition()

  function toggleSkill(skill: CollocationSkill) {
    const updated = localSkills.includes(skill)
      ? localSkills.filter((s) => s !== skill)
      : [...localSkills, skill]
    setLocalSkills(updated)
    startTransition(() => onSkillsUpdate(updated))
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm gap-3">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
        title="Delete"
      >
        ✕
      </button>

      {/* Phrase + type */}
      <div className="flex flex-col gap-1 pr-7">
        <span className="text-base font-semibold text-gray-900">{card.phrase}</span>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 w-fit">
          {card.type}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {card.skills.length === 0 ? (
              <span className="text-xs text-gray-400 italic">No skills tagged</span>
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
          <button
            onClick={() => setEditingSkills((v) => !v)}
            className="shrink-0 text-xs text-gray-400 hover:text-blue-500 transition-colors ml-auto"
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
                    active
                      ? `${SKILL_COLORS[skill]} border-transparent`
                      : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {SKILL_LABELS[skill]}
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
                <div key={i} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs leading-relaxed text-gray-700 italic">&ldquo;{ex}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
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
