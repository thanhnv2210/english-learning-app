import { db } from '@/lib/db'
import { wordPairs } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

type Seed = {
  wordA: string
  wordB: string
  explanation: string
  examples: string[]
  category: string
  rank?: number
}

const SEEDS: Seed[] = [
  // ── Regional (British vs American) ──────────────────────────────────────────
  {
    wordA: 'onward',
    wordB: 'onwards',
    category: 'Regional',
    explanation: 'Both mean "forward in time, space, or progress." "Onward" is preferred in American English; "onwards" is more common in British, Australian, and Irish English. Both are universally understood.',
    examples: [
      'From this point onward / onwards, stricter policies will apply.',
      'The project moved onward / onwards despite setbacks.',
    ],
    rank: 4,
  },
  {
    wordA: 'toward',
    wordB: 'towards',
    category: 'Regional',
    explanation: '"Toward" is standard in American English; "towards" is the British/Australian preference. Both are correct and interchangeable in meaning — they indicate direction or movement.',
    examples: [
      'The government is moving toward / towards a greener economy.',
      'She walked toward / towards the conference hall.',
    ],
    rank: 4,
  },
  {
    wordA: 'while',
    wordB: 'whilst',
    category: 'Regional',
    explanation: 'Both mean "during the time that" or "although." "Whilst" is formal British English and increasingly rare; "while" is universal and preferred in American and modern British writing.',
    examples: [
      'While / Whilst automation increases efficiency, it displaces some workers.',
      'He continued coding while / whilst listening to music.',
    ],
    rank: 4,
  },
  {
    wordA: 'among',
    wordB: 'amongst',
    category: 'Regional',
    explanation: '"Among" is the standard American form; "amongst" is a formal British variant. Both mean "in the middle of" or "within a group." "Among" is increasingly dominant in modern writing globally.',
    examples: [
      'Among / Amongst the solutions proposed, renewable energy stands out.',
      'There is growing disagreement among / amongst researchers.',
    ],
    rank: 3,
  },
  {
    wordA: 'amid',
    wordB: 'amidst',
    category: 'Regional',
    explanation: '"Amid" is the modern standard; "amidst" is a formal/archaic British variant. Both mean "surrounded by" or "in the middle of a situation." "Amid" is recommended in academic writing.',
    examples: [
      'Amid / Amidst rising inflation, consumers are cutting spending.',
      'The talks continued amid / amidst tensions.',
    ],
    rank: 3,
  },
  {
    wordA: 'learned',
    wordB: 'learnt',
    category: 'Regional',
    explanation: 'Both are past tense/past participle of "learn." "Learned" is standard American English; "learnt" is the British/Australian preference. In academic writing, follow the regional convention of your audience.',
    examples: [
      'Researchers have learned / learnt from past failures.',
      'She learned / learnt the technique quickly.',
    ],
    rank: 3,
  },
  {
    wordA: 'burned',
    wordB: 'burnt',
    category: 'Regional',
    explanation: 'Both are valid past forms of "burn." "Burned" is preferred in American English; "burnt" is common in British/Australian English. As an adjective before a noun ("burnt toast"), "burnt" is standard in all varieties.',
    examples: [
      'The factory burned / burnt down last year.',
      'The data was burned / burnt onto a disc.',
    ],
    rank: 3,
  },
  {
    wordA: 'spelled',
    wordB: 'spelt',
    category: 'Regional',
    explanation: '"Spelled" is the American past tense of "spell"; "spelt" is used in British English and also refers to a type of grain. In IELTS writing aimed at a British examiner, either is acceptable.',
    examples: [
      'The candidate spelled / spelt the technical term correctly.',
      'Consistency in how a word is spelled / spelt matters in formal writing.',
    ],
    rank: 3,
  },
  {
    wordA: 'gray',
    wordB: 'grey',
    category: 'Spelling',
    explanation: '"Gray" is the American spelling; "grey" is the British/Australian spelling. They are identical in meaning. In IELTS, use the spelling that matches your chosen variety consistently.',
    examples: [
      'The graph shows a gray / grey area of uncertainty.',
      'Policy makers operate in a gray / grey zone between regulation and innovation.',
    ],
    rank: 3,
  },
  {
    wordA: 'analyze',
    wordB: 'analyse',
    category: 'Spelling',
    explanation: '"Analyze" is American; "analyse" is British/Australian. The meaning is identical. IELTS Academic accepts both — what matters is consistency throughout your essay.',
    examples: [
      'The study aims to analyze / analyse consumption patterns.',
      'Researchers analyze / analyse data using statistical models.',
    ],
    rank: 4,
  },
  {
    wordA: 'organize',
    wordB: 'organise',
    category: 'Spelling',
    explanation: 'American English uses "-ize" endings; British/Australian English prefers "-ise" (though "-ize" is also accepted in British formal writing, especially Oxford style). The meaning is identical.',
    examples: [
      'Companies need to organize / organise their data effectively.',
      'The government organized / organised a public consultation.',
    ],
    rank: 3,
  },
  {
    wordA: 'center',
    wordB: 'centre',
    category: 'Spelling',
    explanation: '"Center" is American spelling; "centre" is British/Australian. Both refer to the middle point or a focal place. Choose based on your audience and stay consistent.',
    examples: [
      'The city center / centre has seen rapid commercial growth.',
      'Research centers / centres are attracting global talent.',
    ],
    rank: 3,
  },
  // ── Register ─────────────────────────────────────────────────────────────────
  {
    wordA: 'buy',
    wordB: 'purchase',
    category: 'Register',
    explanation: '"Buy" is informal/everyday; "purchase" is formal and preferred in academic or professional writing. Use "purchase" in IELTS Task 2 essays to elevate register.',
    examples: [
      'Consumers are increasingly likely to purchase / buy products online.',
      'The decision to purchase / buy property is influenced by interest rates.',
    ],
    rank: 4,
  },
  {
    wordA: 'use',
    wordB: 'utilise',
    category: 'Register',
    explanation: '"Use" is neutral and universally clear; "utilise" (or "utilize") is formal but can sound inflated if overused. "Utilise" specifically implies making practical use of something available — it is not always interchangeable.',
    examples: [
      'Developers can use / utilise cloud platforms to scale rapidly.',
      'The framework uses / utilises a modular architecture.',
    ],
    rank: 4,
  },
  {
    wordA: 'start',
    wordB: 'commence',
    category: 'Register',
    explanation: '"Start" is everyday language; "commence" is formal. Use "commence" in formal essays to vary sentence structure and raise lexical register.',
    examples: [
      'Construction will start / commence in the third quarter.',
      'The programme started / commenced with a keynote on AI ethics.',
    ],
    rank: 4,
  },
  {
    wordA: 'end',
    wordB: 'conclude',
    category: 'Register',
    explanation: '"End" is neutral; "conclude" is more formal and implies a reasoned or deliberate finish. In academic essays, "conclude" is preferred for essays and arguments.',
    examples: [
      'The study ends / concludes with a set of policy recommendations.',
      'The debate ended / concluded without consensus.',
    ],
    rank: 4,
  },
  {
    wordA: 'show',
    wordB: 'demonstrate',
    category: 'Register',
    explanation: '"Show" is simple and conversational; "demonstrate" is formal and implies evidence-backed proof. Prefer "demonstrate" in IELTS academic writing.',
    examples: [
      'The data shows / demonstrates a clear upward trend.',
      'This example shows / demonstrates the importance of data privacy.',
    ],
    rank: 5,
  },
  {
    wordA: 'get',
    wordB: 'obtain',
    category: 'Register',
    explanation: '"Get" is informal; "obtain" is the academic equivalent. Replace "get" with "obtain," "acquire," "receive," or "achieve" depending on context in formal essays.',
    examples: [
      'Students can obtain / get a scholarship through competitive exams.',
      'It is difficult to obtain / get accurate data in this field.',
    ],
    rank: 4,
  },
  // ── Formality ────────────────────────────────────────────────────────────────
  {
    wordA: 'but',
    wordB: 'however',
    category: 'Formality',
    explanation: '"But" starts a clause and is informal/neutral; "however" is a formal connector used mid-sentence (with commas) or at the start of a sentence. In IELTS essays, use "however" for contrast rather than "but" at the start of sentences.',
    examples: [
      'Technology brings benefits. However / But, it also creates new risks.',
      'The policy reduced costs; however / but it had unintended consequences.',
    ],
    rank: 5,
  },
  {
    wordA: 'also',
    wordB: 'furthermore',
    category: 'Formality',
    explanation: '"Also" is neutral and common; "furthermore" is a formal additive connector that signals a stronger, additional point. Use "furthermore" (or "moreover") in body paragraphs to raise coherence scores.',
    examples: [
      'Furthermore / Also, remote work reduces commuting costs.',
      'The benefits are economic; furthermore / also, there are social advantages.',
    ],
    rank: 5,
  },
  // ── Context ──────────────────────────────────────────────────────────────────
  {
    wordA: 'fewer',
    wordB: 'less',
    category: 'Context',
    explanation: '"Fewer" applies to countable nouns (people, jobs, cars); "less" applies to uncountable nouns (time, money, water). A common IELTS mistake is writing "less people" — the correct form is "fewer people."',
    examples: [
      'There are fewer / less job opportunities in rural areas.',
      'The policy resulted in fewer / less emissions per capita.',
    ],
    rank: 5,
  },
  {
    wordA: 'amount',
    wordB: 'number',
    category: 'Context',
    explanation: '"Amount" collocates with uncountable nouns; "number" with countable nouns. "A large amount of research" is correct; "a large number of studies" is correct. Mixing them is a frequent IELTS error.',
    examples: [
      'A large number / amount of studies support this view.',
      'The amount / number of water consumed daily has increased.',
    ],
    rank: 5,
  },
  {
    wordA: 'affect',
    wordB: 'impact',
    category: 'Context',
    explanation: '"Affect" is usually a verb meaning to influence; "impact" can be a noun or verb. "Impact on" (noun) and "impact" (verb) are both common in academic writing. Avoid overusing "impact" as it can sound vague.',
    examples: [
      'Climate change affects / impacts agricultural output.',
      'The new policy will affect / impact millions of workers.',
    ],
    rank: 4,
  },
  {
    wordA: 'raise',
    wordB: 'rise',
    category: 'Context',
    explanation: '"Raise" is transitive — it needs an object (you raise something). "Rise" is intransitive — it happens on its own. A common error: "the temperature raised" should be "the temperature rose."',
    examples: [
      'The government raised / rose taxes last year.',
      'Temperatures raise / rise significantly in summer months.',
    ],
    rank: 5,
  },
  {
    wordA: 'ensure',
    wordB: 'assure',
    category: 'Context',
    explanation: '"Ensure" means to make certain that something happens (ensure safety); "assure" means to tell someone confidently to remove doubt (assure someone). In academic writing, "ensure" is far more common.',
    examples: [
      'Governments must ensure / assure that data privacy laws are enforced.',
      'The report ensures / assures the reliability of the findings.',
    ],
    rank: 4,
  },
]

async function main() {
  console.log(`Seeding ${SEEDS.length} word pairs…`)
  let inserted = 0

  for (const seed of SEEDS) {
    const existing = await db
      .select({ id: wordPairs.id })
      .from(wordPairs)
      .where(and(eq(wordPairs.wordA, seed.wordA), eq(wordPairs.wordB, seed.wordB), eq(wordPairs.isSystem, true)))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(wordPairs).values({
        wordA: seed.wordA,
        wordB: seed.wordB,
        explanation: seed.explanation,
        examples: seed.examples,
        category: seed.category,
        rank: seed.rank ?? 3,
        isSystem: true,
        userId: null,
      })
      inserted++
    }
  }

  console.log(`Done — inserted ${inserted} new pairs (${SEEDS.length - inserted} already existed).`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
