'use client'

import { useState, useMemo, useTransition } from 'react'
import { useLocalBoolean } from '@/lib/hooks/use-local-boolean'
import Link from 'next/link'
import { deleteGrammarTrapAction, updateGrammarTrapRankAction } from '@/app/actions/grammar-traps'
import type { GrammarTrapCard } from '@/lib/db/grammar-traps'
import { CATEGORY_LABELS, CATEGORY_COLORS, ALL_CATEGORIES } from '@/lib/ielts/grammar-traps/constants'
import type { GrammarCheckResult } from '@/lib/ielts/grammar-traps/prompts'

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; result: GrammarCheckResult }
  | { status: 'error'; message: string }

type GenerateState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; entry: GrammarTrapCard }
  | { status: 'error'; message: string }

// ── Main view ─────────────────────────────────────────────────────────────────

export function GrammarTrapsView({ initialEntries }: { initialEntries: GrammarTrapCard[] }) {
  const [entries, setEntries] = useState(initialEntries)
  const [, startTransition] = useTransition()

  // Collapsible sections
  const [checkerOpen, setCheckerOpen] = useLocalBoolean('grammar-traps:quick-checker-open', false)

  // Quick Checker state
  const [checkInput, setCheckInput] = useState('')
  const [checkState, setCheckState] = useState<CheckState>({ status: 'idle' })

  // Generate & Add state
  const [generateInput, setGenerateInput] = useState('')
  const [generateState, setGenerateState] = useState<GenerateState>({ status: 'idle' })
  const [showGenerateForm, setShowGenerateForm] = useState(false)

  // Library filter state
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // ── Quick Checker ──────────────────────────────────────────────────────────

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!checkInput.trim()) return
    setCheckState({ status: 'loading' })
    try {
      const res = await fetch('/api/grammar-traps/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: checkInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Check failed')
      setCheckState({ status: 'done', result: data })
    } catch (err) {
      setCheckState({ status: 'error', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  // ── Generate & Add ─────────────────────────────────────────────────────────

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!generateInput.trim()) return
    setGenerateState({ status: 'loading' })
    try {
      const res = await fetch('/api/grammar-traps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: generateInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generate failed')
      const entry: GrammarTrapCard = data.entry
      setEntries((prev) => {
        const exists = prev.find((e) => e.id === entry.id)
        return exists
          ? prev.map((e) => (e.id === entry.id ? entry : e))
          : [entry, ...prev]
      })
      setGenerateState({ status: 'done', entry })
      setGenerateInput('')
    } catch (err) {
      setGenerateState({ status: 'error', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    startTransition(() => deleteGrammarTrapAction(id))
  }

  // ── Rank ──────────────────────────────────────────────────────────────────

  function handleRank(id: number, rank: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, rank } : e)))
    startTransition(() => updateGrammarTrapRankAction(id, rank))
  }

  // ── Filtered library ──────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = entries
    if (activeCategory) result = result.filter((e) => e.category === activeCategory)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const primary = result.filter(
        (e) => e.phrase.toLowerCase().includes(q) || e.correction.toLowerCase().includes(q)
      )
      const secondary = result.filter(
        (e) => !e.phrase.toLowerCase().includes(q) && !e.correction.toLowerCase().includes(q) &&
          e.explanation.toLowerCase().includes(q)
      )
      return [...primary, ...secondary]
    }
    return result
  }, [entries, activeCategory, search])

  const secondaryMatchIds = useMemo(() => {
    if (!search.trim()) return new Set<number>()
    const q = search.trim().toLowerCase()
    return new Set(
      entries
        .filter((e) => !e.phrase.toLowerCase().includes(q) && !e.correction.toLowerCase().includes(q) && e.explanation.toLowerCase().includes(q))
        .map((e) => e.id)
    )
  }, [entries, search])

  const categoryCounts = useMemo(
    () => Object.fromEntries(ALL_CATEGORIES.map((c) => [c, entries.filter((e) => e.category === c).length])),
    [entries],
  )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grammar Traps</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Noun form errors — uncountable nouns, number agreement, false singulars.
          </p>
        </div>
        <div className="flex gap-2">
          {entries.length >= 3 && (
            <Link
              href="/grammar-traps/practice"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Practice →
            </Link>
          )}
          <button
            onClick={() => { setShowGenerateForm((v) => !v); setGenerateState({ status: 'idle' }) }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            {showGenerateForm ? 'Cancel' : '+ Add Entry'}
          </button>
        </div>
      </div>

      {/* ── Quick Checker ── */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setCheckerOpen(!checkerOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-subtle transition-colors"
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">Quick Checker</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Type a phrase or sentence to check for noun form errors.</p>
          </div>
          <span className="text-faint text-xs shrink-0">{checkerOpen ? '▲' : '▼'}</span>
        </button>
        {checkerOpen && <div className="px-5 pb-5 flex flex-col gap-3">
        <form onSubmit={handleCheck} className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            value={checkInput}
            onChange={(e) => { setCheckInput(e.target.value); setCheckState({ status: 'idle' }) }}
            placeholder='e.g. "The staffs are working" or "Give me an advice"'
            className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400 placeholder:text-faint min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!checkInput.trim() || checkState.status === 'loading'}
            className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors min-h-[44px]"
          >
            {checkState.status === 'loading' ? 'Checking…' : 'Check'}
          </button>
        </form>

        {checkState.status === 'done' && (
          <CheckResultCard result={checkState.result} />
        )}
        {checkState.status === 'error' && (
          <p className="text-xs text-red-500">{checkState.message}</p>
        )}
        </div>}
      </section>

      {/* ── Generate & Add ── */}
      {showGenerateForm && (
        <section className="flex flex-col gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Generate & Add Entry</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Enter a word or phrase — AI will generate the trap entry and save it to your library.</p>
          </div>
          <form onSubmit={handleGenerate} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={generateInput}
              onChange={(e) => setGenerateInput(e.target.value)}
              placeholder='e.g. "staff", "advice", "furniture", "scissors"'
              className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400 placeholder:text-faint min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!generateInput.trim() || generateState.status === 'loading'}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors min-h-[44px]"
            >
              {generateState.status === 'loading' ? 'Generating…' : 'Generate & Save'}
            </button>
          </form>
          {generateState.status === 'done' && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Saved: <span className="font-bold">{generateState.entry.phrase}</span> → {generateState.entry.correction}
            </p>
          )}
          {generateState.status === 'error' && (
            <p className="text-xs text-red-500">{generateState.message}</p>
          )}
        </section>
      )}

      {/* ── Library ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Library <span className="text-faint font-normal">({entries.length})</span>
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phrase, correction, or explanation…"
            className="rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400 placeholder:text-faint min-h-[44px]"
          />
          <div className="flex flex-wrap gap-2">
            <FilterChip label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} count={entries.length} />
            {ALL_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={CATEGORY_LABELS[c]}
                active={activeCategory === c}
                onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                count={categoryCounts[c]}
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {entries.length === 0
                ? 'No entries yet. Use "Add Entry" to generate your first grammar trap.'
                : 'No entries match your filters.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((entry) => (
              <TrapCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                onRank={handleRank}
                isSecondaryMatch={secondaryMatchIds.has(entry.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ── Check result card ─────────────────────────────────────────────────────────

function CheckResultCard({ result }: { result: GrammarCheckResult }) {
  if (result.isCorrect) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3">
        <span className="text-green-600 text-lg shrink-0">✓</span>
        <div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">Correct!</p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">{result.explanation}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg shrink-0">✗</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{result.error}</p>
          {result.correction && (
            <p className="text-sm mt-1 text-foreground">
              Correct form: <span className="font-bold text-green-700 dark:text-green-400">{result.correction}</span>
            </p>
          )}
        </div>
        {result.category && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[result.category] ?? ''}`}>
            {CATEGORY_LABELS[result.category] ?? result.category}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{result.explanation}</p>
    </div>
  )
}

// ── Trap card ─────────────────────────────────────────────────────────────────

function TrapCard({
  entry,
  onDelete,
  onRank,
  isSecondaryMatch = false,
}: {
  entry: GrammarTrapCard
  onDelete: (id: number) => void
  onRank: (id: number, rank: number) => void
  isSecondaryMatch?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 line-through shrink-0">{entry.phrase}</span>
            <span className="text-faint text-sm shrink-0">→</span>
            <span className="text-sm font-semibold text-green-700 dark:text-green-400 shrink-0">{entry.correction}</span>
          </div>
          <span className={`hidden sm:inline-flex rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${CATEGORY_COLORS[entry.category] ?? 'bg-subtle text-muted-foreground'}`}>
            {CATEGORY_LABELS[entry.category] ?? entry.category}
          </span>
        </div>
        <span className={`text-[10px] text-faint transition-transform duration-200 shrink-0 ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isSecondaryMatch && (
        <p className="px-5 pb-2 text-xs text-faint italic">↳ matched in explanation</p>
      )}
      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 flex flex-col gap-4">
          {/* Category badge on mobile */}
          <span className={`sm:hidden self-start rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[entry.category] ?? 'bg-subtle text-muted-foreground'}`}>
            {CATEGORY_LABELS[entry.category] ?? entry.category}
          </span>

          <p className="text-sm text-muted-foreground leading-relaxed">{entry.explanation}</p>

          {entry.examples.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-faint uppercase tracking-wide">Examples</p>
              {entry.examples.map((ex, i) => (
                <div key={i} className="flex flex-col gap-0.5 rounded-lg bg-subtle px-3 py-2 text-sm">
                  <span className="text-red-500 line-through">{ex.wrong}</span>
                  <span className="text-green-700 dark:text-green-400">✓ {ex.correct}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-faint mr-1">Rank:</span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => onRank(entry.id, r)}
                  className={`text-sm transition-colors ${r <= entry.rank ? 'text-amber-400' : 'text-faint hover:text-amber-300'}`}
                  title={`Set rank ${r}`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="text-xs text-faint hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Filter chip ───────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-subtle text-muted-foreground hover:bg-muted'
      }`}
    >
      {label}
      <span className={`rounded-full px-1 text-[10px] ${active ? 'bg-blue-500' : 'bg-muted text-faint'}`}>
        {count}
      </span>
    </button>
  )
}
