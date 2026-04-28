import { STATUSES, PRIORITIES, TYPES, EPICS } from '@/lib/projects/constants'

export function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status) ?? STATUSES[0]
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.color}`}>{s.label}</span>
}

export function PriorityDot({ priority }: { priority: string }) {
  const p = PRIORITIES.find((x) => x.value === priority) ?? PRIORITIES[1]
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className={`inline-block w-2 h-2 rounded-full ${p.dot}`} />
      {p.label}
    </span>
  )
}

export function TypeIcon({ type }: { type: string }) {
  const t = TYPES.find((x) => x.value === type)
  return <span title={t?.label} className="text-sm leading-none">{t?.icon ?? '☑'}</span>
}

export function EpicBadge({ epic }: { epic: string | null }) {
  if (!epic) return null
  const e = EPICS.find((x) => x.value === epic)
  if (!e) return null
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${e.color}`}>
      {e.label}
    </span>
  )
}

export function EpicDot({ epic }: { epic: string | null }) {
  if (!epic) return null
  const e = EPICS.find((x) => x.value === epic)
  if (!e) return null
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${e.dot}`} title={e.label} />
}
