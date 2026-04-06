'use client'

import { useState, useEffect, useCallback } from 'react'

export type TimerState = {
  remaining: number   // seconds left
  active: boolean
  enabled: boolean    // user toggle
  fired: boolean      // true when countdown hits 0
}

export function useTimer(durationSeconds: number) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [fired, setFired] = useState(false)

  useEffect(() => {
    if (!active || !enabled || remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setActive(false)
          setFired(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, enabled, remaining])

  const start = useCallback(() => {
    setFired(false)
    setActive(true)
  }, [])

  const stop = useCallback(() => setActive(false), [])

  const addTime = useCallback((seconds: number) => {
    setRemaining((r) => r + seconds)
    setFired(false)
    setActive(true)
  }, [])

  const reset = useCallback(() => {
    setRemaining(durationSeconds)
    setActive(false)
    setFired(false)
  }, [durationSeconds])

  const toggleEnabled = useCallback(() => {
    setEnabled((e) => {
      if (e) setActive(false) // pause when disabling
      return !e
    })
  }, [])

  const fmt = formatTime(remaining)

  return { remaining, active, enabled, fired, fmt, start, stop, addTime, reset, toggleEnabled }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
