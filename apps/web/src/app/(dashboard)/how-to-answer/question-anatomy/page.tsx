import Link from 'next/link'
import { QUESTION_SKILL_SECTIONS, ROLE_LABELS } from '@/lib/guides/question-anatomy'
import { QuestionAnatomyGuide } from './question-anatomy-guide'

export default function QuestionAnatomyPage() {
  const totalExamples = QUESTION_SKILL_SECTIONS.reduce((n, s) => n + s.examples.length, 0)

  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <div className="mb-6">
        <Link href="/how-to-answer" className="text-xs text-faint hover:text-muted-foreground">
          ← How to Answer
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Question Anatomy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {Object.keys(ROLE_LABELS).length} roles · {totalExamples} worked examples across all 4 skills — dissect every question before you read a word of the passage.
        </p>
      </div>

      {/* Why this matters */}
      <div className="mb-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 flex gap-3">
        <span className="shrink-0 text-base leading-none mt-0.5">💡</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-1">
            Why Question Anatomy matters
          </p>
          <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-300">
            Most wrong answers come not from misreading the passage — they come from misreading the question.
            Every IELTS question contains hidden instructions: the <strong>question word</strong> locks in your answer type,
            <strong> hedge signals</strong> restrict your evidence source, <strong>exclusion clauses</strong> flip the logic entirely.
            Decoding these roles in 10 seconds before you scan saves more marks than any comprehension technique.
          </p>
        </div>
      </div>

      <QuestionAnatomyGuide sections={QUESTION_SKILL_SECTIONS} />
    </div>
  )
}
