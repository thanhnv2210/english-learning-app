import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectById, getActiveSprint, getProjectEpics } from '@/lib/db/projects'
import { ProjectTabs } from '../project-tabs'
import { EpicsProvider } from '@/lib/projects/epics-context'
import { getEpicColor } from '@/lib/projects/epic-colors'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const id = Number(projectId)
  if (isNaN(id)) notFound()

  const project = await getProjectById(id)
  if (!project) notFound()

  const [activeSprint, rawEpics] = await Promise.all([
    getActiveSprint(project.id),
    getProjectEpics(project.id),
  ])

  const customEpics = rawEpics.map((e) => ({
    value: e.value,
    label: e.label,
    dbId: e.id,
    ...getEpicColor(e.colorKey),
  }))

  return (
    <EpicsProvider initialCustom={customEpics}>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link
              href="/projects"
              className="text-xs text-faint hover:text-blue-500 transition-colors"
            >
              ← Projects
            </Link>
            <h1 className="text-xl font-bold text-foreground mt-0.5">{project.name}</h1>
            <p className="text-xs text-faint mt-0.5">
              {project.key} ·{' '}
              {activeSprint ? (
                <span className="text-green-600 font-medium">Sprint: {activeSprint.name}</span>
              ) : (
                <span>No active sprint</span>
              )}
            </p>
          </div>

          <ProjectTabs projectId={project.id} />
        </div>

        {children}
      </div>
    </EpicsProvider>
  )
}
