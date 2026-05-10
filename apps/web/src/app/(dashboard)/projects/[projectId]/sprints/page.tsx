import { notFound } from 'next/navigation'
import { getProjectById, getSprints, getSprintStats } from '@/lib/db/projects'
import { SprintsView } from '../../sprints/sprints-view'

export default async function SprintsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const id = Number(projectId)
  if (isNaN(id)) notFound()

  const project = await getProjectById(id)
  if (!project) notFound()

  const sprints = await getSprints(project.id)
  const statsArr = await Promise.all(sprints.map((s) => getSprintStats(s.id)))
  const sprintStats = Object.fromEntries(sprints.map((s, i) => [s.id, statsArr[i]]))

  return (
    <SprintsView
      projectId={project.id}
      initialSprints={sprints}
      sprintStats={sprintStats}
    />
  )
}
