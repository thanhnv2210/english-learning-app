'use client'

import { useOptimistic, useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTargetProfileAction, updateModelPreferenceAction, updateShowSystemDataAction } from '@/app/actions/user'
import { useTheme } from '@/components/theme-provider'

type TargetProfileValue = 'IELTS_Academic_5' | 'IELTS_Academic_5.5' | 'IELTS_Academic_6' | 'IELTS_Academic_6.5' | 'IELTS_Academic_7' | 'Business_Fluent'

const PROFILES: {
  value: TargetProfileValue
  label: string
  band: string
  description: string
  color: string
}[] = [
  {
    value: 'IELTS_Academic_5',
    label: 'IELTS Academic',
    band: 'Band 5',
    description: 'Modest user — partial command of the language, able to handle overall meaning in most situations.',
    color: 'gray',
  },
  {
    value: 'IELTS_Academic_5.5',
    label: 'IELTS Academic',
    band: 'Band 5.5',
    description: 'Modest user — partial grasp of overall meaning with frequent problems in unfamiliar situations.',
    color: 'orange',
  },
  {
    value: 'IELTS_Academic_6',
    label: 'IELTS Academic',
    band: 'Band 6',
    description: 'Competent user — generally effective command despite inaccuracies and misunderstandings.',
    color: 'yellow',
  },
  {
    value: 'IELTS_Academic_6.5',
    label: 'IELTS Academic',
    band: 'Band 6.5',
    description: 'Competent user — can handle complex language and understand detailed reasoning with occasional inaccuracies.',
    color: 'blue',
  },
  {
    value: 'IELTS_Academic_7',
    label: 'IELTS Academic',
    band: 'Band 7',
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
  gray:   { ring: 'ring-gray-400',   bg: 'bg-gray-50 dark:bg-gray-900/20',   badge: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',   dot: 'bg-gray-400' },
  orange: { ring: 'ring-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
  yellow: { ring: 'ring-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  blue:   { ring: 'ring-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',   dot: 'bg-blue-500' },
  purple: { ring: 'ring-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
  green:  { ring: 'ring-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',  badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',  dot: 'bg-green-500' },
}

const THEMES = [
  { value: 'light' as const, label: 'Light', icon: '☀️' },
  { value: 'dark'  as const, label: 'Dark',  icon: '🌙' },
]

const MODEL_OPTIONS: { value: 'auto' | 'free'; label: string; description: string }[] = [
  {
    value: 'auto',
    label: 'Auto (VIP)',
    description: 'Use Claude — fast model for generation, Sonnet for scoring.',
  },
  {
    value: 'free',
    label: 'Simulate Free Tier',
    description: 'Use local Ollama for all AI calls — same experience as free users.',
  },
]

export function SettingsForm({
  currentProfile,
  tier,
  modelPreference,
  showSystemData,
}: {
  currentProfile: string
  tier: string
  modelPreference: 'auto' | 'free'
  showSystemData: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [optimisticPref, setOptimisticPref] = useOptimistic(modelPreference)
  const [optimisticSystemData, setOptimisticSystemData] = useOptimistic(showSystemData)
  const [savedProfile, setSavedProfile] = useState<TargetProfileValue>(currentProfile as TargetProfileValue)
  const [pendingProfile, setPendingProfile] = useState<TargetProfileValue | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleProfileChange(profile: TargetProfileValue) {
    if (profile === savedProfile) { setPendingProfile(null); return }
    setPendingProfile(profile)
  }

  function confirmSave() {
    if (!pendingProfile) return
    setShowConfirm(false)
    startTransition(async () => {
      await updateTargetProfileAction(pendingProfile)
      setSavedProfile(pendingProfile)
      setPendingProfile(null)
    })
  }

  function selectModelPref(pref: 'auto' | 'free') {
    if (pref === optimisticPref) return
    startTransition(async () => {
      setOptimisticPref(pref)
      await updateModelPreferenceAction(pref)
    })
  }

  function toggleSystemData() {
    startTransition(async () => {
      setOptimisticSystemData(!optimisticSystemData)
      await updateShowSystemDataAction(!optimisticSystemData)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Theme */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Theme</h2>
        <div className="flex gap-3">
          {THEMES.map((t) => {
            const active = theme === t.value
            return (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? 'border-transparent ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-border bg-card text-muted-foreground hover:opacity-80'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Target Profile */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Target Profile</h2>
        {(() => {
          const displayValue = pendingProfile ?? savedProfile
          const displayed = PROFILES.find((p) => p.value === displayValue) ?? PROFILES[3]
          const c = COLOR_MAP[displayed.color]
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className={`relative flex-1 rounded-xl border-2 border-transparent ring-2 ${c.ring} ${c.bg} transition-all`}>
                  <select
                    value={displayValue}
                    disabled={isPending}
                    onChange={(e) => handleProfileChange(e.target.value as TargetProfileValue)}
                    className="w-full appearance-none bg-transparent px-4 py-3 pr-10 text-sm font-semibold text-foreground focus:outline-none disabled:opacity-60 cursor-pointer"
                  >
                    {PROFILES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label} — {p.band}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {pendingProfile && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={isPending}
                    className="shrink-0 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    Save
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground px-1">{displayed.description}</p>
              {isPending && <p className="text-xs text-faint text-center">Saving…</p>}
            </div>
          )
        })()}
      </section>

      {/* Confirm dialog */}
      {showConfirm && pendingProfile && (() => {
        const from = PROFILES.find((p) => p.value === savedProfile)
        const to   = PROFILES.find((p) => p.value === pendingProfile)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
              <h3 className="text-base font-semibold text-foreground mb-2">Change target profile?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You are switching from{' '}
                <span className="font-medium text-foreground">{from?.label} {from?.band}</span>
                {' '}to{' '}
                <span className="font-medium text-foreground">{to?.label} {to?.band}</span>.
                This will adjust your AI evaluation difficulty and recommendations.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:opacity-80 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Content Visibility */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-1">Content Visibility</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Show system-provided data alongside your personal entries in libraries (vocab banks, collocations, idioms, etc.).
        </p>
        <button
          onClick={toggleSystemData}
          disabled={isPending}
          className="w-full rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:opacity-80 disabled:opacity-60"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Show system data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {optimisticSystemData
                  ? 'Showing system + personal entries'
                  : 'Showing personal entries only'}
              </p>
            </div>
            <div className={`relative h-6 w-11 rounded-full transition-colors ${optimisticSystemData ? 'bg-blue-500' : 'bg-muted'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${optimisticSystemData ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
        </button>
      </section>

      {/* AI Model — VIP only */}
      {tier === 'vip' && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-1">AI Model</h2>
          <p className="text-xs text-muted-foreground mb-3">
            VIP users can simulate the free tier to verify the free-user experience.
          </p>
          <div className="flex flex-col gap-3">
            {MODEL_OPTIONS.map((opt) => {
              const active = optimisticPref === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => selectModelPref(opt.value)}
                  disabled={isPending}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    active
                      ? 'border-transparent ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-border bg-card hover:opacity-80'
                  } disabled:opacity-60`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    </div>
                    <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      active ? 'border-transparent bg-amber-500' : 'border-border bg-card'
                    }`} />
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
