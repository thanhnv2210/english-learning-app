'use client'

import { useTransition, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toggleFavorite, addTagToExam, removeTagFromExam } from '@/app/actions/exam'
import { FeedbackView } from '@/components/feedback-view'
import type { TranscriptMessage, FeedbackResult } from '@/lib/db/schema'

type Tag = { id: number; name: string }

type Exam = {
  id: number
  skill: string
  isFavorite: boolean
  createdAt: Date
  transcript: TranscriptMessage[]
  feedback: FeedbackResult | null
  examTags: { tag: Tag }[]
}

export function HistoryView({ exams }: { exams: Exam[] }) {
  const [feedbackExam, setFeedbackExam] = useState<Exam | null>(null)
  const [sessionExam, setSessionExam] = useState<Exam | null>(null)

  if (exams.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-gray-400">
        No sessions yet. Complete a speaking or writing session to see it here.
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onViewFeedback={() => setFeedbackExam(exam)}
            onViewSession={() => setSessionExam(exam)}
          />
        ))}
      </div>

      {/* Session modal */}
      {sessionExam && (
        <Modal onClose={() => setSessionExam(null)}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 capitalize">
                {sessionExam.skill.replace('_', ' ')} — Full Session
              </p>
              <p className="text-xs text-gray-400">
                {new Date(sessionExam.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <button onClick={() => setSessionExam(null)} className="shrink-0 text-xl leading-none text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <SessionView exam={sessionExam} />
        </Modal>
      )}

      {/* Feedback modal */}
      {feedbackExam && (
        <Modal onClose={() => setFeedbackExam(null)}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 capitalize">
                {feedbackExam.skill.replace('_', ' ')} — Feedback
              </p>
              <p className="text-xs text-gray-400">
                {new Date(feedbackExam.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
            <button onClick={() => setFeedbackExam(null)} className="shrink-0 text-xl leading-none text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          {feedbackExam.feedback ? (
            <FeedbackView feedback={feedbackExam.feedback} />
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              No feedback generated yet. End a session and click &quot;Generate Feedback&quot;.
            </p>
          )}
        </Modal>
      )}
    </>
  )
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  )
}

// ─── Session view ──────────────────────────────────────────────────────────────

function SessionView({ exam }: { exam: Exam }) {
  if (exam.skill === 'writing') return <WritingSessionView transcript={exam.transcript} />
  return <SpeakingSessionView transcript={exam.transcript} />
}

function WritingSessionView({ transcript }: { transcript: TranscriptMessage[] }) {
  const topic = transcript.find((m) => m.id === 'topic')?.content ?? ''
  const essay = transcript.find((m) => m.id === 'essay')?.content ?? ''

  const hasOutline = transcript.some((m) => m.id.startsWith('outline_'))
  const outlineIntro = transcript.find((m) => m.id === 'outline_introduction')?.content ?? ''
  const outlineBody1 = transcript.find((m) => m.id === 'outline_body1')?.content ?? ''
  const outlineBody2 = transcript.find((m) => m.id === 'outline_body2')?.content ?? ''
  const outlineConclusion = transcript.find((m) => m.id === 'outline_conclusion')?.content ?? ''
  const outlineCritique = transcript.find((m) => m.id === 'outline_critique')?.content ?? ''

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-5">
      {/* Essay topic */}
      <section>
        <Label>Essay Topic</Label>
        <div className="mt-1 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
          <p className="text-sm leading-relaxed text-gray-800">{topic}</p>
        </div>
      </section>

      {/* Outline — only when drafting mode was used */}
      {hasOutline && (
        <section>
          <Label>Outline</Label>
          <div className="mt-1 flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            {[
              { label: 'Introduction thesis', content: outlineIntro },
              { label: 'Body 1 argument', content: outlineBody1 },
              { label: 'Body 2 argument', content: outlineBody2 },
              { label: 'Conclusion stance', content: outlineConclusion },
            ].map(({ label, content }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-gray-400">{label}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>

          {outlineCritique && (
            <details className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
              <summary className="cursor-pointer text-xs font-semibold text-amber-700">
                AI Outline Critique
              </summary>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-gray-700">{outlineCritique}</p>
            </details>
          )}
        </section>
      )}

      {/* Essay */}
      <section>
        <div className="flex items-baseline justify-between">
          <Label>Essay Response</Label>
          <span className={`text-xs ${wordCount < 250 ? 'text-amber-500' : 'text-green-600'}`}>
            {wordCount} words
          </span>
        </div>
        <div className="mt-1 rounded-xl border border-gray-200 bg-white p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{essay}</p>
        </div>
      </section>
    </div>
  )
}

