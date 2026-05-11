// Pure date logic for the 3-month IELTS plan. No DB imports — client-safe.

export type PlanPhase = {
  id: string
  name: string
  dateRange: string
  start: Date
  end: Date
  sprint: string
  focus: string
  todayTasks: { label: string; href?: string; time: string }[]
  milestone: { label: string; date: Date } | null
  alertLevel: 'normal' | 'warning' | 'trip' | 'complete'
}

export const PLAN_START = new Date('2026-05-11')
export const PLAN_END   = new Date('2026-08-11')

// Key milestones
export const TRIP_START  = new Date('2026-07-05')
export const TRIP_END    = new Date('2026-07-19')
export const MOCK_START  = new Date('2026-07-28')
export const FINAL_WEEK  = new Date('2026-08-05')

export const PHASES: PlanPhase[] = [
  {
    id: 'month1',
    name: 'Listening Foundation',
    dateRange: 'May 11 – Jun 10',
    start: new Date('2026-05-11'),
    end:   new Date('2026-06-10'),
    sprint: 'Month 1 – Listening Foundation',
    focus: 'Build the daily 3-step listening loop. Every day counts here.',
    alertLevel: 'normal',
    milestone: { label: 'Euro trip starts', date: TRIP_START },
    todayTasks: [
      { label: 'Blind listen: IELTS Section 3 or 4', href: '/listening', time: '15 min' },
      { label: 'Transcript analysis — mark missed links & corrections', href: '/wrong-decisions', time: '15 min' },
      { label: 'Shadow practice: speak softly with the audio', href: '/speaking/drill', time: '15 min' },
      { label: 'Relaxed tech podcast (no pausing)', time: '10 min' },
    ],
  },
  {
    id: 'month2-pre',
    name: 'Full Study (Pre-trip)',
    dateRange: 'Jun 11 – Jul 4',
    start: new Date('2026-06-11'),
    end:   new Date('2026-07-04'),
    sprint: 'Month 2 – Full Study + Euro Trip',
    focus: 'Intensive push before the trip. Bank as much listening progress as possible.',
    alertLevel: 'warning',
    milestone: { label: 'Euro trip starts', date: TRIP_START },
    todayTasks: [
      { label: 'Listening Section 4: full set + transcript review', href: '/listening', time: '30 min' },
      { label: 'Reading Passage 3: timed 20 min + argument mapping', href: '/reading', time: '25 min' },
      { label: 'Writing Task 2: 1 essay this week + run Writing Evaluator', href: '/writing', time: '60 min (1×/week)' },
      { label: 'Speaking Part 3: record 1 abstract topic answer', href: '/speaking', time: '10 min' },
    ],
  },
  {
    id: 'trip',
    name: 'Euro Trip 🛫',
    dateRange: 'Jul 5 – Jul 19',
    start: TRIP_START,
    end:   TRIP_END,
    sprint: 'Month 2 – Full Study + Euro Trip',
    focus: 'Passive immersion only. Protect the habit — stay connected, not stressed.',
    alertLevel: 'trip',
    milestone: { label: 'Return & ramp up', date: TRIP_END },
    todayTasks: [
      { label: 'English podcast during commute / walking (BBC Global News, TED)', time: '15 min' },
      { label: 'Optional: read one article on your phone (Aeon, The Conversation)', time: '10 min' },
    ],
  },
  {
    id: 'month3-reentry',
    name: 'Re-entry (Post-trip)',
    dateRange: 'Jul 19 – Jul 27',
    start: TRIP_END,
    end:   MOCK_START,
    sprint: 'Month 3 – Mock Exam Sprint',
    focus: 'Shake off the rust fast. Resume the loop immediately.',
    alertLevel: 'warning',
    milestone: { label: 'Mock sprint starts', date: MOCK_START },
    todayTasks: [
      { label: 'Resume daily listening loop: Section 3 or 4', href: '/listening', time: '30 min' },
      { label: 'Reading Passage 3: argument mapping session', href: '/reading', time: '25 min' },
      { label: 'Vocabulary precision: replace 5 weak collocations in old essays', href: '/vocabulary', time: '15 min' },
      { label: 'Speaking Part 3: record 1 answer, listen back for grammar complexity', href: '/speaking', time: '10 min' },
    ],
  },
  {
    id: 'month3-mock',
    name: 'Mock Exam Sprint',
    dateRange: 'Jul 28 – Aug 4',
    start: MOCK_START,
    end:   FINAL_WEEK,
    sprint: 'Month 3 – Mock Exam Sprint',
    focus: 'Full mock exams Saturday. Review Sunday. Target every weak area.',
    alertLevel: 'warning',
    milestone: { label: 'Final polish week', date: FINAL_WEEK },
    todayTasks: [
      { label: 'Listening Section 4: track % correct vs Week 1', href: '/listening', time: '20 min' },
      { label: 'Writing: 2 essays this week — idea extension focus', href: '/writing', time: '60 min' },
      { label: 'Speaking Part 3: abstract & controversial topics', href: '/speaking', time: '15 min' },
      { label: 'Saturday: full IELTS mock (all 4 skills, timed)', time: '3 hrs (Sat)' },
    ],
  },
  {
    id: 'month3-final',
    name: 'Final Polish',
    dateRange: 'Aug 5 – Aug 11',
    start: FINAL_WEEK,
    end:   PLAN_END,
    sprint: 'Month 3 – Mock Exam Sprint',
    focus: 'Weakness elimination. Book your retake exam this week.',
    alertLevel: 'warning',
    milestone: null,
    todayTasks: [
      { label: 'Listening Section 4: 3 sets, record % correct', href: '/listening', time: '25 min' },
      { label: 'Reading True/False/NG: 1 set, focus on False vs Not Given trap', href: '/reading', time: '20 min' },
      { label: 'Review old essays: find overused connectors, replace with structural cohesion', href: '/essay-builder', time: '15 min' },
      { label: 'Saturday: focused mock on your 2 weakest question types only', time: '90 min (Sat)' },
    ],
  },
]

export type PhaseStatus =
  | { type: 'before' }
  | { type: 'active'; phase: PlanPhase; daysIntoPhase: number; daysRemaining: number; phaseLengthDays: number; overallPct: number }
  | { type: 'complete' }

export function getCurrentPhaseStatus(now: Date): PhaseStatus {
  if (now < PLAN_START) return { type: 'before' }
  if (now >= PLAN_END)  return { type: 'complete' }

  const totalMs = PLAN_END.getTime() - PLAN_START.getTime()
  const elapsedMs = now.getTime() - PLAN_START.getTime()
  const overallPct = Math.round((elapsedMs / totalMs) * 100)

  for (const phase of PHASES) {
    if (now >= phase.start && now < phase.end) {
      const phaseLengthDays = Math.ceil((phase.end.getTime() - phase.start.getTime()) / 86_400_000)
      const daysIntoPhase   = Math.floor((now.getTime() - phase.start.getTime()) / 86_400_000)
      const daysRemaining   = phaseLengthDays - daysIntoPhase
      return { type: 'active', phase, daysIntoPhase, daysRemaining, phaseLengthDays, overallPct }
    }
  }

  // Fallback: between phases (shouldn't happen with contiguous ranges)
  return { type: 'complete' }
}

export function daysUntil(target: Date, from: Date): number {
  return Math.ceil((target.getTime() - from.getTime()) / 86_400_000)
}
