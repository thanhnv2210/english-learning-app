import { getDefaultProject, getActiveSprint } from '@/lib/db/projects'
import { ProjectTabs } from './project-tabs'

export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const project = await getDefaultProject()
  const activeSprint = await getActiveSprint(project.id)

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
          <p className="text-xs text-faint mt-0.5">
            {project.key} ·{' '}
            {activeSprint
              ? <span className="text-green-600 font-medium">Sprint: {activeSprint.name}</span>
              : <span>No active sprint</span>
            }
          </p>
        </div>

        <ProjectTabs />
      </div>

      {children}
    </div>
  )
}
