'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  createSprintAction,
  updateSprintAction,
  updateSprintStatusAction,
  deleteSprintAction,
} from '@/app/actions/projects'
import type { Sprint, SprintStatus } from '@/lib/db/projects'

type SprintStat = { total: number; done: number }

type Props = {
  projectId: number
  initialSprints: Sprint[]
  sprintStats?: Record<number, SprintStat>
}

export function SprintsView({ projectId, initialSprints, sprintStats = {} }: Props) {
  const [sprints, setSprints] = useState(initialSprints)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [, startTransition] = useTransition()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    startTransition(async () => {
      const created = await createSprintAction({
        projectId,
        name: name.trim(),
        goal: goal.trim() || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      })
      setSprints((prev) => [created, ...prev])
    })
    setName('')
    setGoal('')
    setStartDate('')
    setEndDate('')
    setShowForm(false)
  }

  function handleStatus(id: number, status: SprintStatus, dates?: { startDate?: Date; endDate?: Date }) {
    setSprints((prev) => prev.map((s) => s.id === id ? { ...s, status, ...dates } : s))
    startTransition(() => updateSprintStatusAction(id, status, dates))
  }

  function handleEdit(id: number, data: { name: string; goal: string; startDate: string; endDate: string }) {
    const startDate = data.startDate ? new Date(data.startDate) : null
    const endDate   = data.endDate   ? new Date(data.endDate)   : null
    setSprints((prev) => prev.map((s) => s.id === id
      ? { ...s, name: data.name, goal: data.goal || null, startDate, endDate }
      : s
    ))
    startTransition(() => updateSprintAction(id, {
      name: data.name,
      goal: data.goal || null,
      startDate,
      endDate,
    }))
  }

  function handleDelete(id: number) {
    setSprints((prev) => prev.filter((s) => s.id !== id))
    startTransition(() => deleteSprintAction(id))
  }

  const active    = sprints.filter((s) => s.status === 'active')
  const planning  = sprints.filter((s) => s.status === 'planning')
  const completed = sprints.filter((s) => s.status === 'completed')

  return (
    <div className="flex flex-col gap-8">

      {/* Create form */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Sprints</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            + New sprint
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sprint name (e.g. Sprint 1)"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
              autoFocus
            />
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Sprint goal (optional)"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-faint">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-faint">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active */}
      {active.length > 0 && (
        <SprintGroup
          label="Active"
          sprints={active}
          sprintStats={sprintStats}
          onStatus={handleStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
          labelClass="text-green-600 dark:text-green-400"
        />
      )}

      {/* Planning */}
      <SprintGroup
        label="Planning"
        sprints={planning}
        sprintStats={sprintStats}
        onStatus={handleStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyText="No sprints in planning."
      />

      {/* Completed */}
      {completed.length > 0 && (
        <SprintGroup
          label="Completed"
          sprints={completed}
          sprintStats={sprintStats}
          onStatus={handleStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
          labelClass="text-muted-foreground"
          collapsed
        />
      )}
    </div>
  )
}

// ── SprintGroup ───────────────────────────────────────────────────────────────

type EditData = { name: string; goal: string; startDate: string; endDate: string }

function SprintGroup({
  label, sprints, sprintStats, onStatus, onEdit, onDelete, labelClass = '', emptyText, collapsed = false,
}: {
  label: string
  sprints: Sprint[]
  sprintStats: Record<number, SprintStat>
  onStatus: (id: number, status: SprintStatus, dates?: { startDate?: Date; endDate?: Date }) => void
  onEdit: (id: number, data: EditData) => void
  onDelete: (id: number) => void
  labelClass?: string
  emptyText?: string
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(!collapsed)

  return (
    <section className="flex flex-col gap-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left"
      >
        <span className={`text-xs font-semibold uppercase tracking-wide ${labelClass || 'text-foreground'}`}>
          {label}
        </span>
        <span className="text-xs text-faint">({sprints.length})</span>
        <span className={`ml-auto text-[10px] text-faint transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2">
          {sprints.length === 0 && emptyText && (
            <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
              <p className="text-xs text-faint">{emptyText}</p>
            </div>
          )}
          {sprints.map((sprint) => (
            <SprintCard key={sprint.id} sprint={sprint} stats={sprintStats[sprint.id]} onStatus={onStatus} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── SprintCard ────────────────────────────────────────────────────────────────

function SprintCard({
  sprint, stats, onStatus, onEdit, onDelete,
}: {
  sprint: Sprint
  stats?: SprintStat
  onStatus: (id: number, status: SprintStatus, dates?: { startDate?: Date; endDate?: Date }) => void
  onEdit: (id: number, data: EditData) => void
  onDelete: (id: number) => void
}) {
  const { projectId } = useParams<{ projectId: string }>()
  const boardHref = projectId ? `/projects/${projectId}` : '/projects'
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [starting, setStarting] = useState(false)
  const [editing, setEditing] = useState(false)

  const toDateInput = (d: Date | string | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : ''

  const [startDate, setStartDate] = useState(toDateInput(sprint.startDate))
  const [endDate,   setEndDate]   = useState(toDateInput(sprint.endDate))
  const [editName,  setEditName]  = useState(sprint.name)
  const [editGoal,  setEditGoal]  = useState(sprint.goal ?? '')

  const statusColors: Record<Sprint['status'], string> = {
    planning:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    active:    'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-subtle text-muted-foreground',
  }

  function formatDate(d: Date | string | null) {
    if (!d) return null
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function handleConfirmStart() {
    onStatus(sprint.id, 'active', {
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
    })
    setStarting(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[sprint.status]}`}>
              {sprint.status}
            </span>
            <span className="text-sm font-medium text-foreground truncate">{sprint.name}</span>
          </div>
          {sprint.goal && (
            <p className="text-xs text-muted-foreground line-clamp-2 ml-0.5">{sprint.goal}</p>
          )}
          {/* Date range display */}
          {(sprint.startDate || sprint.endDate) && (
            <p className="text-xs text-faint ml-0.5">
              {formatDate(sprint.startDate)} {sprint.startDate && sprint.endDate && '→'} {formatDate(sprint.endDate)}
            </p>
          )}

          {/* Progress bar */}
          {stats && stats.total > 0 && (
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.round((stats.done / stats.total) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-faint shrink-0">
                {stats.done}/{stats.total} done
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={boardHref}
            className="rounded px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Board →
          </Link>

          {!starting && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-subtle transition-colors"
            >
              Edit
            </button>
          )}

          {sprint.status === 'planning' && !starting && !editing && (
            <button
              onClick={() => setStarting(true)}
              className="rounded px-2 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Start
            </button>
          )}
          {sprint.status === 'active' && !editing && (
            <button
              onClick={() => onStatus(sprint.id, 'completed')}
              className="rounded px-2 py-1 text-xs font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Complete
            </button>
          )}

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(sprint.id)} className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle">No</button>
            </div>
          ) : (
            !starting && !editing && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded p-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
              >✕</button>
            )
          )}
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className="mt-1 flex flex-col gap-2 rounded-lg bg-subtle border border-border p-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-faint">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded border border-border bg-input px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-faint">Goal</label>
            <input
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
              placeholder="Sprint goal (optional)"
              className="w-full rounded border border-border bg-input px-2 py-1.5 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-faint">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-border bg-input px-2 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-faint">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-border bg-input px-2 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEditing(false); setEditName(sprint.name); setEditGoal(sprint.goal ?? '') }}
              className="rounded px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!editName.trim()) return
                onEdit(sprint.id, { name: editName.trim(), goal: editGoal, startDate, endDate })
                setEditing(false)
              }}
              className="rounded px-3 py-1 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Inline start form */}
      {starting && (
        <div className="mt-1 flex flex-col gap-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 p-3">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400">Set sprint dates</p>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-faint">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-border bg-input px-2 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-faint">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-border bg-input px-2 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setStarting(false)}
              className="rounded px-3 py-1 text-xs text-muted-foreground hover:bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStart}
              className="rounded px-3 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Confirm Start
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
