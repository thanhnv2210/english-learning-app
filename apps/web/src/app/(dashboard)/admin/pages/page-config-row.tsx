'use client'

import { useState, useTransition } from 'react'
import { upsertPageConfigAction } from '@/app/actions/admin'
import { PAGE_TAGS, TAG_STYLES } from '@/lib/nav-config'
import type { NavItem } from '@/lib/nav-config'

export function PageConfigRow({
  item,
  currentTag,
  currentDisabled,
}: {
  item: NavItem
  currentTag: string | null
  currentDisabled: boolean
}) {
  const [tag, setTag] = useState<string | null>(currentTag)
  const [disabled, setDisabled] = useState(currentDisabled)
  const [isPending, startTransition] = useTransition()

  function save(newTag: string | null, newDisabled: boolean) {
    setTag(newTag)
    setDisabled(newDisabled)
    startTransition(async () => {
      await upsertPageConfigAction(item.href, newTag, newDisabled)
    })
  }

  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${disabled ? 'opacity-50' : ''}`}>
      {/* Icon + label */}
      <span className="w-6 text-center text-base shrink-0">{item.icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${disabled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {item.label}
        </p>
        <p className="text-[10px] text-faint">{item.href}</p>
      </div>

      {/* Tag selector */}
      <select
        value={tag ?? ''}
        disabled={isPending}
        onChange={(e) => save(e.target.value || null, disabled)}
        className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">No tag</option>
        {PAGE_TAGS.map((t) => (
          <option key={t} value={t}>
            {TAG_STYLES[t].label}
          </option>
        ))}
      </select>

      {/* Tag preview */}
      {tag && (
        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none ${TAG_STYLES[tag]?.className ?? ''}`}>
          {TAG_STYLES[tag]?.label}
        </span>
      )}

      {/* Disable toggle */}
      <label className="flex cursor-pointer items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground">{disabled ? 'Hidden' : 'Visible'}</span>
        <div
          onClick={() => save(tag, !disabled)}
          className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${disabled ? 'bg-red-500' : 'bg-emerald-500'}`}
        >
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${disabled ? 'translate-x-0.5' : 'translate-x-4'}`} />
        </div>
      </label>

      {isPending && <span className="text-[10px] text-faint shrink-0">Saving…</span>}
    </div>
  )
}
