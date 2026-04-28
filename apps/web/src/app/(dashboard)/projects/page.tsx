import Link from 'next/link'
import { getDefaultProject, getActiveSprint, getSprintTickets } from '@/lib/db/projects'
import { KanbanBoard } from '@/components/projects/kanban-board'

export default async function BoardPage() {
  const project = await getDefaultProject()
  const sprint = await getActiveSprint(project.id)

  if (!sprint) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-16 flex flex-col items-center gap-3 text-center">
        <p className="text-3xl">🏃</p>
        <p className="text-sm font-semibold text-foreground">No active sprint</p>
        <p className="text-xs text-faint">Create and start a sprint to see the board.</p>
        <Link href="/projects/sprints" className="text-sm font-medium text-blue-500 hover:text-blue-700">
          Go to Sprints →
        </Link>
      </div>
    )
  }

  const tickets = await getSprintTickets(sprint.id)

  return (
    <div className="flex flex-col gap-4">
      {sprint.goal && (
        <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg px-3 py-2">
          <span className="font-semibold text-blue-700 dark:text-blue-400">Sprint goal: </span>
          {sprint.goal}
        </p>
      )}
      <KanbanBoard sprint={sprint} initialTickets={tickets} projectId={project.id} />
    </div>
  )
}
