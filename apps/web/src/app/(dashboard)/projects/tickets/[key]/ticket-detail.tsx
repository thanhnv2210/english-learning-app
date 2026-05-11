'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateTicketAction, addCommentAction, deleteCommentAction } from '@/app/actions/projects'
import { StatusBadge, PriorityDot, TypeIcon } from '@/components/projects/ticket-badge'
import { STATUSES, PRIORITIES, TYPES } from '@/lib/projects/constants'
import { useEpics } from '@/lib/projects/epics-context'
import type { Ticket, Sprint, TicketComment, TicketStatus, TicketPriority, TicketType } from '@/lib/db/projects'
import { HabitStrip } from './habit-strip'

type Props = {
  ticket: Ticket
  initialComments: TicketComment[]
  sprints: Sprint[]
  projectId: number
  initialCompletions: string[]
  ticketSprint: Sprint | null
}

export function TicketDetail({ ticket: initialTicket, initialComments, sprints, projectId, initialCompletions, ticketSprint }: Props) {
  const { allEpics } = useEpics()
  const [ticket, setTicket] = useState(initialTicket)
  const [comments, setComments] = useState(initialComments)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(ticket.title)
  const [description, setDescription] = useState(ticket.description ?? '')
  const [commentText, setCommentText] = useState('')
  const [, startTransition] = useTransition()

  function handleSave() {
    const updated = { ...ticket, title, description }
    setTicket(updated)
    setEditing(false)
    startTransition(() => updateTicketAction(ticket.id, { title, description }))
  }

  function handleStatusChange(status: string) {
    setTicket((prev) => ({ ...prev, status: status as TicketStatus }))
    startTransition(() => updateTicketAction(ticket.id, { status: status as TicketStatus }))
  }

  function handlePriorityChange(priority: string) {
    setTicket((prev) => ({ ...prev, priority: priority as TicketPriority }))
    startTransition(() => updateTicketAction(ticket.id, { priority: priority as TicketPriority }))
  }

  function handleTypeChange(type: string) {
    setTicket((prev) => ({ ...prev, type: type as TicketType }))
    startTransition(() => updateTicketAction(ticket.id, { type: type as TicketType }))
  }

  function handleSprintChange(sprintId: string) {
    const sid = sprintId === 'backlog' ? null : Number(sprintId)
    setTicket((prev) => ({ ...prev, sprintId: sid }))
    startTransition(() => updateTicketAction(ticket.id, { sprintId: sid }))
  }

  function handleEpicChange(epic: string) {
    const val = epic || null
    setTicket((prev) => ({ ...prev, epic: val }))
    startTransition(() => updateTicketAction(ticket.id, { epic: val }))
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    const optimistic: TicketComment = {
      id: Date.now(),
      ticketId: ticket.id,
      content: commentText.trim(),
      createdAt: new Date(),
    }
    setComments((prev) => [...prev, optimistic])
    setCommentText('')
    startTransition(() => addCommentAction(ticket.id, optimistic.content))
  }

  function handleDeleteComment(id: number) {
    setComments((prev) => prev.filter((c) => c.id !== id))
    startTransition(() => deleteCommentAction(id))
  }

  const currentSprint = sprints.find((s) => s.id === ticket.sprintId)

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-faint">
        <Link href="/projects" className="hover:text-blue-500 transition-colors">Projects</Link>
        <span>/</span>
        <Link href={`/projects/${projectId}`} className="hover:text-blue-500 transition-colors">Board</Link>
        <span>/</span>
        <Link href={`/projects/${projectId}/backlog`} className="hover:text-blue-500 transition-colors">Backlog</Link>
        <span>/</span>
        <span className="font-mono text-muted-foreground">{ticket.key}</span>
      </div>

      {/* Main card */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start gap-3">
          <TypeIcon type={ticket.type} />
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setEditing(true)}
                className="text-lg font-semibold text-foreground cursor-text hover:text-blue-600 transition-colors"
              >
                {ticket.title}
              </h1>
            )}
            <span className="text-xs text-faint font-mono">{ticket.key}</span>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-subtle transition-colors shrink-0"
            >
              Edit
            </button>
          )}
        </div>

        {/* Fields row */}
        <div className="flex flex-wrap gap-4 py-3 border-y border-border">
          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Status</span>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded border border-border bg-input text-xs text-foreground px-2 py-1 outline-none"
            >
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Priority</span>
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="rounded border border-border bg-input text-xs text-foreground px-2 py-1 outline-none"
            >
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Type</span>
            <select
              value={ticket.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="rounded border border-border bg-input text-xs text-foreground px-2 py-1 outline-none"
            >
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Epic */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Epic</span>
            <select
              value={ticket.epic ?? ''}
              onChange={(e) => handleEpicChange(e.target.value)}
              className="rounded border border-border bg-input text-xs text-foreground px-2 py-1 outline-none"
            >
              <option value="">— None —</option>
              {allEpics.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>

          {/* Sprint */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Sprint</span>
            <select
              value={ticket.sprintId ?? 'backlog'}
              onChange={(e) => handleSprintChange(e.target.value)}
              className="rounded border border-border bg-input text-xs text-foreground px-2 py-1 outline-none"
            >
              <option value="backlog">Backlog</option>
              {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Template badge */}
          {ticket.isTemplate && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">Kind</span>
              <span className="rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 text-[10px] font-medium">
                Template
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-faint uppercase tracking-wide">Description</span>
          {editing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Add a description..."
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          ) : (
            <div
              onClick={() => setEditing(true)}
              className={`rounded-lg p-3 text-sm cursor-text min-h-16 transition-colors hover:bg-subtle ${
                description ? 'text-foreground' : 'text-faint italic'
              }`}
            >
              {description || 'No description. Click to add one.'}
            </div>
          )}
        </div>

        {/* Edit actions */}
        {editing && (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => { setEditing(false); setTitle(ticket.title); setDescription(ticket.description ?? '') }}
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Habit Tracker — shown when the ticket lives in a sprint with date bounds */}
      {ticketSprint?.startDate && ticketSprint?.endDate && (
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Completion Tracker</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {ticketSprint.name}
            </span>
          </div>
          <HabitStrip
            ticketId={ticket.id}
            ticketKey={ticket.key}
            sprintStart={new Date(ticketSprint.startDate).toISOString().slice(0, 10)}
            sprintEnd={new Date(ticketSprint.endDate).toISOString().slice(0, 10)}
            initialCompletions={initialCompletions}
          />
        </div>
      )}

      {/* Comments */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          Comments <span className="text-faint font-normal">({comments.length})</span>
        </h2>

        {comments.length > 0 && (
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <CommentRow key={c.id} comment={c} onDelete={handleDeleteComment} />
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="flex flex-col gap-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment(e as unknown as React.FormEvent)
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-faint">⌘+Enter to submit</span>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── CommentRow ────────────────────────────────────────────────────────────────

function CommentRow({ comment, onDelete }: { comment: TicketComment; onDelete: (id: number) => void }) {
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="group flex gap-3 rounded-lg p-3 hover:bg-subtle transition-colors">
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-faint">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {confirm ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(comment.id)} className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white hover:bg-red-600">Delete</button>
              <button onClick={() => setConfirm(false)} className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              className="hidden group-hover:block text-[10px] text-red-400 hover:text-red-600"
            >
              delete
            </button>
          )}
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  )
}
