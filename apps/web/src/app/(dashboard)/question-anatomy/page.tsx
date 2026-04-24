import { QUESTION_SKILL_SECTIONS } from '@/lib/guides/question-anatomy'
import { QuestionAnatomyGuide } from './question-anatomy-guide'

export default function QuestionAnatomyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 xl:max-w-4xl 2xl:max-w-6xl">

      {/* Hero */}
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 px-8 py-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Cross-skill strategy
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Question Anatomy</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Every IELTS question is built from distinct parts — each giving you a specific instruction
          before you read, listen, speak, or write a single word. Decoding those parts takes 10–15
          seconds and tells you exactly what type of answer to find, what to exclude, and what
          language pattern to scan for.
        </p>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-100 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
            Why it matters
          </p>
          <p className="text-sm text-blue-900">
            Most wrong answers come from reacting to the <em>topic</em> of a question rather than its{' '}
            <em>structure</em>. A question about sugar that contains &quot;other than acid-producing
            bacteria&quot; is not asking about bacteria — it is asking about something else entirely. The
            structure tells you that; the topic distracts you from it.
          </p>
        </div>
      </div>

      {/* Role legend */}
      <section>
        <h2 className="mb-3 text-base font-bold text-gray-900">The 7 Question Roles</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLE_LEGEND.map((r) => (
            <div key={r.role} className={`rounded-lg border p-3 ${r.bg} ${r.border}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${r.badge}`}>
                  {r.label}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${r.text}`}>{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skill tabs + examples */}
      <QuestionAnatomyGuide sections={QUESTION_SKILL_SECTIONS} />

    </div>
  )
}

const ROLE_LEGEND = [
  {
    role: 'question-word',
    label: 'Question word',
    description: 'What / Who / Where / When / How many — tells you the grammatical form of the answer.',
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-600',
  },
  {
    role: 'category',
    label: 'Category',
    description: '"What fruit", "What type of" — narrows the answer to a specific class of noun. Anything outside that class is wrong.',
    bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-600',
  },
  {
    role: 'exclusion',
    label: 'Exclusion',
    description: '"Other than X", "apart from Y" — one answer is already named and must be skipped. Find that item first, then look for the different one.',
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', badge: 'bg-rose-600',
  },
  {
    role: 'hedge',
    label: 'Hedge signal',
    description: '"Is suggested to", "may be", "could be" — the source text will use uncertain language, not a definite claim.',
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-500',
  },
  {
    role: 'relationship',
    label: 'Relationship',
    description: 'The verb connecting subject to answer: "was linked to", "evolved to seek", "influenced". Scan for this pattern, not just topic keywords.',
    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-600',
  },
  {
    role: 'target',
    label: 'Target',
    description: 'The subject being described or affected: "our teeth", "children". Anchors you to the right paragraph or section.',
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-600',
  },
  {
    role: 'time',
    label: 'Time constraint',
    description: '"In the past", "currently", "historically" — filters the answer to a specific time frame and eliminates irrelevant paragraphs.',
    bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-500',
  },
]
