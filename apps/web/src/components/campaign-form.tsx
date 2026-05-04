'use client'

import { useState, useTransition } from 'react'
import { updateCampaignConfigAction } from '@/app/actions/campaign'
import type { CampaignConfig } from '@/lib/db/campaign'

export function CampaignForm({
  config,
  activeCount,
  pendingCount,
}: {
  config: CampaignConfig | null
  activeCount: number
  pendingCount: number
}) {
  const [isActive, setIsActive] = useState(config?.isActive ?? false)
  const [userLimit, setUserLimit] = useState(config?.userLimit ?? 100)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await updateCampaignConfigAction({ isActive, userLimit })
      setSaved(true)
    })
  }

  const spotsRemaining = Math.max(0, userLimit - activeCount)
  const pct = userLimit > 0 ? Math.min((activeCount / userLimit) * 100, 100) : 0

  return (
    <div className="flex flex-col gap-6">

      {/* Stats bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">User capacity</span>
          <span className="text-xs text-muted-foreground">
            {activeCount} active · {pendingCount} pending · {userLimit} limit
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-faint">
          <span>{spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} remaining</span>
          <span>{Math.round(pct)}% full</span>
        </div>
        {pendingCount > 0 && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
            {pendingCount} user{pendingCount !== 1 ? 's' : ''} on the waitlist.{' '}
            Raise the limit to auto-approve them in order of signup.
          </p>
        )}
      </div>

      {/* Config */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-foreground">Configuration</h2>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Campaign active</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isActive
                ? 'New users can sign up. Those beyond the limit are waitlisted.'
                : 'Signups are completely closed. New visitors see a "closed" message.'}
            </p>
          </div>
          <button
            onClick={() => setIsActive((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              isActive ? 'bg-blue-600' : 'bg-muted'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Limit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            User limit
          </label>
          <p className="text-xs text-muted-foreground">
            Maximum number of active users. Raising this auto-approves pending users oldest-first.
          </p>
          <input
            type="number"
            min={1}
            value={userLimit}
            onChange={(e) => setUserLimit(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-32 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
          {saved && !isPending && (
            <span className="text-xs text-emerald-500">Saved ✓</span>
          )}
        </div>
      </div>
    </div>
  )
}
