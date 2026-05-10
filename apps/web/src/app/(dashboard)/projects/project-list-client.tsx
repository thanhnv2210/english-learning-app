'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createProjectAction, deleteProjectAction } from '@/app/actions/projects'
import type { Project, Sprint } from '@/lib/db/projects'

type ProjectWithSprint = Project & { activeSprint: Sprint | null }

export function ProjectList({ initialProjects }: { initialProjects: ProjectWithSprint[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [description, setDescription] = useState('')
  const [, startTransition] = useTransition()

  function suggestKey(n: string) {
    const words = n.toUpperCase().replace(/[^A-Z0-9 ]/g, '').split(' ').filter(Boolean)
    if (words.length >= 2) return words.map((w) => w[0]).join('').slice(0, 4)
    return n.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  }

  function handleNameChange(v: string) {
    setName(v)
    setKey(suggestKey(v))
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !key.trim()) return
    const optimistic: ProjectWithSprint = {
      id: Date.now(),
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim() || null,
      ticketCounter: 0,
      createdAt: new Date(),
      activeSprint: null,
    }
    setProjects((prev) => [...prev, optimistic])
    setName(''); setKey(''); setDescription('')
    setShowForm(false)
    startTransition(async () => {
      const created = await createProjectAction({
        name: optimistic.name,
        key: optimistic.key,
        description: optimistic.description ?? undefined,
      })
      setProjects((prev) =>
        prev.map((p) => (p.id === optimistic.id ? { ...created, activeSprint: null } : p)),
      )
    })
  }

  function handleDelete(id: number) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    startTransition(() => deleteProjectAction(id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-xs text-faint mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          + New project
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-faint">Project name</label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My IELTS Project"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
                autoFocus
              />
            </div>
            <div className="w-28 flex flex-col gap-1">
              <label className="text-xs text-faint">Key</label>
              <input
                value={key}
                onChange={(e) =>
                  setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
                }
                placeholder="PROJ"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-mono text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !key.trim()}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 flex flex-col items-center gap-3 text-center">
          <p className="text-3xl">📋</p>
          <p className="text-sm font-semibold text-foreground">No projects yet</p>
          <p className="text-xs text-faint">
            Create a project to start tracking your IELTS study goals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: ProjectWithSprint
  onDelete: (id: number) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="group rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 text-[10px] font-mono font-semibold self-start">
            {project.key}
          </span>
          <h2 className="text-sm font-semibold text-foreground mt-1 truncate">{project.name}</h2>
          {project.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
          )}
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onDelete(project.id)}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-subtle"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      <div className="text-xs text-faint">
        {project.activeSprint ? (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ● {project.activeSprint.name}
          </span>
        ) : (
          <span>No active sprint</span>
        )}
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="mt-auto rounded-lg border border-border bg-subtle px-3 py-1.5 text-xs font-medium text-foreground text-center hover:bg-muted transition-colors"
      >
        Open →
      </Link>
    </div>
  )
}
