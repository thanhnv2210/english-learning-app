import { PARAPHRASE_GUIDES } from '@/lib/guides/paraphrase'
import { ParaphraseGuide } from './paraphrase-guide'

export default function ParaphrasePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 xl:max-w-4xl 2xl:max-w-5xl">

      {/* Hero */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-8 py-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Core IELTS skill
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Paraphrase</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Paraphrasing means expressing the same idea using different words and structure.
          In IELTS it is not just a writing technique — it is a reading skill, a test-taking
          strategy, and a marking criterion. Every exam question paraphrases the source material.
          Every model answer paraphrases the task prompt.
        </p>
        <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-100 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-800">
            Why it matters
          </p>
          <p className="text-sm text-indigo-900">
            Examiners are trained to penalise copied phrases under Task Achievement and Lexical
            Resource. In Reading, word-matching instead of meaning-matching is the single
            biggest cause of wrong answers. Mastering paraphrase unlocks at least 0.5 band points
            across all four skills.
          </p>
        </div>
      </div>

      {/* Level legend */}
      <section>
        <h2 className="mb-3 text-base font-bold text-gray-900">Three Levels of Paraphrase</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              level: 1,
              badge: 'Beginner',
              title: 'Synonym Substitution',
              desc: 'Replace individual words with synonyms or change word forms (noun → verb). Same grammar — different vocabulary.',
              bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge_bg: 'bg-green-600',
            },
            {
              level: 2,
              badge: 'Intermediate',
              title: 'Structural Restructuring',
              desc: 'Change the grammar — active ↔ passive, reorder clauses, positive ↔ negative. Same words can appear but the structure is new.',
              bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge_bg: 'bg-amber-600',
            },
            {
              level: 3,
              badge: 'Advanced',
              title: 'Concept-Level Rewrite',
              desc: 'Express the same idea through a completely different lens — change perspective, abstraction level, or merge/split clauses.',
              bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge_bg: 'bg-purple-600',
            },
          ].map((l) => (
            <div key={l.level} className={`rounded-lg border p-3 ${l.bg} ${l.border}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${l.badge_bg}`}>
                  Level {l.level}
                </span>
                <span className={`text-[10px] font-bold ${l.text}`}>{l.badge}</span>
              </div>
              <p className={`text-xs font-semibold mb-1 ${l.text}`}>{l.title}</p>
              <p className={`text-xs leading-relaxed ${l.text} opacity-80`}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <ParaphraseGuide guides={PARAPHRASE_GUIDES} />

    </div>
  )
}
