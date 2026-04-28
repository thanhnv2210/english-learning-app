import { getDefaultProject, getBacklogTickets, getTemplates, getSprints } from '@/lib/db/projects'
import { BacklogView } from './backlog-view'

export default async function BacklogPage() {
  const project = await getDefaultProject()
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
