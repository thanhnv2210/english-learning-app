import Link from 'next/link'
import { ContactForm } from './contact-form'

const TOP_5_VALUE_POINTS = [
  {
    number: '01',
    icon: '🎯',
    title: 'Domain-Adaptive Approach — One Method, Many Segments',
    summary: 'Professionals learn IELTS faster when content uses their existing expertise. We are the only platform built on this insight.',
    bullets: [
      'Primary beachhead: 3.7M+ annual IELTS tests; millions taken by professionals with real domain knowledge',
      'Software engineers are the first and best-understood segment — but the model extends to healthcare, finance, education, and business',
      'Existing platforms use generic topics (travel, food, environment) — irrelevant to any working professional',
      'High willingness to pay across segments: motivated professionals with career-specific deadlines invest in targeted tools',
    ],
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI Evaluation Engine — Not Tutoring, Strict Examination',
    summary: 'Our core IP is a production-grade IELTS scoring engine modelled on real examiner behaviour.',
    bullets: [
      'Grades all 4 criteria: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range',
      'Speaking: real-time STT + filler word detection + post-session band feedback',
      'Writing: 3-pass pipeline (grammar audit → vocabulary upgrade → IELTS scoring)',
      'Powered by Claude Sonnet for scoring; Haiku for generation — cost-optimised by task',
    ],
  },
  {
    number: '03',
    icon: '🧰',
    title: '20+ Integrated AI Tools — Complete Skill Coverage',
    summary: 'Users never need to leave the platform to prepare all four IELTS skills.',
    bullets: [
      'Speaking: Part 1/2/3 simulator, Read-Aloud drill, Connected Speech analyser',
      'Writing: Essay Builder, Outline generator, Vocabulary upgrader, Gap analysis',
      'Reading & Listening: AI-generated passages with exam-format questions',
      'Vocabulary: AWL browser, Collocations, Word Pairs drill, Sentence library with practice games',
    ],
  },
  {
    number: '04',
    icon: '⚙️',
    title: 'Technical Differentiation — Domain-Adaptive Content Engine',
    summary: 'Content generation is parameterised by domain — the same platform serves engineers, nurses, finance professionals, and educators with contextually relevant material.',
    bullets: [
      'Domain parameter drives all AI prompts: tech (microservices, Agile), healthcare, business, education, and more',
      'Wrong Decision Log: records every mistake, AI analyses root cause, prevents repetition — works across all domains',
      'Connected Speech analyser: detects 7 phonological phenomena in spoken transcripts',
      'Paraphrase guide + Question Anatomy: structured reasoning tools applicable to any IELTS topic',
    ],
  },
  {
    number: '05',
    icon: '📊',
    title: 'Built-in Retention — Analytics, Sprints & Habit Strips',
    summary: 'Retention is engineered into the product, not bolted on as an afterthought.',
    bullets: [
      'Analytics dashboard: band score trends per skill, gap-to-target, criteria breakdown',
      'Study Sprint Board: Kanban with 22 IELTS template tickets — daily clarity on what to do next',
      'History & Habit Strip: visual progress across all activity types keeps users returning',
      'Onboarding flow: profiles users by target band, weak skills, and study reason — personalised from day one',
    ],
  },
]

