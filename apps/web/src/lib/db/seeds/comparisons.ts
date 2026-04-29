/**
 * Seed: comparison_entries
 *
 * Top 30 most commonly confused word pairs for IELTS Band 6.5–7.
 * Covers register, IELTS fit, intensity, and contrastive example pairs.
 *
 * Run with:
 *   pnpm db:seed:comparisons
 *
 * Safe to re-run — uses ON CONFLICT DO UPDATE to patch isSystem on existing rows.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from '../schema'
import type { ComparisonTerm, ComparisonExamplePair } from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

type SeedComparison = {
  termA: string
  termB: string
  category: string
  keyDifference: string
  dimensionA: ComparisonTerm
  dimensionB: ComparisonTerm
  examples: ComparisonExamplePair[]
}

const COMPARISONS: SeedComparison[] = [

  // ── Degree adverbs ────────────────────────────────────────────────────────────

  {
    termA: 'quite',
    termB: 'fairly',
    category: 'adverb',
    keyDifference: 'In British English, "quite" is ambiguous — before gradable adjectives it means "moderately" (quite good), but before absolute adjectives it means "completely" (quite perfect). "Fairly" always means "moderately" with no ambiguity, making it safer for IELTS writing.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Use with care — meaning shifts by adjective type', ieltsSpeaking: 'Natural and common in all parts', intensity: 3, note: '"Quite brilliant" = completely brilliant; "quite good" = moderately good' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Safer choice — consistently means moderately', ieltsSpeaking: 'Natural, slightly less emphatic than quite', intensity: 2 },
    examples: [
      { context: 'Evaluating a policy outcome', withA: 'The results were quite promising, suggesting the initiative had some positive impact.', withB: 'The results were fairly promising, suggesting the initiative had some positive impact.' },
      { context: 'Describing research findings', withA: 'The correlation between the two variables is quite strong.', withB: 'The correlation between the two variables is fairly strong.' },
    ],
  },

  {
    termA: 'fairly',
    termB: 'rather',
    category: 'adverb',
    keyDifference: '"Rather" carries a slightly critical or surprised tone, often implying the degree is higher than expected or desirable. "Fairly" is neutral and simply means "moderately". In IELTS writing, "rather" can subtly convey the writer\'s stance.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Safe, neutral modifier for both tasks', ieltsSpeaking: 'Natural and unremarkable', intensity: 2 },
    dimensionB: { register: 'formal', ieltsWriting: 'Adds critical/evaluative tone — useful in Task 2', ieltsSpeaking: 'Sounds educated and deliberate in Part 3', intensity: 3, note: 'Often implies mild criticism: "rather expensive" = more expensive than ideal' },
    examples: [
      { context: 'Commenting on government spending', withA: 'The allocated budget was fairly limited for a project of this scale.', withB: 'The allocated budget was rather limited for a project of this scale.' },
      { context: 'Describing a social trend', withA: 'The pace of change has been fairly slow over the past decade.', withB: 'The pace of change has been rather slow over the past decade.' },
    ],
  },

  {
    termA: 'almost',
    termB: 'nearly',
    category: 'adverb',
    keyDifference: 'Both mean "not quite" and are largely interchangeable. However, "nearly" is more common with numbers and measurements, while "almost" collocates more naturally with negatives ("almost never", "almost nothing") and in fixed phrases.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Preferred with negatives and abstract quantities', ieltsSpeaking: 'Natural in all parts', intensity: 4, note: 'Stronger in negative contexts: "almost no evidence"' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Preferred with numbers and measurable quantities', ieltsSpeaking: 'Natural and common', intensity: 4, note: '"Nearly 80%" sounds more natural than "almost 80%"' },
    examples: [
      { context: 'Describing data in a report', withA: 'Almost all of the respondents reported feeling stressed at work.', withB: 'Nearly all of the respondents reported feeling stressed at work.' },
      { context: 'Discussing statistical trends', withA: 'The unemployment rate reached almost 12% during the recession.', withB: 'The unemployment rate reached nearly 12% during the recession.' },
    ],
  },

  {
    termA: 'especially',
    termB: 'particularly',
    category: 'adverb',
    keyDifference: 'Both emphasise that something applies more to one thing than others. "Particularly" is slightly more formal and is preferred in academic writing. "Especially" is more common in speech and informal writing, and is used more freely in fixed positions.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Acceptable but slightly informal for Task 2', ieltsSpeaking: 'Very natural and common in all parts', intensity: 4 },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred in academic Task 2 writing', ieltsSpeaking: 'Sounds polished in Part 3 discussions', intensity: 4 },
    examples: [
      { context: 'Discussing the effects of pollution', withA: 'Air pollution is harmful to health, especially for children and the elderly.', withB: 'Air pollution is harmful to health, particularly for children and the elderly.' },
      { context: 'Analysing education systems', withA: 'The gap in attainment is especially pronounced in rural areas.', withB: 'The gap in attainment is particularly pronounced in rural areas.' },
    ],
  },

  // ── Verbs ─────────────────────────────────────────────────────────────────────

  {
    termA: 'use',
    termB: 'utilise',
    category: 'verb',
    keyDifference: '"Utilise" does not mean the same as "use" — it specifically means to make practical or effective use of something that might otherwise go unused. Using "utilise" as a synonym for "use" is a common IELTS mistake that signals poor lexical precision and can lower your score.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Preferred — direct and precise', ieltsSpeaking: 'Natural and universally understood', note: 'Default choice in nearly all contexts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Only use when meaning "make effective use of resources"', ieltsSpeaking: 'Sounds unnatural if misused — avoid unless precise', note: '"Utilise solar panels" ✓; "utilise a pen to write" ✗' },
    examples: [
      { context: 'Discussing technology in education', withA: 'Schools increasingly use digital tools to deliver lessons remotely.', withB: 'Schools increasingly utilise existing digital infrastructure to deliver lessons remotely.' },
      { context: 'Environmental resource management', withA: 'Farmers use irrigation systems to water their crops.', withB: 'Farmers utilise reclaimed water through irrigation systems, reducing waste.' },
    ],
  },

  {
    termA: 'show',
    termB: 'demonstrate',
    category: 'verb',
    keyDifference: '"Demonstrate" is more formal and implies deliberate proof or evidence. "Show" is neutral and broadly applicable. In IELTS Task 1 data description and Task 2 arguments, "demonstrate" carries more academic weight.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Acceptable but less academic', ieltsSpeaking: 'Natural and common in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred for data description in Task 1 and evidence in Task 2', ieltsSpeaking: 'Appropriate in Part 3 arguments' },
    examples: [
      { context: 'Describing a graph', withA: 'The data show a steady increase in renewable energy adoption between 2010 and 2020.', withB: 'The data demonstrate a steady increase in renewable energy adoption between 2010 and 2020.' },
      { context: 'Building an argument in an essay', withA: 'These examples show that stricter regulations are necessary.', withB: 'These examples demonstrate that stricter regulations are necessary.' },
    ],
  },

  {
    termA: 'get',
    termB: 'obtain',
    category: 'verb',
    keyDifference: '"Get" is informal and should generally be avoided in IELTS Academic writing. "Obtain" is formal, more precise, and is the standard choice for academic contexts involving acquiring or receiving something through effort.',
    dimensionA: { register: 'informal', ieltsWriting: 'Avoid in Task 1 and Task 2 — too informal', ieltsSpeaking: 'Natural in all speaking parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred in both tasks', ieltsSpeaking: 'Sounds polished in Part 3; slightly unnatural in casual Part 1' },
    examples: [
      { context: 'Discussing access to healthcare', withA: 'Many people in rural areas struggle to get adequate medical treatment.', withB: 'Many people in rural areas struggle to obtain adequate medical treatment.' },
      { context: 'Describing academic or career achievement', withA: 'Students who get a university degree earn significantly more over their lifetime.', withB: 'Students who obtain a university degree earn significantly more over their lifetime.' },
    ],
  },

  {
    termA: 'help',
    termB: 'assist',
    category: 'verb',
    keyDifference: '"Assist" is more formal than "help" and implies a supportive or secondary role. "Help" is neutral and more versatile. In academic IELTS writing, "assist" fits better in formal arguments, but overusing it sounds stilted.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Universally acceptable in both tasks', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Stronger in Task 2 academic arguments', ieltsSpeaking: 'Can sound overly formal in Part 1; fine in Part 3' },
    examples: [
      { context: 'Discussing the role of technology', withA: 'Digital tools help students learn at their own pace.', withB: 'Digital tools assist students in learning at their own pace.' },
      { context: 'Analysing government responsibilities', withA: 'The programme was designed to help low-income families access housing.', withB: 'The programme was designed to assist low-income families in accessing housing.' },
    ],
  },

  {
    termA: 'make',
    termB: 'cause',
    category: 'verb',
    keyDifference: '"Cause" implies a direct, often negative causal link, while "make" is versatile but informal in causal constructions. In academic writing, "cause" is preferred for discussing problems, while "make" in causal sense ("make it happen") can sound vague.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Avoid in causal sentences — prefer cause/lead to/result in', ieltsSpeaking: 'Natural and flexible' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Preferred for describing negative consequences', ieltsSpeaking: 'Clear and precise in Part 2/3 discussions', note: 'Best for direct negative causation; use "lead to" for indirect chains' },
    examples: [
      { context: 'Discussing environmental damage', withA: 'Industrial waste makes the water in rivers unsafe for human consumption.', withB: 'Industrial waste causes the water in rivers to become unsafe for human consumption.' },
      { context: 'Analysing social issues', withA: 'Unemployment makes people feel isolated and hopeless.', withB: 'Unemployment causes feelings of isolation and hopelessness.' },
    ],
  },

  {
    termA: 'raise',
    termB: 'rise',
    category: 'verb',
    keyDifference: '"Raise" is transitive — it requires an object (you raise something). "Rise" is intransitive — it has no object (something rises on its own). This is one of the most common grammar errors in IELTS and directly affects Grammatical Range and Accuracy.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Transitive — always needs an object: "raise prices/standards/concerns"', ieltsSpeaking: 'Common in Part 2/3: "raise the issue of..."', note: 'Past tense: raised; past participle: raised' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Intransitive — never takes an object: "prices rose", "temperatures rise"', ieltsSpeaking: 'Used in Part 1 trends: "crime rose sharply"', note: 'Past tense: rose; past participle: risen' },
    examples: [
      { context: 'Describing economic policy', withA: 'The government decided to raise interest rates to combat inflation.', withB: 'Interest rates rose sharply following the central bank\'s announcement.' },
      { context: 'Discussing educational standards', withA: 'Schools must raise academic standards to prepare students for the modern workforce.', withB: 'Academic standards have risen significantly in countries that invest heavily in teacher training.' },
    ],
  },

  {
    termA: 'affect',
    termB: 'effect',
    category: 'verb',
    keyDifference: '"Affect" is almost always a verb meaning to influence something. "Effect" is almost always a noun meaning a result or outcome. The key test: if you can substitute "influence", use "affect"; if you can substitute "result" or "consequence", use "effect".',
    dimensionA: { register: 'neutral', ieltsWriting: 'Verb — "Pollution affects health." Universally needed.', ieltsSpeaking: 'Essential in Part 2/3 cause-effect discussions', note: '"Effect" as a verb (to effect change) exists but is rare — avoid in IELTS' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Noun — "The effect of pollution on health is well-documented."', ieltsSpeaking: 'Used in Part 3: "What effect does X have on Y?"', note: 'Common collocations: have an effect, positive/negative effect, side effect' },
    examples: [
      { context: 'Discussing climate change', withA: 'Rising temperatures affect biodiversity by disrupting ecosystems.', withB: 'The effect of rising temperatures on biodiversity is becoming increasingly severe.' },
      { context: 'Analysing social media', withA: 'Social media can negatively affect young people\'s self-image.', withB: 'The effect of social media on young people\'s self-image is a growing concern.' },
    ],
  },

  // ── Conjunctions / connectors ─────────────────────────────────────────────────

  {
    termA: 'although',
    termB: 'despite',
    category: 'conjunction',
    keyDifference: '"Although" introduces a full clause (subject + verb). "Despite" is a preposition followed by a noun phrase or gerund (-ing). Using the wrong grammar structure after each is a direct Grammatical Range error in IELTS.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Followed by a clause: "Although X is true, Y..."', ieltsSpeaking: 'Natural in all parts for concession' },
    dimensionB: { register: 'formal', ieltsWriting: 'Followed by noun/gerund: "Despite the growth...", "Despite being..."', ieltsSpeaking: 'Sounds sophisticated in Part 3 — use to compress ideas' },
    examples: [
      { context: 'Discussing economic inequality', withA: 'Although economic growth has been strong, inequality has continued to widen.', withB: 'Despite strong economic growth, inequality has continued to widen.' },
      { context: 'Evaluating environmental policy', withA: 'Although governments have signed international agreements, emissions continue to rise.', withB: 'Despite signing international agreements, governments have failed to reduce emissions.' },
    ],
  },

  {
    termA: 'however',
    termB: 'nevertheless',
    category: 'conjunction',
    keyDifference: 'Both introduce contrast, but "nevertheless" is stronger — it implies the contrast is surprising or that something happens despite a significant obstacle. "However" is the default contrast connector. "Nevertheless" signals higher register and deeper contrast.',
    dimensionA: { register: 'formal', ieltsWriting: 'Default contrast connector — versatile for both tasks', ieltsSpeaking: 'Common in Part 3 balanced arguments' },
    dimensionB: { register: 'formal', ieltsWriting: 'Use when the contrast is particularly striking or concessive', ieltsSpeaking: 'Impressive in Part 3 — signals nuanced reasoning', note: '"Nonetheless" is a near-synonym of the same register' },
    examples: [
      { context: 'Balancing an argument about technology', withA: 'Technology has created new jobs. However, it has also made many traditional roles obsolete.', withB: 'Technology has created new jobs. Nevertheless, the displacement of traditional workers remains a serious concern.' },
      { context: 'Discussing renewable energy challenges', withA: 'Solar energy is expensive to install. However, it reduces long-term energy costs.', withB: 'Solar energy is expensive to install. Nevertheless, many governments have committed to large-scale adoption.' },
    ],
  },

  {
    termA: 'while',
    termB: 'whereas',
    category: 'conjunction',
    keyDifference: '"Whereas" is exclusively used for contrast between two clauses and carries a stronger sense of direct opposition. "While" can mean contrast OR simultaneous time ("while she studied"). In IELTS Task 1, "whereas" is clearer for comparing data.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Can be ambiguous — clarify if meaning contrast vs. time', ieltsSpeaking: 'Natural and versatile' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred for data contrast in Task 1 and argument contrast in Task 2', ieltsSpeaking: 'Sounds precise and academic in Part 3', note: 'Unambiguously means contrast — never means "at the same time"' },
    examples: [
      { context: 'Comparing countries in a graph', withA: 'While Country A saw a steady rise in exports, Country B experienced a sharp decline.', withB: 'Whereas Country A saw a steady rise in exports, Country B experienced a sharp decline.' },
      { context: 'Contrasting two social groups', withA: 'While urban residents enjoy better access to healthcare, rural populations often lack basic services.', withB: 'Whereas urban residents enjoy better access to healthcare, rural populations often lack basic services.' },
    ],
  },

  {
    termA: 'because',
    termB: 'due to',
    category: 'conjunction',
    keyDifference: '"Because" introduces a full clause (subject + verb). "Due to" is a prepositional phrase followed by a noun. This is a high-frequency grammar error — "due to" cannot directly follow a verb like "is" or "happened" when a full clause follows.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Followed by a clause: "...because the government failed..."', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Followed by a noun phrase: "due to the government\'s failure..."', ieltsSpeaking: 'Sounds more academic than "because of" in Part 3', note: '"Due to the fact that" + clause is acceptable but wordy — prefer "because"' },
    examples: [
      { context: 'Explaining rising costs', withA: 'Housing prices have increased because demand far exceeds supply in major cities.', withB: 'Housing prices have increased due to the imbalance between demand and supply in major cities.' },
      { context: 'Discussing environmental damage', withA: 'Many coral reefs are dying because ocean temperatures are rising.', withB: 'Many coral reefs are dying due to rising ocean temperatures.' },
    ],
  },

  {
    termA: 'so',
    termB: 'therefore',
    category: 'conjunction',
    keyDifference: '"So" is informal and should be avoided at the start of sentences in IELTS Academic writing. "Therefore" is formal, typically placed after a semicolon or at the start of a new sentence, and clearly marks logical consequence in academic arguments.',
    dimensionA: { register: 'informal', ieltsWriting: 'Avoid at sentence start in Task 2 — use therefore/thus/consequently', ieltsSpeaking: 'Natural and common — fine in all speaking parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred result connector for both tasks', ieltsSpeaking: 'Appropriate in Part 3 for logical conclusions', note: 'Synonyms of similar register: thus, consequently, as a result, hence' },
    examples: [
      { context: 'Arguing about education funding', withA: 'Investment in education is inadequate, so many schools lack basic resources.', withB: 'Investment in education is inadequate; therefore, many schools lack basic resources.' },
      { context: 'Discussing health outcomes', withA: 'Physical activity reduces the risk of chronic disease, so governments should promote it.', withB: 'Physical activity reduces the risk of chronic disease; therefore, governments should actively promote it.' },
    ],
  },

  {
    termA: 'also',
    termB: 'furthermore',
    category: 'conjunction',
    keyDifference: '"Furthermore" is more formal and signals that the next point is additional and equally or more important. "Also" is neutral but weak as a paragraph-opener in academic writing. "Furthermore" at the start of a sentence scores higher for Coherence.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Weak as a sentence starter — use mid-sentence instead', ieltsSpeaking: 'Natural and common in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Strong paragraph opener for adding a major supporting point', ieltsSpeaking: 'Impressive in Part 3 extended answers', note: 'Synonyms: in addition, moreover, what is more' },
    examples: [
      { context: 'Listing benefits of exercise', withA: 'Regular exercise improves cardiovascular health. It also strengthens the immune system.', withB: 'Regular exercise improves cardiovascular health. Furthermore, it strengthens the immune system and reduces the risk of chronic illness.' },
      { context: 'Arguing for investment in education', withA: 'Education increases individual earning potential. It also drives broader economic growth.', withB: 'Education increases individual earning potential. Furthermore, it serves as the primary driver of long-term economic growth.' },
    ],
  },

  {
    termA: 'despite',
    termB: 'in spite of',
    category: 'preposition',
    keyDifference: '"Despite" and "in spite of" are virtually identical in meaning — both are prepositional phrases of concession followed by a noun or gerund. "Despite" is slightly more common in modern academic writing and is more concise. "In spite of" can sound more emphatic.',
    dimensionA: { register: 'formal', ieltsWriting: 'Slightly preferred — more concise', ieltsSpeaking: 'Natural in Part 2/3' },
    dimensionB: { register: 'formal', ieltsWriting: 'Equally acceptable — can add slight emphasis', ieltsSpeaking: 'Slightly more emphatic tone in Part 3', note: 'Never write "inspite of" as one word — common spelling error' },
    examples: [
      { context: 'Discussing policy failures', withA: 'Despite significant investment, the healthcare system remains underfunded.', withB: 'In spite of significant investment, the healthcare system remains underfunded.' },
      { context: 'Evaluating environmental efforts', withA: 'Despite public awareness campaigns, recycling rates have stagnated.', withB: 'In spite of public awareness campaigns, recycling rates have stagnated.' },
    ],
  },

  // ── Adjectives ────────────────────────────────────────────────────────────────

  {
    termA: 'big',
    termB: 'significant',
    category: 'adjective',
    keyDifference: '"Big" is informal and vague — it should almost always be replaced in IELTS Academic writing. "Significant" is precise, formal, and implies the magnitude is meaningful or consequential, which is exactly the nuance academic writing requires.',
    dimensionA: { register: 'informal', ieltsWriting: 'Avoid — replace with significant, substantial, considerable, major', ieltsSpeaking: 'Natural in Part 1; replace with more precise words in Part 3' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred in both tasks for meaningful magnitude', ieltsSpeaking: 'Impressive in Part 3 — signals analytical thinking' },
    examples: [
      { context: 'Discussing economic change', withA: 'There has been a big increase in the number of people working remotely.', withB: 'There has been a significant increase in the number of people working remotely.' },
      { context: 'Evaluating an environmental problem', withA: 'Deforestation is a big problem in many tropical regions.', withB: 'Deforestation poses a significant threat to biodiversity in many tropical regions.' },
    ],
  },

  {
    termA: 'important',
    termB: 'crucial',
    category: 'adjective',
    keyDifference: '"Crucial" is stronger than "important" — it means absolutely necessary or critical, implying that without it, failure is likely. Using "crucial" when you mean merely "important" is an overstatement that weakens precision. Reserve "crucial" for genuinely decisive factors.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Safe, broad choice for both tasks', ieltsSpeaking: 'Universally understood in all parts', intensity: 3 },
    dimensionB: { register: 'formal', ieltsWriting: 'Use only for decisive or critical factors', ieltsSpeaking: 'High impact in Part 3 when the point genuinely is critical', intensity: 5, note: 'Synonyms of similar strength: vital, essential, indispensable' },
    examples: [
      { context: 'Discussing education policy', withA: 'It is important that governments invest in early childhood education.', withB: 'It is crucial that governments invest in early childhood education, as these are the formative years that determine lifelong outcomes.' },
      { context: 'Arguing about climate policy', withA: 'International cooperation is important for addressing climate change.', withB: 'International cooperation is crucial — without it, individual national efforts will be insufficient to limit global warming.' },
    ],
  },

  {
    termA: 'main',
    termB: 'primary',
    category: 'adjective',
    keyDifference: 'Both mean most important, but "primary" is more formal and academic. "Primary" also carries a nuance of being first in a sequence or order, which "main" does not. In IELTS Task 2, "primary" is the more sophisticated choice.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Acceptable but less academic', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred — stronger academic register', ieltsSpeaking: 'Sounds sophisticated in Part 3', note: 'Common collocations: primary cause, primary concern, primary responsibility' },
    examples: [
      { context: 'Identifying causes of a problem', withA: 'The main cause of youth unemployment is the lack of practical skills training.', withB: 'The primary cause of youth unemployment is the lack of practical skills training.' },
      { context: 'Discussing government responsibility', withA: 'The main responsibility of any government is to ensure the safety of its citizens.', withB: 'The primary responsibility of any government is to ensure the safety of its citizens.' },
    ],
  },

  // ── Nouns ─────────────────────────────────────────────────────────────────────

  {
    termA: 'problem',
    termB: 'issue',
    category: 'noun',
    keyDifference: '"Problem" implies something negative that needs fixing. "Issue" is more neutral — it refers to a topic or matter under discussion, which may or may not be inherently negative. In IELTS academic writing, "issue" is often more appropriate when introducing a discussion topic.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Use when emphasising harm or difficulty', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred for topic introduction and balanced discussion', ieltsSpeaking: 'Common in Part 3: "This is a complex issue..."', note: '"The issue of X" = neutral framing; "the problem of X" = negative framing' },
    examples: [
      { context: 'Introducing an essay topic', withA: 'Unemployment is a serious problem in many developed countries.', withB: 'Unemployment is a complex issue that affects both developed and developing nations.' },
      { context: 'Discussing technology ethics', withA: 'Data privacy is a growing problem for internet users.', withB: 'Data privacy has become a central issue in debates about digital regulation.' },
    ],
  },

  {
    termA: 'increase',
    termB: 'surge',
    category: 'noun',
    keyDifference: '"Surge" implies a sudden, dramatic, and often unexpected increase — it is a more vivid and precise word than "increase". "Increase" is neutral and appropriate for any upward trend. Using "surge" for gradual growth is an overstatement that reduces precision.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Safe, accurate for any upward trend', ieltsSpeaking: 'Clear and universally understood' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Use only for sudden, sharp, dramatic rises', ieltsSpeaking: 'Vivid and impactful in Part 3 when trend is genuinely dramatic', note: 'Related: spike (even shorter), boom (sector-wide)' },
    examples: [
      { context: 'Describing a line graph', withA: 'There was a steady increase in internet usage between 2000 and 2020.', withB: 'There was a surge in internet usage following the widespread availability of smartphones.' },
      { context: 'Discussing economic data', withA: 'The report noted a gradual increase in consumer spending over five years.', withB: 'The report noted a surge in consumer spending during the post-lockdown recovery period.' },
    ],
  },

  // ── Reporting verbs ───────────────────────────────────────────────────────────

  {
    termA: 'say',
    termB: 'argue',
    category: 'verb',
    keyDifference: '"Say" is neutral and simply reports words. "Argue" implies the speaker is making a case or providing reasoning to support a claim. In IELTS Task 2, "argue" signals critical engagement with ideas and scores higher for Task Achievement.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Weak for academic argument — prefer argue/claim/assert/suggest', ieltsSpeaking: 'Natural but can be strengthened with more precise verbs' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred reporting verb for opinions and academic claims', ieltsSpeaking: 'Strong in Part 3: "Some people argue that..."', note: 'Other precise reporting verbs: claim, contend, maintain, assert, suggest' },
    examples: [
      { context: 'Introducing an opposing view', withA: 'Some people say that technology is making society less connected.', withB: 'Some researchers argue that technology is paradoxically making society less connected.' },
      { context: 'Presenting research findings', withA: 'The study says that diet is the most significant factor in long-term health.', withB: 'The study argues that diet is the most significant factor in long-term health outcomes.' },
    ],
  },

  {
    termA: 'think',
    termB: 'consider',
    category: 'verb',
    keyDifference: '"Think" is informal and suggests a passing opinion. "Consider" is more formal, implies careful reflection, and is followed by a noun phrase or gerund rather than a clause. In academic writing, "consider" is far stronger for expressing an evaluated position.',
    dimensionA: { register: 'informal', ieltsWriting: 'Avoid in Task 2 — use believe, consider, maintain instead', ieltsSpeaking: 'Natural in Part 1; use more precise verbs in Part 3' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred — signals careful evaluation', ieltsSpeaking: 'Impressive in Part 2/3: "I consider this to be..."', note: 'Construction: "consider + noun/gerund" not "consider that + clause" in formal use' },
    examples: [
      { context: 'Expressing a personal position in an essay', withA: 'I think that governments should invest more in public transport.', withB: 'I consider government investment in public transport to be essential for reducing urban emissions.' },
      { context: 'Discussing societal values', withA: 'Many people think that family is the most important institution in society.', withB: 'Many people consider the family to be the most fundamental institution in society.' },
    ],
  },

  // ── Connectors of addition ────────────────────────────────────────────────────

  {
    termA: 'moreover',
    termB: 'in addition',
    category: 'conjunction',
    keyDifference: '"Moreover" signals that the next point reinforces or amplifies the previous one — it implies the new information is more significant. "In addition" simply adds another point of equal weight. "Moreover" is slightly more sophisticated and signals logical escalation.',
    dimensionA: { register: 'formal', ieltsWriting: 'Use to escalate an argument — the next point should be stronger', ieltsSpeaking: 'Strong in Part 3 — signals structured thinking' },
    dimensionB: { register: 'formal', ieltsWriting: 'Use to add a parallel point of equal importance', ieltsSpeaking: 'Clear and academically appropriate in Part 3' },
    examples: [
      { context: 'Arguing for renewable energy investment', withA: 'Renewable energy reduces carbon emissions. Moreover, it creates thousands of jobs in the green economy.', withB: 'Renewable energy reduces carbon emissions. In addition, it has the potential to create thousands of new jobs.' },
      { context: 'Discussing online learning', withA: 'Online learning provides flexibility for students. Moreover, it often reduces educational costs significantly.', withB: 'Online learning provides flexibility for students. In addition, it makes education accessible to people in remote areas.' },
    ],
  },

  // ── Adverbs of frequency/probability ─────────────────────────────────────────

  {
    termA: 'maybe',
    termB: 'perhaps',
    category: 'adverb',
    keyDifference: '"Perhaps" is more formal than "maybe" and is the standard choice in IELTS Academic writing and formal speaking. "Maybe" is informal and should be replaced with "perhaps" or "possibly" in written tasks.',
    dimensionA: { register: 'informal', ieltsWriting: 'Avoid — replace with perhaps/possibly/it may be that', ieltsSpeaking: 'Natural in Part 1; use perhaps in Parts 2 and 3' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred hedging adverb for both tasks', ieltsSpeaking: 'Sounds polished and appropriate throughout', note: 'Position: "Perhaps the most significant factor is..." — strong academic opener' },
    examples: [
      { context: 'Hedging a claim in an essay', withA: 'Maybe the most effective solution would be to increase taxes on carbon emissions.', withB: 'Perhaps the most effective solution would be to increase taxes on carbon emissions.' },
      { context: 'Speculating in speaking', withA: 'Maybe technology will replace most jobs within the next fifty years.', withB: 'Perhaps technology will replace most routine jobs within the next fifty years.' },
    ],
  },

  // ── Precise word pairs ────────────────────────────────────────────────────────

  {
    termA: 'mainly',
    termB: 'primarily',
    category: 'adverb',
    keyDifference: 'Both mean "for the most part" but "primarily" is more formal and academic. "Primarily" also implies a clearer priority ranking — that something is the first or chief reason. "Mainly" is neutral and acceptable but less precise.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Acceptable in both tasks but less academic', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred — stronger academic register, implies clear priority', ieltsSpeaking: 'Sounds precise in Part 3 explanations' },
    examples: [
      { context: 'Explaining a cause', withA: 'Traffic congestion is caused mainly by the over-reliance on private vehicles.', withB: 'Traffic congestion is caused primarily by the over-reliance on private vehicles in the absence of viable public transport.' },
      { context: 'Describing a target group', withA: 'The policy is aimed mainly at low-income families.', withB: 'The policy is designed primarily to support low-income families who lack access to adequate housing.' },
    ],
  },

  {
    termA: 'rather than',
    termB: 'instead of',
    category: 'phrase',
    keyDifference: 'Both express preference for one thing over another, but "rather than" is more formal and often used in comparative constructions mid-clause. "Instead of" is more informal and typically introduces a contrast at the start or end of a clause. "Rather than" is preferred in IELTS Academic writing.',
    dimensionA: { register: 'formal', ieltsWriting: 'Preferred in Task 2 for expressing comparative choices', ieltsSpeaking: 'Sounds sophisticated in Part 3 comparisons' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Acceptable but slightly informal compared to rather than', ieltsSpeaking: 'Natural and clear in all speaking parts' },
    examples: [
      { context: 'Discussing government policy choices', withA: 'Governments should invest in preventive healthcare rather than spending exclusively on treatment.', withB: 'Governments should invest in preventive healthcare instead of spending exclusively on treatment.' },
      { context: 'Proposing a better approach', withA: 'Students learn more effectively through practical application rather than rote memorisation.', withB: 'Students learn more effectively through practical application instead of rote memorisation.' },
    ],
  },

  {
    termA: 'fast',
    termB: 'quickly',
    category: 'adverb',
    keyDifference: '"Fast" can be both an adjective and adverb ("a fast car", "drive fast"). "Quickly" is only an adverb. In academic IELTS writing, "quickly" is generally preferred as an adverb because "fast" as an adverb can sound informal. Neither is wrong grammatically, but "quickly" is more academic.',
    dimensionA: { register: 'neutral', ieltsWriting: 'As adverb: acceptable but slightly informal', ieltsSpeaking: 'Natural in all parts', note: 'As adjective "fast" is fine: "a fast-growing economy"' },
    dimensionB: { register: 'neutral', ieltsWriting: 'Preferred adverb for academic writing', ieltsSpeaking: 'Natural and clear in all parts' },
    examples: [
      { context: 'Describing technological change', withA: 'The digital economy is growing fast, creating both opportunities and risks.', withB: 'The digital economy is growing quickly, creating both opportunities and risks.' },
      { context: 'Discussing urban development', withA: 'Cities need to adapt fast to accommodate rapid population growth.', withB: 'Cities need to adapt quickly to accommodate rapid population growth.' },
    ],
  },

  {
    termA: 'need',
    termB: 'require',
    category: 'verb',
    keyDifference: '"Require" is more formal than "need" and is preferred in IELTS Academic writing when expressing that something is necessary or essential. "Need" is neutral and universal, but "require" signals a more official or structured necessity.',
    dimensionA: { register: 'neutral', ieltsWriting: 'Acceptable but less formal — prefer require in Task 2', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Preferred in Task 2 for expressing formal requirements', ieltsSpeaking: 'Appropriate in Part 3; may sound stiff in Part 1' },
    examples: [
      { context: 'Discussing policy conditions', withA: 'Solving the housing crisis will need significant government intervention.', withB: 'Solving the housing crisis will require significant and sustained government intervention.' },
      { context: 'Arguing for systemic change', withA: 'Addressing climate change needs international cooperation at an unprecedented scale.', withB: 'Addressing climate change requires international cooperation at an unprecedented scale.' },
    ],
  },

  {
    termA: 'start',
    termB: 'commence',
    category: 'verb',
    keyDifference: '"Commence" is highly formal and often bureaucratic — it appears in official documents and formal announcements but can sound overly stiff in academic essays. "Start" is neutral and universally applicable. In IELTS, "begin" is generally the better formal alternative to "start" rather than "commence".',
    dimensionA: { register: 'neutral', ieltsWriting: 'Fine in both tasks — "begin" is a good formal alternative', ieltsSpeaking: 'Natural in all parts' },
    dimensionB: { register: 'formal', ieltsWriting: 'Use only in formal procedural or official contexts; can sound stiff in essays', ieltsSpeaking: 'Sounds unnatural in everyday speaking contexts', note: 'Better formal upgrade from "start" is "begin", not "commence"' },
    examples: [
      { context: 'Describing when a programme launched', withA: 'The government started the initiative in 2015 to address youth unemployment.', withB: 'The government commenced the initiative in 2015 to address youth unemployment.' },
      { context: 'Discussing when change needs to happen', withA: 'Reforms must start immediately if long-term damage is to be avoided.', withB: 'Reforms must commence immediately if long-term damage is to be avoided.' },
    ],
  },

]

async function seed() {
  console.log(`Seeding ${COMPARISONS.length} comparisons…`)
  let inserted = 0
  let patched = 0

  for (const item of COMPARISONS) {
    const existing = await db.query.comparisonEntries.findFirst({
      where: (t, { or, and, sql }) =>
        or(
          and(sql`lower(${t.termA}) = ${item.termA.toLowerCase()}`, sql`lower(${t.termB}) = ${item.termB.toLowerCase()}`),
          and(sql`lower(${t.termA}) = ${item.termB.toLowerCase()}`, sql`lower(${t.termB}) = ${item.termA.toLowerCase()}`),
        ),
    })

    if (existing) {
      if (!existing.isSystem) {
        await db
          .update(schema.comparisonEntries)
          .set({ isSystem: true })
          .where(sql`${schema.comparisonEntries.id} = ${existing.id}`)
        patched++
      }
      continue
    }

    await db.insert(schema.comparisonEntries).values({
      ...item,
      termA: item.termA.toLowerCase(),
      termB: item.termB.toLowerCase(),
      isSystem: true,
    })
    inserted++
  }

  console.log(`Done — ${inserted} new, ${patched} patched, ${COMPARISONS.length - inserted - patched} already up to date.`)
  await client.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
