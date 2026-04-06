'use client'

import { useTransition, useState, useRef } from 'react'
import { toggleFavorite, addTagToExam, removeTagFromExam } from '@/app/actions/exam'
import type { TranscriptMessage } from '@/lib/db/schema'

type Tag = { id: number; name: string }

type Exam = {
  id: number
  skill: string
  isFavorite: boolean
  createdAt: Date
  transcript: TranscriptMessage[]
  examTags: { tag: Tag }[]
}

export function HistoryView({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-gray-400">
        No sessions yet. Complete a speaking or writing session to see it here.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  )
}

function ExamCard({ exam }: { exam: Exam }) {
  const [isPending, startTransition] = useTransition()
  const [tagInput, setTagInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleMessages = exam.transcript.filter((m) => m.content !== '__START__')
  const preview = visibleMessages.slice(0, 2)

  function handleToggleFavorite() {
    startTransition(() => toggleFavorite(exam.id))
  }

  function handleAddTag(e: React.FormEvent) {
    e.preventDefault()
    const name = tagInput.trim()
    if (!name) return
    startTransition(() => addTagToExam(exam.id, name))
    setTagInput('')
    inputRef.current?.focus()
  }

  function handleRemoveTag(tagId: number) {
    startTransition(() => removeTagFromExam(exam.id, tagId))
  }

  return (
    <div className={`rounded-xl border bg-white p-5 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700">
            {exam.skill}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(exam.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <button
          onClick={handleToggleFavorite}
          title={exam.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
              onClick={() => handleRemoveTag(tag.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Remove tag"
            >
              ×
            </button>
          </span>
        ))}

        {/* Add tag inline form */}
        <form onSubmit={handleAddTag} className="flex items-center gap-1">
          <input
            ref={inputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="+ tag"
            className="w-20 rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs outline-none focus:border-blue-400 focus:w-28 transition-all"
          />
        </form>
      </div>
    </div>
  )
}