function SpeakingSessionView({ transcript }: { transcript: TranscriptMessage[] }) {
  const messages = transcript.filter((m) => m.content !== '__START__')

  if (messages.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">No messages recorded.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex flex-col gap-0.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <span className="text-xs font-semibold capitalize text-gray-400">
            {m.role === 'assistant' ? 'Examiner' : 'You'}
          </span>
          <div
            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'assistant'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-600 text-white'
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── ExamCard ─────────────────────────────────────────────────────────────────

function ExamCard({
  exam,
  onViewFeedback,
  onViewSession,
}: {
  exam: Exam
  onViewFeedback: () => void
  onViewSession: () => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tagInput, setTagInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleMessages = exam.transcript.filter(
    (m) => m.content !== '__START__' && !m.id.startsWith('outline_'),
  )
  const preview = visibleMessages.slice(0, 2)

  const continueUrl =
    exam.skill === 'speaking_part2'
      ? `/speaking/part2?examId=${exam.id}`
      : exam.skill === 'writing'
        ? `/writing?examId=${exam.id}`
        : `/speaking?examId=${exam.id}`

  function handleAddTag(e: React.FormEvent) {
    e.preventDefault()
    const name = tagInput.trim()
    if (!name) return
    startTransition(() => addTagToExam(exam.id, name))
    setTagInput('')
    inputRef.current?.focus()
  }

  return (
    <div className={`rounded-xl border bg-white p-5 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700">
            {exam.skill.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(exam.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        <button
          onClick={() => startTransition(() => toggleFavorite(exam.id))}
          className="text-lg transition-transform hover:scale-110"
        >
          {exam.isFavorite ? '★' : '☆'}
        </button>
      </div>

      {/* Transcript preview */}
      <div className="mt-3 flex flex-col gap-1.5">
        {preview.map((m) => (
          <p key={m.id} className="text-xs leading-relaxed text-gray-600">
            <span className="font-semibold capitalize text-gray-400">{m.role === 'assistant' ? 'Examiner' : 'You'}: </span>
            {m.content.length > 120 ? m.content.slice(0, 120) + '…' : m.content}
          </p>
        ))}
        {visibleMessages.length > 2 && (
          <button
            onClick={onViewSession}
            className="mt-0.5 self-start text-xs text-blue-500 hover:underline"
          >
            +{visibleMessages.length - 2} more — view full session
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {exam.examTags.map(({ tag }) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
          >
            {tag.name}
            <button
              onClick={() => startTransition(() => removeTagFromExam(exam.id, tag.id))}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <form onSubmit={handleAddTag}>
          <input
            ref={inputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="+ tag"
            className="w-20 rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs outline-none transition-all focus:w-28 focus:border-blue-400"
          />
        </form>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => router.push(continueUrl)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ↩ Continue
        </button>
        <button
          onClick={onViewSession}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          View Session
        </button>
        <button
          onClick={onViewFeedback}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            exam.feedback
              ? 'border border-blue-200 text-blue-600 hover:bg-blue-50'
              : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
          }`}
        >
          {exam.feedback ? '📊 View Feedback' : '📊 No Feedback Yet'}
        </button>
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{children}</p>
}
