'use client'

import { useState, useTransition } from 'react'
import { saveCollocationAction } from '@/app/actions/collocations'
import type { CollocationSkill } from '@/lib/db/schema'
import type { CollocationResult } from '@/lib/ielts/collocations/prompts'
import type { CollocationSearchResponse } from '@/app/api/collocations/search/route'

const ALL_SKILLS: CollocationSkill[] = ['Writing_1', 'Writing_2', 'Speaking']

const SKILL_COLORS: Record<CollocationSkill, string> = {
  Writing_1: 'bg-blue-100 text-blue-700 border-blue-200',
  Writing_2: 'bg-purple-100 text-purple-700 border-purple-200',
  Speaking: 'bg-green-100 text-green-700 border-green-200',
}

const SKILL_LABELS: Record<CollocationSkill, string> = {
  Writing_1: 'Writing Task 1',
  Writing_2: 'Writing Task 2',
  Speaking: 'Speaking',
}

type CardState = CollocationResult & { inLibrary: boolean; savedSkills: CollocationSkill[] }

type Status = 'idle' | 'searching' | 'done' | 'invalid' | 'error'

export function CollocationSearch() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'word' | 'phrase'>('word')
  const [status, setStatus] = useState<Status>('idle')
  const [cards, setCards] = useState<CardState[]>([])
  const [invalidReason, setInvalidReason] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(searchMode: 'word' | 'phrase') {
    const q = query.trim()
    if (!q) return
    setMode(searchMode)
    setStatus('searching')
    setCards([])
    setInvalidReason(null)
    setError(null)

    try {
      const res = await fetch('/api/collocations/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, mode: searchMode }),
      })
      if (!res.ok) throw new Error('Server error')
      const data: CollocationSearchResponse = await res.json()

      if (data.mode === 'word') {
        const seen = new Set<string>()
        setCards(
          data.results
            .filter((r) => {
              const key = r.phrase.toLowerCase()
              if (seen.has(key)) return false
              seen.add(key)
              return true
            })
            .map((r) => ({ ...r, savedSkills: r.suggestedSkills })),
        )
        setStatus('done')
      } else if (data.valid) {
        setCards([{ ...data.result, savedSkills: data.result.suggestedSkills }])
        setStatus('done')
      } else {
        setInvalidReason(data.reason)
        setStatus('invalid')
      }
    } catch {
      setError('Could not fetch collocations. Please try again.')
      setStatus('error')
    }
  }

  function toggleSkill(cardIndex: number, skill: CollocationSkill) {
    setCards((prev) =>
      prev.map((c, i) => {
        if (i !== cardIndex) return c
        const has = c.savedSkills.includes(skill)
        return {
          ...c,
          savedSkills: has ? c.savedSkills.filter((s) => s !== skill) : [...c.savedSkills, skill],
        }
      }),
    )
  }

  function markSaved(cardIndex: number) {
    setCards((prev) =>
      prev.map((c, i) => (i === cardIndex ? { ...c, inLibrary: true } : c)),
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">Search collocations</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Enter a word to find common collocations, or a phrase to check a specific one.
        </p>
      </div>

      {/* Input + buttons */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch('word')}
          placeholder="e.g. risk, significant impact, contribute to…"
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={() => handleSearch('word')}
          disabled={!query.trim() || status === 'searching'}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          By Word
        </button>
        <button
          onClick={() => handleSearch('phrase')}
          disabled={!query.trim() || status === 'searching'}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          By Phrase
        </button>
      </div>

      {/* States */}
      {status === 'searching' && (
        <p className="text-xs text-gray-400 animate-pulse text-center py-4">
          {mode === 'word' ? 'Finding collocations…' : 'Checking phrase…'}
        </p>
      )}

      {status === 'error' && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {status === 'invalid' && invalidReason && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-700">Not a valid collocation</p>
          <p className="text-xs text-amber-600 mt-0.5">{invalidReason}</p>
        </div>
      )}

      {/* Result cards */}
      {status === 'done' && cards.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400">
            {mode === 'word'
              ? `${cards.length} collocations found — adjust skills then save`
              : 'Valid collocation — adjust skills then save'}
          </p>
          {cards.map((card, i) => (
            <CollocationResultCard
              key={`${card.phrase}-${i}`}
              card={card}
              onToggleSkill={(skill) => toggleSkill(i, skill)}
              onSaved={() => markSaved(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CollocationResultCard({
  card,
  onToggleSkill,
  onSaved,
}: {
  card: CardState
  onToggleSkill: (skill: CollocationSkill) => void
  onSaved: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isSaving, startSaving] = useTransition()

  function handleSave() {
    startSaving(async () => {
      await saveCollocationAction({
        phrase: card.phrase,
        type: card.type,
        explanation: card.explanation,
        skills: card.savedSkills,
        examples: card.examples,
      })
      onSaved()
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-900">{card.phrase}</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 w-fit">
            {card.type}
          </span>
        </div>

        <div className="shrink-0">
          {card.inLibrary ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ Saved
            </span>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving || card.savedSkills.length === 0}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Explanation */}
      {card.explanation && (
        <p className="text-sm leading-relaxed text-gray-600">{card.explanation}</p>
      )}

      {/* Skill toggles */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-gray-400">Skills (AI-suggested — toggle to adjust):</p>
        <div className="flex gap-2 flex-wrap">
          {ALL_SKILLS.map((skill) => {
            const active = card.savedSkills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => !card.inLibrary && onToggleSkill(skill)}
                disabled={card.inLibrary}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? SKILL_COLORS[skill]
                    : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100'
                } ${card.inLibrary ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
              >
                {SKILL_LABELS[skill]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Examples toggle */}
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
                <div key={i} className="rounded-lg bg-white border border-gray-100 p-3">
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
