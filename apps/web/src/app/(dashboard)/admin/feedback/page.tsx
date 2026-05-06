import { db } from '@/lib/db'
import { feedbacks, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { FeedbackItem } from './feedback-item'

export const dynamic = 'force-dynamic'

export default async function AdminFeedbackPage() {
  const rows = await db
    .select({
      id: feedbacks.id,
      type: feedbacks.type,
      message: feedbacks.message,
      status: feedbacks.status,
      adminNote: feedbacks.adminNote,
      createdAt: feedbacks.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(feedbacks)
    .leftJoin(users, eq(feedbacks.userId, users.id))
    .orderBy(desc(feedbacks.createdAt))

  const newCount = rows.filter((r) => r.status === 'new').length
  const readCount = rows.filter((r) => r.status === 'read').length
  const resolvedCount = rows.filter((r) => r.status === 'resolved').length

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Admin
          </span>
          {newCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {newCount} new
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bug reports, suggestions, and questions from users.
        </p>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm">
          <span className="text-blue-500 font-semibold">{newCount} new</span>
          <span className="text-amber-500 font-semibold">{readCount} read</span>
          <span className="text-emerald-500 font-semibold">{resolvedCount} resolved</span>
          <span className="text-faint">{rows.length} total</span>
        </div>
      </div>

      {/* Feedback list */}
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-3xl mb-3">💬</p>
          <p className="text-sm text-muted-foreground">No feedback yet. Share the feedback link with your beta users.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {rows.map((row) => (
            <FeedbackItem key={row.id} item={row} />
          ))}
        </div>
      )}
    </div>
  )
}
