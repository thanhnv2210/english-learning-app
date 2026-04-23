'use client'

import { useTransition } from 'react'
import { updateTargetProfileAction } from '@/app/actions/user'

type TargetProfileValue = 'IELTS_Academic_6.5' | 'IELTS_Academic_7.5' | 'Business_Fluent'

const PROFILES: {
  value: TargetProfileValue
  label: string
  band: string
  description: string
  color: string
}[] = [
  {
    value: 'IELTS_Academic_6.5',
    label: 'IELTS Academic',
    band: 'Band 6.5',
    description: 'Competent user — can handle complex language and understand detailed reasoning with occasional inaccuracies.',
    color: 'blue',
  },
  {
    value: 'IELTS_Academic_7.5',
    label: 'IELTS Academic',
    band: 'Band 7.5',
    description: 'Good user — handles complex language well with only occasional unsystematic inaccuracies.',
    color: 'purple',
  },
  {
    value: 'Business_Fluent',
    label: 'Business Fluent',
    band: 'Professional',
    description: 'Focus on professional register, clarity, and conciseness for workplace communication.',
    color: 'green',
  },
]

const COLOR_MAP: Record<string, { ring: string; bg: string; badge: string; dot: string }> = {
  blue:   { ring: 'ring-blue-500',   bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  purple: { ring: 'ring-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  green:  { ring: 'ring-green-500',  bg: 'bg-green-50',  badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
}

export function SettingsForm({ currentProfile }: { currentProfile: string }) {
  const [isPending, startTransition] = useTransition()

  function select(profile: TargetProfileValue) {
    if (profile === currentProfile) return
    startTransition(() => updateTargetProfileAction(profile))
  }

  return (
    <div className="flex flex-col gap-3">
      {PROFILES.map((p) => {
        const active = currentProfile === p.value
        const c = COLOR_MAP[p.color]
        return (
          <button
            key={p.value}
            onClick={() => select(p.value)}
            disabled={isPending}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              active
                ? `border-transparent ring-2 ${c.ring} ${c.bg}`
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            } disabled:opacity-60`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{p.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.badge}`}>
                    {p.band}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
              </div>
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                active ? `border-transparent ${c.dot}` : 'border-gray-300 bg-white'
              }`} />
            </div>
          </button>
        )
      })}

      {isPending && (
        <p className="text-xs text-gray-400 text-center">Saving…</p>
      )}
    </div>
  )
}
