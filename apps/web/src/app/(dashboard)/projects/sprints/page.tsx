import { getDefaultProject, getSprints } from '@/lib/db/projects'
import { SprintsView } from './sprints-view'

export default async function SprintsPage() {
  const project = await getDefaultProject()
  const sprints = await getSprints(project.id)

  return <SprintsView projectId={project.id} initialSprints={sprints} />
}
