'use client'

import { useState, useRef, useCallback, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveExam, saveFeedback } from '@/app/actions/exam'
import { saveScriptToLibrary, pickRandomScript } from '@/app/actions/listening'
import { FeedbackView } from '@/components/feedback-view'
import { scoreListening, estimateBand } from '@/lib/ielts/listening/prompts'
import type { ListeningTurn, ListeningQuestion, FeedbackResult, TranscriptMessage } from '@/lib/db/schema'

// ── Types ───────────────────────────────────────────────────────────────────────

type Domain = { id: number; name: string; description: string }

type Script = {
  title: string
  domain: string
  transcript: ListeningTurn[]
  questions: ListeningQuestion[]
}

type Props = {
  domains: Domain[]
  targetBand?: number
  libraryCounts?: Record<string, number>
}

type Stage = 'select' | 'options' | 'generating' | 'loading' | 'listening' | 'submitted'

// ── TTS helper ──────────────────────────────────────────────────────────────────

function pickVoices(): [SpeechSynthesisVoice | null, SpeechSynthesisVoice | null] {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return [null, null]
  const en = voices.filter((v) => v.lang.startsWith('en'))
  const pool = en.length >= 2 ? en : voices
  return [pool[0] ?? null, pool[1] ?? pool[0] ?? null]
}

// ── Main component ──────────────────────────────────────────────────────────────

