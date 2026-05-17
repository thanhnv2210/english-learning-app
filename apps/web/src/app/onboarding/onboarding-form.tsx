'use client'

import { useState, useTransition } from 'react'
import { completeOnboardingAction } from '@/app/actions/onboarding'

const PROFILES = [
  { value: 'IELTS_Academic_5',   label: 'IELTS Band 5',   description: 'Modest user — partial command of the language' },
  { value: 'IELTS_Academic_5.5', label: 'IELTS Band 5.5', description: 'Modest user — partial grasp of overall meaning' },
  { value: 'IELTS_Academic_6',   label: 'IELTS Band 6',   description: 'Competent user — generally effective despite inaccuracies' },
  { value: 'IELTS_Academic_6.5', label: 'IELTS Band 6.5', description: 'University admission / general competency' },
  { value: 'IELTS_Academic_7',   label: 'IELTS Band 7',   description: 'Good user — handles complex language with minor errors' },
  { value: 'Business_Fluent',    label: 'Professional',    description: 'Professional workplace communication' },
]

const SKILLS = [
  { value: 'writing',   label: 'Writing',   icon: '✍️' },
  { value: 'speaking',  label: 'Speaking',  icon: '🎙️' },
  { value: 'reading',   label: 'Reading',   icon: '📖' },
  { value: 'listening', label: 'Listening', icon: '🎧' },
]

const REASON_OPTIONS = [
  'University admission',
  'Job application',
  'Migration visa',
  'Professional growth',
  'Personal interest',
]

type Props = {
  defaultName: string
  defaultProfile: string
}

export function OnboardingForm({ defaultName, defaultProfile }: Props) {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()

  // Step 1
  const [bio, setBio] = useState('')
  const [weakSkills, setWeakSkills] = useState<string[]>([])
  const [returningUser, setReturningUser] = useState(false)

  // Step 2
  const [profile, setProfile] = useState(defaultProfile)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [otherReason, setOtherReason] = useState('')

  function toggleSkill(skill: string) {
    setWeakSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  function toggleReason(reason: string) {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    )
  }

  function submit() {
    const allReasons = [
      ...selectedReasons,
      ...(otherReason.trim() ? [otherReason.trim()] : []),
    ]
    startTransition(() =>
      completeOnboardingAction({
        bio,
        weakSkills,
        targetProfile: profile,
        onboardingReasons: allReasons,
        favouritePages: [],
        returningUser,
      })
    )
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? 'bg-blue-500' : 'bg-muted'}`} />
          </div>
        ))}
      </div>

      {/* ── Step 1: About you ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tell us about yourself</h1>
            <p className="mt-1 text-sm text-muted-foreground">This helps personalise your experience.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              A bit about you <span className="text-faint font-normal">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. I'm a software engineer preparing for a UK job application…"
              rows={3}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">
              Which skills do you most want to improve?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SKILLS.map((s) => {
                const active = weakSkills.includes(s.value)
                return (
                  <button
                    key={s.value}
                    onClick={() => toggleSkill(s.value)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-border bg-card text-muted-foreground hover:opacity-80'
                    }`}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => setReturningUser((v) => !v)}
            className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
              returningUser
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-border bg-card hover:opacity-80'
            }`}
          >
            <div className="text-left">
              <p className={`text-sm font-semibold ${returningUser ? 'text-green-700 dark:text-green-300' : 'text-foreground'}`}>
                I&apos;m already familiar with this app
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Skip the guided setup and go straight to your dashboard
              </p>
            </div>
            <div className={`relative h-6 w-11 rounded-full transition-colors ${returningUser ? 'bg-green-500' : 'bg-muted'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${returningUser ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>

          {returningUser && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                All guided steps — including suggested bookmarks and skill recommendations — will be skipped. You can restart the setup anytime from <span className="font-semibold">Settings</span>.
              </p>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 2: Target & reasons ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your goal</h1>
            <p className="mt-1 text-sm text-muted-foreground">Set your target and tell us why you&apos;re here.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Target profile</label>
            <div className="relative rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full appearance-none bg-transparent px-4 py-3 pr-10 text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                {PROFILES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground px-1">
              {PROFILES.find((p) => p.value === profile)?.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">Why are you using this app?</label>
            <div className="flex flex-wrap gap-2">
              {REASON_OPTIONS.map((r) => {
                const active = selectedReasons.includes(r)
                return (
                  <button
                    key={r}
                    onClick={() => toggleReason(r)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-border bg-card text-muted-foreground hover:opacity-80'
                    }`}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
            <input
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Other reason (optional)"
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-faint outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:opacity-80 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={submit}
              disabled={isPending}
              className="flex-[2] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {isPending ? 'Saving…' : 'Finish →'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
