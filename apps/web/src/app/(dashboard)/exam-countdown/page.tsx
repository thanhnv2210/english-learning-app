import Link from 'next/link'
import {
  WEEK_PLANS,
  SKILL_PRIORITIES,
  CORE_TOPICS,
  GRAMMAR_STRUCTURES,
  VN_TECH_SKILL_PRIORITIES,
} from '@/lib/guides/exam-countdown'

export default function ExamCountdownPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 xl:max-w-4xl 2xl:max-w-7xl">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-8 py-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            2-Week Sprint
          </span>
          <span className="text-xs font-medium text-amber-700">Exam in ~14 days</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">2-Week Exam Sprint</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Two weeks is enough time to meaningfully raise your band — if you invest it in the
          right places. This guide applies ROI thinking to IELTS: skip low-frequency question
          types, double down on the patterns that appear in every exam, and drill the three
          grammar structures examiners use as evidence of Band 6.5 range.
        </p>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-100 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            ROI Mindset
          </p>
          <p className="text-sm text-amber-900">
            Your goal is not perfection — it is a <strong>reliable Band 6.5 across all four
            skills</strong>. Stop studying things that rarely appear. Start practising things that
            are guaranteed to appear. Every day you have counts.
          </p>
        </div>
      </div>

      {/* ── Week-by-Week Plan ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Week-by-Week Plan</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {WEEK_PLANS.map((week) => (
            <div
              key={week.week}
              className="rounded-xl border border-amber-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                  {week.week}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{week.label}</p>
                  <p className="text-xs text-amber-600">{week.focus}</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {week.dailyItems.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skill Priorities ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-gray-900">Skill Priorities</h2>
        <p className="mb-4 text-sm text-gray-500">
          Where to invest your time — and what to deliberately skip.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SKILL_PRIORITIES.map((skill) => (
            <div
              key={skill.skill}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">{skill.icon}</span>
                <p className="font-semibold text-gray-900">{skill.skill}</p>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Focus On
                </p>
                <ul className="space-y-2">
                  {skill.focusOn.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-gray-700">
                      <span className="mt-0.5 shrink-0 text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                  Skip
                </p>
                <ul className="space-y-2">
                  {skill.skip.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed">
                      <span className="mt-0.5 shrink-0 text-red-400">✕</span>
                      <span className="text-gray-400 line-through decoration-red-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vietnamese Tech Engineer Profile ─────────────────────────────────── */}
      <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-6 py-7">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            🇻🇳 Vietnamese Tech Engineer
          </span>
          <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700">
            Previous score: 5.5 all skills → Target: 6.5
          </span>
        </div>

        <h2 className="mb-1 text-lg font-bold text-gray-900">
          Skill Priority for You — Ranked by ROI
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Based on your 5.5 baseline and tech background, this is the order to invest your
          two weeks. Effort is relative to the band gain you can realistically achieve.
        </p>

        <div className="flex flex-col gap-4">
          {VN_TECH_SKILL_PRIORITIES.map((item) => {
            const effortColor = {
              'Low':          'bg-green-100 text-green-700',
              'Medium':       'bg-blue-100 text-blue-700',
              'Medium-High':  'bg-amber-100 text-amber-700',
              'High':         'bg-red-100 text-red-700',
            }[item.effort]

            const rankColor = [
              'bg-green-500',
              'bg-blue-500',
              'bg-amber-500',
              'bg-red-400',
            ][item.rank - 1]

            return (
              <div key={item.skill} className="rounded-xl border border-indigo-100 bg-white p-5">
                {/* Row 1: rank + skill + badges */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${rankColor}`}>
                    {item.rank}
                  </span>
                  <span className="text-base">{item.icon}</span>
                  <span className="font-semibold text-gray-900">{item.skill}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${effortColor}`}>
                    Effort: {item.effort}
                  </span>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    Expected gain: {item.expectedGain}
                  </span>
                </div>

                {/* Why */}
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{item.why}</p>

                {/* Tips */}
                <ul className="space-y-2">
                  {item.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-gray-700">
                      <span className="mt-0.5 shrink-0 text-indigo-400">▸</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Core Topics ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-gray-900">5 Core Topics to Master</h2>
        <p className="mb-4 text-sm text-gray-500">
          These topics appear in every IELTS exam across all four skills. Learn the vocabulary
          for each, then practise using the words in your writing and speaking sessions.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {CORE_TOPICS.map((topic) => (
            <div
              key={topic.name}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{topic.icon}</span>
                <p className="text-sm font-semibold text-gray-900">{topic.name}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topic.keyVocab.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          For deeper topic breakdowns, frameworks, and vocabulary examples →{' '}
          <Link href="/topic-ideas" className="text-blue-500 hover:underline">
            Topic Ideas
          </Link>
        </p>
      </section>

      {/* ── Collocations CTA ─────────────────────────────────────────────────── */}
      <section className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl">🧩</span>
          <div className="flex-1">
            <p className="mb-1 font-semibold text-gray-900">Build Your Collocation Bank</p>
            <p className="mb-1 text-sm leading-relaxed text-gray-600">
              Collocations — natural word pairings like <em>raise awareness</em>,{' '}
              <em>significant increase</em>, or <em>play a crucial role</em> — are the fastest
              way to raise your Lexical Resource band in both Writing and Speaking.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Use the Collocation Library to search by word or phrase, save the ones that matter
              to you, and filter by the{' '}
              <strong className="text-amber-700">All 3 Skills</strong> chip to find collocations
              that work in Writing Task 1, Writing Task 2, <em>and</em> Speaking — maximum
              return for the time you invest in learning them.
            </p>
            <Link
              href="/collocations"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Open Collocation Library →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Grammar Structures ───────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-gray-900">
          3 High-ROI Grammar Structures
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Examiners use these three structures as evidence of Band 6.5 Grammatical Range. Each
          one takes one day to drill — practise writing five sentences with each before the exam.
        </p>
        <div className="flex flex-col gap-4">
          {GRAMMAR_STRUCTURES.map((g, i) => (
            <div key={g.name} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-semibold text-gray-900">{g.name}</p>
              </div>
              <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <p className="font-mono text-xs text-gray-500">{g.pattern}</p>
              </div>
              <div className="mb-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
                <p className="mb-0.5 text-xs font-medium text-amber-700">Example</p>
                <p className="text-sm italic text-gray-800">{g.example}</p>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">{g.whyItWorks}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
