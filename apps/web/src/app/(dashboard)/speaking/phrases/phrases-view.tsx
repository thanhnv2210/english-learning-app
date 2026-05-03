'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useLocalBoolean } from '@/lib/hooks/use-local-boolean'
import { addPhraseAction, deletePhraseAction } from '@/app/actions/speaking-phrases'
import { SPEAKING_PHRASE_CATEGORIES, WRITING_PHRASE_CATEGORIES } from '@/lib/ielts/speaking/phrase-categories'
import type { SpeakingPhrase } from '@/lib/db/speaking-phrases'

const CATEGORY_COLORS: Record<string, string> = {
  'Opinion':       'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Agreeing':      'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  'Disagreeing':   'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  'Buying Time':   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Describing':    'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  'Part 2 Opener': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
  'Speculation':   'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  'Example':       'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
  'Other':         'bg-subtle text-muted-foreground',
}

type Props = {
  initialPhrases: SpeakingPhrase[]
  skill: 'speaking' | 'writing'
}

export function PhrasesView({ initialPhrases, skill }: Props) {
  const [addOpen, setAddOpen] = useLocalBoolean(`${skill}-phrases:add-form-open`, false)
  const categories = skill === 'writing' ? WRITING_PHRASE_CATEGORIES : SPEAKING_PHRASE_CATEGORIES
  const [phrases, setPhrasesOptimistic] = useOptimistic(initialPhrases)
  const [, startTransition] = useTransition()

  const [phrase, setPhrase] = useState('')
  const [category, setCategory] = useState<string>(categories[0])
  const [note, setNote] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!phrase.trim()) return
    setIsAdding(true)
    const optimistic: SpeakingPhrase = {
      id: Date.now(),
      userId: 0,
      phrase: phrase.trim(),
      category,
      skill,
      note: note.trim() || null,
      isSystem: false,
      createdAt: new Date(),
    }
    startTransition(() => {
      setPhrasesOptimistic((prev) => [optimistic, ...prev])
    })
    setPhrase('')
    setNote('')
    await addPhraseAction({ phrase: optimistic.phrase, category, skill, note: optimistic.note ?? undefined })
    setIsAdding(false)
  }

  function handleDelete(id: number) {
    startTransition(() => {
      setPhrasesOptimistic((prev) => prev.filter((p) => p.id !== id))
    })
    deletePhraseAction(id, skill)
    setConfirmingDelete(null)
  }

  const filtered = activeFilter === 'All'
    ? phrases
    : phrases.filter((p) => p.category === activeFilter)

  const usedCategories = Array.from(new Set(phrases.map((p) => p.category)))

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setAddOpen(!addOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-subtle transition-colors"
        >
          <h2 className="text-sm font-semibold text-foreground">Add a phrase</h2>
          <span className="text-faint text-xs shrink-0">{addOpen ? '▲' : '▼'}</span>
        </button>
        {addOpen && <div className="px-5 pb-5 flex flex-col gap-3">
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Paste or type a phrase you want to mimic…"
            rows={3}
            className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none placeholder:text-faint"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional) — e.g. where you heard it"
            className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-faint"
          />
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!phrase.trim() || isAdding}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {isAdding ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
        </div>}
      </div>

      {/* Category filter chips */}
      {phrases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('All')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-subtle text-muted-foreground hover:bg-border'
            }`}
          >
            All ({phrases.length})
          </button>
          {usedCategories.map((cat) => {
            const count = phrases.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-subtle text-muted-foreground hover:bg-border'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Phrase list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-faint">
              {phrases.length === 0
                ? 'No phrases yet. Add one above.'
                : `No phrases in "${activeFilter}".`}
            </p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS['Other']}`}
                >
                  {p.category}
                </span>

                {!p.isSystem && (
                confirmingDelete === p.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-red-600 font-medium">Delete?</span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      className="rounded px-2 py-0.5 text-xs font-semibold bg-subtle text-muted-foreground hover:bg-border transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(p.id)}
                    className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors shrink-0"
                    title="Delete"
                  >
                    ✕
                  </button>
                )
              )}
              </div>

              <p className="text-sm leading-relaxed text-foreground">{p.phrase}</p>

              {p.note && (
                <p className="text-xs text-faint italic">{p.note}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
