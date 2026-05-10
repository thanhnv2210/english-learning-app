import { notFound } from 'next/navigation'
import { getProjectById, getBacklogTickets, getTemplates, getSprints } from '@/lib/db/projects'
import { BacklogView } from '../../backlog/backlog-view'

export default async function BacklogPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const id = Number(projectId)
  if (isNaN(id)) notFound()

  const project = await getProjectById(id)
  if (!project) notFound()

  const [backlog, templates, sprints] = await Promise.all([
    getBacklogTickets(project.id),
    getTemplates(project.id),
    getSprints(project.id),
  ])

  const planningSprints = sprints.filter((s) => s.status === 'planning' || s.status === 'active')

  return (
    <BacklogView
      projectId={project.id}
      initialBacklog={backlog}
      initialTemplates={templates}
      sprints={planningSprints}
    />
  )
}
