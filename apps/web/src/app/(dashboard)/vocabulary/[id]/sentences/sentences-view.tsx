'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { addSentenceAction, deleteSentenceAction } from '@/app/actions/word-sentences'
import { SENTENCE_CONTEXTS } from '@/lib/ielts/vocabulary/sentence-contexts'
import type { WordSentence } from '@/lib/db/word-sentences'

const CONTEXT_COLORS: Record<string, string> = {
  Speaking:  'bg-green-50 text-green-700',
  Writing:   'bg-blue-50 text-blue-700',
  News:      'bg-orange-50 text-orange-700',
  Book:      'bg-purple-50 text-purple-700',
  Podcast:   'bg-pink-50 text-pink-700',
  Other:     'bg-subtle text-muted-foreground',
}

type Props = {
  wordId: number
  initialSentences: WordSentence[]
}

export function SentencesView({ wordId, initialSentences }: Props) {
  const [sentences, setSentences] = useOptimistic(initialSentences)
  const [, startTransition] = useTransition()
  const [text, setText] = useState('')
  const [context, setContext] = useState<string>(SENTENCE_CONTEXTS[0])
  const [isAdding, setIsAdding] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setIsAdding(true)
    const optimistic: WordSentence = {
      id: Date.now(),
      wordId,
      sentence: text.trim(),
      context,
      createdAt: new Date(),
    }
    startTransition(() => {
      setSentences((prev) => [optimistic, ...prev])
    })
    setText('')
    await addSentenceAction({ wordId, sentence: optimistic.sentence, context })
    setIsAdding(false)
  }

  function handleDelete(id: number) {
    startTransition(() => {
      setSentences((prev) => prev.filter((s) => s.id !== id))
    })
    deleteSentenceAction(id, wordId)
    setConfirmingDelete(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Add a sentence</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type a sentence that uses this word in context…"
            rows={3}
            className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none placeholder:text-faint"
          />
          <div className="flex items-center gap-3">
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              {SENTENCE_CONTEXTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!text.trim() || isAdding}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {isAdding ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Sentence list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Saved sentences
            <span className="ml-2 text-xs font-normal text-faint">({sentences.length})</span>
          </h2>
        </div>

        {sentences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-faint">No sentences yet. Add one above.</p>
          </div>
        ) : (
          sentences.map((s) => (
            <div
              key={s.id}
              className="group relative rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTEXT_COLORS[s.context] ?? CONTEXT_COLORS.Other}`}
                >
                  {s.context}
                </span>

                {/* Delete — two-step */}
                {confirmingDelete === s.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-red-600 font-medium">Delete?</span>
                    <button
                      onClick={() => handleDelete(s.id)}
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
                    onClick={() => setConfirmingDelete(s.id)}
                    className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors shrink-0"
                    title="Delete"
                  >
                    ✕
                  </button>
                )}
              </div>

              <p className="text-sm leading-relaxed text-foreground">{s.sentence}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
