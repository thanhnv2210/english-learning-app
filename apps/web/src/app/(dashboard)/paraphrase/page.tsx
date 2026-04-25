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

      {/* Cannot paraphrase */}
      <section>
        <h2 className="mb-1 text-base font-bold text-gray-900">Words You Cannot Paraphrase</h2>
        <p className="mb-3 text-xs leading-relaxed text-gray-500">
          Some words have fixed meanings — replacing them creates a different meaning or sounds unnatural.
          Recognising these saves you from forced synonyms that lower your Lexical Resource score.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Proper nouns',
              note: 'Names of people, places, organisations, and brands are fixed identifiers.',
              examples: ['UNESCO', 'Amazon', 'Einstein', 'Silicon Valley'],
              trap: 'Writing "the international educational body" every time instead of "UNESCO" wastes words and reads awkwardly. Use the proper noun directly.',
            },
            {
              name: 'Technical & scientific terms',
              note: 'Domain-specific words with precise meanings — no synonym carries the same definition.',
              examples: ['photosynthesis', 'GDP', 'bandwidth', 'mitochondria'],
              trap: '"Photosynthesis" cannot become "plant food-making". Use the term and demonstrate understanding through context, not synonym.',
            },
            {
              name: 'Numbers & statistics',
              note: 'Figures, percentages, and quantities are exact — they cannot be changed without changing the fact.',
              examples: ['75%', '2.5 million', '$300 billion', '1.2°C'],
              trap: 'Do not round or approximate numbers from a Task 1 chart — "approximately 75%" when the figure is exactly 75% misrepresents the data.',
            },
            {
              name: 'Dates & time references',
              note: 'Specific dates, years, and periods are fixed facts — rephrasing them alters the information.',
              examples: ['2023', 'the 1990s', 'Monday', 'three months'],
              trap: '"The year two thousand and twenty-three" instead of "2023" adds length without value. Keep time references in their standard form.',
            },
            {
              name: 'Acronyms & initialisms',
              note: 'Abbreviations stand for precise concepts — expanding them once is acceptable, but they are not synonyms for a paraphrase.',
              examples: ['DNA', 'WHO', 'IELTS', 'CO₂', 'AI'],
              trap: 'Replacing "DNA" with "genetic material" changes precision. You can expand once ("DNA (deoxyribonucleic acid)"), then use the acronym consistently.',
            },
            {
              name: 'Units of measurement',
              note: 'Standardised units are internationally fixed — changing them requires a unit conversion, not a paraphrase.',
              examples: ['kilometres', 'kilograms', 'degrees Celsius', 'litres'],
              trap: '"A long distance" instead of "500 kilometres" loses specific information. In Task 1, always keep the original unit from the data.',
            },
            {
              name: 'Task keyword (core topic)',
              note: 'The central concept of a Task 2 question sometimes has no true synonym — forcing one distorts the meaning.',
              examples: ['climate change', 'social media', 'globalisation', 'mental health'],
              trap: '"Climate change" → "atmospheric temperature fluctuation" sounds forced and loses clarity. Use the topic term naturally; vary it with light synonyms only when they are genuinely equivalent.',
            },
            {
              name: 'Hedge words & modal nuance',
              note: 'Words that soften or qualify a claim carry specific logical weight — swapping them changes the strength of the statement.',
              examples: ['may', 'could', 'suggests', 'appears to', 'tends to'],
              trap: '"The study suggests…" ≠ "The study proves…". In Reading T/F/NG, changing a hedge to a definitive claim turns a NOT GIVEN into a FALSE.',
            },
            {
              name: 'Quantifier precision',
              note: 'Words expressing exact scope or proportion are not freely interchangeable.',
              examples: ['all', 'most', 'some', 'few', 'none', 'a minority'],
              trap: '"Most people" ≠ "All people" ≠ "Some people". Swapping quantifiers in a paraphrase creates a logically different claim — a common trap in IELTS Reading.',
            },
          ].map((cat) => (
            <div key={cat.name} className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs leading-relaxed text-gray-500">{cat.note}</p>
              <div className="flex flex-wrap gap-1">
                {cat.examples.map((ex) => (
                  <span key={ex} className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-700">
                    {ex}
                  </span>
                ))}
              </div>
              <div className="rounded border border-rose-100 bg-rose-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-rose-400 mb-0.5">Watch out</p>
                <p className="text-xs leading-relaxed text-rose-800">{cat.trap}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guide */}
      <ParaphraseGuide guides={PARAPHRASE_GUIDES} />

    </div>
  )
}
