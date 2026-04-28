import Link from 'next/link'
import { getDefaultProject, getCurrentSprint, getSprintTickets } from '@/lib/db/projects'
import { KanbanBoard } from '@/components/projects/kanban-board'

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDaysRemaining(endDate: Date | string): number {
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function BoardPage() {
  const project = await getDefaultProject()
  const sprint = await getCurrentSprint(project.id)

  if (!sprint) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-16 flex flex-col items-center gap-3 text-center">
        <p className="text-3xl">🏃</p>
        <p className="text-sm font-semibold text-foreground">No sprints yet</p>
        <p className="text-xs text-faint">Create a sprint and add tickets to get started.</p>
        <Link href="/projects/sprints" className="text-sm font-medium text-blue-500 hover:text-blue-700">
          Go to Sprints →
        </Link>
      </div>
    )
  }

  const tickets = await getSprintTickets(sprint.id)

  const daysRemaining = sprint.endDate ? getDaysRemaining(sprint.endDate) : null
  const isOverdue = daysRemaining !== null && daysRemaining < 0

  return (
    <div className="flex flex-col gap-4">

      {/* Sprint info bar */}
      <div className={`rounded-lg border px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${
        sprint.status === 'planning'
          ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/40'
          : isOverdue
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/40'
            : 'bg-card border-border'
      }`}>

        {/* Left: name + goal */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
              sprint.status === 'planning'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {sprint.status}
            </span>
            <span className="text-sm font-semibold text-foreground truncate">{sprint.name}</span>
          </div>
          {sprint.goal && (
            <p className="text-xs text-muted-foreground truncate">{sprint.goal}</p>
          )}
        </div>

        {/* Right: dates + countdown */}
        <div className="flex items-center gap-4 shrink-0">
          {(sprint.startDate || sprint.endDate) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {sprint.startDate && <span>{formatDate(sprint.startDate)}</span>}
              {sprint.startDate && sprint.endDate && <span className="text-faint">→</span>}
              {sprint.endDate && <span>{formatDate(sprint.endDate)}</span>}
            </div>
          )}

          {sprint.status === 'active' && daysRemaining !== null && (
            <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
              isOverdue
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : daysRemaining <= 2
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
              {isOverdue
                ? `${Math.abs(daysRemaining)}d overdue`
                : daysRemaining === 0
                  ? 'Due today'
                  : `${daysRemaining}d left`}
            </span>
          )}

          {sprint.status === 'planning' && (
            <Link
              href="/projects/sprints"
              className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 hover:underline"
            >
              Start sprint →
            </Link>
          )}
        </div>
      </div>

      <KanbanBoard sprint={sprint} initialTickets={tickets} projectId={project.id} />
    </div>
  )
}
