'use client'

import { useState, useMemo, useTransition, useEffect } from 'react'
import { saveEssayAction, updateDecoratedTextAction, toggleEssayFavoriteAction, deleteEssayAction } from '@/app/actions/essay-builder'
import type { VocabularyCard } from '@/lib/db/vocabulary'
import type { CollocationCard } from '@/lib/db/collocations'
import type { EssayBuilderRecord } from '@/lib/db/essay-builder'

// ── Types ─────────────────────────────────────────────────────────────────────

type Skill = 'writing_task1' | 'writing_task2' | 'speaking'

const SKILL_LABELS: Record<string, string> = {
  writing_task1: 'Writing Task 1',
  writing_task2: 'Writing Task 2',
  speaking: 'Speaking',
}

// ── Highlight helper ──────────────────────────────────────────────────────────

type PhraseSet = { phrases: string[]; className: string }

function highlight(text: string, phraseSets: PhraseSet[]) {
  const all = phraseSets
    .flatMap(({ phrases, className }) => phrases.map((p) => ({ phrase: p, className })))
    .sort((a, b) => b.phrase.length - a.phrase.length) // longest first

  if (all.length === 0) return <>{text}</>

  // First match wins (selected takes priority over bonus via order)
  const phraseMap = new Map<string, string>()
  for (const { phrase, className } of all) {
    const key = phrase.toLowerCase()
    if (!phraseMap.has(key)) phraseMap.set(key, className)
  }

  const escaped = all.map(({ phrase }) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) => {
        const cls = phraseMap.get(part.toLowerCase())
        return cls ? (
          <mark key={i} className={`rounded px-0.5 font-semibold not-italic ${cls}`}>{part}</mark>
        ) : (
          part
        )
      })}
    </>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  words: VocabularyCard[]
  collocations: CollocationCard[]
  domains: string[]
  history: EssayBuilderRecord[]
  targetBand: number
}

// ── Main component ────────────────────────────────────────────────────────────

