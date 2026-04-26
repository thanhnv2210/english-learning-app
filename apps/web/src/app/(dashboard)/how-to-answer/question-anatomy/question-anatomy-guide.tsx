'use client'

import { useState } from 'react'
import type { QuestionRole, SkillSection } from '@/lib/guides/question-anatomy'
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/lib/guides/question-anatomy'
import type { QuestionAnatomyResult } from '@/app/api/question-anatomy/analyse/route'

// ── Role colour palette ───────────────────────────────────────────────────────

const ROLE_COLORS: Record<QuestionRole, {
  badge: string
  bar: string
  bg: string
  border: string
  text: string
  pill: string
}> = {
  'question-word': {
    badge:  'bg-blue-600 text-white',
    bar:    'bg-blue-500',
    bg:     'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text:   'text-blue-900 dark:text-blue-200',
    pill:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  'category': {
    badge:  'bg-indigo-600 text-white',
    bar:    'bg-indigo-500',
    bg:     'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text:   'text-indigo-900 dark:text-indigo-200',
    pill:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  'exclusion': {
    badge:  'bg-rose-600 text-white',
    bar:    'bg-rose-500',
    bg:     'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    text:   'text-rose-900 dark:text-rose-200',
    pill:   'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  },
  'hedge': {
    badge:  'bg-amber-500 text-white',
    bar:    'bg-amber-400',
    bg:     'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text:   'text-amber-900 dark:text-amber-200',
    pill:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  'relationship': {
    badge:  'bg-purple-600 text-white',
    bar:    'bg-purple-500',
    bg:     'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text:   'text-purple-900 dark:text-purple-200',
    pill:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  'target': {
    badge:  'bg-green-600 text-white',
    bar:    'bg-green-500',
    bg:     'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text:   'text-green-900 dark:text-green-200',
    pill:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  'time': {
    badge:  'bg-gray-500 text-white',
    bar:    'bg-gray-400',
    bg:     'bg-muted',
    border: 'border-border',
    text:   'text-foreground',
    pill:   'bg-subtle text-muted-foreground border border-border',
  },
}

const SKILL_COLORS: Record<string, { tab: string; activeTab: string }> = {
  Reading:   { tab: 'border-blue-500 text-blue-600 dark:text-blue-400',   activeTab: 'bg-blue-50 dark:bg-blue-900/20' },
  Listening: { tab: 'border-purple-500 text-purple-600 dark:text-purple-400', activeTab: 'bg-purple-50 dark:bg-purple-900/20' },
  Speaking:  { tab: 'border-green-500 text-green-600 dark:text-green-400',  activeTab: 'bg-green-50 dark:bg-green-900/20' },
  Writing:   { tab: 'border-amber-500 text-amber-600 dark:text-amber-400',  activeTab: 'bg-amber-50 dark:bg-amber-900/20' },
}

// ── Role legend ───────────────────────────────────────────────────────────────

const ALL_ROLES: QuestionRole[] = [
  'question-word', 'category', 'target', 'hedge', 'exclusion', 'relationship', 'time',
]

function RoleLegend() {
  const [openRole, setOpenRole] = useState<QuestionRole | null>(null)

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        The 7 Question Roles — click to expand
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_ROLES.map((role) => {
          const c = ROLE_COLORS[role]
          const isOpen = openRole === role
          return (
            <button
              key={role}
              onClick={() => setOpenRole(isOpen ? null : role)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                isOpen ? c.badge : c.pill
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          )
        })}
      </div>
      {openRole && (() => {
        const c = ROLE_COLORS[openRole]
        return (
          <div className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
            <p className={`text-xs font-bold mb-1 ${c.text}`}>{ROLE_LABELS[openRole]}</p>
            <p className={`text-xs leading-relaxed ${c.text}`}>{ROLE_DESCRIPTIONS[openRole]}</p>
          </div>
        )
      })()}
    </div>
  )
}

// ── Example card ──────────────────────────────────────────────────────────────

function ExampleCard({ example, index }: {
  example: SkillSection['examples'][number]
  index: number
}) {
  const [isOpen, setIsOpen] = useState(index === 0)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-muted transition-colors"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background mt-0.5">
          {index + 1}
        </span>
        <p className="flex-1 text-sm font-medium text-foreground italic">
          &ldquo;{example.question}&rdquo;
        </p>
        <span className={`ml-2 shrink-0 text-xs text-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-border px-5 pb-5 pt-4 flex flex-col gap-4">

          {/* Fragment breakdown */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Anatomy Breakdown
            </p>
            <FragmentList fragments={example.fragments} />
          </div>

          {/* Answer type + scan plan */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-faint mb-1">
                Answer Type
              </p>
              <p className="text-xs text-foreground leading-relaxed">{example.answerType}</p>
            </div>
            <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-teal-500 dark:text-teal-400 mb-1">
                Scan Plan
              </p>
              <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">{example.scanPlan}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ── Fragment list renderer (shared between worked examples and analyser) ──────

function FragmentList({ fragments }: { fragments: Array<{ text: string; role: QuestionRole; label: string; instruction: string }> }) {
  return (
    <div className="flex flex-col gap-2">
      {fragments.map((frag, i) => {
        const c = ROLE_COLORS[frag.role]
        if (!c) return null
        return (
          <div key={i} className={`flex gap-3 rounded-lg border p-3 ${c.bg} ${c.border}`}>
            <div className={`w-1 shrink-0 self-stretch rounded-full ${c.bar}`} />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.badge}`}>
                  {frag.label}
                </span>
                <span className={`text-xs font-mono font-semibold ${c.text}`}>
                  &ldquo;{frag.text}&rdquo;
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${c.text}`}>{frag.instruction}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Question analyser ─────────────────────────────────────────────────────────

const SKILL_OPTIONS = ['Reading', 'Listening', 'Speaking', 'Writing']

function QuestionAnalyser() {
  const [question, setQuestion] = useState('')
  const [skill, setSkill] = useState('Reading')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<QuestionAnatomyResult | null>(null)

  async function handleAnalyse() {
    const q = question.trim()
    if (!q) return
    setError('')
    setResult(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/question-anatomy/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, skill }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'API error')
      }
      const data: QuestionAnatomyResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-violet-700 dark:text-violet-400">Analyse Your Own Question</p>
        <p className="text-xs text-violet-600 dark:text-violet-500 mt-0.5">
          Paste any IELTS question and the AI will break it down into anatomy roles.
        </p>
      </div>

      {/* Skill selector */}
      <div className="flex flex-wrap gap-1.5">
        {SKILL_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSkill(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              skill === s
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-card text-muted-foreground border-border hover:opacity-70'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        placeholder="e.g. According to the author, which factor did NOT contribute to the decline of the fishing industry?"
        className="w-full rounded-lg border border-violet-200 dark:border-violet-700 bg-card px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
      />

      <button
        onClick={handleAnalyse}
        disabled={isLoading || !question.trim()}
        className="self-start rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
      >
        {isLoading ? 'Analysing…' : 'Analyse Question'}
      </button>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-4 border-t border-violet-200 dark:border-violet-700 pt-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Anatomy Breakdown
            </p>
            <FragmentList fragments={result.fragments} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.answerType && (
              <div className="rounded-lg border border-border bg-muted px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-faint mb-1">Answer Type</p>
                <p className="text-xs text-foreground leading-relaxed">{result.answerType}</p>
              </div>
            )}
            {result.scanPlan && (
              <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-teal-500 dark:text-teal-400 mb-1">Scan Plan</p>
                <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">{result.scanPlan}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function QuestionAnatomyGuide({ sections }: { sections: SkillSection[] }) {
  const [activeSkill, setActiveSkill] = useState(sections[0]?.skill ?? '')

  const activeSection = sections.find((s) => s.skill === activeSkill)

  return (
    <div className="flex flex-col gap-6">

      {/* Role legend */}
      <RoleLegend />

      {/* Skill tabs */}
      <div>
        <div className="flex gap-1 border-b border-border">
          {sections.map((s) => {
            const isActive = s.skill === activeSkill
            const c = SKILL_COLORS[s.skill] ?? SKILL_COLORS.Reading
            return (
              <button
                key={s.skill}
                onClick={() => setActiveSkill(s.skill)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  isActive
                    ? `${c.tab} -mb-px`
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{s.icon}</span>
                {s.skill}
              </button>
            )
          })}
        </div>

        {/* Skill intro */}
        {activeSection && (
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeSection.intro}
            </p>

            {/* Examples */}
            <div className="flex flex-col gap-2">
              {activeSection.examples.map((ex, i) => (
                <ExampleCard key={i} example={ex} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI analyser */}
      <QuestionAnalyser />

    </div>
  )
}
