'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { generateAndSaveCueCard } from '@/app/actions/cue-card'
import { TimerControl } from '@/components/timer-control'
import { TimerAlertModal } from '@/components/timer-alert-modal'
import { FeedbackView } from '@/components/feedback-view'
import { VocabularyDrawer } from '@/components/vocabulary-drawer'
import { MicInput } from '@/components/mic-input'
import { useTimer } from '@/lib/ielts/timer/use-timer'
import { detectFillers, totalFillerCount, type FillerCount } from '@/lib/ielts/feedback/filler-detector'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'
import type { Message } from 'ai'

type Stage =
  | 'idle'
  | 'part1'
  | 'part2_generating'
  | 'part2_prep'
  | 'part2_speaking'
  | 'part3'
  | 'ended'

type CueCard = { id: number; prompt: string }

const STAGE_LABELS: Record<Stage, string> = {
  idle: '',
  part1: 'Part 1 — Personal Questions',
  part2_generating: 'Part 2 — Generating Cue Card…',
  part2_prep: 'Part 2 — Preparation (1 min)',
  part2_speaking: 'Part 2 — Long Turn (2 min)',
  part3: 'Part 3 — Discussion',
  ended: 'Session Complete',
}

export function SpeakingSession({ targetBand = 6.5 }: { targetBand?: number }) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('idle')
  const [cueCard, setCueCard] = useState<CueCard | undefined>()
  const [examId, setExamId] = useState<number | undefined>()
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [fillers, setFillers] = useState<FillerCount[]>([])
  const [isSaving, startSaveTransition] = useTransition()
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

  const prepTimer = useTimer(60)   // Part 2 prep: 1 min
  const speakTimer = useTimer(120) // Part 2 speak: 2 min

  // Three separate chat instances — one per part
  const part1Chat = useChat({ api: '/api/chat' })
  const part2Chat = useChat({
    api: '/api/chat',
    body: { mode: 'part2', cueCardPrompt: cueCard?.prompt },
  })
  const part3Chat = useChat({
    api: '/api/chat',
    body: { mode: 'part3', cueCardPrompt: cueCard?.prompt },
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [part1Chat.messages, part2Chat.messages, part3Chat.messages])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function visibleMessages(msgs: Message[]) {
    return msgs.filter((m) => m.content !== '__START__')
  }

  function toTranscript(msgs: Message[], part: string): TranscriptMessage[] {
    return visibleMessages(msgs).map((m) => ({
      id: `${part}-${m.id}`,
      role: m.role as 'user' | 'assistant',
      content: `[${part}] ${m.content}`,
    }))
  }

  function allUserText() {
    const msgs = [
      ...visibleMessages(part1Chat.messages),
      ...visibleMessages(part2Chat.messages),
      ...visibleMessages(part3Chat.messages),
    ]
    return msgs.filter((m) => m.role === 'user').map((m) => m.content).join(' ')
  }

  // ── Stage transitions ──────────────────────────────────────────────────────

  function startPart1() {
    setStage('part1')
    part1Chat.append({ role: 'user', content: '__START__' })
  }

  async function startPart2() {
    setStage('part2_generating')
    const card = await generateAndSaveCueCard()
    setCueCard(card)
    setStage('part2_prep')
    prepTimer.start()
  }

  function beginPart2Speaking() {
    prepTimer.stop()
    setStage('part2_speaking')
    speakTimer.start()
    part2Chat.append({ role: 'user', content: '__START__' })
  }

  function startPart3() {
    speakTimer.stop()
    setStage('part3')
    part3Chat.append({ role: 'user', content: '__START__' })
  }

  function handleEndSession() {
    const userText = allUserText()
    setFillers(detectFillers(userText))

    startSaveTransition(async () => {
      const transcript: TranscriptMessage[] = [
        ...toTranscript(part1Chat.messages, 'Part 1'),
        ...toTranscript(part2Chat.messages, 'Part 2'),
        ...toTranscript(part3Chat.messages, 'Part 3'),
      ]
      const result = await saveExam({
        skill: 'speaking_full',
        transcript,
        cueCardId: cueCard?.id,
      })
      setExamId(result.id)
      setStage('ended')
    })
  }

  async function handleGenerateFeedback() {
    if (!examId) return
    setIsGeneratingFeedback(true)
    const transcript: TranscriptMessage[] = [
      ...toTranscript(part1Chat.messages, 'Part 1'),
      ...toTranscript(part2Chat.messages, 'Part 2'),
      ...toTranscript(part3Chat.messages, 'Part 3'),
    ]
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, skill: 'speaking', targetBand }),
      })
      const data: FeedbackResult = await res.json()
      setFeedback(data)
      await saveFeedback(examId, data)
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  // ── Shared mic submit helper ───────────────────────────────────────────────

  function makeSubmit(chat: typeof part1Chat) {
    return () => chat.handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  function makeOnChange(chat: typeof part1Chat) {
    return (v: string) =>
      chat.handleInputChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 xl:max-w-3xl">
      {/* Part 2 speak timer alert → moves to Part 3 */}
      <TimerAlertModal timer={speakTimer} partLabel="Part 3" onMoveOn={startPart3} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Speaking — Full Session</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stage === 'idle' ? 'Part 1 → Part 2 → Part 3, all in one flow.' : STAGE_LABELS[stage]}
          </p>
        </div>
        {stage === 'part2_prep' && <TimerControl timer={prepTimer} label="Prep" />}
        {stage === 'part2_speaking' && <TimerControl timer={speakTimer} label="Speaking" />}
      </div>

      {/* ── Idle ── */}
      {stage === 'idle' && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            A full IELTS Speaking test: 4–5 Part 1 questions, a cue card topic in Part 2, and an analytical discussion in Part 3.
          </p>
          <button
            onClick={startPart1}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Start Full Session
          </button>
        </div>
      )}

      {/* ── Part 1 ── */}
      {stage === 'part1' && (
        <div className="flex flex-col gap-4">
          <ChatBox messages={visibleMessages(part1Chat.messages)} isLoading={part1Chat.isLoading} bottomRef={bottomRef} />
          <MicInput
            value={part1Chat.input}
            onChange={makeOnChange(part1Chat)}
            onSubmit={makeSubmit(part1Chat)}
            disabled={part1Chat.isLoading}
          />
          <button
            onClick={startPart2}
            disabled={part1Chat.isLoading || visibleMessages(part1Chat.messages).length < 4}
            className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
          >
            Move to Part 2 →
          </button>
        </div>
      )}

      {/* ── Part 2 generating ── */}
      {stage === 'part2_generating' && (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card p-10">
          <p className="text-sm text-faint animate-pulse">Generating cue card…</p>
        </div>
      )}

      {/* ── Part 2 prep ── */}
      {stage === 'part2_prep' && cueCard && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-3">Cue Card</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{cueCard.prompt}</p>
          </div>
          <button
            onClick={beginPart2Speaking}
            className="self-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Begin Speaking →
          </button>
        </div>
      )}

      {/* ── Part 2 speaking ── */}
      {stage === 'part2_speaking' && (
        <div className="flex flex-col gap-4">
          {cueCard && (
            <details className="rounded-lg border border-border bg-muted px-4 py-2 text-xs text-muted-foreground cursor-pointer">
              <summary className="font-medium">View cue card</summary>
              <p className="mt-2 whitespace-pre-line leading-relaxed">{cueCard.prompt}</p>
            </details>
          )}
          <ChatBox messages={visibleMessages(part2Chat.messages)} isLoading={part2Chat.isLoading} bottomRef={bottomRef} />
          <MicInput
            value={part2Chat.input}
            onChange={makeOnChange(part2Chat)}
            onSubmit={makeSubmit(part2Chat)}
            disabled={part2Chat.isLoading}
            placeholder="Type or speak your response…"
          />
          <button
            onClick={startPart3}
            disabled={part2Chat.isLoading || visibleMessages(part2Chat.messages).length < 2}
            className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
          >
            Move to Part 3 →
          </button>
        </div>
      )}

      {/* ── Part 3 ── */}
      {stage === 'part3' && (
        <div className="flex flex-col gap-4">
          <ChatBox messages={visibleMessages(part3Chat.messages)} isLoading={part3Chat.isLoading} bottomRef={bottomRef} />
          <MicInput
            value={part3Chat.input}
            onChange={makeOnChange(part3Chat)}
            onSubmit={makeSubmit(part3Chat)}
            disabled={part3Chat.isLoading}
          />
          <button
            onClick={handleEndSession}
            disabled={isSaving || part3Chat.isLoading || visibleMessages(part3Chat.messages).length < 4}
            className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-colors"
          >
            {isSaving ? 'Saving…' : 'End & Save Session'}
          </button>
        </div>
      )}

      {/* ── Ended ── */}
      {stage === 'ended' && (
        <div className="flex flex-col gap-4">
          {/* Filler summary */}
          {fillers.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">
                Filler words detected — {totalFillerCount(fillers)} total
              </p>
              <div className="flex flex-wrap gap-2">
                {fillers.map((f) => (
                  <span key={f.word} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700 font-medium">
                    &ldquo;{f.word}&rdquo; ×{f.count}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-amber-600">
                Tip: Replace fillers with discourse markers like &ldquo;Furthermore,&rdquo; &ldquo;In addition,&rdquo; or a brief pause.
              </p>
            </div>
          )}

          {/* Feedback */}
          {!feedback ? (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Session saved ✓</p>
                <p className="text-xs text-muted-foreground">Generate AI feedback on all three parts.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateFeedback}
                  disabled={isGeneratingFeedback}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isGeneratingFeedback ? 'Analysing…' : 'Generate Feedback'}
                </button>
                <button
                  onClick={() => router.push('/history')}
                  className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  History →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Feedback</h2>
              <FeedbackView feedback={feedback} />
              <button
                onClick={() => router.push('/history')}
                className="self-end rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                View in History →
              </button>
            </div>
          )}

          <VocabularyDrawer text={allUserText()} />
        </div>
      )}
    </div>
  )
}

// ── Shared chat message list ─────────────────────────────────────────────────

function ChatBox({
  messages,
  isLoading,
  bottomRef,
}: {
  messages: Message[]
  isLoading: boolean
  bottomRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 min-h-48 max-h-[45vh] overflow-y-auto">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-lg px-4 py-2 text-sm leading-relaxed max-w-[85%] ${
            m.role === 'assistant'
              ? 'self-start bg-subtle text-foreground'
              : 'self-end bg-blue-600 text-white'
          }`}
        >
          {m.content}
        </div>
      ))}
      {isLoading && (
        <p className="self-start text-xs text-faint animate-pulse">Examiner is speaking…</p>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
