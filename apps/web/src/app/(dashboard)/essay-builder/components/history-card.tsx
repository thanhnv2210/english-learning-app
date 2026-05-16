'use client'

import { useState } from 'react'
import type { EssayBuilderRecord } from '@/lib/db/essay-builder'
import type { VocabularyCard } from '@/lib/db/vocabulary'
import type { CollocationCard } from '@/lib/db/collocations'
import { highlight, SKILL_LABELS, type PhraseSet } from '../utils'

export function HistoryCard({
  record,
  words,
  collocations,
  onToggleFavorite,
  onDelete,
  onUpdateSelections,
}: {
  record: EssayBuilderRecord
  words: VocabularyCard[]
  collocations: CollocationCard[]
  onToggleFavorite: () => void
  onDelete: () => void
  onUpdateSelections: (vocab: string[], colloc: string[]) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [bonusVocab, setBonusVocab] = useState<string[]>([])
  const [bonusColloc, setBonusColloc] = useState<string[]>([])
  const [detected, setDetected] = useState(false)
  const [isSavingSelections, setIsSavingSelections] = useState(false)
  const [selectionsSaved, setSelectionsSaved] = useState(false)

  function handleDetect() {
    const lower = record.decoratedText.toLowerCase()
    setBonusVocab(
      words
        .filter((w) => !record.selectedVocabulary.includes(w.word) && lower.includes(w.word.toLowerCase()))
        .map((w) => w.word),
    )
    setBonusColloc(
      collocations
        .filter((c) => !record.selectedCollocations.includes(c.phrase) && lower.includes(c.phrase.toLowerCase()))
        .map((c) => c.phrase),
    )
    setDetected(true)
    setSelectionsSaved(false)
  }

  async function handleSaveSelections() {
    const mergedVocab = [...record.selectedVocabulary, ...bonusVocab]
    const mergedColloc = [...record.selectedCollocations, ...bonusColloc]
    setIsSavingSelections(true)
    try {
      onUpdateSelections(mergedVocab, mergedColloc)
      setBonusVocab([])
      setBonusColloc([])
      setSelectionsSaved(true)
    } finally {
      setIsSavingSelections(false)
    }
  }

  const highlightSets: PhraseSet[] = [
    { phrases: record.selectedVocabulary,   className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { phrases: record.selectedCollocations, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { phrases: bonusVocab,                  className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { phrases: bonusColloc,                 className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">{record.topic}</p>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 font-medium">
              {SKILL_LABELS[record.skill] ?? record.skill}
            </span>
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs text-muted-foreground">
              {record.domain}
            </span>
            <span className="rounded-full bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
              Band {record.targetBand}
            </span>
            <span className="text-xs text-faint self-center">
              {new Date(record.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleFavorite}
            title={record.isFavorite ? 'Unfavourite' : 'Favourite'}
            className={`text-lg transition-colors ${record.isFavorite ? 'text-amber-400' : 'text-border hover:text-amber-300'}`}
          >
            ★
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="rounded px-2 py-0.5 text-xs bg-red-500 text-white hover:bg-red-600">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs bg-subtle text-muted-foreground hover:bg-border">No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs transition-colors"
              title="Delete"
            >✕</button>
          )}
        </div>
      </div>

      {/* Words used */}
      {(record.selectedVocabulary.length > 0 || record.selectedCollocations.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {record.selectedVocabulary.map((w) => (
            <span key={w} className="rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 text-xs text-purple-700 dark:text-purple-300">{w}</span>
          ))}
          {record.selectedCollocations.map((c) => (
            <span key={c} className="rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">{c}</span>
          ))}
        </div>
      )}

      {/* Expand text */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-xs font-medium text-blue-500 hover:text-blue-700"
      >
        {expanded ? 'Hide essay ▲' : 'Show essay ▼'}
      </button>

      {expanded && (
        <div className="rounded-lg bg-muted p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDetect}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              {detected ? '↻ Re-detect vocab & collocations' : 'Detect vocab & collocations'}
            </button>
            {detected && (bonusVocab.length > 0 || bonusColloc.length > 0) && (
              <>
                <span className="text-xs text-faint">
                  {bonusVocab.length + bonusColloc.length} extra match{bonusVocab.length + bonusColloc.length !== 1 ? 'es' : ''} found
                </span>
                <button
                  onClick={handleSaveSelections}
                  disabled={isSavingSelections}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSavingSelections ? 'Saving…' : 'Save to this essay'}
                </button>
              </>
            )}
            {detected && bonusVocab.length === 0 && bonusColloc.length === 0 && (
              <span className="text-xs text-faint">
                {selectionsSaved ? 'Selections saved ✓' : 'No additional matches'}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {highlight(record.decoratedText, highlightSets)}
          </p>

          {detected && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-2">
              <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-semibold">word</span> selected vocab</span>
              <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">phrase</span> selected collocation</span>
              {bonusVocab.length > 0 && <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold">word</span> bonus vocab</span>}
              {bonusColloc.length > 0 && <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-semibold">phrase</span> bonus collocation</span>}
            </div>
          )}

          {record.decoratedText !== record.originalGeneratedText && (
            <details>
              <summary className="text-xs text-faint cursor-pointer hover:text-muted-foreground">Original (unedited)</summary>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground italic whitespace-pre-wrap">
                {record.originalGeneratedText}
              </p>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
