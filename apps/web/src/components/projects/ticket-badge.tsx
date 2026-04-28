import { STATUSES, PRIORITIES, TYPES } from '@/lib/projects/constants'

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
