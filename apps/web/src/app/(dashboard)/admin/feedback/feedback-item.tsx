'use client'

import { useState, useTransition } from 'react'
import { updateFeedbackStatusAction } from '@/app/actions/feedback'

const STATUS_CONFIG = {
  new:      { label: 'New',      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  read:     { label: 'Read',     className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  resolved: { label: 'Resolved', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; className: string }> = {
  bug:        { icon: '🐛', label: 'Bug',        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  suggestion: { icon: '💡', label: 'Suggestion', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  question:   { icon: '❓', label: 'Question',   className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  praise:     { icon: '🙏', label: 'Praise',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

type FeedbackRow = {
  id: number
  type: string
  message: string
  status: string
  adminNote: string | null
  createdAt: Date
  userName: string | null
  userEmail: string | null
}

export function FeedbackItem({ item }: { item: FeedbackRow }) {
  const [status, setStatus] = useState(item.status)
  const [adminNote, setAdminNote] = useState(item.adminNote ?? '')
  const [expanded, setExpanded] = useState(item.status === 'new')
  const [isPending, startTransition] = useTransition()

  const typeConfig = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.suggestion
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.new

  function updateStatus(newStatus: string) {
    setStatus(newStatus)
    startTransition(async () => {
      await updateFeedbackStatusAction(item.id, newStatus, adminNote || undefined)
    })
  }

  function saveNote() {
    startTransition(async () => {
      await updateFeedbackStatusAction(item.id, status, adminNote || undefined)
    })
  }

  return (
    <div className={`border-b border-border last:border-0 transition-colors ${status === 'resolved' ? 'opacity-60' : ''}`}>
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-subtle transition-colors"
      >
        <span className="text-xl shrink-0 mt-0.5">{typeConfig.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${typeConfig.className}`}>
              {typeConfig.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
            {status === 'new' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
            <span className="text-xs text-faint ml-auto">{relativeTime(item.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{item.message}</p>
          {item.userName && (
            <p className="text-xs text-muted-foreground mt-0.5">{item.userName} · {item.userEmail}</p>
          )}
        </div>
        <span className={`text-xs text-faint shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 flex flex-col gap-3 ml-9">
          {/* Full message */}
          <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground whitespace-pre-wrap">
            {item.message}
          </div>

          {/* Admin note */}
          <div className="flex gap-2">
            <input
              type="text"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Internal note (not shown to user)…"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={saveNote}
              disabled={isPending}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Save note
            </button>
          </div>

          {/* Status actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-faint">Mark as:</span>
            {(['new', 'read', 'resolved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={isPending || status === s}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors disabled:opacity-40 ${
                  status === s
                    ? STATUS_CONFIG[s].className + ' opacity-100'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
            {isPending && <span className="text-[10px] text-faint">Saving…</span>}
          </div>
        </div>
      )}
    </div>
  )
}
