import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

const FEATURES = [
  {
    icon: '🎙',
    title: 'AI Speaking Examiner',
    description:
      'Practice Part 1, 2 & 3 with a strict AI examiner that never helps you. Chrome Speech-to-Text, filler-word detection, and band-level feedback after every session.',
  },
  {
    icon: '✍️',
    title: 'Writing Task 2 Coach',
    description:
      'Multi-pass pipeline: grammar audit → vocabulary upgrade → IELTS band scoring. Get targeted feedback on Task Response, Coherence, Lexical Resource, and Grammar.',
  },
  {
    icon: '📖',
    title: 'Reading & Listening',
    description:
      'AI-generated passages and scripts on software engineering topics. True/False/NG, short-answer, and note-completion questions just like the real exam.',
  },
  {
    icon: '📚',
    title: 'Vocabulary Engine',
    description:
      'Replace dev slang with Academic Word List alternatives. Spaced-repetition review, sentence library, and pronunciation guides for Band 6.5+ word choice.',
  },
  {
    icon: '🧩',
    title: 'Collocations & Idioms',
    description:
      'Search natural word combinations by phrase or keyword. Tag Writing Task 1 & 2 or Speaking, and see them highlighted in AI-generated essays.',
  },
  {
    icon: '✍',
    title: 'Essay Builder',
    description:
      'Select vocabulary and collocations, generate a full Task 2 essay, then run the full audit + score pipeline inline. Four-tier highlight shows every word at work.',
  },
  {
    icon: '❌',
    title: 'Wrong Decision Log',
    description:
      'Journal every mistake — your reasoning, the correct answer, and an AI-generated analysis that explains why you went wrong and how to prevent it.',
  },
  {
    icon: '📋',
    title: 'Study Sprint Board',
    description:
      'Kanban board with IELTS-specific epics, sprint planning, and 22 ready-made template tickets so you always know what to study next.',
  },
]

const STATS = [
  { value: '4', label: 'IELTS skills covered' },
  { value: '20+', label: 'AI-powered tools' },
  { value: '6.5', label: 'Target band for engineers' },
  { value: '100%', label: 'Tech-focused content' },
]

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ───────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-bold tracking-tight text-foreground">
            IELTS Accelerator
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
          Built for software engineers
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Achieve IELTS Band 6.5<br />
          <span className="text-blue-500">using your tech background</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          An AI-powered prep platform that turns your engineering knowledge into
          exam advantage. Practice all four skills with content designed for
          senior developers — not generic test-takers.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.532 24.552c0-1.636-.132-3.2-.38-4.704H24v8.896h13.228c-.572 3.064-2.308 5.656-4.92 7.392v6.14h7.968c4.664-4.296 7.256-10.62 7.256-17.724z" fill="#fff" fillOpacity=".9"/>
              <path d="M24 48c6.48 0 11.916-2.148 15.888-5.824l-7.968-6.14c-2.148 1.44-4.896 2.292-7.92 2.292-6.096 0-11.256-4.116-13.092-9.648H2.62v6.34C6.576 42.58 14.724 48 24 48z" fill="#fff" fillOpacity=".75"/>
              <path d="M10.908 28.68A14.46 14.46 0 0 1 9.6 24c0-1.632.28-3.216.78-4.68v-6.34H2.62A23.988 23.988 0 0 0 0 24c0 3.876.928 7.548 2.62 10.82l8.288-6.14z" fill="#fff" fillOpacity=".6"/>
              <path d="M24 9.672c3.432 0 6.516 1.18 8.94 3.492l6.708-6.708C35.9 2.58 30.472 0 24 0 14.724 0 6.576 5.42 2.62 13.32l8.288 6.34C12.744 13.788 17.904 9.672 24 9.672z" fill="#fff" fillOpacity=".5"/>
            </svg>
            Get started free
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-4 text-xs text-faint">No credit card required.</p>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-6 py-8 text-center">
              <span className="text-3xl font-extrabold text-foreground">{value}</span>
              <span className="mt-1 text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Everything you need to hit Band 6.5
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Purpose-built for engineers who learn best by doing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
            >
              <div className="mb-3 text-2xl">{icon}</div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why engineers ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
                Why this app
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Generic IELTS prep doesn&apos;t work for engineers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                You already have the analytical mindset. The gap is vocabulary register,
                formal coherence markers, and exam-specific structures — not intelligence.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  'All practice content uses software engineering topics you already know',
                  'AI examiner grades you like a real IELTS examiner — no hints, no comfort',
                  'Academic Word List upgrades replace the dev slang that tanks Band scores',
                  'Wrong Decision Log turns every mistake into a permanent lesson',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-blue-500">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">AI Examiner — Part 1</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="self-start rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground max-w-xs">
                  Do you think working from home has changed the way software teams communicate?
                </div>
                <div className="self-end rounded-xl rounded-tr-none bg-blue-600 px-4 py-3 text-sm text-white max-w-xs">
                  Yes, it has significantly affected how we collaborate. Personally, I&apos;ve noticed that async communication tools like Slack have replaced a lot of real-time discussion...
                </div>
                <div className="self-start rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground max-w-xs">
                  Interesting. And would you say that&apos;s a positive development overall?
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Band estimate</span>
                  <span className="font-semibold text-blue-400">6.5</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[65%] rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Ready to start?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign up in 10 seconds with Google. No setup, no credit card.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-faint">
          <span>IELTS Accelerator — for senior engineers targeting Band 6.5</span>
          <Link href="/login" className="hover:text-muted-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}
