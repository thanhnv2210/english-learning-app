'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { updateTicketAction } from '@/app/actions/projects'
import { STATUSES, PRIORITIES } from '@/lib/projects/constants'
import { StatusBadge, PriorityDot, TypeIcon, EpicBadge } from './ticket-badge'
import { TicketForm } from './ticket-form'
import type { Ticket, Sprint } from '@/lib/db/projects'

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  sprint: Sprint
  initialTickets: Ticket[]
  projectId: number
}

// ── Board ─────────────────────────────────────────────────────────────────────

export function KanbanBoard({ sprint, initialTickets, projectId }: Props) {
  const [tickets, setTickets] = useState(initialTickets)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function getColumnTickets(status: string) {
    return tickets.filter((t) => t.status === status)
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveTicket(tickets.find((t) => t.id === active.id) ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTicket(null)
    if (!over) return
    const ticket = tickets.find((t) => t.id === active.id)
    const newStatus = over.id as string
    if (!ticket || ticket.status === newStatus) return

    setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: newStatus } : t))
    startTransition(() => updateTicketAction(ticket.id, { status: newStatus as never }))
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((col) => (
          <Column
            key={col.value}
            status={col.value}
            label={col.label}
            tickets={getColumnTickets(col.value)}
            projectId={projectId}
            sprintId={sprint.id}
            isAddingForm={addingToColumn === col.value}
            onAddClick={() => setAddingToColumn(col.value)}
            onFormClose={() => setAddingToColumn(null)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTicket && <TicketCardDragging ticket={activeTicket} />}
      </DragOverlay>
    </DndContext>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────

function Column({
  status, label, tickets, projectId, sprintId,
  isAddingForm, onAddClick, onFormClose,
}: {
  status: string
  label: string
  tickets: Ticket[]
  projectId: number
  sprintId: number
  isAddingForm: boolean
  onAddClick: () => void
  onFormClose: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col gap-2 w-64 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{label}</span>
          <span className="rounded-full bg-subtle px-1.5 py-0.5 text-[10px] text-faint">{tickets.length}</span>
        </div>
        <button
          onClick={onAddClick}
          className="text-faint hover:text-foreground text-lg leading-none transition-colors"
          title="Add ticket"
        >
          +
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-24 rounded-xl p-2 transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-subtle/50'
        }`}
      >
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}

        {isAddingForm && (
          <div className="rounded-xl border border-border bg-card p-3">
            <TicketForm
              projectId={projectId}
              sprintId={sprintId}
              isTemplate={false}
              onClose={onFormClose}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Ticket card (draggable) ───────────────────────────────────────────────────

function TicketCard({ ticket }: { ticket: Ticket }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: ticket.id })
  const [editingStatus, setEditingStatus] = useState(false)
  const [, startTransition] = useTransition()

  function handleStatusChange(status: string) {
    setEditingStatus(false)
    startTransition(() => updateTicketAction(ticket.id, { status: status as never }))
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-border bg-card p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing shadow-sm transition-opacity ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <TypeIcon type={ticket.type} />
          <span className="text-[10px] text-faint font-mono">{ticket.key}</span>
        </div>
        <PriorityDot priority={ticket.priority} />
      </div>

      {/* Epic + Title */}
      {ticket.epic && <EpicBadge epic={ticket.epic} />}
      <Link
        href={`/projects/tickets/${ticket.key}`}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-sm text-foreground hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
      >
        {ticket.title}
      </Link>

      {/* Status chip — click to change */}
      <div className="relative">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setEditingStatus((v) => !v)}
          className="text-left"
        >
          <StatusBadge status={ticket.status} />
        </button>

        {editingStatus && (
          <div className="absolute left-0 top-full mt-1 z-20 rounded-xl border border-border bg-popover shadow-lg p-1 flex flex-col gap-0.5 min-w-32">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleStatusChange(s.value)}
                className={`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors hover:bg-muted ${
                  ticket.status === s.value ? 'text-blue-600' : 'text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Ghost card shown in DragOverlay
function TicketCardDragging({ ticket }: { ticket: Ticket }) {
  return (
    <div className="rounded-lg border border-blue-400 bg-card p-3 flex flex-col gap-2 shadow-xl w-64 opacity-90 cursor-grabbing">
      <div className="flex items-center gap-1.5">
        <TypeIcon type={ticket.type} />
        <span className="text-[10px] text-faint font-mono">{ticket.key}</span>
      </div>
      <p className="text-sm text-foreground line-clamp-2">{ticket.title}</p>
      <StatusBadge status={ticket.status} />
    </div>
  )
}
