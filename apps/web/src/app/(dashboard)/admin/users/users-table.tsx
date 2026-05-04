'use client'

import { useState, useTransition } from 'react'
import { updateUserTierAction, updateUserModelPreferenceAction, approveUserAction } from '@/app/actions/admin'
import type { UserRow } from './page'

function Avatar({ image, name, email }: { image: string | null; name: string | null; email: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="h-8 w-8 rounded-full ring-1 ring-border shrink-0" />
  }
  return (
    <div className="h-8 w-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
      {(name || email)[0].toUpperCase()}
    </div>
  )
}

function TierBadge({
  userId,
  tier,
}: {
  userId: number
  tier: string
}) {
  const [optimistic, setOptimistic] = useState(tier)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = optimistic === 'vip' ? 'free' : 'vip'
    setOptimistic(next)
    startTransition(() => updateUserTierAction(userId, next as 'free' | 'vip'))
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title="Click to toggle tier"
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        optimistic === 'vip'
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40'
          : 'bg-subtle text-muted-foreground hover:bg-subtle/80'
      }`}
    >
      {optimistic === 'vip' ? '★ VIP' : 'Free'}
    </button>
  )
}

function ModelBadge({
  userId,
  preference,
}: {
  userId: number
  preference: string
}) {
  const [optimistic, setOptimistic] = useState(preference)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = optimistic === 'auto' ? 'free' : 'auto'
    setOptimistic(next)
    startTransition(() => updateUserModelPreferenceAction(userId, next as 'auto' | 'free'))
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title="Click to toggle model preference"
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        optimistic === 'auto'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          : 'bg-subtle text-muted-foreground hover:bg-subtle/80'
      }`}
    >
      {optimistic === 'auto' ? 'Cloud' : 'Ollama'}
    </button>
  )
}

function StatusBadge({ userId, status }: { userId: number; status: string }) {
  const [optimistic, setOptimistic] = useState(status)
  const [pending, startTransition] = useTransition()

  function approve() {
    setOptimistic('active')
    startTransition(() => approveUserAction(userId))
  }

  if (optimistic === 'pending') {
    return (
      <button
        onClick={approve}
        disabled={pending}
        title="Click to approve"
        className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40 px-2.5 py-0.5 text-xs font-semibold transition-colors disabled:opacity-50"
      >
        ⏳ Pending
      </button>
    )
  }
  return (
    <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-semibold">
      ✓ Active
    </span>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

function formatProfile(profile: string) {
  if (profile === 'Business_Fluent') return 'Business'
  const m = profile.match(/(\d+\.?\d*)$/)
  return m ? `IELTS ${m[1]}` : profile
}

export function UsersTable({ users }: { users: UserRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-subtle">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">Tier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">Model</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-faint">Target</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-faint">Mistakes</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-faint">Practice</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-faint">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-subtle transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar image={u.image} name={u.name} email={u.email} />
                    <div className="min-w-0">
                      {u.name && <p className="text-sm font-medium text-foreground truncate">{u.name}</p>}
                      <p className={`truncate ${u.name ? 'text-xs text-faint' : 'text-sm text-foreground'}`}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge userId={u.id} status={u.status} />
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    u.authProvider === 'google' ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                  }`}>
                    {u.authProvider === 'google' ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 48 48" fill="none">
                          <path d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.6-4.9 7.3v6.1h7.9c4.7-4.3 7.3-10.6 7.3-17.5z" fill="#4285F4"/>
                          <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6.1c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.1-9.6H2.6v6.3C6.6 42.6 14.7 48 24 48z" fill="#34A853"/>
                          <path d="M10.9 28.8A14.5 14.5 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7v-6.3H2.6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.3-6z" fill="#FBBC05"/>
                          <path d="M24 9.7c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.6 30.5 0 24 0 14.7 0 6.6 5.4 2.6 13.3l8.3 6.3C12.7 13.8 17.9 9.7 24 9.7z" fill="#EA4335"/>
                        </svg>
                        Google
                      </>
                    ) : (
                      <>🔑 Admin</>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <TierBadge userId={u.id} tier={u.tier} />
                </td>
                <td className="px-4 py-3">
                  <ModelBadge userId={u.id} preference={u.modelPreference} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatProfile(u.targetProfile)}</td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground">{u.wrongDecisionCount}</td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground">{u.practiceSessionCount}</td>
                <td className="px-4 py-3 text-right text-xs text-faint whitespace-nowrap">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {users.map((u) => (
          <div key={u.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar image={u.image} name={u.name} email={u.email} />
              <div className="min-w-0 flex-1">
                {u.name && <p className="text-sm font-medium text-foreground truncate">{u.name}</p>}
                <p className="text-xs text-faint truncate">{u.email}</p>
              </div>
              <span className="text-xs text-faint">{formatDate(u.createdAt)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge userId={u.id} status={u.status} />
              <TierBadge userId={u.id} tier={u.tier} />
              <ModelBadge userId={u.id} preference={u.modelPreference} />
              <span className="text-xs text-muted-foreground">{formatProfile(u.targetProfile)}</span>
              <span className="text-xs text-faint ml-auto">
                {u.wrongDecisionCount} mistakes · {u.practiceSessionCount} sessions
              </span>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="py-16 text-center text-sm text-faint">No users yet.</div>
      )}
    </div>
  )
}
