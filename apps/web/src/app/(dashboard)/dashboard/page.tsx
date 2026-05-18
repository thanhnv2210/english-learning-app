import Link from 'next/link'
import { CheatSheetBanner } from '@/components/cheat-sheet-banner'
import { OnboardingTour } from '@/components/onboarding-tour'
import { getCurrentUser } from '@/lib/db/user'
import { getAnalyticsStats } from '@/lib/db/analytics'
import { db } from '@/lib/db'
import { wrongDecisionLogs, mockExams } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const PRACTICE_CARDS = [
  {
    href: '/speaking/session',
    icon: '🎙',
    title: 'Speaking (Full)',
    description: 'Part 1 + 2 + 3 with AI examiner',
    color: 'blue',
  },
  {
    href: '/writing',
    icon: '✍️',
    title: 'Writing Task 2',
    description: 'Essay with multi-pass feedback',
    color: 'violet',
  },
  {
    href: '/reading',
    icon: '📖',
    title: 'Reading',
    description: 'T/F/NG + short-answer passages',
    color: 'emerald',
  },
  {
    href: '/listening',
    icon: '🎧',
    title: 'Listening',
    description: 'Note-completion from AI scripts',
    color: 'amber',
  },
]

const TOOL_LINKS = [
  { href: '/vocabulary', icon: '📚', label: 'Vocabulary' },
  { href: '/collocations', icon: '🧩', label: 'Collocations' },
  { href: '/essay-builder', icon: '✍', label: 'Essay Builder' },
  { href: '/wrong-decisions', icon: '❌', label: 'Wrong Decisions' },
  { href: '/analytics', icon: '📊', label: 'Analytics' },
  { href: '/projects', icon: '📋', label: 'Projects' },
]

const NEW_USER_LOCKED_HREFS = new Set(['/essay-builder', '/wrong-decisions', '/projects'])

const SKILL_LABEL: Record<string, string> = {
  speaking: 'Speaking Pt 1',
  speaking_part2: 'Speaking Pt 2',
  writing: 'Writing',
  reading: 'Reading',
  listening: 'Listening',
}

const COLOR_MAP: Record<string, string> = {
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5',
}

const ICON_BG: Record<string, string> = {
  blue: 'bg-blue-500/10',
  violet: 'bg-violet-500/10',
  emerald: 'bg-emerald-500/10',
  amber: 'bg-amber-500/10',
}

function bandColor(gap: number) {
  if (gap >= 0) return 'text-emerald-400'
  if (gap >= -0.5) return 'text-amber-400'
  return 'text-red-400'
}

function BandBar({ value, target }: { value: number; target: number }) {
  const pct = Math.min((value / 9) * 100, 100)
  const targetPct = Math.min((target / 9) * 100, 100)
  return (
    <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-0 h-full w-0.5 bg-white/30"
        style={{ left: `${targetPct}%` }}
      />
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const [stats, [wrongRow], [sessionRow]] = await Promise.all([
    getAnalyticsStats(user.id),
    db.select({ count: count() }).from(wrongDecisionLogs).where(eq(wrongDecisionLogs.userId, user.id)),
    db.select({ count: count() }).from(mockExams),
  ])

  const totalSessions = sessionRow?.count ?? 0
  const wrongCount = wrongRow?.count ?? 0
  const firstName = user.name?.split(' ')[0] ?? 'there'
  const isNewUser = !user.returningUser

  const bandMatch = user.targetProfile.match(/(\d+\.\d+|\d+)$/)
  const targetBand = bandMatch ? parseFloat(bandMatch[1]) : 6.5

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <OnboardingTour />
      <CheatSheetBanner />

      {/* ── Welcome header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Target:{' '}
            <span className="font-semibold text-blue-400">
              IELTS Band {targetBand}
            </span>
            {totalSessions > 0 && (
              <> · {totalSessions} session{totalSessions !== 1 ? 's' : ''} completed</>
            )}
            {wrongCount > 0 && (
              <> · {wrongCount} mistake{wrongCount !== 1 ? 's' : ''} logged</>
            )}
          </p>
        </div>
        <Link
          href="/analytics"
          className="self-start rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          View analytics →
        </Link>
      </div>

      {/* ── Practice cards ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
          Practice
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRACTICE_CARDS.map(({ href, icon, title, description, color }) => (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors ${COLOR_MAP[color]}`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${ICON_BG[color]}`}>
                {icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Band scores ─────────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
            Band Scores
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {stats.map((s) => (
              <div key={s.skill} className="flex items-center gap-4 px-5 py-3">
                <span className="w-28 shrink-0 text-sm text-muted-foreground">
                  {SKILL_LABEL[s.skill] ?? s.skill}
                </span>
                <div className="flex-1">
                  <BandBar value={s.avgBand} target={s.targetBand} />
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {s.avgBand.toFixed(1)}
                  </span>
                  <span className={`text-xs font-medium ${bandColor(s.gap)}`}>
                    {s.gap >= 0 ? '+' : ''}{s.gap.toFixed(1)}
                  </span>
                  <span className="text-xs text-faint">
                    {s.sessionCount} session{s.sessionCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-faint">
            Bar marker shows target band {targetBand}. Gap = avg − target.
          </p>
        </section>
      )}

      {/* ── No data state ────────────────────────────────────────────────────── */}
      {stats.length === 0 && (
        <div className="rounded-xl border border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-foreground">New here? Start with your 30-day plan</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A week-by-week guide that takes you from zero to a consistent Band 6.5 practice routine.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/getting-started"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              See your 30-day plan →
            </Link>
            <Link
              href="/writing"
              className="rounded-lg border border-border bg-card px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Or jump straight to Writing
            </Link>
          </div>
        </div>
      )}

      {/* ── Quick tools ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
          Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOOL_LINKS.map(({ href, icon, label }) => {
            const locked = isNewUser && NEW_USER_LOCKED_HREFS.has(href)
            if (locked) {
              return (
                <span
                  key={href}
                  title="Complete a few sessions to unlock"
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-faint cursor-not-allowed opacity-50"
                >
                  <span>{icon}</span>
                  {label}
                  <span className="ml-0.5 text-[10px]">🔒</span>
                </span>
              )
            }
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