export function ListeningTask({ domains, targetBand = 6.5, libraryCounts = {} }: Props) {
  const router = useRouter()

  const [stage, setStage] = useState<Stage>('select')
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [script, setScript] = useState<Script | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Playback
  const [isPlaying, setIsPlaying] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [currentSpeaker, setCurrentSpeaker] = useState<'A' | 'B' | null>(null)
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(-1)
  const playCountRef = useRef(0)
  const cancelledRef = useRef(false)

  // Answers
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [scoreResult, setScoreResult] = useState<{
    correct: number; total: number; perQuestion: Record<number, boolean>; band: number
  } | null>(null)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

  // ── Generate ──────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!selectedDomain) return
    setStage('generating')
    setError(null)
    const res = await fetch('/api/listening/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: selectedDomain.name }),
    })
    if (!res.ok) { setError('Failed to generate script. Please try again.'); setStage('options'); return }
    const data = await res.json()
    await saveScriptToLibrary({ ...data, domain: selectedDomain.name })
    setScript({ ...data, domain: selectedDomain.name })
    setStage('listening')
  }

  // ── Pick from library ─────────────────────────────────────────────────────────

  async function handlePickRandom() {
    if (!selectedDomain) return
    setStage('loading')
    setError(null)
    const found = await pickRandomScript(selectedDomain.name)
    if (!found) {
      setError('No scripts in the library for this domain yet. Generate one first.')
      setStage('options')
      return
    }
    setScript({
      title: found.title,
      domain: found.domain,
      transcript: found.transcript,
      questions: found.questions,
    })
    setStage('listening')
  }

  // ── TTS playback ──────────────────────────────────────────────────────────────

  const playScript = useCallback((transcript: ListeningTurn[]) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    cancelledRef.current = false

    const [voiceA, voiceB] = pickVoices()

    let idx = 0
    function speakNext() {
      if (cancelledRef.current || idx >= transcript.length) {
        setIsPlaying(false)
        setCurrentSpeaker(null)
        setCurrentTurnIdx(-1)
        if (!cancelledRef.current) {
          playCountRef.current += 1
          setPlayCount(playCountRef.current)
        }
        return
      }
      const turn = transcript[idx]
      setCurrentSpeaker(turn.speaker)
      setCurrentTurnIdx(idx)

      const utt = new SpeechSynthesisUtterance(turn.text)
      utt.voice = turn.speaker === 'A' ? voiceA : voiceB
      // Pitch differentiation when only one voice is available
      utt.pitch = turn.speaker === 'A' ? 1.0 : 1.2
      utt.rate = 0.95
      utt.onend = () => { idx++; speakNext() }
      utt.onerror = () => { idx++; speakNext() }
      window.speechSynthesis.speak(utt)
    }

    setIsPlaying(true)
    speakNext()
  }, [])

  function handlePlay() {
    if (!script) return
    playScript(script.transcript)
  }

  function handlePause() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    }
  }

  function handleResume() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
    }
  }

  function handleStop() {
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentSpeaker(null)
    setCurrentTurnIdx(-1)
  }

  // Stop TTS when leaving the page
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  // ── Submit ─────────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!script) return
    handleStop()
    const { correct, total, perQuestion } = scoreListening(script.questions, userAnswers)
    const band = estimateBand(correct, total)
    setScoreResult({ correct, total, perQuestion, band })

    const result: FeedbackResult = {
      overallBand: band,
      targetBand,
      criteria: [
        {
          criterion: 'Note Completion',
          score: band,
          targetScore: targetBand,
          keyPoints: [
            `${correct} of ${total} correct`,
            ...script.questions
              .filter((q) => !perQuestion[q.id])
              .map((q) => `Expected: "${q.answer}"`),
          ],
        },
      ],
    }
    setFeedback(result)
    setStage('submitted')

    startSaveTransition(async () => {
      const transcript: TranscriptMessage[] = [
        { id: 'script', role: 'assistant', content: JSON.stringify({ title: script.title, transcript: script.transcript, questions: script.questions }) },
        { id: 'answers', role: 'user', content: JSON.stringify({ answers: userAnswers, score: `${correct}/${total}`, band }) },
      ]
      const { id } = await saveExam({ skill: 'listening', transcript })
      await saveFeedback(id, result)
    })
  }

  // ── Stage: select / options / generating / loading ────────────────────────────

  if (stage === 'select' || stage === 'options' || stage === 'generating' || stage === 'loading') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6 xl:max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listening</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stage === 'select' && 'Choose a domain to get started.'}
            {stage === 'options' && `Domain: ${selectedDomain?.name} — how would you like to practice?`}
            {stage === 'generating' && 'Generating conversation and questions…'}
            {stage === 'loading' && 'Loading a script from the library…'}
          </p>
        </div>

        {/* Step 1 — domain picker */}
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
                      : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-muted'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (selectedDomain) { setError(null); setStage('options') } }}
              disabled={!selectedDomain}
              className="self-start rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 — library vs generate */}
        {stage === 'options' && (
          <div className="flex flex-col gap-4">
            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={handlePickRandom}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 text-left hover:border-blue-400 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎧</span>
                  {(() => {
                    const count = libraryCounts[selectedDomain?.name ?? ''] ?? 0
                    return count > 0 ? (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {count} script{count !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-faint">Empty</span>
                    )
                  })()}
                </div>
                <p className="text-sm font-semibold text-foreground group-hover:text-blue-700">Pick from Library</p>
                <p className="text-xs text-muted-foreground">Practice with a previously saved conversation in this domain.</p>
              </button>

              <button
                onClick={handleGenerate}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 text-left hover:border-green-400 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">✨</span>
                <p className="text-sm font-semibold text-foreground group-hover:text-green-700">Generate New</p>
                <p className="text-xs text-muted-foreground">Create a fresh conversation with AI and save it to the library.</p>
              </button>
            </div>
            <button
              onClick={() => setStage('select')}
              className="self-start text-xs text-faint hover:text-muted-foreground underline transition-colors"
            >
              ← Change domain
            </button>
          </div>
        )}

        {(stage === 'generating' || stage === 'loading') && (
          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-16">
            <p className="text-sm text-faint animate-pulse">
              {stage === 'generating' ? 'Generating conversation and questions…' : 'Loading from library…'}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Stage: listening / submitted ──────────────────────────────────────────────

  if (!script) return null

  const paused = typeof window !== 'undefined' && window.speechSynthesis?.paused
  const canReplay = playCount < 2 && !isPlaying && !paused
  const hasPlayedOnce = playCount >= 1 || isPlaying
  const answeredCount = Object.values(userAnswers).filter((v) => v.trim()).length

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 shrink-0 px-1">
        <div className="min-w-0">
          <h1 className="text-base font-bold text-foreground truncate">{script.title}</h1>
          <p className="text-xs text-faint mt-0.5">{script.domain}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-faint">
            {answeredCount}/{script.questions.length} answered
          </span>
          {playCount > 0 && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              playCount >= 2 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
            }`}>
              Play {playCount}/2
            </span>
          )}
          {stage === 'listening' && (
            <button
              onClick={handleSubmit}
              disabled={!hasPlayedOnce}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              title={!hasPlayedOnce ? 'Play the audio at least once before submitting' : ''}
            >
              Submit
            </button>
          )}
          {stage === 'submitted' && (
            <button
              onClick={() => router.push('/history')}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              History →
            </button>
          )}
        </div>
      </div>

      {/* Two-panel split */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left — playback + transcript */}
        <div className="flex-[45] flex flex-col min-w-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Audio</p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

            {/* Playback controls */}
            {stage === 'listening' && (
              <div className="flex flex-col gap-3">
                {!isPlaying && !paused ? (
                  <button
                    onClick={handlePlay}
                    disabled={playCount >= 2}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  >
                    <span className="text-xl">▶</span>
                    {playCount === 0 ? 'Play Audio' : playCount === 1 ? 'Replay (last play)' : 'No more replays'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {isPlaying ? (
                      <button
                        onClick={handlePause}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <span>⏸</span> Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleResume}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <span>▶</span> Resume
                      </button>
                    )}
                    <button
                      onClick={handleStop}
                      className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                      ■ Stop
                    </button>
                  </div>
                )}

                {/* IELTS rules reminder */}
                <p className="text-xs text-faint text-center">
                  You may play the audio up to 2 times · answer the questions while listening
                </p>
              </div>
            )}

            {/* Speaker indicator during playback */}
            {isPlaying && currentTurnIdx >= 0 && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  currentSpeaker === 'A' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {currentSpeaker === 'A' ? 'Engineer' : 'Manager'}
                </span>
                <p className="text-xs text-blue-700 italic line-clamp-2">
                  {script.transcript[currentTurnIdx]?.text}
                </p>
              </div>
            )}

            {/* Transcript — hidden during listening, shown after submit */}
            {stage === 'submitted' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transcript</p>
                {script.transcript.map((turn, i) => (
                  <div key={i} className={`flex gap-2 text-sm ${turn.speaker === 'A' ? '' : 'flex-row-reverse'}`}>
                    <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full h-fit mt-0.5 ${
                      turn.speaker === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {turn.speaker === 'A' ? 'Eng' : 'Mgr'}
                    </span>
                    <p className={`rounded-lg px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
                      turn.speaker === 'A' ? 'bg-subtle text-foreground' : 'bg-purple-50 text-foreground'
                    }`}>
                      {turn.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {stage === 'listening' && !isPlaying && playCount === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-4xl">🎧</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Press Play to start the conversation. Fill in the answers on the right while you listen.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — questions */}
        <div className="flex-[55] flex flex-col min-w-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">
              Note Completion — Questions 1–{script.questions.length}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">

            <p className="text-xs text-faint">
              Complete each note using <span className="font-semibold">1–3 words</span> from the conversation.
            </p>

            {script.questions.map((q) => {
              const [before, after] = q.sentence.split('___')
              const result = scoreResult?.perQuestion[q.id]
              return (
                <div
                  key={q.id}
                  className={`rounded-lg border p-3 flex flex-col gap-2 transition-colors ${
                    result === true ? 'border-green-200 bg-green-50' :
                    result === false ? 'border-red-200 bg-red-50' :
                    'border-border bg-muted'
                  }`}
                >
                  <div className="flex items-baseline gap-1 flex-wrap text-sm text-foreground leading-snug">
                    <span className="text-xs font-semibold text-faint shrink-0 mr-1">{q.id}.</span>
                    {before && <span>{before}</span>}
                    <input
                      value={userAnswers[q.id] ?? ''}
                      onChange={(e) => setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      disabled={stage === 'submitted'}
                      placeholder="___"
                      className={`inline-block w-32 rounded border px-2 py-0.5 text-sm outline-none transition-colors
                        ${result === true ? 'border-green-400 bg-card text-green-700' :
                          result === false ? 'border-red-400 bg-card text-red-700' :
                          'border-border bg-card focus:border-blue-400'}
                        disabled:bg-transparent disabled:border-dashed`}
                    />
                    {after && <span>{after}</span>}
                  </div>
                  {result === false && stage === 'submitted' && (
                    <p className="text-xs text-red-600 font-medium">
                      Correct: &ldquo;{q.answer}&rdquo;
                    </p>
                  )}
                </div>
              )
            })}

            {/* Results */}
            {stage === 'submitted' && scoreResult && feedback && (
              <>
                <div className="border-t border-border mt-2" />
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg bg-muted border border-border p-3">
                    <p className="text-sm font-semibold text-foreground">
                      Score: {scoreResult.correct}/{scoreResult.total}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Estimated band: {scoreResult.band}</p>
                    {isSaving && <p className="text-xs text-faint mt-1">Saving…</p>}
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
