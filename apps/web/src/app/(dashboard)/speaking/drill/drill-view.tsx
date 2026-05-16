'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { AnalysisResult } from '@/lib/ielts/connected-speech/prompts'
import { saveDrillResultAction, getDrillHistoryAction } from '@/app/actions/drill'
import type { DrillText, DrillResult } from '@/lib/db/drill'
import {
  type EditOp,
  type Mistake,
  alignWords,
  computeMistakes,
  countMatchedWords,
  opsToPlainText,
  tokenize,
} from './utils'
import { MistakeCard } from './components/mistake-card'

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage = 'setup' | 'speaking' | 'results'

// ── Web Speech API (minimal types) ────────────────────────────────────────────

interface DrillSTTResultItem { transcript: string }
interface DrillSTTResult {
  readonly isFinal: boolean
  [index: number]: DrillSTTResultItem
}
interface DrillSTTEvent extends Event {
  readonly resultIndex: number
  readonly results: { length: number; [index: number]: DrillSTTResult }
}
interface IDrillSTT extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: DrillSTTEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}


const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

// ── Main component ─────────────────────────────────────────────────────────────

export function DrillView({
  initialText,
  drillTexts,
}: {
  initialText: string
  drillTexts: DrillText[]
}) {
  const [text, setText] = useState(initialText)
  const [stage, setStage] = useState<Stage>('setup')
  const [spokenText, setSpokenText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [csAnalysis, setCsAnalysis] = useState<AnalysisResult | null>(null)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [finalOps, setFinalOps] = useState<EditOp[]>([])
  const [supported, setSupported] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [activeDrillTextId, setActiveDrillTextId] = useState<number | undefined>()
  const [practiceOnly, setPracticeOnly] = useState(false)

  // Library panel
  const [libraryOpen, setLibraryOpen] = useState(!initialText)
  const [activeCategory, setActiveCategory] = useState('All')

  // History panel
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyRecords, setHistoryRecords] = useState<DrillResult[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null)
  const [resultCopied, setResultCopied] = useState(false)
  const [copiedHistoryId, setCopiedHistoryId] = useState<number | null>(null)

  const recognitionRef = useRef<IDrillSTT | null>(null)
  const spokenAccRef = useRef('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Word refs for auto-scroll
  const wordRefsRef = useRef<(HTMLSpanElement | null)[]>([])
  const textScrollRef = useRef<HTMLDivElement>(null)

  const origWords = tokenize(text)
  const liveSpokenWords = tokenize(spokenText + (interimText ? ' ' + interimText : ''))
  const matchedCount = countMatchedWords(origWords, liveSpokenWords)

  // Split words into display lines by character budget (~50 chars per line)
  const MAX_LINE_CHARS = 50
  const wordLines: { startIdx: number; words: string[] }[] = []
  let lineWords: string[] = []
  let lineStart = 0
  let lineChars = 0
  for (let i = 0; i < origWords.length; i++) {
    const w = origWords[i]
    const needed = lineChars === 0 ? w.length : lineChars + 1 + w.length
    if (needed > MAX_LINE_CHARS && lineWords.length > 0) {
      wordLines.push({ startIdx: lineStart, words: lineWords })
      lineWords = [w]
      lineStart = i
      lineChars = w.length
    } else {
      lineWords.push(w)
      lineChars = needed
    }
  }
  if (lineWords.length > 0) wordLines.push({ startIdx: lineStart, words: lineWords })

  const currentLineIdx = wordLines.reduce(
    (acc, line, idx) => (line.startIdx <= matchedCount ? idx : acc),
    0,
  )

  // Auto-resize textarea between 3 and 10 rows
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 224) + 'px'
  }, [text])

  // Auto-scroll current word into view during speaking
  useEffect(() => {
    if (stage !== 'speaking') return
    const el = wordRefsRef.current[matchedCount]
    if (el && textScrollRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [matchedCount, stage])

  // ── Library helpers ────────────────────────────────────────────────────────

  const categories = ['All', ...Array.from(new Set(drillTexts.map((t) => t.category)))]

  const filteredTexts =
    activeCategory === 'All'
      ? drillTexts
      : drillTexts.filter((t) => t.category === activeCategory)

  function selectDrillText(dt: DrillText) {
    setText(dt.text)
    setActiveDrillTextId(dt.id)
    setLibraryOpen(false)
    setSaveStatus('idle')
    setFinalOps([])
    setMistakes([])
  }

  // ── Speech handlers ────────────────────────────────────────────────────────

  const handleStart = useCallback(async () => {
    if (!text.trim()) return

    const SR =
      (window as Window & { SpeechRecognition?: new () => unknown }).SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition

    if (!SR) { setSupported(false); return }

    setStage('speaking')
    setSpokenText('')
    setInterimText('')
    setFinalOps([])
    setMistakes([])
    setCsAnalysis(null)
    setSaveStatus('idle')
    spokenAccRef.current = ''

    // Pre-fetch connected speech analysis (non-blocking, skipped in practice-only mode)
    if (!practiceOnly) {
      fetch('/api/connected-speech/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: AnalysisResult | null) => { if (data) setCsAnalysis(data) })
        .catch(() => null)
    }

    const recognition = new SR() as IDrillSTT
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: DrillSTTEvent) => {
      let interimChunk = ''
      let finalChunk = ''
      for (let k = event.resultIndex; k < event.results.length; k++) {
        const t = event.results[k][0].transcript
        if (event.results[k].isFinal) finalChunk += t
        else interimChunk += t
      }
      setInterimText(interimChunk)
      if (finalChunk.trim()) {
        spokenAccRef.current = (spokenAccRef.current + ' ' + finalChunk.trim()).trim()
        setSpokenText(spokenAccRef.current)
        setInterimText('')
      }
    }

    recognition.onerror = () => { /* ignore transient errors */ }
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try { recognition.start() } catch { /* ignore */ }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [text, practiceOnly])

  function handleStop() {
    const rec = recognitionRef.current
    recognitionRef.current = null
    if (rec) rec.stop()

    const allSpoken = (spokenAccRef.current + (interimText ? ' ' + interimText : '')).trim()
    setSpokenText(allSpoken)
    setInterimText('')

    const ops = alignWords(origWords, tokenize(allSpoken))
    const topMistakes = computeMistakes(ops, csAnalysis?.instances ?? [])
    setFinalOps(ops)
    setMistakes(topMistakes)
    setStage('results')

    // Auto-save silently (skip in practice-only mode or if nothing was spoken)
    if (!practiceOnly && allSpoken) {
      setSaveStatus('saving')
      const correctCount = ops.filter((o) => o.op === 'match').length
      saveDrillResultAction({
        drillTextId: activeDrillTextId,
        originalText: text.trim(),
        spokenText: allSpoken,
        accuracy: origWords.length > 0 ? Math.round((correctCount / origWords.length) * 100) : 0,
        correctCount,
        totalCount: origWords.length,
        mistakes: topMistakes.map((m) => ({
          type: m.type,
          original: m.original,
          spoken: m.spoken,
          context: m.context,
          csPhenomenon: m.csTip?.phenomenon,
          csTip: m.csTip?.tip,
        })),
        csAnalysis: csAnalysis ?? null,
      }).then(() => setSaveStatus('saved')).catch(() => setSaveStatus('idle'))
    }
  }

  function handleReset() {
    setStage('setup')
    setSpokenText('')
    setInterimText('')
    setFinalOps([])
    setMistakes([])
    setCsAnalysis(null)
    setSaveStatus('idle')
    spokenAccRef.current = ''
  }

  // ── History ────────────────────────────────────────────────────────────────

  async function openHistory() {
    setHistoryOpen(true)
    setHistoryLoading(true)
    const records = await getDrillHistoryAction()
    setHistoryRecords(records)
    setHistoryLoading(false)
  }

  function loadFromHistory(record: DrillResult) {
    setText(record.originalText)
    setActiveDrillTextId(record.drillTextId ?? undefined)
    setHistoryOpen(false)
    setStage('setup')
    setSaveStatus('idle')
    setFinalOps([])
    setMistakes([])
  }

  // ── Derived stats ──────────────────────────────────────────────────────────

  const correctCount = finalOps.filter((o) => o.op === 'match').length
  const accuracy = origWords.length > 0 ? Math.round((correctCount / origWords.length) * 100) : 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* ── Text library panel ── */}
      {stage === 'setup' && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setLibraryOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-subtle transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">
              Paragraph Library
              <span className="ml-2 text-xs font-normal text-faint">({drillTexts.length} texts)</span>
            </span>
            <span className="text-faint text-xs">{libraryOpen ? '▲' : '▼'}</span>
          </button>

          {libraryOpen && (
            <div className="border-t border-border">
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-border">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-subtle text-muted-foreground hover:bg-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Text list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {filteredTexts.map((dt) => (
                  <button
                    key={dt.id}
                    onClick={() => selectDrillText(dt)}
                    className={`w-full text-left px-5 py-3 hover:bg-subtle transition-colors ${
                      activeDrillTextId === dt.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{dt.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLORS[dt.difficulty as keyof typeof DIFFICULTY_COLORS] ?? ''}`}>
                        {dt.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{dt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Setup: textarea + controls ── */}
      {stage === 'setup' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-faint uppercase tracking-wide mb-2">
              Text to read aloud
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => { setText(e.target.value); setActiveDrillTextId(undefined) }}
              rows={3}
              placeholder="Pick a paragraph above, or paste your own text here…"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-faint focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-y-auto"
              style={{ minHeight: '84px' }}
            />
          </div>

          {!supported && (
            <p className="text-sm text-red-600">
              Speech recognition is not supported. Please use Chrome or Edge.
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleStart}
              disabled={!text.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Start Drill
            </button>
            <span className="text-xs text-faint">{origWords.length} words</span>
            <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
              <div
                onClick={() => setPracticeOnly((v) => !v)}
                className={`relative w-8 h-4 rounded-full transition-colors ${practiceOnly ? 'bg-blue-500' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${practiceOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs text-muted-foreground">Practice only</span>
            </label>
            <button
              onClick={openHistory}
              className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-subtle transition-colors"
            >
              History
            </button>
          </div>
          <p className="text-xs text-faint">Chrome / Edge only. Speak at a natural pace — pauses are fine.</p>
        </div>
      )}

      {/* ── Speaking stage ── */}
      {stage === 'speaking' && (
        <div className="space-y-4">
          {/* Scrollable word-by-word text box */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
              Read this aloud
            </p>
            <div
              ref={textScrollRef}
              className="max-h-64 overflow-y-auto space-y-0.5"
            >
              {wordLines.map((line, lineIdx) => {
                const isPast = lineIdx < currentLineIdx
                const isCurrent = lineIdx === currentLineIdx
                return (
                  <div
                    key={lineIdx}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      isCurrent ? 'bg-blue-50 dark:bg-blue-900/15' : ''
                    }`}
                  >
                    <p className={`font-medium leading-8 transition-all duration-300 ${
                      isPast ? 'text-sm opacity-40' :
                      isCurrent ? 'text-lg' :
                      'text-base text-muted-foreground opacity-60'
                    }`}>
                      {line.words.map((word, wIdx) => {
                        const globalIdx = line.startIdx + wIdx
                        let cls: string
                        if (globalIdx < matchedCount) {
                          cls = 'text-green-600 dark:text-green-400'
                        } else if (globalIdx === matchedCount) {
                          cls = 'text-blue-600 dark:text-blue-400 font-bold underline decoration-dotted'
                        } else {
                          cls = isCurrent ? 'text-foreground' : 'text-muted-foreground'
                        }
                        return (
                          <span
                            key={globalIdx}
                            ref={(el) => { wordRefsRef.current[globalIdx] = el }}
                            className={`mr-1.5 transition-colors duration-150 ${cls}`}
                          >
                            {word}
                          </span>
                        )
                      })}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300 rounded-full"
                  style={{ width: `${origWords.length > 0 ? (matchedCount / origWords.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {matchedCount} / {origWords.length}
              </span>
            </div>
          </div>

          {/* Live transcript */}
          <div className="rounded-lg border border-border bg-muted px-4 py-3 overflow-y-auto" style={{ minHeight: '84px', maxHeight: '224px' }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-1">Live transcript</p>
            <p className="text-sm text-foreground">
              {spokenText}
              {interimText && <span className="text-faint italic"> {interimText}</span>}
              {!spokenText && !interimText && <span className="text-faint italic">Listening…</span>}
            </p>
          </div>

          {/* Legend + stop */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span><span className="text-green-600 font-semibold">Green</span> = matched</span>
              <span><span className="text-blue-600 font-bold">Blue</span> = next word</span>
              <span><span className="text-faint">Gray</span> = pending</span>
            </div>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors shrink-0"
            >
              <span className="inline-block w-2 h-2 rounded-sm bg-white" />
              {practiceOnly ? 'Stop' : 'Stop & Analyse'}
            </button>
          </div>
        </div>
      )}

      {/* ── Results stage ── */}
      {stage === 'results' && (
        <div className="space-y-6">
          {/* Score header */}
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-5">
            <div className={`text-4xl font-bold tabular-nums shrink-0 ${
              accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-amber-500' : 'text-red-500'
            }`}>
              {accuracy}%
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {correctCount} / {origWords.length} words correct
              </p>
              <div className="mt-2 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    accuracy >= 90 ? 'bg-green-500' : accuracy >= 70 ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0 items-center">
              {!practiceOnly && (
                <span className={`text-xs font-medium ${
                  saveStatus === 'saved' ? 'text-green-600' :
                  saveStatus === 'saving' ? 'text-faint' : 'text-faint'
                }`}>
                  {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'saving' ? 'Saving…' : ''}
                </span>
              )}
              <button
                onClick={handleStart}
                className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-subtle transition-colors"
              >
                Try again
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                New text
              </button>
            </div>
          </div>

          {/* Annotated text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-faint uppercase tracking-wide">
                Annotated transcript
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(opsToPlainText(finalOps))
                  setResultCopied(true)
                  setTimeout(() => setResultCopied(false), 2000)
                }}
                className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 hover:bg-subtle transition-colors"
              >
                {resultCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base leading-8 overflow-y-auto"
              style={{ minHeight: '84px', maxHeight: '224px' }}
            >
              {finalOps
                .filter((op) => op.op !== 'ins')
                .map((op, idx) => {
                  if (op.op === 'match') return <span key={idx} className="mr-1 text-foreground">{op.orig}</span>
                  if (op.op === 'sub') return (
                    <span
                      key={idx}
                      className="mr-1 rounded px-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 cursor-help"
                      title={`You said: "${op.spoken}"`}
                    >{op.orig}</span>
                  )
                  return (
                    <span
                      key={idx}
                      className="mr-1 rounded px-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through cursor-help"
                      title="Skipped"
                    >{op.orig}</span>
                  )
                })}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                <span className="rounded px-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">Orange</span>{' '}= wrong word (hover to see)
              </span>
              <span>
                <span className="rounded px-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through font-medium">Red</span>{' '}= skipped
              </span>
            </div>
          </div>

          {/* Top mistakes — hidden in practice-only mode */}
          {!practiceOnly && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                {mistakes.length === 0 ? 'No mistakes' : `Top ${mistakes.length} mistake${mistakes.length > 1 ? 's' : ''}`}
              </h2>
              {mistakes.length === 0 ? (
                <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Excellent — you nailed every word!
                  </p>
                </div>
              ) : (
                mistakes.map((mistake, idx) => (
                  <MistakeCard key={idx} mistake={mistake} rank={idx + 1} />
                ))
              )}
            </div>
          )}

          {/* What the system heard — hidden in practice-only mode */}
          {!practiceOnly && (
            <div className="rounded-lg border border-border bg-muted px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-1">
                What the system heard
              </p>
              <p className="text-sm text-muted-foreground">{spokenText || <em>Nothing captured</em>}</p>
            </div>
          )}
        </div>
      )}

      {/* ── History drawer ── */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
          <div className="flex h-full w-full max-w-md flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Drill History</h2>
              <button onClick={() => setHistoryOpen(false)} className="text-faint hover:text-foreground">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {historyLoading ? (
                <p className="py-8 text-center text-sm text-faint">Loading…</p>
              ) : historyRecords.length === 0 ? (
                <p className="py-8 text-center text-sm text-faint">No results saved yet.</p>
              ) : (
                <div className="space-y-2">
                  {historyRecords.map((record) => {
                    const isExpanded = expandedHistoryId === record.id
                    const ops = isExpanded
                      ? alignWords(tokenize(record.originalText), tokenize(record.spokenText))
                      : []
                    return (
                      <div
                        key={record.id}
                        className="rounded-lg border border-border bg-card overflow-hidden"
                      >
                        {/* Card header — toggles expand */}
                        <button
                          onClick={() => setExpandedHistoryId(isExpanded ? null : record.id)}
                          className="w-full text-left px-3 py-3 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${
                                record.accuracy >= 90 ? 'text-green-600' :
                                record.accuracy >= 70 ? 'text-amber-500' : 'text-red-500'
                              }`}>
                                {record.accuracy}%
                              </span>
                              <span className="text-xs text-faint">
                                {record.correctCount}/{record.totalCount} words
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-faint">
                                {new Date(record.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-faint text-xs">{isExpanded ? '▲' : '▼'}</span>
                            </div>
                          </div>
                          <p className={`text-xs text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {record.originalText}
                          </p>
                        </button>

                        {/* Expanded: annotated transcript + load button */}
                        {isExpanded && (
                          <div className="border-t border-border px-3 py-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-faint">
                                Annotated transcript
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(opsToPlainText(ops))
                                  setCopiedHistoryId(record.id)
                                  setTimeout(() => setCopiedHistoryId(null), 2000)
                                }}
                                className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 hover:bg-subtle transition-colors"
                              >
                                {copiedHistoryId === record.id ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <div
                              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-7 overflow-y-auto"
                              style={{ minHeight: '84px', maxHeight: '224px' }}
                            >
                              {ops
                                .filter((op) => op.op !== 'ins')
                                .map((op, idx) => {
                                  if (op.op === 'match') return (
                                    <span key={idx} className="mr-1 text-foreground">{op.orig}</span>
                                  )
                                  if (op.op === 'sub') return (
                                    <span
                                      key={idx}
                                      className="mr-1 rounded px-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 cursor-help"
                                      title={`You said: "${op.spoken}"`}
                                    >{op.orig}</span>
                                  )
                                  return (
                                    <span
                                      key={idx}
                                      className="mr-1 rounded px-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through cursor-help"
                                      title="Skipped"
                                    >{op.orig}</span>
                                  )
                                })}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                              <span>
                                <span className="rounded px-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">Orange</span>{' '}= wrong
                              </span>
                              <span>
                                <span className="rounded px-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through font-medium">Red</span>{' '}= skipped
                              </span>
                            </div>
                            <button
                              onClick={() => loadFromHistory(record)}
                              className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                              Load this text
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