export default function PartnerLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tracking-tight text-foreground">IELTS Accelerator</span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Partner Deck
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/doi-tac"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tiếng Việt
            </Link>
            <a
              href="#contact"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Partner with us
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
          Partner & Investor Overview
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          The IELTS platform that meets learners{' '}
          <span className="text-blue-500">where their knowledge already is</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          An AI-powered exam preparation platform for professionals who need IELTS Band 6.5+
          under time pressure — using their existing domain expertise as the learning accelerant,
          not generic travel and food topics. Primary beachhead: software engineers.
          Designed to scale across any professional domain.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#value-points"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors sm:w-auto"
          >
            See our 5 key advantages
          </a>
          <a
            href="#contact"
            className="w-full rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors sm:w-auto"
          >
            Request a demo
          </a>
        </div>
      </section>

      {/* ── Market Stats ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {[
            { value: '3.7M+', label: 'IELTS tests per year' },
            { value: '25M+', label: 'software developers globally' },
            { value: '$500+', label: 'avg IELTS prep spend' },
            { value: '20+', label: 'AI-powered tools' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-6 py-8 text-center">
              <span className="text-2xl font-extrabold text-foreground sm:text-3xl">{value}</span>
              <span className="mt-1 text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 Value Points ───────────────────────────────────────────────────── */}
      <section id="value-points" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
            Why we win
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            5 reasons this platform stands apart
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Each advantage compounds on the others — together they create a defensible, high-retention product.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {TOP_5_VALUE_POINTS.map(({ number, icon, title, summary, bullets }) => (
            <div
              key={number}
              className="rounded-2xl border border-border bg-card p-8 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Number + icon */}
                <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-center lg:gap-2 lg:w-20">
                  <span className="text-3xl font-black text-blue-500/30">{number}</span>
                  <span className="text-3xl">{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{summary}</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 shrink-0 text-blue-500">&#x2714;</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitive Matrix ───────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Competitive landscape
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              We occupy a differentiated position
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No other platform combines tech-domain content with a strict AI examiner and engineering-grade tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-left font-semibold text-foreground">Feature</th>
                  <th className="pb-4 text-center font-bold text-blue-400">IELTS Accelerator</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">IELTS.org</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">British Council</th>
                  <th className="pb-4 text-center font-medium text-muted-foreground">Magoosh</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { attribute: 'Tech-domain content', us: true, a: false, b: false, c: false },
                  { attribute: 'AI strict examiner (not tutor)', us: true, a: false, b: false, c: false },
                  { attribute: 'Connected Speech analysis', us: true, a: false, b: false, c: false },
                  { attribute: 'Wrong Decision Log', us: true, a: false, b: false, c: false },
                  { attribute: '4-skill AI scoring', us: true, a: true, b: false, c: true },
                  { attribute: 'Sprint / Kanban study board', us: true, a: false, b: false, c: false },
                  { attribute: 'Free tier available', us: true, a: false, b: false, c: true },
                ].map(({ attribute, us, a, b, c }) => (
                  <tr key={attribute} className="border-b border-border last:border-0">
                    <td className="py-3 pr-6 text-muted-foreground">{attribute}</td>
                    <td className="py-3 text-center">
                      {us
                        ? <span className="font-bold text-blue-400">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {a
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {b
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                    <td className="py-3 text-center">
                      {c
                        ? <span className="text-green-500">&#x2714;</span>
                        : <span className="text-muted-foreground/40">&#x2013;</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Product Demo Mockup ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              In-product experience
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              A real IELTS examiner in their pocket
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI never helps. It questions, probes, and challenges — exactly like an IELTS examiner.
              Band score and detailed criteria feedback only appear after the session ends.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Chrome Speech-to-Text — hands-free practice',
                'Filler word detection: "um", "uh", "like", "you know"',
                'Band score across all 4 IELTS speaking criteria',
                'Tech topics the user already understands deeply',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-blue-500">&#x2714;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">AI Examiner — Speaking Part 1</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="self-start max-w-xs rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground">
                Do you think working from home has changed how software teams communicate?
              </div>
              <div className="self-end max-w-xs rounded-xl rounded-tr-none bg-blue-600 px-4 py-3 text-sm text-white">
                Yes, significantly. Async tools like Slack have replaced a lot of real-time discussion in distributed teams...
              </div>
              <div className="self-start max-w-xs rounded-xl rounded-tl-none bg-muted px-4 py-3 text-sm text-foreground">
                And would you say that is always a positive development?
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Post-session band estimate</span>
                <span className="font-semibold text-blue-400">6.5</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-blue-500" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Task Response: 6.5</span>
                <span>Coherence: 7.0</span>
                <span>Lexical: 6.0</span>
                <span>Grammar: 6.5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnership Tiers ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400">
              Partnership opportunities
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Multiple ways to get involved
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We are looking for strategic partners, distribution channels, and seed investors.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              {
                tier: 'Distribution Partner',
                description: 'Coding bootcamps, developer communities, tech companies with engineers needing IELTS.',
                perks: [
                  'Revenue share on referred users',
                  'White-label option for enterprise',
                  'Custom domain content',
                  'Analytics dashboard for your cohort',
                ],
                cta: 'Discuss distribution',
              },
              {
                tier: 'Strategic Investor',
                description: 'Seed round open. Looking for EdTech, AI, or SEA-focused investors aligned with our vision.',
                perks: [
                  'Equity participation',
                  'Board observer seat (lead)',
                  'Monthly investor updates',
                  'First right on follow-on',
                ],
                cta: 'Request pitch deck',
                highlight: true,
              },
              {
                tier: 'Integration Partner',
                description: 'LMS platforms, HR tools, immigration services, and language testing orgs.',
                perks: [
                  'API access for score data',
                  'Co-marketing opportunities',
                  'Joint case studies',
                  'Priority feature roadmap input',
                ],
                cta: 'Explore integration',
              },
            ].map(({ tier, description, perks, cta, highlight }) => (
              <div
                key={tier}
                className={`flex flex-col rounded-2xl p-8 ${
                  highlight
                    ? 'border-2 border-blue-500 bg-background'
                    : 'border border-border bg-background'
                }`}
              >
                {highlight && (
                  <div className="mb-4 self-start rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    Primary focus
                  </div>
                )}
                <h3 className="mb-2 text-base font-bold text-foreground">{tier}</h3>
                <p className="mb-6 text-xs leading-relaxed text-muted-foreground">{description}</p>
                <ul className="mb-8 flex flex-col gap-2">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className={`mt-0.5 shrink-0 ${highlight ? 'text-blue-500' : 'text-muted-foreground'}`}>
                        &#x2714;
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-auto rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors ${
                    highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact form ─────────────────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Get in touch
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to explore a partnership?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Fill in the form and we will reply to your email within 24 hours.
              You will also receive a confirmation immediately after submitting.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <ContactForm lang="en" />
          </div>
          <p className="mt-4 text-center text-xs text-faint">
            Prefer to try first?{' '}
            <Link href="/login" className="underline hover:text-muted-foreground transition-colors">
              Sign in and explore the product live
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
          <span className="text-xs text-faint text-center sm:text-left">
            IELTS Accelerator &mdash; AI-powered IELTS prep for software engineers
          </span>
          <div className="flex items-center gap-4 text-xs text-faint">
            <Link href="/" className="hover:text-muted-foreground transition-colors">
              User landing page
            </Link>
            <Link href="/login" className="hover:text-muted-foreground transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
