'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalBoolean } from '@/lib/hooks/use-local-boolean'
import { saveIdiomAction } from '@/app/actions/idioms'
import type { IdiomSkill, IdiomContext } from '@/lib/db/schema'
import type { IdiomLookupResult } from '@/lib/ielts/idioms/prompts'
import type { IdiomLookupResponse } from '@/app/api/idioms/lookup/route'

const ALL_SKILLS: IdiomSkill[] = ['Writing_1', 'Writing_2', 'Speaking']
const ALL_CONTEXTS: IdiomContext[] = ['Speaking', 'Writing', 'News', 'Book', 'Podcast', 'Other']

const SKILL_COLORS: Record<IdiomSkill, string> = {
  Writing_1: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  Writing_2: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  Speaking: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
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
  Other: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
}

type CardState = IdiomLookupResult & { inLibrary: boolean; savedSkills: IdiomSkill[]; savedContexts: IdiomContext[] }

type Status = 'idle' | 'searching' | 'done' | 'invalid' | 'error'

export function IdiomSearch() {
  const router = useRouter()
  const [open, setOpen] = useLocalBoolean('idioms:search-open', false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [card, setCard] = useState<CardState | null>(null)
  const [invalidReason, setInvalidReason] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    setStatus('searching')
    setCard(null)
    setInvalidReason(null)
    setError(null)

    try {
      const res = await fetch('/api/idioms/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) throw new Error('Server error')
      const data: IdiomLookupResponse = await res.json()

      if (data.valid) {
        setCard({
          ...data.result,
          savedSkills: data.result.suggestedSkills,
          savedContexts: data.result.suggestedContexts,
        })
        setStatus('done')
      } else {
        setInvalidReason(data.reason)
        setStatus('invalid')
      }
    } catch {
      setError('Could not look up idiom. Please try again.')
      setStatus('error')
    }
  }

  function toggleSkill(skill: IdiomSkill) {
    if (!card) return
    const has = card.savedSkills.includes(skill)
    setCard({ ...card, savedSkills: has ? card.savedSkills.filter((s) => s !== skill) : [...card.savedSkills, skill] })
  }

  function toggleContext(ctx: IdiomContext) {
    if (!card) return
    const has = card.savedContexts.includes(ctx)
    setCard({ ...card, savedContexts: has ? card.savedContexts.filter((c) => c !== ctx) : [...card.savedContexts, ctx] })
  }

  function markSaved() {
    if (!card) return
    setCard({ ...card, inLibrary: true })
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-subtle transition-colors"
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">Look up an idiom</h2>
          <p className="text-xs text-faint mt-0.5">
            Enter an idiom phrase — AI will fill in the meaning, register, and example sentences.
          </p>
        </div>
        <span className="text-faint text-xs shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-5 pb-5 flex flex-col gap-4">

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. a double-edged sword, in the long run…"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || status === 'searching'}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          {status === 'searching' ? 'Looking up…' : 'Look up'}
        </button>
      </div>

      {status === 'error' && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {status === 'invalid' && invalidReason && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-700">Not a recognised idiom</p>
          <p className="text-xs text-amber-600 mt-0.5">{invalidReason}</p>
        </div>
      )}

      {status === 'done' && card && (
        <IdiomResultCard
          card={card}
          onToggleSkill={toggleSkill}
          onToggleContext={toggleContext}
          onSaved={markSaved}
        />
      )}
      </div>}
    </div>
  )
}

function IdiomResultCard({
  card,
  onToggleSkill,
  onToggleContext,
  onSaved,
}: {
  card: CardState
  onToggleSkill: (skill: IdiomSkill) => void
  onToggleContext: (ctx: IdiomContext) => void
  onSaved: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isSaving, startSaving] = useTransition()

  function handleSave() {
    startSaving(async () => {
      await saveIdiomAction({
        idiom: card.idiom,
        meaning: card.meaning,
        register: card.register,
        skills: card.savedSkills,
        contexts: card.savedContexts,
        examples: card.examples,
      })
      onSaved()
    })
  }

  return (
    <div className="rounded-xl border border-border bg-muted p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-foreground">{card.idiom}</span>
          <span className="text-xs text-faint bg-subtle rounded-full px-2 py-0.5 w-fit capitalize">
            {card.register}
          </span>
        </div>
        <div className="shrink-0">
          {card.inLibrary ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ Saved</span>
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

      {/* Meaning */}
      <p className="text-sm leading-relaxed text-muted-foreground">{card.meaning}</p>

      {/* Skill toggles */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-faint">Skills (AI-suggested — toggle to adjust):</p>
        <div className="flex gap-2 flex-wrap">
          {ALL_SKILLS.map((skill) => {
            const active = card.savedSkills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => !card.inLibrary && onToggleSkill(skill)}
                disabled={card.inLibrary}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active ? SKILL_COLORS[skill] : 'bg-card text-faint border-border hover:bg-subtle'
                } ${card.inLibrary ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
              >
                {SKILL_LABELS[skill]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Context toggles */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-faint">Contexts (where you encountered it — toggle to adjust):</p>
        <div className="flex gap-2 flex-wrap">
          {ALL_CONTEXTS.map((ctx) => {
            const active = card.savedContexts.includes(ctx)
            return (
              <button
                key={ctx}
                onClick={() => !card.inLibrary && onToggleContext(ctx)}
                disabled={card.inLibrary}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active ? `${CONTEXT_COLORS[ctx]} border-transparent` : 'bg-card text-faint border-border hover:bg-subtle'
                } ${card.inLibrary ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
              >
                {ctx}
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
                <div key={i} className="rounded-lg bg-card border border-border p-3">
                  <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{ex}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
