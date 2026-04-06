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
          <ExamCard key={exam.id} exam={exam} onViewFeedback={() => setFeedbackExam(exam)} />
        ))}
      </div>

      {/* Feedback modal */}
      {feedbackExam && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl my-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 capitalize">{feedbackExam.skill} — Feedback</p>
                <p className="text-xs text-gray-400">
                  {new Date(feedbackExam.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => setFeedbackExam(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            {feedbackExam.feedback ? (
              <FeedbackView feedback={feedbackExam.feedback} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No feedback generated yet. End a session and click &quot;Generate Feedback&quot;.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function ExamCard({ exam, onViewFeedback }: { exam: Exam; onViewFeedback: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tagInput, setTagInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleMessages = exam.transcript.filter((m) => m.content !== '__START__')
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
          <p key={m.id} className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold capitalize text-gray-400">{m.role}: </span>
            {m.content.length > 120 ? m.content.slice(0, 120) + '…' : m.content}
          </p>
        ))}
        {visibleMessages.length > 2 && (
          <p className="text-xs text-gray-400">{visibleMessages.length - 2} more messages…</p>
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
            className="w-20 rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs outline-none focus:border-blue-400 focus:w-28 transition-all"
          />
        </form>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => router.push(continueUrl)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ↩ Continue
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
