'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createTicketAction, updateTicketAction, deleteTicketAction, cloneTemplateAction, createEpicAction, deleteEpicAction } from '@/app/actions/projects'
import { TicketForm } from '@/components/projects/ticket-form'
import { StatusBadge, PriorityDot, TypeIcon, EpicBadge, EpicDot } from '@/components/projects/ticket-badge'
import { EPICS } from '@/lib/projects/constants'
import { useEpics } from '@/lib/projects/epics-context'
import { nextColorKey, getEpicColor, CUSTOM_EPIC_COLOR_KEYS } from '@/lib/projects/epic-colors'
import type { Ticket, Sprint } from '@/lib/db/projects'

type Props = {
  projectId: number
  initialBacklog: Ticket[]
  initialTemplates: Ticket[]
  sprints: Sprint[]
}

type Filter = 'all' | 'custom'

export function BacklogView({ projectId, initialBacklog, initialTemplates, sprints }: Props) {
  const { allEpics, addEpic, removeEpic } = useEpics()
  const customEpics = allEpics.filter((e) => !EPICS.some((sys) => sys.value === e.value))

  const [backlog, setBacklog] = useState(initialBacklog)
  const [templates, setTemplates] = useState(initialTemplates)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [templateFilter, setTemplateFilter] = useState<Filter>('all')
  const [showEpicForm, setShowEpicForm] = useState(false)
  const [newEpicLabel, setNewEpicLabel] = useState('')
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
    startTransition(async () => {
      const cloned = await cloneTemplateAction(templateId, sprintId)
      if (!cloned) return
      if (sprintId === null) {
        setBacklog((prev) => [...prev, cloned])
      }
      // if cloned into a sprint, the board will reflect it on next visit — no local state needed
    })
  }

  function handleDeleteTemplate(id: number) {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    startTransition(() => deleteTicketAction(id))
  }

  function handleCreateEpic(e: React.FormEvent) {
    e.preventDefault()
    const label = newEpicLabel.trim()
    if (!label) return
    const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const usedColorKeys = customEpics
      .map((ep) => CUSTOM_EPIC_COLOR_KEYS.find((k) => getEpicColor(k).dot === ep.dot) ?? '')
      .filter(Boolean)
    const colorKey = nextColorKey(usedColorKeys)
    setNewEpicLabel('')
    setShowEpicForm(false)
    startTransition(async () => {
      const created = await createEpicAction({ projectId, label, value, colorKey })
      addEpic({ value: created.value, label: created.label, dbId: created.id, ...getEpicColor(created.colorKey) })
    })
  }

  function handleDeleteEpic(epicValue: string, dbId: number) {
    removeEpic(epicValue)
    startTransition(() => deleteEpicAction(dbId))
  }

  const visibleTemplates = templateFilter === 'custom'
    ? templates.filter((t) => !t.isSystem)
    : templates

  const systemCount = templates.filter((t) => t.isSystem).length
  const customCount = templates.filter((t) => !t.isSystem).length

  // Group visible templates by epic (ungrouped ones go under null)
  const epicOrder = [...EPICS.map((e) => e.value), null] as (string | null)[]
  const groupedTemplates = epicOrder
    .map((epic) => ({
      epic,
      items: visibleTemplates.filter((t) => (t.epic ?? null) === epic),
    }))
    .filter((g) => g.items.length > 0)

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
            <TicketForm
              projectId={projectId}
              sprintId={null}
              onClose={() => setShowTicketForm(false)}
              onCreated={(ticket) => setBacklog((prev) => [...prev, ticket])}
            />
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
            <span className="text-xs text-faint">({visibleTemplates.length})</span>
            <span className="rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 text-[10px] font-medium">reusable</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <div className="flex items-center rounded-lg border border-border bg-subtle p-0.5 text-[10px] font-medium">
              <button
                onClick={() => setTemplateFilter('all')}
                className={`rounded px-2 py-1 transition-colors ${
                  templateFilter === 'all'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({templates.length})
              </button>
              <button
                onClick={() => setTemplateFilter('custom')}
                className={`rounded px-2 py-1 transition-colors ${
                  templateFilter === 'custom'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Custom ({customCount})
              </button>
            </div>

            <button
              onClick={() => setShowTemplateForm((v) => !v)}
              className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              + New template
            </button>
          </div>
        </div>

        {showTemplateForm && (
          <div className="rounded-xl border border-border bg-card p-4">
            <TicketForm projectId={projectId} isTemplate onClose={() => setShowTemplateForm(false)} />
          </div>
        )}

        {visibleTemplates.length === 0 && !showTemplateForm ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-faint">
              {templateFilter === 'custom'
                ? 'No custom templates yet. Create one to get started.'
                : 'No templates yet. Templates can be cloned into any sprint.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedTemplates.map(({ epic, items }) => (
              <EpicGroup
                key={epic ?? 'none'}
                epic={epic}
                items={items}
                sprints={sprints}
                onClone={handleCloneTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        )}

        {templateFilter === 'all' && systemCount > 0 && (
          <p className="text-[10px] text-faint text-center">
            {systemCount} default IELTS Academic templates · cannot be deleted
          </p>
        )}
      </section>

      {/* ── Custom Epics ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Custom Epics</h2>
            <span className="text-xs text-faint">({customEpics.length})</span>
          </div>
          <button
            onClick={() => setShowEpicForm((v) => !v)}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            + New epic
          </button>
        </div>

        {showEpicForm && (
          <form
            onSubmit={handleCreateEpic}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3"
          >
            <input
              value={newEpicLabel}
              onChange={(e) => setNewEpicLabel(e.target.value)}
              placeholder="Epic name (e.g. Grammar, Pronunciation)"
              className="flex-1 rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
              autoFocus
            />
            <button
              type="button"
              onClick={() => { setShowEpicForm(false); setNewEpicLabel('') }}
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newEpicLabel.trim()}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              Create
            </button>
          </form>
        )}

        {customEpics.length === 0 && !showEpicForm ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <p className="text-xs text-faint">
              No custom epics yet. Create one to categorise your tickets beyond the defaults.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {customEpics.map((epic) => (
              <div
                key={epic.value}
                className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1"
              >
                <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${epic.dot}`} />
                <span className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${epic.color}`}>
                  {epic.label}
                </span>
                {epic.dbId !== undefined && (
                  <button
                    onClick={() => handleDeleteEpic(epic.value, epic.dbId!)}
                    className="hidden group-hover:flex w-4 h-4 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-[9px] shrink-0 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
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
      <EpicDot epic={ticket.epic ?? null} />
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

      {/* Delete — hidden for system tickets */}
      {!ticket.isSystem && (
        confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onDelete(ticket.id)} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle">No</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs shrink-0"
          >✕</button>
        )
      )}
    </div>
  )
}

