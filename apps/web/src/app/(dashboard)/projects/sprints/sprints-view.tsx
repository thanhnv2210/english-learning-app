'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  createSprintAction,
  updateSprintStatusAction,
  deleteSprintAction,
} from '@/app/actions/projects'
import type { Sprint } from '@/lib/db/projects'

type Props = {
  projectId: number
  initialSprints: Sprint[]
}

export function SprintsView({ projectId, initialSprints }: Props) {
  const [sprints, setSprints] = useState(initialSprints)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [, startTransition] = useTransition()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    startTransition(async () => {
      const created = await createSprintAction({ projectId, name: name.trim(), goal: goal.trim() || undefined })
      setSprints((prev) => [created, ...prev])
    })
    setName('')
    setGoal('')
    setShowForm(false)
  }

  function handleStatus(id: number, status: Sprint['status']) {
    setSprints((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
    startTransition(() => updateSprintStatusAction(id, status))
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
          onStatus={handleStatus}
          onDelete={handleDelete}
          labelClass="text-green-600 dark:text-green-400"
        />
      )}

      {/* Planning */}
      <SprintGroup
        label="Planning"
        sprints={planning}
        onStatus={handleStatus}
        onDelete={handleDelete}
        emptyText="No sprints in planning."
      />

      {/* Completed */}
      {completed.length > 0 && (
        <SprintGroup
          label="Completed"
          sprints={completed}
          onStatus={handleStatus}
          onDelete={handleDelete}
          labelClass="text-muted-foreground"
          collapsed
        />
      )}
    </div>
  )
}

// ── SprintGroup ───────────────────────────────────────────────────────────────

function SprintGroup({
  label, sprints, onStatus, onDelete, labelClass = '', emptyText, collapsed = false,
}: {
  label: string
  sprints: Sprint[]
  onStatus: (id: number, status: Sprint['status']) => void
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
            <SprintCard key={sprint.id} sprint={sprint} onStatus={onStatus} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── SprintCard ────────────────────────────────────────────────────────────────

function SprintCard({
  sprint, onStatus, onDelete,
}: {
  sprint: Sprint
  onStatus: (id: number, status: Sprint['status']) => void
  onDelete: (id: number) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const statusColors: Record<Sprint['status'], string> = {
    planning:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    active:    'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
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
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/projects"
            className="rounded px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Board →
          </Link>

          {sprint.status === 'planning' && (
            <button
              onClick={() => onStatus(sprint.id, 'active')}
              className="rounded px-2 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Start
            </button>
          )}
          {sprint.status === 'active' && (
            <button
              onClick={() => onStatus(sprint.id, 'completed')}
              className="rounded px-2 py-1 text-xs font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Complete
            </button>
          )}

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(sprint.id)}
                className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600"
              >Yes</button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded p-1 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
            >✕</button>
          )}
        </div>
      </div>
    </div>
  )
}
