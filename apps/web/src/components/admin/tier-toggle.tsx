'use client'

import { useTransition } from 'react'
import { updateUserTierAction } from '@/app/actions/admin'

export function TierToggle({ userId, tier }: { userId: number; tier: string }) {
  const [isPending, startTransition] = useTransition()
  const isVip = tier === 'vip'

  function toggle() {
    startTransition(async () => {
      await updateUserTierAction(userId, isVip ? 'free' : 'vip')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        isVip
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-muted text-muted-foreground'
      }`}>
        {isVip ? 'VIP' : 'Free'}
      </span>
      <button
        onClick={toggle}
        disabled={isPending}
        className="text-[10px] font-medium text-blue-500 hover:text-blue-400 disabled:opacity-40 transition-opacity"
      >
        {isPending ? '...' : isVip ? '↓ Free' : '↑ VIP'}
      </button>
    </div>
  )
}
