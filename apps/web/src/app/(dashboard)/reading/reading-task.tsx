'use client'

import { useState, useRef, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { TimerControl } from '@/components/timer-control'
import { FeedbackView } from '@/components/feedback-view'
import { useTimer } from '@/lib/ielts/timer/use-timer'
import {
  scoreReading,
  estimateBand,
  type ReadingPassage,
  type ReadingQuestion,
} from '@/lib/ielts/reading/prompts'
import type { FeedbackResult, TranscriptMessage } from '@/lib/db/schema'

// ── Highlight helpers ──────────────────────────────────────────────────────────

type Highlight = { id: string; start: number; end: number }
// Question highlights are scoped per question id to keep offsets local
type QuestionHighlight = Highlight & { questionId: number }

type Segment = { text: string; highlightId?: string }

function buildSegments(text: string, highlights: Highlight[]): Segment[] {
  const sorted = [...highlights].sort((a, b) => a.start - b.start)
  const segs: Segment[] = []
  let pos = 0
  for (const h of sorted) {
    if (h.start > pos) segs.push({ text: text.slice(pos, h.start) })
    if (h.start >= pos) {
      segs.push({ text: text.slice(h.start, h.end), highlightId: h.id })
      pos = h.end
    }
  }
  if (pos < text.length) segs.push({ text: text.slice(pos) })
  return segs
}

function charOffsetInContainer(container: HTMLElement, node: Node, offset: number): number {
  const range = document.createRange()
  range.setStart(container, 0)
  range.setEnd(node, offset)
  return range.toString().length
}

function HighlightedText({
  text,
  highlights,
  onRemove,
}: {
  text: string
  highlights: Highlight[]
  onRemove: (id: string) => void
}) {
  const segs = buildSegments(text, highlights)
  return (
    <>
      {segs.map((seg, i) =>
        seg.highlightId ? (
          <mark
            key={i}
            onClick={() => onRemove(seg.highlightId!)}
            className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 cursor-pointer hover:bg-red-100 transition-colors"
            title="Click to remove"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────

type Domain = { id: number; name: string; description: string }
type Props = { domains: Domain[]; targetBand?: number }
type Stage = 'select' | 'generating' | 'reading' | 'submitted'

// ── Main component ─────────────────────────────────────────────────────────────

export function ReadingTask({ domains, targetBand = 6.5 }: Props) {
  const router = useRouter()
  const timer = useTimer(20 * 60)

  const [stage, setStage] = useState<Stage>('select')
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [passage, setPassage] = useState<ReadingPassage | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [scoreResult, setScoreResult] = useState<{
    correct: number; total: number; perQuestion: Record<number, boolean>; band: number
  } | null>(null)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  // Separate highlight stores — passage uses global char offsets; questions use per-question offsets
  const [passageHighlights, setPassageHighlights] = useState<Highlight[]>([])
  const [questionHighlights, setQuestionHighlights] = useState<QuestionHighlight[]>([])
  const [highlightMode, setHighlightMode] = useState(false)

  const [isSaving, startSaveTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const passageRef = useRef<HTMLDivElement>(null)

  const totalHighlights = passageHighlights.length + questionHighlights.length

  // ── Generate ───────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!selectedDomain) return
    setStage('generating')
    setError(null)
    const res = await fetch('/api/reading/passage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: selectedDomain.name }),
    })
    if (!res.ok) { setError('Failed to generate passage. Please try again.'); setStage('select'); return }
    const data: ReadingPassage = await res.json()
    setPassage(data)
    setStage('reading')
    timer.start()
  }

  // ── Passage highlight ──────────────────────────────────────────────────────

  const handlePassageMouseUp = useCallback(() => {
    if (!highlightMode || !passageRef.current) return
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const container = passageRef.current
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return
    const start = charOffsetInContainer(container, range.startContainer, range.startOffset)
    const end = charOffsetInContainer(container, range.endContainer, range.endOffset)
    if (start >= end) return
    setPassageHighlights((prev) => [...prev, { id: crypto.randomUUID(), start, end }])
    sel.removeAllRanges()
  }, [highlightMode])

  // ── Question highlight ─────────────────────────────────────────────────────

  function addQuestionHighlight(questionId: number, start: number, end: number) {
    setQuestionHighlights((prev) => [...prev, { id: crypto.randomUUID(), questionId, start, end }])
  }

  function removeQuestionHighlight(id: string) {
    setQuestionHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!passage) return
    timer.stop()
    const { correct, total, perQuestion } = scoreReading(passage.questions, userAnswers)
    const band = estimateBand(correct, total)
    setScoreResult({ correct, total, perQuestion, band })

    const tfngQs = passage.questions.filter((q) => q.type === 'tfng')
    const saQs = passage.questions.filter((q) => q.type === 'short_answer')
    const tfngCorrect = tfngQs.filter((q) => perQuestion[q.id]).length
    const saCorrect = saQs.filter((q) => perQuestion[q.id]).length

    const result: FeedbackResult = {
      overallBand: band,
      targetBand,
      criteria: [
        {
          criterion: 'True / False / Not Given',
          score: estimateBand(tfngCorrect, tfngQs.length),
          targetScore: targetBand,
          keyPoints: [
            `${tfngCorrect} of ${tfngQs.length} correct`,
            ...tfngQs.filter((q) => !perQuestion[q.id]).map((q) => `Missed: "${q.question.slice(0, 70)}"`),
          ],
        },
        {
          criterion: 'Short Answer',
          score: estimateBand(saCorrect, saQs.length),
          targetScore: targetBand,
          keyPoints: [
            `${saCorrect} of ${saQs.length} correct`,
            ...saQs.filter((q) => !perQuestion[q.id]).map((q) => `Expected: "${q.answer}"`),
          ],
        },
      ],
    }
    setFeedback(result)
    setStage('submitted')

    startSaveTransition(async () => {
      const transcript: TranscriptMessage[] = [
        { id: 'passage', role: 'assistant', content: JSON.stringify({ title: passage.title, passage: passage.passage, questions: passage.questions }) },
        { id: 'answers', role: 'user', content: JSON.stringify({ answers: userAnswers, score: `${correct}/${total}`, band }) },
      ]
      const { id } = await saveExam({ skill: 'reading', transcript })
      await saveFeedback(id, result)
    })
  }

  // ── Domain selector & generating ──────────────────────────────────────────

  if (stage === 'select' || stage === 'generating') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reading</h1>
          <p className="mt-1 text-sm text-gray-500">
            {stage === 'select' ? 'Choose a domain to generate a passage.' : 'Generating passage and questions…'}
          </p>
        </div>
        {stage === 'select' && (
          <div className="flex flex-col gap-4">
            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selectedDomain?.id === d.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={!selectedDomain}
              className="self-start rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Generate Passage
            </button>
          </div>
        )}
        {stage === 'generating' && (
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-16">
            <p className="text-sm text-gray-400 animate-pulse">Generating passage and questions…</p>
          </div>
        )}
      </div>
    )
  }

  // ── Split layout ───────────────────────────────────────────────────────────

  if (!passage) return null

  const answered = Object.keys(userAnswers).length

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 shrink-0 px-1">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">{passage.title}</h1>
          <span className="hidden sm:inline text-xs text-gray-400 shrink-0">
            {answered}/{passage.questions.length} answered
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setHighlightMode((m) => !m)}
            title={highlightMode ? 'Highlighting on' : 'Highlight text in passage or questions'}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              highlightMode
                ? 'border-yellow-400 bg-yellow-100 text-yellow-800'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {highlightMode ? 'On' : 'Highlight'}
          </button>
          {totalHighlights > 0 && (
            <button
              onClick={() => { setPassageHighlights([]); setQuestionHighlights([]) }}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
              title="Clear all highlights"
            >
              Clear ({totalHighlights})
            </button>
          )}
          <TimerControl timer={timer} label="Time" onStart={timer.start} />
          {stage === 'reading' && (
            <button
              onClick={handleSubmit}
              disabled={answered < passage.questions.length}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Submit
            </button>
          )}
          {stage === 'submitted' && (
            <button
              onClick={() => router.push('/history')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              History →
            </button>
          )}
        </div>
      </div>

      {/* Hint bar */}
      {highlightMode && (
        <p className="shrink-0 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
          Select any text in the passage or questions to highlight it. Click a highlight to remove it.
        </p>
      )}

      {/* Two-panel split */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left — passage */}
        <div className="flex-[55] flex flex-col min-w-0 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reading Passage</p>
          </div>
          <div
            ref={passageRef}
            onMouseUp={handlePassageMouseUp}
            className={`flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-800 leading-7 select-text ${highlightMode ? 'cursor-text' : 'cursor-default'}`}
          >
            <HighlightedText
              text={passage.passage}
              highlights={passageHighlights}
              onRemove={(id) => setPassageHighlights((prev) => prev.filter((h) => h.id !== id))}
            />
          </div>
        </div>

        {/* Right — questions */}
        <div className="flex-[45] flex flex-col min-w-0 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Questions</p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Questions 1–6 · True / False / Not Given</p>
                <p className="text-xs text-gray-400 mt-0.5">True = stated · False = contradicted · Not Given = not mentioned</p>
              </div>
              {passage.questions.filter((q) => q.type === 'tfng').map((q) => (
                <TFNGRow
                  key={q.id}
                  q={q}
                  value={userAnswers[q.id] ?? ''}
                  onChange={(v) => setUserAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  result={scoreResult?.perQuestion[q.id]}
                  correctAnswer={stage === 'submitted' ? q.answer : undefined}
                  disabled={stage === 'submitted'}
                  highlightMode={highlightMode}
                  highlights={questionHighlights.filter((h) => h.questionId === q.id)}
                  onHighlight={(start, end) => addQuestionHighlight(q.id, start, end)}
                  onRemoveHighlight={removeQuestionHighlight}
                />
              ))}
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Questions 7–10 · Short Answer</p>
                <p className="text-xs text-gray-400 mt-0.5">No more than 3 words from the passage</p>
              </div>
              {passage.questions.filter((q) => q.type === 'short_answer').map((q) => (
                <ShortAnswerRow
                  key={q.id}
                  q={q}
                  value={userAnswers[q.id] ?? ''}
                  onChange={(v) => setUserAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  result={scoreResult?.perQuestion[q.id]}
                  correctAnswer={stage === 'submitted' ? q.answer : undefined}
                  disabled={stage === 'submitted'}
                  highlightMode={highlightMode}
                  highlights={questionHighlights.filter((h) => h.questionId === q.id)}
                  onHighlight={(start, end) => addQuestionHighlight(q.id, start, end)}
                  onRemoveHighlight={removeQuestionHighlight}
                />
              ))}
            </div>

            {/* Results */}
            {stage === 'submitted' && scoreResult && feedback && (
              <>
                <div className="border-t border-gray-100" />
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <p className="text-sm font-semibold text-gray-800">Score: {scoreResult.correct}/{scoreResult.total}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Estimated band: {scoreResult.band}</p>
                    {isSaving && <p className="text-xs text-gray-400 mt-1">Saving…</p>}
                  </div>
                  <FeedbackView feedback={feedback} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Question row sub-components ────────────────────────────────────────────────

type QuestionRowProps = {
  q: ReadingQuestion
  value: string
  onChange: (v: string) => void
  result?: boolean
  correctAnswer?: string
  disabled: boolean
  highlightMode: boolean
  highlights: Highlight[]
  onHighlight: (start: number, end: number) => void
  onRemoveHighlight: (id: string) => void
}

function useQuestionHighlight(
  highlightMode: boolean,
  onHighlight: (start: number, end: number) => void
) {
  const ref = useRef<HTMLParagraphElement>(null)

  function handleMouseUp() {
    if (!highlightMode || !ref.current) return
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const container = ref.current
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return
    const start = charOffsetInContainer(container, range.startContainer, range.startOffset)
    const end = charOffsetInContainer(container, range.endContainer, range.endOffset)
    if (start >= end) return
    onHighlight(start, end)
    sel.removeAllRanges()
  }

  return { ref, handleMouseUp }
}

function TFNGRow({ q, value, onChange, result, correctAnswer, disabled, highlightMode, highlights, onHighlight, onRemoveHighlight }: QuestionRowProps) {
  const { ref, handleMouseUp } = useQuestionHighlight(highlightMode, onHighlight)
  const questionText = `${q.id}. ${q.question}`
  const options = ['True', 'False', 'Not Given']

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 text-sm transition-colors ${
      result === true ? 'border-green-200 bg-green-50' :
      result === false ? 'border-red-200 bg-red-50' :
      'border-gray-100 bg-gray-50'
    }`}>
      <p
        ref={ref}
        onMouseUp={handleMouseUp}
        className={`text-gray-800 leading-snug select-text ${highlightMode ? 'cursor-text' : ''}`}
      >
        <HighlightedText text={questionText} highlights={highlights} onRemove={onRemoveHighlight} />
      </p>
      <div className="flex gap-3 select-none">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              disabled={disabled}
              className="accent-blue-600"
            />
            <span className="text-xs text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
      {correctAnswer && result === false && (
        <p className="text-xs text-red-600 font-medium select-none">Correct: {correctAnswer}</p>
      )}
    </div>
  )
}

function ShortAnswerRow({ q, value, onChange, result, correctAnswer, disabled, highlightMode, highlights, onHighlight, onRemoveHighlight }: QuestionRowProps) {
  const { ref, handleMouseUp } = useQuestionHighlight(highlightMode, onHighlight)
  const questionText = `${q.id}. ${q.question}`

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 text-sm transition-colors ${
      result === true ? 'border-green-200 bg-green-50' :
      result === false ? 'border-red-200 bg-red-50' :
      'border-gray-100 bg-gray-50'
    }`}>
      <p
        ref={ref}
        onMouseUp={handleMouseUp}
        className={`text-gray-800 leading-snug select-text ${highlightMode ? 'cursor-text' : ''}`}
      >
        <HighlightedText text={questionText} highlights={highlights} onRemove={onRemoveHighlight} />
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Your answer…"
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 disabled:bg-white disabled:text-gray-600 select-none"
      />
      {correctAnswer && result === false && (
        <p className="text-xs text-red-600 font-medium select-none">Correct: "{correctAnswer}"</p>
      )}
    </div>
  )
}
