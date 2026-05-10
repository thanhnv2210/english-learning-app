import { getAllProjects, getActiveSprint } from '@/lib/db/projects'
import { ProjectList } from './project-list-client'

export default async function ProjectsPage() {
  const allProjects = await getAllProjects()
  const activeSprints = await Promise.all(allProjects.map((p) => getActiveSprint(p.id)))
  const items = allProjects.map((p, i) => ({ ...p, activeSprint: activeSprints[i] }))

  return <ProjectList initialProjects={items} />
}
