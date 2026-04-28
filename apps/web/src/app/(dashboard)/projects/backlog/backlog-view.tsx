'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createTicketAction, updateTicketAction, deleteTicketAction, cloneTemplateAction } from '@/app/actions/projects'
import { TicketForm } from '@/components/projects/ticket-form'
import { StatusBadge, PriorityDot, TypeIcon } from '@/components/projects/ticket-badge'
import type { Ticket, Sprint } from '@/lib/db/projects'

type Props = {
  projectId: number
  initialBacklog: Ticket[]
  initialTemplates: Ticket[]
  sprints: Sprint[]
}

export function BacklogView({ projectId, initialBacklog, initialTemplates, sprints }: Props) {
  const [backlog, setBacklog] = useState(initialBacklog)
  const [templates, setTemplates] = useState(initialTemplates)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [, startTransition] = useTransition()

  function handleMoveToSprint(ticketId: number, sprintId: number) {
    setBacklog((prev) => prev.filter((t) => t.id !== ticketId))
    startTransition(() => updateTicketAction(ticketId, { sprintId }))
  }

  function handleRemoveFromBacklog(ticketId: number) {
    setBacklog((prev) => prev.filter((t) => t.id !== ticketId))
    startTransition(() => deleteTicketAction(ticketId))
  }

  function handleCloneTemplate(templateId: number, sprintId: number | null) {
    startTransition(() => cloneTemplateAction(templateId, sprintId))
  }

  function handleDeleteTemplate(id: number) {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    startTransition(() => deleteTicketAction(id))
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Backlog ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Backlog</h2>
            <span className="text-xs text-faint">({backlog.length})</span>
          </div>
          <button
            onClick={() => setShowTicketForm((v) => !v)}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            + New ticket
          </button>
        </div>

        {showTicketForm && (
          <div className="rounded-xl border border-border bg-card p-4">
            <TicketForm projectId={projectId} sprintId={null} onClose={() => setShowTicketForm(false)} />
          </div>
        )}

        {backlog.length === 0 && !showTicketForm ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-faint">Backlog is empty. Create a ticket to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {backlog.map((ticket) => (
              <BacklogRow
                key={ticket.id}
                ticket={ticket}
                sprints={sprints}
                onMoveToSprint={handleMoveToSprint}
                onDelete={handleRemoveFromBacklog}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Templates ───────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Templates</h2>
            <span className="text-xs text-faint">({templates.length})</span>
            <span className="rounded-full bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-medium">reusable</span>
          </div>
          <button
            onClick={() => setShowTemplateForm((v) => !v)}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            + New template
          </button>
        </div>

        {showTemplateForm && (
          <div className="rounded-xl border border-border bg-card p-4">
            <TicketForm projectId={projectId} isTemplate onClose={() => setShowTemplateForm(false)} />
          </div>
        )}

        {templates.length === 0 && !showTemplateForm ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-faint">No templates yet. Templates can be cloned into any sprint.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {templates.map((tmpl) => (
              <TemplateRow
                key={tmpl.id}
                template={tmpl}
                sprints={sprints}
                onClone={handleCloneTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ── BacklogRow ────────────────────────────────────────────────────────────────

function BacklogRow({
  ticket, sprints, onMoveToSprint, onDelete,
}: {
  ticket: Ticket
  sprints: Sprint[]
  onMoveToSprint: (id: number, sprintId: number) => void
  onDelete: (id: number) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 hover:bg-muted/50 transition-colors">
      <TypeIcon type={ticket.type} />
      <span className="text-[10px] text-faint font-mono w-16 shrink-0">{ticket.key}</span>
      <Link href={`/projects/tickets/${ticket.key}`} className="flex-1 text-sm text-foreground hover:text-blue-600 truncate">
        {ticket.title}
      </Link>
      <PriorityDot priority={ticket.priority} />
      <StatusBadge status={ticket.status} />

      {/* Move to sprint */}
      {sprints.length > 0 && (
        <select
          onChange={(e) => e.target.value && onMoveToSprint(ticket.id, Number(e.target.value))}
          defaultValue=""
          className="text-xs rounded border border-border bg-input text-muted-foreground px-1.5 py-1 outline-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <option value="" disabled>→ Sprint</option>
          {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}

      {/* Delete */}
      {confirmDelete ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onDelete(ticket.id)} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Yes</button>
          <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle">No</button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs shrink-0"
        >✕</button>
      )}
    </div>
  )
}

// ── TemplateRow ───────────────────────────────────────────────────────────────

function TemplateRow({
  template, sprints, onClone, onDelete,
}: {
  template: Ticket
  sprints: Sprint[]
  onClone: (templateId: number, sprintId: number | null) => void
  onDelete: (id: number) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-card px-4 py-2.5 hover:bg-muted/50 transition-colors">
      <TypeIcon type={template.type} />
      <span className="text-[10px] text-faint font-mono w-16 shrink-0">{template.key}</span>
      <Link href={`/projects/tickets/${template.key}`} className="flex-1 text-sm text-foreground hover:text-blue-600 truncate">
        {template.title}
      </Link>
      <PriorityDot priority={template.priority} />

      {/* Clone to sprint or backlog */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onClone(template.id, null)}
          className="rounded px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
        >
          Clone → Backlog
        </button>
        {sprints.length > 0 && (
          <select
            onChange={(e) => e.target.value && onClone(template.id, Number(e.target.value))}
            defaultValue=""
            className="text-xs rounded border border-border bg-input text-muted-foreground px-1.5 py-1 outline-none"
          >
            <option value="" disabled>Clone → Sprint</option>
            {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
      </div>

      {confirmDelete ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onDelete(template.id)} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Yes</button>
          <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle">No</button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs shrink-0"
        >✕</button>
      )}
    </div>
  )
}
