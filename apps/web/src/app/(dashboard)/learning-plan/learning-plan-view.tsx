'use client'

import { useState } from 'react'
import Link from 'next/link'
import { saveOfficialResultAction, deleteOfficialResultAction } from '@/app/actions/learning-plan'
import { getCurrentPhaseStatus, daysUntil, PLAN_START, PLAN_END } from '@/lib/ielts/plan-phases'

type OfficialResult = {
  id: number
  userId: number
  examDate: string
  listening: number
  reading: number
  writing: number
  speaking: number
  overall: number
  notes: string | null
  createdAt: Date
}

// ─── 3-Month Study Plan Data ──────────────────────────────────────────────────

const PLAN_MONTHS = [
  {
    month: 'Month 1',
    label: 'May 11 – Jun 10',
    theme: 'Listening Foundation + Habit Building',
    color: 'border-blue-500',
    headerColor: 'bg-blue-500',
    status: 'active',
    weeks: [
      {
        label: 'Week 1–2',
        focus: 'Build the daily listening loop',
        tasks: [
          '15 min: IELTS Section 3 or 4 (blind listening)',
          '15 min: Transcript analysis — mark missed links & corrections',
          '15 min: Shadow the audio (speak softly along)',
          '10 min: Relaxed tech podcast (BBC Tech / Lex Fridman clips)',
        ],
        tip: 'Use the Read-Aloud Drill here to build shadowing habit.',
      },
      {
        label: 'Week 3–4',
        focus: 'Add reading argument mapping',
        tasks: [
          'Continue listening loop (daily)',
          '20 min: Read one Aeon / BBC Future article → map paragraph purpose',
          '20 min: IELTS Reading Passage 3 timed (20 min) + review',
          'Writing: 1 essay outline per week, plan verbally first',
        ],
        tip: 'Goal: identify paragraph function (introduce / criticise / conclude) before reading for detail.',
      },
    ],
    target: 'Listening: 5.0 → 5.5  |  Reading: 6.0 steady  |  Writing: 6.0 steady',
  },
  {
    month: 'Month 2',
    label: 'Jun 11 – Jul 19',
    theme: 'Full Study + Euro Trip (Jul 5–19)',
    color: 'border-amber-500',
    headerColor: 'bg-amber-500',
    status: 'upcoming',
    weeks: [
      {
        label: 'Jun 11 – Jul 4 (Pre-trip)',
        focus: 'Intensive 3.5-week push before travel',
        tasks: [
          'Continue daily listening loop (Section 3 + 4)',
          '30 min: IELTS Reading Passage 3 × 3 sessions/week with argument mapping',
          'Write 1 full Task 2 essay/week + self-evaluate using Writing Evaluator',
          'Record Speaking Part 3 answers on abstract topics (2×/week)',
        ],
        tip: 'Bank momentum before the trip — this is your longest uninterrupted study window.',
      },
      {
        label: 'Jul 5–19 (Euro Trip)',
        focus: 'Passive immersion only — protect the habit',
        tasks: [
          '15 min/day: English podcast during commute / walking (BBC Global News, TED)',
          'Optional: Read one article on phone (Aeon, The Conversation)',
          'No pressure on tests — stay connected, not stressed',
        ],
        tip: 'Travelling in English-speaking environments counts as real listening practice.',
      },
    ],
    target: 'Listening: 5.5 → 6.0  |  Reading: 6.0 → 6.5  |  Writing: working on precision',
  },
  {
    month: 'Month 3',
    label: 'Jul 19 – Aug 11',
    theme: 'Return + Mock Exam Sprint + Final Polish',
    color: 'border-green-500',
    headerColor: 'bg-green-500',
    status: 'upcoming',
    weeks: [
      {
        label: 'Jul 19–27 (Re-entry)',
        focus: 'Ramp back up after the trip',
        tasks: [
          'Resume listening loop — Section 3 + 4 daily',
          '30 min: IELTS Reading Passage 3 with argument mapping (shake off the rust)',
          'Writing: Vocabulary precision drill — replace "get/make/have" with formal alternatives',
          'Speaking: 1 Part 3 topic recorded per day to rebuild momentum',
        ],
        tip: 'Use the Vocabulary page to find academic replacements for weak collocations.',
      },
      {
        label: 'Jul 28 – Aug 4 (Mock Sprint)',
        focus: 'Full mock exams under timed conditions',
        tasks: [
          'Saturday: Full IELTS mock (all 4 skills, timed) — review Sunday',
          'Daily: 1 listening section + transcript analysis',
          'Writing: 2 full essays/week, focus on idea extension (Band 6 → 7 gap)',
          'Speaking: Part 3 practice — abstract & controversial topics',
        ],
        tip: 'Use the Wrong Decisions log to track every mistake pattern.',
      },
      {
        label: 'Aug 5–11 (Final Polish)',
        focus: 'Weakness elimination + confidence',
        tasks: [
          'Saturday mock: focus only on weak areas from previous mock',
          'Listening: Section 4 only — track % correct to measure progress',
          'Speaking: Use app simulator for Part 1 + Part 3 combos',
          'Reading: Practice True/False/NG — the highest-trap question type',
          'Writing: Read your old essays, identify cohesion issues',
        ],
        tip: 'Book your official retake exam now if scores look ready.',
      },
    ],
    target: 'Listening: 6.0+  |  Reading: 6.5  |  Writing: 6.5  |  Speaking: 7.0',
  },
]

