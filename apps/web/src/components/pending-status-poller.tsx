'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const POLL_INTERVAL_MS = 30_000

export function PendingStatusPoller() {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/user/status')
        if (!res.ok) return
        const { status } = await res.json()
        if (status === 'active') router.push('/dashboard')
      } catch {
        // network error — silently ignore, try again next interval
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(id)
  }, [router])

  return null
}
