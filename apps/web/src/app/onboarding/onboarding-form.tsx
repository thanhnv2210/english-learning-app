'use client'

import { useState, useTransition } from 'react'
import { completeOnboardingAction } from '@/app/actions/onboarding'
import { getSuggestedPages, type SuggestedPage } from '@/lib/onboarding/suggestions'

const PROFILES = [
  { value: 'IELTS_Academic_6.5', label: 'IELTS Band 6.5', description: 'University admission / general competency' },
  { value: 'IELTS_Academic_7.5', label: 'IELTS Band 7.5', description: 'Competitive postgrad / professional registration' },
  { value: 'Business_Fluent',    label: 'Business Fluent', description: 'Professional workplace communication' },
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

  // Step 2
  const [profile, setProfile] = useState(defaultProfile)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [otherReason, setOtherReason] = useState('')

  // Step 3
  const [suggestions, setSuggestions] = useState<SuggestedPage[]>([])
  const [selectedPages, setSelectedPages] = useState<string[]>([])

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

  function togglePage(href: string) {
    setSelectedPages((prev) =>
      prev.includes(href) ? prev.filter((p) => p !== href) : [...prev, href]
    )
  }

  function goToStep3() {
    const allReasons = [
      ...selectedReasons,
      ...(otherReason.trim() ? [otherReason.trim()] : []),
    ]
    const pages = getSuggestedPages(weakSkills, allReasons)
    setSuggestions(pages)
    setSelectedPages(pages.map((p) => p.href))
    setStep(3)
  }

  function submit(applyPages: boolean) {
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
        favouritePages: applyPages ? selectedPages : [],
      })
    )
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((n) => (
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
            <div className="flex flex-col gap-2">
              {PROFILES.map((p) => {
                const active = profile === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => setProfile(p.value)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border bg-card hover:opacity-80'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${active ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                        {p.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                    </div>
                    <div className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                      active ? 'border-transparent bg-blue-500' : 'border-border'
                    }`} />
                  </button>
                )
              })}
            </div>
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
              onClick={goToStep3}
              className="flex-[2] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Suggested pages ───────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suggested bookmarks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your goals, these pages will be pinned to your sidebar. Deselect any you don&apos;t want.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {suggestions.map((page) => {
              const selected = selectedPages.includes(page.href)
              return (
                <button
                  key={page.href}
                  onClick={() => togglePage(page.href)}
                  className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border bg-card opacity-50'
                  }`}
                >
                  <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                    selected ? 'border-blue-500 bg-blue-500' : 'border-border'
                  }`}>
                    {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                      {page.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{page.reason}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={isPending}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:opacity-80 transition-colors disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              onClick={() => submit(false)}
              disabled={isPending}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:opacity-80 transition-colors disabled:opacity-40"
            >
              Skip
            </button>
            <button
              onClick={() => submit(true)}
              disabled={isPending}
              className="flex-[2] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {isPending ? 'Saving…' : 'Apply & continue →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