const ANALYSIS_INSIGHTS = [
  {
    icon: '🎯',
    title: 'Your Biggest Bottleneck',
    body: 'Listening (5.0) is the only skill dragging down your overall. Reading, Writing, and Speaking are all at 6.0–6.5. Fixing Listening to 6.0 will push your overall to 6.5.',
    color: 'border-red-400',
  },
  {
    icon: '🧠',
    title: 'Why Listening Is Hard for You',
    body: 'Your vocabulary and grammar are fine — your issue is real-time processing speed and "audio memory buffer." You understand sentences while hearing them but lose earlier context. This is extremely common for technical professionals.',
    color: 'border-orange-400',
  },
  {
    icon: '📖',
    title: 'Reading Gap: Argument Mapping',
    body: 'Band 6 issue is not vocabulary — it\'s tracking complex arguments across paragraphs. Passage 3 topics (philosophy, humanities, social science) require a different reading mode than technical content.',
    color: 'border-yellow-400',
  },
  {
    icon: '✍️',
    title: 'Writing Gap: Idea Extension',
    body: '"Technology improves communication" (Band 6) vs "Technology has transformed communication by enabling instant interaction across geographical boundaries" (Band 7). Same idea, deeper development. Focus on extending, not just connecting.',
    color: 'border-purple-400',
  },
  {
    icon: '🎤',
    title: 'Speaking: Already Your Strength',
    body: 'Speaking 6.5 proves your English foundation is solid. Use this strength to improve other skills — summarise reading aloud, explain listening content in your own words, plan essays verbally first.',
    color: 'border-green-400',
  },
]

const BAND_COLORS: Record<string, string> = {
  '5.0': 'bg-red-100 text-red-700 border-red-300',
  '5.5': 'bg-orange-100 text-orange-700 border-orange-300',
  '6.0': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  '6.5': 'bg-blue-100 text-blue-700 border-blue-300',
  '7.0': 'bg-green-100 text-green-700 border-green-300',
  '7.5': 'bg-emerald-100 text-emerald-700 border-emerald-300',
}

function bandColor(score: number) {
  const key = score.toFixed(1)
  return BAND_COLORS[key] ?? 'bg-muted text-muted-foreground border-border'
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`rounded-lg border px-3 py-1 text-lg font-bold ${bandColor(score)}`}>
        {score.toFixed(1)}
      </span>
    </div>
  )
}

