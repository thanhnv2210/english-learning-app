'use client'

import { useState, useEffect } from 'react'

/**
 * Boolean state that persists in localStorage.
 * SSR-safe: reads from localStorage only after mount.
 */
export function useLocalBoolean(key: string, defaultValue: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? stored === 'true' : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try { localStorage.setItem(key, String(value)) } catch { /* ignore */ }
  }, [key, value])

  return [value, setValue]
}