export function EssayBuilderView({ words, collocations, domains, history: initialHistory, targetBand }: Props) {
  // ── Selection state ──────────────────────────────────────────────────────
  const [domain, setDomain] = useState('')
  const [skill, setSkill] = useState<Skill>('writing_task2')
  const [selectedVocab, setSelectedVocab] = useState<Set<string>>(new Set())
  const [selectedColloc, setSelectedColloc] = useState<Set<string>>(new Set())
  const [vocabSearch, setVocabSearch] = useState('')
  const [collocSearch, setCollocSearch] = useState('')

  // ── Persist selections to localStorage keyed by domain:skill ─────────────
  useEffect(() => {
    if (!domain) return
    localStorage.setItem(
      `essay-builder:${domain}:${skill}`,
      JSON.stringify({ vocab: Array.from(selectedVocab), colloc: Array.from(selectedColloc) }),
    )
  }, [domain, skill, selectedVocab, selectedColloc])

  function loadSaved(d: string, s: string) {
    try {
      const saved = localStorage.getItem(`essay-builder:${d}:${s}`)
      if (saved) {
        const { vocab, colloc } = JSON.parse(saved) as { vocab: string[]; colloc: string[] }
        setSelectedVocab(new Set(vocab))
        setSelectedColloc(new Set(colloc))
        return
      }
    } catch {}
    setSelectedVocab(new Set())
    setSelectedColloc(new Set())
  }

  function handleDomainChange(newDomain: string) {
    setDomain(newDomain)
    if (newDomain) loadSaved(newDomain, skill)
    else { setSelectedVocab(new Set()); setSelectedColloc(new Set()) }
  }

  function handleSkillChange(newSkill: Skill) {
    setSkill(newSkill)
    if (domain) loadSaved(domain, newSkill)
  }

  // ── Result state ─────────────────────────────────────────────────────────
  const [result, setResult] = useState<{ topic: string; text: string } | null>(null)
  const [decoratedText, setDecoratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view')
  const [savedRecord, setSavedRecord] = useState<EssayBuilderRecord | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

  // ── Bonus coverage (library matches not in selection) ────────────────────
  const [bonusVocab, setBonusVocab] = useState<string[]>([])
  const [bonusColloc, setBonusColloc] = useState<string[]>([])

  function computeBonus(text: string, currentVocab: Set<string>, currentColloc: Set<string>) {
    const lower = text.toLowerCase()
    setBonusVocab(
      words
        .filter((w) => !currentVocab.has(w.word) && lower.includes(w.word.toLowerCase()))
        .map((w) => w.word),
    )
    setBonusColloc(
      collocations
        .filter((c) => !currentColloc.has(c.phrase) && lower.includes(c.phrase.toLowerCase()))
        .map((c) => c.phrase),
    )
  }

  function addBonusVocab(word: string) {
    setSelectedVocab((prev) => new Set([...prev, word]))
    setBonusVocab((prev) => prev.filter((w) => w !== word))
  }

  function addBonusColloc(phrase: string) {
    setSelectedColloc((prev) => new Set([...prev, phrase]))
    setBonusColloc((prev) => prev.filter((p) => p !== phrase))
  }

  // ── History state ────────────────────────────────────────────────────────
  const [history, setHistory] = useState(initialHistory)
  const [historyTab, setHistoryTab] = useState<'builder' | 'history'>('builder')
  const [, startHistoryTransition] = useTransition()

  // ── Filtered lists ───────────────────────────────────────────────────────
  const filteredWords = useMemo(() => {
    const q = vocabSearch.toLowerCase()
    return words.filter(
      (w) => !q || w.word.toLowerCase().includes(q) || w.domains.some((d) => d.toLowerCase().includes(q)),
    )
  }, [words, vocabSearch])

  const filteredCollocations = useMemo(() => {
    const q = collocSearch.toLowerCase()
    return collocations.filter(
      (c) => !q || c.phrase.toLowerCase().includes(q) || c.type.toLowerCase().includes(q),
    )
  }, [collocations, collocSearch])

  // ── Generate ─────────────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!domain) return
    setIsGenerating(true)
    setGenerateError('')
    setResult(null)
    setSavedRecord(null)
    setBonusVocab([])
    setBonusColloc([])

    try {
      const res = await fetch('/api/essay-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill,
          domain,
          vocabulary: Array.from(selectedVocab),
          collocations: Array.from(selectedColloc),
          targetBand,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')
      const data: { topic: string; text: string } = await res.json()
      setResult(data)
      setDecoratedText(data.text)
      setActiveTab('view')
      computeBonus(data.text, selectedVocab, selectedColloc)
    } catch {
      setGenerateError('Failed to generate. Check that Ollama is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!result) return
    startSaveTransition(async () => {
      const record = await saveEssayAction({
        skill,
        domain,
        topic: result.topic,
        selectedVocabulary: Array.from(selectedVocab),
        selectedCollocations: Array.from(selectedColloc),
        originalGeneratedText: result.text,
        decoratedText,
        targetBand,
        isFavorite: false,
      })
      setSavedRecord(record)
      setHistory((prev) => [record, ...prev])
    })
  }

  // ── History actions ───────────────────────────────────────────────────────
  function handleToggleFavorite(record: EssayBuilderRecord) {
    const next = !record.isFavorite
    setHistory((prev) => prev.map((r) => (r.id === record.id ? { ...r, isFavorite: next } : r)))
    startHistoryTransition(() => toggleEssayFavoriteAction(record.id, next))
  }

  function handleDelete(id: number) {
    setHistory((prev) => prev.filter((r) => r.id !== id))
    startHistoryTransition(() => deleteEssayAction(id))
  }

  // ── Highlight phrase sets (priority order: selected first) ───────────────
  const highlightSets: PhraseSet[] = [
    { phrases: Array.from(selectedVocab),  className: 'bg-purple-100 text-purple-800' },
    { phrases: Array.from(selectedColloc), className: 'bg-blue-100 text-blue-800' },
    { phrases: bonusVocab,                 className: 'bg-green-100 text-green-800' },
    { phrases: bonusColloc,                className: 'bg-amber-100 text-amber-800' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {(['builder', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setHistoryTab(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
              historyTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'history' ? `History (${history.length})` : 'Builder'}
          </button>
        ))}
      </div>

      {historyTab === 'builder' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── Left: Selection panel ────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Domain */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold text-gray-700">Domain</p>
              <select
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 bg-white"
              >
                <option value="">Select a domain…</option>
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Skill */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold text-gray-700">Skill</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(SKILL_LABELS) as Skill[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSkillChange(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      skill === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {SKILL_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Vocabulary selector */}
            <SelectionPanel
              title="Vocabulary"
              count={selectedVocab.size}
              search={vocabSearch}
              onSearch={setVocabSearch}
              placeholder="Search words…"
            >
              {filteredWords.map((w) => (
                <SelectionRow
                  key={w.word}
                  label={w.word}
                  sublabel={w.domains[0] ?? 'General'}
                  selected={selectedVocab.has(w.word)}
                  onToggle={() => {
                    setSelectedVocab((prev) => {
                      const next = new Set(prev)
                      next.has(w.word) ? next.delete(w.word) : next.add(w.word)
                      return next
                    })
                  }}
                />
              ))}
            </SelectionPanel>

            {/* Collocation selector */}
            <SelectionPanel
              title="Collocations"
              count={selectedColloc.size}
              search={collocSearch}
              onSearch={setCollocSearch}
              placeholder="Search collocations…"
            >
              {filteredCollocations.map((c) => (
                <SelectionRow
                  key={c.phrase}
                  label={c.phrase}
                  sublabel={c.type}
                  selected={selectedColloc.has(c.phrase)}
                  onToggle={() => {
                    setSelectedColloc((prev) => {
                      const next = new Set(prev)
                      next.has(c.phrase) ? next.delete(c.phrase) : next.add(c.phrase)
                      return next
                    })
                  }}
                />
              ))}
            </SelectionPanel>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!domain || isGenerating}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {isGenerating ? 'Generating…' : 'Generate'}
            </button>
            {generateError && <p className="text-xs text-red-500">{generateError}</p>}
          </div>

          {/* ── Right: Result panel ──────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                {/* Topic */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-1">Topic</p>
                  <p className="text-sm text-gray-800 leading-relaxed">{result.topic}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 font-medium">
                      {SKILL_LABELS[skill]}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {domain}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      Band {targetBand}
                    </span>
                  </div>
                </div>

                {/* Selected items summary */}
                {(selectedVocab.size > 0 || selectedColloc.size > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2">
                    {selectedVocab.size > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400 mr-1 self-center">Vocab</span>
                        {Array.from(selectedVocab).map((w) => (
                          <span key={w} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{w}</span>
                        ))}
                      </div>
                    )}
                    {selectedColloc.size > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400 mr-1 self-center">Colloc</span>
                        {Array.from(selectedColloc).map((c) => (
                          <span key={c} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* View / Edit tabs */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex border-b border-gray-100">
                    {(['view', 'edit'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-medium transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {activeTab === 'view' ? (
                      <div className="flex flex-col gap-4">
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {highlight(decoratedText, highlightSets)}
                        </p>

                        {/* Colour legend */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-purple-100 text-purple-800 font-semibold">word</span> selected vocab</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold">phrase</span> selected collocation</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-green-100 text-green-800 font-semibold">word</span> bonus vocab</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 font-semibold">phrase</span> bonus collocation</span>
                        </div>

                        {/* Also covered — clickable to add to selection */}
                        {(bonusVocab.length > 0 || bonusColloc.length > 0) && (
                          <div className="rounded-lg border border-dashed border-gray-200 p-3 flex flex-col gap-2">
                            <p className="text-xs font-semibold text-gray-500">Also covered — click to add to selection:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {bonusVocab.map((w) => (
                                <button
                                  key={w}
                                  onClick={() => addBonusVocab(w)}
                                  className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700 hover:bg-green-100 transition-colors"
                                >
                                  + {w}
                                </button>
                              ))}
                              {bonusColloc.map((c) => (
                                <button
                                  key={c}
                                  onClick={() => addBonusColloc(c)}
                                  className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700 hover:bg-amber-100 transition-colors"
                                >
                                  + {c}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={decoratedText}
                        onChange={(e) => setDecoratedText(e.target.value)}
                        rows={14}
                        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-blue-400 leading-relaxed"
                      />
                    )}
                  </div>
                </div>

                {/* Save */}
                {savedRecord ? (
                  <p className="text-xs text-green-600 font-medium text-center">Saved to history ✓</p>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="self-end rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? 'Saving…' : 'Save to History'}
                  </button>
                )}
              </>
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
                <p className="text-sm text-gray-400 text-center px-8">
                  Select a domain and at least one vocabulary word or collocation, then click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── History tab ─────────────────────────────────────────────────── */
        <div className="flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-sm text-gray-400">No saved essays yet. Generate one and hit Save.</p>
            </div>
          ) : (
            history.map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                onToggleFavorite={() => handleToggleFavorite(record)}
                onDelete={() => handleDelete(record.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── SelectionPanel ────────────────────────────────────────────────────────────

function SelectionPanel({
  title,
  count,
  search,
  onSearch,
  placeholder,
  children,
}: {
  title: string
  count: number
  search: string
  onSearch: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">{title}</p>
        {count > 0 && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            {count} selected
          </span>
        )}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-blue-400"
      />
      <div className="max-h-44 overflow-y-auto flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  )
}

// ── SelectionRow ──────────────────────────────────────────────────────────────

function SelectionRow({
  label,
  sublabel,
  selected,
  onToggle,
}: {
  label: string
  sublabel: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <label className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors ${
      selected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-600"
      />
      <span className={`text-xs font-medium ${selected ? 'text-blue-700' : 'text-gray-800'}`}>
        {label}
      </span>
      <span className="ml-auto text-xs text-gray-400 shrink-0">{sublabel}</span>
    </label>
  )
}

// ── HistoryCard ───────────────────────────────────────────────────────────────

function HistoryCard({
  record,
  onToggleFavorite,
  onDelete,
}: {
  record: EssayBuilderRecord
  onToggleFavorite: () => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">{record.topic}</p>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 font-medium">
              {SKILL_LABELS[record.skill] ?? record.skill}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {record.domain}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              Band {record.targetBand}
            </span>
            <span className="text-xs text-gray-400 self-center">
              {new Date(record.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleFavorite}
            title={record.isFavorite ? 'Unfavourite' : 'Favourite'}
            className={`text-lg transition-colors ${record.isFavorite ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}
          >
            ★
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="rounded px-2 py-0.5 text-xs bg-red-500 text-white hover:bg-red-600">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">No</button>
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
      {allPhrases.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {record.selectedVocabulary.map((w) => (
            <span key={w} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{w}</span>
          ))}
          {record.selectedCollocations.map((c) => (
            <span key={c} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{c}</span>
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
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {highlight(record.decoratedText, [
              { phrases: record.selectedVocabulary, className: 'bg-purple-100 text-purple-800' },
              { phrases: record.selectedCollocations, className: 'bg-blue-100 text-blue-800' },
            ])}
          </p>
          {record.decoratedText !== record.originalGeneratedText && (
            <details className="mt-3">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Original (unedited)</summary>
              <p className="mt-2 text-xs leading-relaxed text-gray-500 italic whitespace-pre-wrap">
                {record.originalGeneratedText}
              </p>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