// ─── Add Result Form ──────────────────────────────────────────────────────────

function AddResultForm({ onClose }: { onClose: () => void }) {
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const fd = new FormData(e.currentTarget)
    await saveOfficialResultAction(fd)
    setPending(false)
    onClose()
  }

  const bandOptions = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-foreground">Record Official Exam Result</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Exam Date</label>
          <input
            type="date"
            name="examDate"
            required
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
          />
        </div>
        {(['listening', 'reading', 'writing', 'speaking', 'overall'] as const).map((skill) => (
          <div key={skill}>
            <label className="mb-1 block text-xs font-medium capitalize text-muted-foreground">{skill}</label>
            <select
              name={skill}
              required
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
            >
              <option value="">—</option>
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b.toFixed(1)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
        <textarea
          name="notes"
          rows={2}
          placeholder="e.g. Struggled with Section 4, ran out of time on Passage 3..."
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-faint"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save Result'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: OfficialResult }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this result?')) return
    setDeleting(true)
    await deleteOfficialResultAction(result.id)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {new Date(result.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          {result.notes && <p className="mt-0.5 text-xs text-muted-foreground">{result.notes}</p>}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-faint hover:text-red-500 disabled:opacity-50"
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <ScoreBadge score={result.listening} label="Listening" />
        <ScoreBadge score={result.reading} label="Reading" />
        <ScoreBadge score={result.writing} label="Writing" />
        <ScoreBadge score={result.speaking} label="Speaking" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">Overall</span>
          <span className={`rounded-lg border px-3 py-1 text-lg font-bold ring-2 ring-offset-1 ${bandColor(result.overall)}`}>
            {result.overall.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Today's Focus Card ──────────────────────────────────────────────────────

function TodayFocusCard() {
  const now = new Date()
  const status = getCurrentPhaseStatus(now)

  if (status.type === 'before') {
    const days = daysUntil(PLAN_START, now)
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Plan starts in {days} day{days !== 1 ? 's' : ''}</p>
        <p className="mt-1 text-xs text-muted-foreground">Your 3-month study plan begins on 11 May 2026. Get ready!</p>
      </div>
    )
  }

  if (status.type === 'complete') {
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950/30">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">Plan complete! 🎉</p>
        <p className="mt-1 text-xs text-green-700 dark:text-green-400">
          You have reached the end of your 3-month plan. Record your retake result in the Results tab.
        </p>
      </div>
    )
  }

  const { phase, daysRemaining, phaseLengthDays, daysIntoPhase, overallPct } = status
  const totalDays = Math.ceil((PLAN_END.getTime() - PLAN_START.getTime()) / 86_400_000)

  const alertStyles: Record<string, string> = {
    normal:  'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30',
    warning: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30',
    trip:    'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/30',
    complete:'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
  }
  const textStyles: Record<string, string> = {
    normal:  'text-blue-700 dark:text-blue-300',
    warning: 'text-amber-700 dark:text-amber-300',
    trip:    'text-purple-700 dark:text-purple-300',
    complete:'text-green-700 dark:text-green-300',
  }
  const badgeStyles: Record<string, string> = {
    normal:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    trip:    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    complete:'bg-green-100 text-green-700',
  }

  const al = phase.alertLevel

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${alertStyles[al]}`}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeStyles[al]}`}>
              {phase.name}
            </span>
            <span className="text-xs text-muted-foreground">{phase.dateRange}</span>
          </div>
          <p className={`mt-1 text-sm font-medium ${textStyles[al]}`}>{phase.focus}</p>
        </div>

        {/* Countdown */}
        {phase.milestone && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {daysUntil(phase.milestone.date, now)}
            </p>
            <p className="text-xs text-muted-foreground">days until {phase.milestone.label}</p>
          </div>
        )}
      </div>

      {/* Overall progress bar */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Overall plan progress</span>
          <span>{overallPct}% · Day {Math.floor((now.getTime() - PLAN_START.getTime()) / 86_400_000) + 1} of {totalDays}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-2 rounded-full transition-all ${al === 'trip' ? 'bg-purple-500' : al === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
        {/* Phase progress sub-bar */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-foreground/20 transition-all"
            style={{ width: `${Math.round((daysIntoPhase / phaseLengthDays) * 100)}%` }}
          />
        </div>
        <p className="mt-0.5 text-right text-xs text-faint">
          {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left in this phase
        </p>
      </div>

      {/* Today's tasks */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today&apos;s Tasks</p>
        <div className="space-y-2">
          {phase.todayTasks.map((task) => (
            <div key={task.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-faint">·</span>
                {task.href ? (
                  <Link href={task.href} className={`text-sm truncate hover:underline ${textStyles[al]}`}>
                    {task.label}
                  </Link>
                ) : (
                  <span className="text-sm truncate text-foreground">{task.label}</span>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {task.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Link to project board */}
      <div className="mt-4 border-t border-border pt-3">
        <Link
          href="/projects"
          className={`text-xs font-medium hover:underline ${textStyles[al]}`}
        >
          View IELTS project board →
        </Link>
        <span className="ml-3 text-xs text-faint">Track ticket progress on the kanban board</span>
      </div>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function LearningPlanView({ initialResults }: { initialResults: OfficialResult[] }) {
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'plan' | 'analysis' | 'results'>('plan')

  return (
    <div className="space-y-6">
      {/* Today's Focus */}
      <TodayFocusCard />

      {/* Target Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Recommended Target</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">Overall Band 6.5</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Achievable in 3 months with consistent daily effort (~45–60 min/day on weekdays).
            </p>
          </div>
          <div className="ml-auto flex gap-4">
            {[
              { label: 'Listening', cur: 5.0, target: 6.0, priority: true },
              { label: 'Reading', cur: 6.0, target: 6.5 },
              { label: 'Writing', cur: 6.0, target: 6.5 },
              { label: 'Speaking', cur: 6.5, target: 7.0 },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className={`text-xs font-medium ${s.priority ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {s.label}{s.priority ? ' *' : ''}
                </span>
                <span className="text-sm font-bold text-foreground">{s.cur} → {s.target}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
          * Listening is the critical path — fixing it from 5.0 to 6.0 is what drives the overall score to 6.5.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        {([['plan', '📅 Study Plan'], ['analysis', '🔍 Analysis'], ['results', '📋 Results']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Study Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            <strong>Constraints factored in:</strong> Full-time work (45–60 min/day) · Euro trip Jul 5–19 (passive only) · Weekend exercise (lighter study on Saturdays/Sundays)
          </div>
          {PLAN_MONTHS.map((month) => (
            <div key={month.month} className={`rounded-xl border-l-4 bg-card shadow-sm ${month.color}`}>
              <div className={`rounded-t-lg px-5 py-3 ${month.headerColor} bg-opacity-10`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{month.month}</span>
                    <span className="ml-2 text-xs text-faint">{month.label}</span>
                    <h3 className="mt-0.5 text-base font-semibold text-foreground">{month.theme}</h3>
                  </div>
                  {month.status === 'active' && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4 p-5">
                {month.weeks.map((week) => (
                  <div key={week.label} className="rounded-lg border border-border bg-subtle p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{week.label}</span>
                      <span className="text-sm font-medium text-foreground">{week.focus}</span>
                    </div>
                    <ul className="space-y-1">
                      {week.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-0.5 text-faint">·</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                    {week.tip && (
                      <p className="mt-3 rounded-md bg-blue-50 px-3 py-1.5 text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                        💡 {week.tip}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-muted-foreground">Month target:</span>
                  <span className="text-xs text-foreground">{month.target}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Weekend Schedule */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-foreground">Weekend Schedule (Exercise Days)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-subtle p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Saturday — Exercise Day</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>· Morning: Badminton / Running / Swimming</li>
                  <li>· 20–30 min: Relaxed podcast listening (commute or cool-down)</li>
                  <li>· Month 3 only: Full mock exam (2 hrs)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-subtle p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Sunday — Light Review</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>· 30 min: Review the week&apos;s mistakes (Wrong Decisions log)</li>
                  <li>· 15 min: Speaking practice — 1 Part 3 topic</li>
                  <li>· Rest and recharge for the week ahead</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Priority ROI */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-foreground">Study Priority Order (ROI)</h3>
            <div className="space-y-2">
              {[
                { rank: 1, skill: 'Listening', why: 'Biggest score gap — 3-step loop (blind → transcript → shadow) daily', time: '30 min/day' },
                { rank: 2, skill: 'Reading', why: 'Argument mapping for Passage 3; diverse non-tech sources (Aeon, BBC Future)', time: '20 min/day' },
                { rank: 3, skill: 'Writing', why: 'Idea extension depth + formal collocation precision; 2 essays/week', time: '3×/week' },
                { rank: 4, skill: 'Speaking', why: 'Already strong — maintain with Part 3 abstract topics + connected speech', time: '15 min/day' },
              ].map((p) => (
                <div key={p.rank} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                    {p.rank}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{p.skill}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.why}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Based on your official result (3 May 2026) and detailed diagnostic analysis.
          </p>

          {/* Score Summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Score Breakdown</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Listening', score: 5.0 },
                { label: 'Reading', score: 6.0 },
                { label: 'Writing', score: 6.0 },
                { label: 'Speaking', score: 6.5 },
                { label: 'Overall', score: 6.0 },
              ].map((s) => (
                <ScoreBadge key={s.label} score={s.score} label={s.label} />
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Your profile: <strong className="text-foreground">production stronger than reception</strong>.
              Speaking/Writing (6.0–6.5) outpace Listening (5.0) — classic pattern for engineers who think carefully
              before responding but struggle with real-time native-speed audio.
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3">
            {ANALYSIS_INSIGHTS.map((insight) => (
              <div key={insight.title} className={`rounded-xl border-l-4 bg-card p-4 shadow-sm ${insight.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Realistic Projection */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Realistic Score Projection</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-medium text-muted-foreground">Skill</th>
                    <th className="py-2 text-center font-medium text-muted-foreground">Current</th>
                    <th className="py-2 text-center font-medium text-muted-foreground">3-Month Target</th>
                    <th className="py-2 text-left font-medium text-muted-foreground">Key Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { skill: 'Listening', cur: '5.0', target: '6.0', action: 'Daily 3-step loop (blind → transcript → shadow)' },
                    { skill: 'Reading', cur: '6.0', target: '6.5', action: 'Argument mapping + Passage 3 timed practice' },
                    { skill: 'Writing', cur: '6.0', target: '6.5', action: 'Idea extension + formal collocation precision' },
                    { skill: 'Speaking', cur: '6.5', target: '7.0', action: 'Part 3 abstract topics + connected speech' },
                    { skill: 'Overall', cur: '6.0', target: '6.5', action: 'Fix Listening — it unlocks the overall jump' },
                  ].map((r) => (
                    <tr key={r.skill}>
                      <td className="py-2 font-medium text-foreground">{r.skill}</td>
                      <td className="py-2 text-center">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${bandColor(parseFloat(r.cur))}`}>{r.cur}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${bandColor(parseFloat(r.target))}`}>{r.target}</span>
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Official Exam History</h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Result'}
            </button>
          </div>

          {showForm && <AddResultForm onClose={() => setShowForm(false)} />}

          {initialResults.length === 0 && !showForm ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">No results recorded yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Record your first result
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {initialResults.map((r) => (
                <ResultCard key={r.id} result={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
