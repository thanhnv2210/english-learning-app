'use client'

import { useState, useTransition } from 'react'
import { createTicketAction, updateTicketAction } from '@/app/actions/projects'
import { PRIORITIES, TYPES, EPICS } from '@/lib/projects/constants'
import type { Ticket } from '@/lib/db/projects'

type Props = {
  projectId: number
  sprintId?: number | null
  ticket?: Ticket          // if provided → edit mode
  isTemplate?: boolean
  onClose: () => void
}

export function TicketForm({ projectId, sprintId, ticket, isTemplate, onClose }: Props) {
  const [title, setTitle] = useState(ticket?.title ?? '')
  const [description, setDescription] = useState(ticket?.description ?? '')
  const [priority, setPriority] = useState(ticket?.priority ?? 'medium')
  const [type, setType] = useState(ticket?.type ?? 'task')
  const [epic, setEpic] = useState(ticket?.epic ?? '')
  const [, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const epicVal = epic || null
    startTransition(async () => {
      if (ticket) {
        await updateTicketAction(ticket.id, { title: title.trim(), description: description.trim(), priority: priority as never, type: type as never, epic: epicVal })
      } else {
        await createTicketAction({ projectId, sprintId, title: title.trim(), description: description.trim(), priority: priority as never, type: type as never, epic: epicVal, isTemplate })
      }
      onClose()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {ticket ? 'Edit ticket' : isTemplate ? 'New template' : 'New ticket'}
        </h3>
        <button type="button" onClick={onClose} className="text-faint hover:text-muted-foreground text-lg leading-none">✕</button>
      </div>

      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ticket title…"
        className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)…"
        rows={3}
        className="rounded-lg border border-border bg-input text-foreground px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none placeholder:text-faint"
      />

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-faint">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-border bg-input text-foreground px-2 py-1.5 text-sm outline-none">
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-faint">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-border bg-input text-foreground px-2 py-1.5 text-sm outline-none">
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-faint">Epic</label>
        <select value={epic} onChange={(e) => setEpic(e.target.value)} className="rounded-lg border border-border bg-input text-foreground px-2 py-1.5 text-sm outline-none">
          <option value="">— No epic —</option>
          {EPICS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
        <button type="submit" disabled={!title.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors">
          {ticket ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  )
}
