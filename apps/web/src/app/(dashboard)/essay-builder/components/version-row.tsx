'use client'

import { useState } from 'react'
import type { EssayBuilderRecord } from '@/lib/db/essay-builder'

export function VersionRow({
  version,
  index,
  isActive,
  onSelect,
  onDelete,
}: {
  version: EssayBuilderRecord
  index: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'hover:bg-muted border border-transparent'
      }`}
      onClick={onSelect}
    >
      <span className={`text-xs font-semibold shrink-0 w-5 text-center ${isActive ? 'text-blue-600' : 'text-faint'}`}>
        v{index}
      </span>
      <span className="text-xs text-foreground truncate flex-1">{version.topic}</span>
      <span className="text-xs text-faint shrink-0">{new Date(version.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      {confirmDelete ? (
        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={onDelete} className="rounded px-1.5 py-0.5 text-xs bg-red-500 text-white hover:bg-red-600">Yes</button>
          <button onClick={() => setConfirmDelete(false)} className="rounded px-1.5 py-0.5 text-xs bg-subtle text-muted-foreground hover:bg-border">No</button>
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
          className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-faint hover:bg-red-100 hover:text-red-500 text-xs transition-colors"
        >✕</button>
      )}
    </div>
  )
}
