'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ielts-cheat-sheet-dismissed'

export function CheatSheetBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg">🗺️</span>
        <div>
          <p className="text-sm font-semibold text-foreground">New here? Start with the Cheat Sheet</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Maps every tool in the app to a specific IELTS problem. Useful to read before your first session.
          </p>
          <Link
            href="/cheat-sheet"
            className="mt-2 inline-block text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open Cheat Sheet →
          </Link>
        </div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-faint hover:text-muted-foreground transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
