import { notFound } from 'next/navigation'
import { getTicketByKey, getComments, getSprints } from '@/lib/db/projects'
import { TicketDetail } from './ticket-detail'

export default async function TicketPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const ticket = await getTicketByKey(key)
  if (!ticket) notFound()

  const [comments, sprints] = await Promise.all([
    getComments(ticket.id),
    getSprints(ticket.projectId),
  ])

  return (
    <TicketDetail
      ticket={ticket}
      initialComments={comments}
      sprints={sprints.filter((s) => s.status === 'planning' || s.status === 'active')}
      projectId={ticket.projectId}
    />
  )
}
