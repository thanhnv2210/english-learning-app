import { notFound } from 'next/navigation'
import { getTicketByKey, getComments, getSprints, getProjectEpics } from '@/lib/db/projects'
import { getCompletionsForTicket } from '@/lib/db/ticket-completions'
import { EpicsProvider } from '@/lib/projects/epics-context'
import { getEpicColor } from '@/lib/projects/epic-colors'
import { TicketDetail } from './ticket-detail'

export default async function TicketPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const ticket = await getTicketByKey(key)
  if (!ticket) notFound()

  const [comments, sprints, rawEpics, completions] = await Promise.all([
    getComments(ticket.id),
    getSprints(ticket.projectId),
    getProjectEpics(ticket.projectId),
    getCompletionsForTicket(ticket.id),
  ])

  const customEpics = rawEpics.map((e) => ({
    value: e.value,
    label: e.label,
    dbId: e.id,
    ...getEpicColor(e.colorKey),
  }))

  const activeSprints = sprints.filter((s) => s.status === 'planning' || s.status === 'active')
  const ticketSprint = sprints.find((s) => s.id === ticket.sprintId) ?? null

  return (
    <EpicsProvider initialCustom={customEpics}>
      <TicketDetail
        ticket={ticket}
        initialComments={comments}
        sprints={activeSprints}
        projectId={ticket.projectId}
        initialCompletions={completions}
        ticketSprint={ticketSprint}
      />
    </EpicsProvider>
  )
}
