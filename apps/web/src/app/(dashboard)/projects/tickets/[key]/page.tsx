import { notFound } from 'next/navigation'
import { getTicketByKey, getComments, getSprints, getProjectEpics } from '@/lib/db/projects'
import { EpicsProvider } from '@/lib/projects/epics-context'
import { getEpicColor } from '@/lib/projects/epic-colors'
import { TicketDetail } from './ticket-detail'

export default async function TicketPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const ticket = await getTicketByKey(key)
  if (!ticket) notFound()

  const [comments, sprints, rawEpics] = await Promise.all([
    getComments(ticket.id),
    getSprints(ticket.projectId),
    getProjectEpics(ticket.projectId),
  ])

  const customEpics = rawEpics.map((e) => ({
    value: e.value,
    label: e.label,
    dbId: e.id,
    ...getEpicColor(e.colorKey),
  }))

  return (
    <EpicsProvider initialCustom={customEpics}>
      <TicketDetail
        ticket={ticket}
        initialComments={comments}
        sprints={sprints.filter((s) => s.status === 'planning' || s.status === 'active')}
        projectId={ticket.projectId}
      />
    </EpicsProvider>
  )
}