// ── EpicGroup ─────────────────────────────────────────────────────────────────

function EpicGroup({
  epic, items, sprints, onClone, onDelete,
}: {
  epic: string | null
  items: Ticket[]
  sprints: Sprint[]
  onClone: (templateId: number, sprintId: number | null) => void
  onDelete: (id: number) => void
}) {
  const epicMeta = EPICS.find((e) => e.value === epic)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-1 mb-0.5">
        {epicMeta ? (
          <>
            <span className={`inline-block w-2 h-2 rounded-full ${epicMeta.dot}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${epicMeta.color}`}>
              {epicMeta.label}
            </span>
          </>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">No Epic</span>
        )}
        <span className="text-[10px] text-faint">({items.length})</span>
      </div>
      {items.map((tmpl) => (
        <TemplateRow
          key={tmpl.id}
          template={tmpl}
          sprints={sprints}
          onClone={onClone}
          onDelete={onDelete}
        />
      ))}
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
    <div className={`group flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 hover:bg-muted/50 transition-colors ${
      template.isSystem
        ? 'border-blue-100 dark:border-blue-900/30'
        : 'border-purple-100 dark:border-purple-900/30'
    }`}>
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
          className="rounded px-2 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 transition-colors"
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

      {/* Delete — hidden for system templates */}
      {!template.isSystem && (
        confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onDelete(template.id)} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle">No</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs shrink-0"
          >✕</button>
        )
      )}
    </div>
  )
}
