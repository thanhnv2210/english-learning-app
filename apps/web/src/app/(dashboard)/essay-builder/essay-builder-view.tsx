'use client'

import { useState, useMemo, useTransition, useEffect, useCallback, useRef } from 'react'
import { saveEssayAction, getVersionsAction, updateDecoratedTextAction, updateEssaySelectionsAction, toggleEssayFavoriteAction, deleteEssayAction, getEssayBuilderConfigAction, saveEssayBuilderConfigAction } from '@/app/actions/essay-builder'
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

  // ── Persist selections to DB (debounced, suppressed during config load) ──
  const isLoadingConfigRef = useRef(false)

  useEffect(() => {
    if (!domain || isLoadingConfigRef.current) return
    const timer = setTimeout(() => {
      saveEssayBuilderConfigAction(domain, skill, Array.from(selectedVocab), Array.from(selectedColloc))
    }, 800)
    return () => clearTimeout(timer)
  }, [domain, skill, selectedVocab, selectedColloc])

  async function loadConfig(d: string, s: string) {
    isLoadingConfigRef.current = true
    try {
      const config = await getEssayBuilderConfigAction(d, s)
      setSelectedVocab(new Set(config?.selectedVocabulary ?? []))
      setSelectedColloc(new Set(config?.selectedCollocations ?? []))
    } finally {
      // Clear flag after React has processed the state updates
      setTimeout(() => { isLoadingConfigRef.current = false }, 0)
    }
  }

  async function handleDomainChange(newDomain: string) {
    setDomain(newDomain)
    if (newDomain) {
      await loadConfig(newDomain, skill)
      loadVersions(newDomain, skill)
    } else {
      setSelectedVocab(new Set())
      setSelectedColloc(new Set())
      setVersions([])
      setActiveVersion(null)
    }
  }

  async function handleSkillChange(newSkill: Skill) {
    setSkill(newSkill)
    if (domain) {
      await loadConfig(domain, newSkill)
      loadVersions(domain, newSkill)
    }
  }

  // ── Versions (last 5 per domain+skill) ───────────────────────────────────
  const [versions, setVersions] = useState<EssayBuilderRecord[]>([])
  const [activeVersion, setActiveVersion] = useState<EssayBuilderRecord | null>(null)
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)
  const [, startDeleteTransition] = useTransition()

  const selectVersion = useCallback((record: EssayBuilderRecord) => {
    setActiveVersion(record)
    setDecoratedText(record.decoratedText)
    setSelectedVocab(new Set(record.selectedVocabulary))
    setSelectedColloc(new Set(record.selectedCollocations))
    setActiveTab('view')
    // Compute bonus coverage for the selected version
    const lower = record.decoratedText.toLowerCase()
    setBonusVocab(
      words.filter((w) => !record.selectedVocabulary.includes(w.word) && lower.includes(w.word.toLowerCase())).map((w) => w.word),
    )
    setBonusColloc(
      collocations.filter((c) => !record.selectedCollocations.includes(c.phrase) && lower.includes(c.phrase.toLowerCase())).map((c) => c.phrase),
    )
  }, [words, collocations])

  async function loadVersions(d: string, s: string) {
    setIsLoadingVersions(true)
    try {
      const vs = await getVersionsAction(d, s)
      setVersions(vs)
      if (vs.length > 0) selectVersion(vs[0])
      else { setActiveVersion(null); setDecoratedText('') }
    } finally {
      setIsLoadingVersions(false)
    }
  }

  function handleDeleteVersion(id: number) {
    const next = versions.filter((v) => v.id !== id)
    setVersions(next)
    if (activeVersion?.id === id) {
      if (next.length > 0) selectVersion(next[0])
      else { setActiveVersion(null); setDecoratedText('') }
    }
    startDeleteTransition(() => deleteEssayAction(id))
  }

  // ── Result state ─────────────────────────────────────────────────────────
  const [decoratedText, setDecoratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view')
  const [isSavingText, startSaveTextTransition] = useTransition()

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

  // ── Evaluate (writing skills only) ───────────────────────────────────────
  type EvalState = 'idle' | 'auditing' | 'scoring' | 'done' | 'error'
  const [evalState, setEvalState] = useState<EvalState>('idle')
  const [evalAudit, setEvalAudit] = useState<{ wordCount: number; notes: string[] } | null>(null)
  const [evalScoreStream, setEvalScoreStream] = useState('')
  const [evalFeedback, setEvalFeedback] = useState<import('@/lib/db/schema').FeedbackResult | null>(null)

  async function handleEvaluate() {
    if (!activeVersion || !decoratedText) return
    setEvalState('auditing')
    setEvalAudit(null)
    setEvalScoreStream('')
    setEvalFeedback(null)

    try {
      // Pass 1: audit
      const auditRes = await fetch('/api/writing/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay: decoratedText, topic: activeVersion.topic }),
      })
      if (auditRes.ok) {
        const a = await auditRes.json()
        setEvalAudit({ wordCount: a.wordCount ?? 0, notes: a.notes ?? [] })
      }

      // Pass 2: score (streaming)
      setEvalState('scoring')
      const scoreRes = await fetch('/api/writing/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay: decoratedText, topic: activeVersion.topic, targetBand }),
      })
      if (!scoreRes.ok || !scoreRes.body) throw new Error('score failed')

      const reader = scoreRes.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setEvalScoreStream(full)
      }
      const jsonMatch = full.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          setEvalFeedback(JSON.parse(jsonMatch[0]))
        } catch {}
      }
      setEvalState('done')
    } catch {
      setEvalState('error')
    }
  }

  // Reset eval when active version changes
  useEffect(() => {
    setEvalState('idle')
    setEvalAudit(null)
    setEvalScoreStream('')
    setEvalFeedback(null)
  }, [activeVersion?.id])

  // ── History state ────────────────────────────────────────────────────────
  const [history, setHistory] = useState(initialHistory)
  const [historyTab, setHistoryTab] = useState<'builder' | 'history' | 'analyse'>('builder')
  const [historySkillFilter, setHistorySkillFilter] = useState<string>('all')
  const [historyTopicSearch, setHistoryTopicSearch] = useState('')

  const filteredHistory = useMemo(() => {
    const q = historyTopicSearch.toLowerCase()
    return history.filter((r) => {
      if (historySkillFilter !== 'all' && r.skill !== historySkillFilter) return false
      if (q && !r.topic.toLowerCase().includes(q) && !r.domain.toLowerCase().includes(q)) return false
      return true
    })
  }, [history, historySkillFilter, historyTopicSearch])

  // ── Analyse tab state ────────────────────────────────────────────────────
  const [analyseText, setAnalyseText] = useState('')
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [analyseError, setAnalyseError] = useState('')
  const [analyseResult, setAnalyseResult] = useState<{ domain: string; skill: string; question: string } | null>(null)
  const [analyseHighlightSets, setAnalyseHighlightSets] = useState<PhraseSet[]>([])

  async function handleAnalyse() {
    if (!analyseText.trim()) return
    setIsAnalysing(true)
    setAnalyseError('')
    setAnalyseResult(null)
    setAnalyseHighlightSets([])
    setAnalyseSaved(false)
    try {
      const res = await fetch('/api/essay-builder/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analyseText }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data: { domain: string; skill: string; question: string } = await res.json()
      setAnalyseResult(data)
      // Compute highlight sets from library
      const lower = analyseText.toLowerCase()
      const matchedVocab = words.filter((w) => lower.includes(w.word.toLowerCase())).map((w) => w.word)
      const matchedColloc = collocations.filter((c) => lower.includes(c.phrase.toLowerCase())).map((c) => c.phrase)
      setAnalyseHighlightSets([
        { phrases: matchedVocab,   className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
        { phrases: matchedColloc,  className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      ])
    } catch {
      setAnalyseError('Analysis failed. Check that Ollama is running.')
    } finally {
      setIsAnalysing(false)
    }
  }

  function handleLoadIntoBuilder() {
    if (!analyseResult) return
    const matchedVocab = analyseHighlightSets[0]?.phrases ?? []
    const matchedColloc = analyseHighlightSets[1]?.phrases ?? []
    setDomain(analyseResult.domain)
    setSkill(analyseResult.skill as Skill)
    setSelectedVocab(new Set(matchedVocab))
    setSelectedColloc(new Set(matchedColloc))
    loadVersions(analyseResult.domain, analyseResult.skill)
    setHistoryTab('builder')
  }

  const [isSavingAnalyse, setIsSavingAnalyse] = useState(false)
  const [analyseSaved, setAnalyseSaved] = useState(false)

  async function handleSaveAnalyseResult() {
    if (!analyseResult) return
    setIsSavingAnalyse(true)
    try {
      const matchedVocab = analyseHighlightSets[0]?.phrases ?? []
      const matchedColloc = analyseHighlightSets[1]?.phrases ?? []
      const record = await saveEssayAction({
        skill: analyseResult.skill,
        domain: analyseResult.domain,
        topic: analyseResult.question,
        selectedVocabulary: matchedVocab,
        selectedCollocations: matchedColloc,
        originalGeneratedText: analyseText,
        decoratedText: analyseText,
        targetBand,
        isFavorite: false,
      })
      setHistory((prev) => [record, ...prev])
      setAnalyseSaved(true)
    } finally {
      setIsSavingAnalyse(false)
    }
  }
  const [, startHistoryTransition] = useTransition()

  function handleHistoryToggleFavorite(record: EssayBuilderRecord) {
    const next = !record.isFavorite
    setHistory((prev) => prev.map((r) => (r.id === record.id ? { ...r, isFavorite: next } : r)))
    startHistoryTransition(() => toggleEssayFavoriteAction(record.id, next))
  }

  function handleHistoryDelete(id: number) {
    setHistory((prev) => prev.filter((r) => r.id !== id))
    setVersions((prev) => prev.filter((v) => v.id !== id))
    if (activeVersion?.id === id) setActiveVersion(null)
    startHistoryTransition(() => deleteEssayAction(id))
  }

  function handleHistoryUpdateSelections(id: number, vocab: string[], colloc: string[]) {
    setHistory((prev) =>
      prev.map((r) => r.id === id ? { ...r, selectedVocabulary: vocab, selectedCollocations: colloc } : r),
    )
    setVersions((prev) =>
      prev.map((v) => v.id === id ? { ...v, selectedVocabulary: vocab, selectedCollocations: colloc } : v),
    )
    if (activeVersion?.id === id)
      setActiveVersion((prev) => prev ? { ...prev, selectedVocabulary: vocab, selectedCollocations: colloc } : null)
    startHistoryTransition(() => updateEssaySelectionsAction(id, vocab, colloc))
  }

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

  // ── Generate (auto-saves as new version) ─────────────────────────────────
  async function handleGenerate() {
    if (!domain) return
    setIsGenerating(true)
    setGenerateError('')
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

      // Auto-save as a new version
      const record = await saveEssayAction({
        skill,
        domain,
        topic: data.topic,
        selectedVocabulary: Array.from(selectedVocab),
        selectedCollocations: Array.from(selectedColloc),
        originalGeneratedText: data.text,
        decoratedText: data.text,
        targetBand,
        isFavorite: false,
      })

      setVersions((prev) => [record, ...prev].slice(0, 5))
      setActiveVersion(record)
      setDecoratedText(data.text)
      setActiveTab('view')
      setHistory((prev) => [record, ...prev])
      computeBonus(data.text, selectedVocab, selectedColloc)
    } catch {
      setGenerateError('Failed to generate. Check that Ollama is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Save decorated text changes to active version ─────────────────────────
  function handleSaveText() {
    if (!activeVersion) return
    startSaveTextTransition(async () => {
      await updateDecoratedTextAction(activeVersion.id, decoratedText)
      setActiveVersion((prev) => prev ? { ...prev, decoratedText } : null)
      setVersions((prev) => prev.map((v) => v.id === activeVersion.id ? { ...v, decoratedText } : v))
      setHistory((prev) => prev.map((v) => v.id === activeVersion.id ? { ...v, decoratedText } : v))
    })
  }

  // ── Highlight phrase sets (priority order: selected first) ───────────────
  const highlightSets: PhraseSet[] = [
    { phrases: Array.from(selectedVocab),  className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { phrases: Array.from(selectedColloc), className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { phrases: bonusVocab,                 className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { phrases: bonusColloc,                className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-subtle p-1 w-fit border border-border">
        {(['builder', 'history', 'analyse'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setHistoryTab(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
              historyTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'history' ? `History (${history.length})` : tab === 'analyse' ? 'Analyse' : 'Builder'}
          </button>
        ))}
      </div>

      {historyTab === 'analyse' && (
        /* ── Analyse tab ──────────────────────────────────────────────────── */
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-foreground">Paste your text</p>
            <textarea
              value={analyseText}
              onChange={(e) => setAnalyseText(e.target.value)}
              rows={10}
              placeholder="Paste an IELTS essay, task response, or speaking transcript here…"
              className="w-full resize-none rounded-lg border border-border bg-input p-3 text-sm text-foreground outline-none focus:border-blue-400 leading-relaxed"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyse}
                disabled={!analyseText.trim() || isAnalysing}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                {isAnalysing ? 'Analysing…' : 'Analyse'}
              </button>
              {analyseError && <p className="text-xs text-red-500">{analyseError}</p>}
            </div>
          </div>

          {analyseResult && (
            <>
              {/* Detected metadata */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Analysis Result</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-card border border-green-200 px-3 py-1 text-xs font-medium text-green-800">
                    {analyseResult.domain}
                  </span>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
                    {SKILL_LABELS[analyseResult.skill] ?? analyseResult.skill}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">Suggested question</p>
                  <p className="text-sm text-foreground leading-relaxed">{analyseResult.question}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleLoadIntoBuilder}
                    className="rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    Load into Builder →
                  </button>
                  <button
                    onClick={handleSaveAnalyseResult}
                    disabled={isSavingAnalyse || analyseSaved}
                    className="rounded-lg border border-green-300 px-5 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                  >
                    {isSavingAnalyse ? 'Saving…' : analyseSaved ? 'Saved ✓' : 'Save to History'}
                  </button>
                </div>
              </div>

              {/* Highlighted text */}
              {analyseHighlightSets.some((s) => s.phrases.length > 0) && (
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-foreground">Library matches in your text</p>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {highlight(analyseText, analyseHighlightSets)}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-semibold">word</span> vocab match</span>
                    <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">phrase</span> collocation match</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {historyTab === 'builder' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── Left: Selection panel ────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Domain */}
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground">Domain</p>
              <select
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Select a domain…</option>
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Skill */}
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground">Skill</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(SKILL_LABELS) as Skill[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSkillChange(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      skill === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-subtle text-muted-foreground hover:bg-border'
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
              selectedChips={Array.from(selectedVocab).map((w) => ({
                label: w,
                onRemove: () => setSelectedVocab((prev) => { const next = new Set(prev); next.delete(w); return next }),
              }))}
              onClearAll={() => setSelectedVocab(new Set())}
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
              selectedChips={Array.from(selectedColloc).map((c) => ({
                label: c,
                onRemove: () => setSelectedColloc((prev) => { const next = new Set(prev); next.delete(c); return next }),
              }))}
              onClearAll={() => setSelectedColloc(new Set())}
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

          {/* ── Right: Versions + Result panel ───────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Versions strip */}
            {domain && (
              <div className="rounded-xl border border-border bg-card p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Versions {versions.length > 0 ? `(${versions.length}/5)` : ''}
                  </p>
                  {isLoadingVersions && <span className="text-xs text-faint">Loading…</span>}
                </div>
                {versions.length === 0 && !isLoadingVersions ? (
                  <p className="text-xs text-faint">No versions yet — click Generate.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {versions.map((v, i) => (
                      <VersionRow
                        key={v.id}
                        version={v}
                        index={versions.length - i}
                        isActive={activeVersion?.id === v.id}
                        onSelect={() => selectVersion(v)}
                        onDelete={() => handleDeleteVersion(v.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Result */}
            {activeVersion ? (
              <>
                {/* Topic */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-faint mb-1">Topic</p>
                  <p className="text-sm text-foreground leading-relaxed">{activeVersion.topic}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 font-medium">
                      {SKILL_LABELS[activeVersion.skill] ?? activeVersion.skill}
                    </span>
                    <span className="rounded-full bg-subtle px-2 py-0.5 text-xs text-muted-foreground">
                      {activeVersion.domain}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      Band {activeVersion.targetBand}
                    </span>
                  </div>
                </div>

                {/* Selected items summary */}
                {(selectedVocab.size > 0 || selectedColloc.size > 0) && (
                  <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                    {selectedVocab.size > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-faint mr-1 self-center">Vocab</span>
                        {Array.from(selectedVocab).map((w) => (
                          <span key={w} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{w}</span>
                        ))}
                      </div>
                    )}
                    {selectedColloc.size > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-faint mr-1 self-center">Colloc</span>
                        {Array.from(selectedColloc).map((c) => (
                          <span key={c} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* View / Edit tabs */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex border-b border-border">
                    {(['view', 'edit'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-medium transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {activeTab === 'view' ? (
                      <div className="flex flex-col gap-4">
                        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                          {highlight(decoratedText, highlightSets)}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-semibold">word</span> selected vocab</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">phrase</span> selected collocation</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold">word</span> bonus vocab</span>
                          <span className="flex items-center gap-1"><span className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-semibold">phrase</span> bonus collocation</span>
                        </div>
                        {(bonusVocab.length > 0 || bonusColloc.length > 0) && (
                          <div className="rounded-lg border border-dashed border-border p-3 flex flex-col gap-2">
                            <p className="text-xs font-semibold text-muted-foreground">Also covered — click to add to selection:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {bonusVocab.map((w) => (
                                <button key={w} onClick={() => addBonusVocab(w)} className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700 hover:bg-green-100 transition-colors">+ {w}</button>
                              ))}
                              {bonusColloc.map((c) => (
                                <button key={c} onClick={() => addBonusColloc(c)} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700 hover:bg-amber-100 transition-colors">+ {c}</button>
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
                        className="w-full resize-none rounded-lg border border-border bg-input p-3 text-sm text-foreground outline-none focus:border-blue-400 leading-relaxed"
                      />
                    )}
                  </div>
                </div>

                {/* Save text edits */}
                {activeTab === 'edit' && decoratedText !== activeVersion.decoratedText && (
                  <button
                    onClick={handleSaveText}
                    disabled={isSavingText}
                    className="self-end rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isSavingText ? 'Saving…' : 'Save changes'}
                  </button>
                )}

                {/* ── Evaluate (writing skills only) ────────────────────── */}
                {(activeVersion.skill === 'writing_task1' || activeVersion.skill === 'writing_task2') && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleEvaluate}
                        disabled={evalState === 'auditing' || evalState === 'scoring'}
                        className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-40 transition-colors"
                      >
                        {evalState === 'auditing' ? 'Auditing…'
                          : evalState === 'scoring' ? 'Scoring…'
                          : evalState === 'done' ? '↻ Re-evaluate'
                          : 'Evaluate essay'}
                      </button>
                      {evalAudit && (
                        <span className="text-xs text-muted-foreground">
                          {evalAudit.wordCount} words
                          {evalAudit.notes.length > 0 && ` · ${evalAudit.notes[0]}`}
                        </span>
                      )}
                      {evalState === 'error' && (
                        <span className="text-xs text-red-500">Evaluation failed — check Ollama</span>
                      )}
                    </div>

                    {/* Streaming score raw text while scoring */}
                    {evalState === 'scoring' && evalScoreStream && !evalFeedback && (
                      <div className="rounded-lg bg-muted border border-border p-3">
                        <p className="text-xs text-faint font-mono whitespace-pre-wrap leading-relaxed line-clamp-6">
                          {evalScoreStream}
                        </p>
                      </div>
                    )}

                    {/* Parsed feedback */}
                    {evalFeedback && (
                      <div className="flex flex-col gap-3">
                        {/* Overall band */}
                        <div className={`rounded-xl p-4 ${evalFeedback.overallBand >= evalFeedback.targetBand ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall Band</p>
                          <div className="mt-1 flex items-end gap-2">
                            <span className="text-3xl font-bold text-foreground">{evalFeedback.overallBand}</span>
                            <span className="mb-0.5 text-sm text-muted-foreground">
                              / target <strong>{evalFeedback.targetBand}</strong>
                              {evalFeedback.overallBand < evalFeedback.targetBand && (
                                <span className="ml-2 text-amber-600 font-medium">
                                  ({(evalFeedback.targetBand - evalFeedback.overallBand).toFixed(1)} to go)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Criteria */}
                        {evalFeedback.criteria.map((c) => {
                          const gap = c.targetScore - c.score
                          const badge = gap <= 0 ? 'bg-green-100 text-green-700' : gap <= 0.5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          return (
                            <div key={c.criterion} className="rounded-xl border border-border bg-card p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-foreground">{c.criterion}</p>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge}`}>
                                  {c.score} / {c.targetScore}
                                </span>
                              </div>
                              {c.keyPoints.length > 0 && (
                                <ul className="mt-3 flex flex-col gap-1.5">
                                  {c.keyPoints.map((pt, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                      <span className="mt-0.5 shrink-0 text-amber-400">▸</span>
                                      {pt}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-card">
                <p className="text-sm text-faint text-center px-8">
                  {domain ? 'Click Generate to create the first version.' : 'Select a domain to get started.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {historyTab === 'history' && (
        /* ── History tab ─────────────────────────────────────────────────── */
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
            <input
              type="text"
              value={historyTopicSearch}
              onChange={(e) => setHistoryTopicSearch(e.target.value)}
              placeholder="Search by topic or domain…"
              className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'writing_task1', 'writing_task2', 'speaking'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setHistorySkillFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    historySkillFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-subtle text-muted-foreground hover:bg-border'
                  }`}
                >
                  {s === 'all' ? `All (${history.length})` : SKILL_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm text-faint">
                {history.length === 0 ? 'No essays yet. Generate one in the Builder tab.' : 'No essays match the current filters.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                words={words}
                collocations={collocations}
                onToggleFavorite={() => handleHistoryToggleFavorite(record)}
                onDelete={() => handleHistoryDelete(record.id)}
                onUpdateSelections={(vocab, colloc) => handleHistoryUpdateSelections(record.id, vocab, colloc)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── VersionRow ────────────────────────────────────────────────────────────────

function VersionRow({
  version,
  index,
  isActive,
  onSelect,
  onDelete,
}: {
  version: EssayBuilderRecord
  index: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-muted border border-transparent'
      }`}
      onClick={onSelect}
    >
      <span className={`text-xs font-semibold shrink-0 w-5 text-center ${isActive ? 'text-blue-600' : 'text-faint'}`}>
        v{index}
      </span>
      <span className="text-xs text-foreground truncate flex-1">{version.topic}</span>
      <span className="text-xs text-faint shrink-0">{new Date(version.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      {confirmDelete ? (
        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={onDelete} className="rounded px-1.5 py-0.5 text-xs bg-red-500 text-white hover:bg-red-600">Yes</button>
          <button onClick={() => setConfirmDelete(false)} className="rounded px-1.5 py-0.5 text-xs bg-subtle text-muted-foreground hover:bg-border">No</button>
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
          className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-faint hover:bg-red-100 hover:text-red-500 text-xs transition-colors"
        >✕</button>
      )}
    </div>
  )
}

// ── SelectionPanel ────────────────────────────────────────────────────────────

type SelectionChip = { label: string; onRemove: () => void }

function SelectionPanel({
  title,
  selectedChips,
  onClearAll,
  search,
  onSearch,
  placeholder,
  children,
}: {
  title: string
  selectedChips: SelectionChip[]
  onClearAll: () => void
  search: string
  onSearch: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between min-h-5">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        {selectedChips.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-faint hover:text-red-500 transition-colors"
          >
            Clear all ({selectedChips.length})
          </button>
        )}
      </div>

      {/* Selected chips */}
      {selectedChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-muted p-2 border border-border">
          {selectedChips.map(({ label, onRemove }) => (
            <span
              key={label}
              className="flex items-center gap-1 rounded-full bg-card border border-blue-200 px-2 py-0.5 text-xs text-blue-700 shadow-sm"
            >
              {label}
              <button
                onClick={onRemove}
                className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-400 hover:bg-blue-100 hover:text-blue-700 transition-colors leading-none"
                aria-label={`Remove ${label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={selectedChips.length > 0 ? `Search to add more…` : placeholder}
        className="rounded-lg border border-border bg-input text-foreground px-3 py-1.5 text-xs outline-none focus:border-blue-400"
      />

      {/* List */}
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
      selected ? 'bg-blue-50' : 'hover:bg-muted'
    }`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="h-3.5 w-3.5 rounded border-border accent-blue-600"
      />
      <span className={`text-xs font-medium ${selected ? 'text-blue-700' : 'text-foreground'}`}>
        {label}
      </span>
      <span className="ml-auto text-xs text-faint shrink-0">{sublabel}</span>
    </label>
  )
}

// ── HistoryCard ───────────────────────────────────────────────────────────────

function HistoryCard({
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
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 font-medium">
              {SKILL_LABELS[record.skill] ?? record.skill}
            </span>
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs text-muted-foreground">
              {record.domain}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
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
        <div className="rounded-lg bg-muted p-4 flex flex-col gap-3">
          {/* Detect button + save */}
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

          {/* Legend */}
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
