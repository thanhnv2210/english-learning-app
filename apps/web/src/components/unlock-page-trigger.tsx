'use client'

import { useEffect, useRef } from 'react'
import { unlockPageAction } from '@/app/actions/user'

export function UnlockPageTrigger({ href }: { href: string }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    unlockPageAction(href)
  }, [href])
  return null
}
