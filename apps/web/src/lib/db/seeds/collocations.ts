/**
 * Seed: collocation_entries
 *
 * Top 50 IELTS Band 6.5–7 collocations across Writing Task 1, Writing Task 2, and Speaking.
 *
 * Run with:
 *   pnpm db:seed:collocations
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'
import type { CollocationSkill } from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

type SeedCollocation = {
  phrase: string
  type: string
  skills: CollocationSkill[]
  examples: string[]
}

// ─── 50 Top IELTS Collocations (Band 6.5–7) ──────────────────────────────────

const COLLOCATIONS: SeedCollocation[] = [

  // ── Verb + Noun (15) ─────────────────────────────────────────────────────────

  {
    phrase: 'raise awareness',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Governments need to raise awareness of the dangers of excessive screen time among young people.',
      'Social media campaigns have been effective in raising awareness about environmental issues.',
      'Schools play a vital role in raising awareness of mental health problems.',
    ],
  },
  {
    phrase: 'tackle a problem',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Without significant investment in infrastructure, cities will struggle to tackle the problem of traffic congestion.',
      'Policymakers must work together to tackle the growing problem of youth unemployment.',
      'The most effective way to tackle this problem is through a combination of education and legislation.',
    ],
  },
  {
    phrase: 'address an issue',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'The government has failed to adequately address the issue of affordable housing in urban areas.',
      'It is crucial that world leaders address the issue of climate change before it becomes irreversible.',
      'Companies should address this issue proactively rather than waiting for regulation.',
    ],
  },
  {
    phrase: 'conduct research',
    type: 'verb+noun',
    skills: ['Writing_2'],
    examples: [
      'Universities must be given adequate funding to conduct research into renewable energy sources.',
      'Scientists have conducted extensive research into the long-term effects of air pollution on health.',
    ],
  },
  {
    phrase: 'draw a conclusion',
    type: 'verb+noun',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'From the data presented, we can draw the conclusion that urban populations are growing at an unsustainable rate.',
      'It would be premature to draw any firm conclusions from such a limited data set.',
    ],
  },
  {
    phrase: 'play a crucial role',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Education plays a crucial role in reducing social inequality and improving long-term economic outcomes.',
      'Technology plays a crucial role in modern healthcare by enabling faster and more accurate diagnoses.',
      'Parents play a crucial role in shaping the values and behaviour of their children.',
    ],
  },
  {
    phrase: 'reach a consensus',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'International negotiations have so far failed to reach a consensus on carbon emission targets.',
      'It is difficult to reach a consensus when the two sides hold fundamentally different views.',
    ],
  },
  {
    phrase: 'pose a threat',
    type: 'verb+noun',
    skills: ['Writing_2'],
    examples: [
      'Climate change poses a serious threat to global food security and biodiversity.',
      'The rapid spread of misinformation online poses a threat to democratic institutions.',
    ],
  },
  {
    phrase: 'take measures',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Governments must take urgent measures to reduce carbon emissions if the 1.5°C target is to be met.',
      'Companies should take proactive measures to ensure the data privacy of their customers.',
    ],
  },
  {
    phrase: 'provide evidence',
    type: 'verb+noun',
    skills: ['Writing_2'],
    examples: [
      'The study provides compelling evidence that regular exercise can significantly reduce the risk of depression.',
      'Opponents of the policy have struggled to provide evidence that it would be effective.',
    ],
  },
  {
    phrase: 'achieve a balance',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'It is important for governments to achieve a balance between economic development and environmental protection.',
      'Modern workers often find it difficult to achieve a healthy balance between their professional and personal lives.',
    ],
  },
  {
    phrase: 'bridge the gap',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Digital literacy programmes can help bridge the gap between older and younger generations in the workforce.',
      'The government introduced several schemes to bridge the gap between the wealthy and the poor.',
    ],
  },
  {
    phrase: 'exert pressure',
    type: 'verb+noun',
    skills: ['Writing_2'],
    examples: [
      'Consumer groups have been exerting pressure on corporations to adopt more sustainable business practices.',
      'Rising living costs exert significant pressure on low-income households in major cities.',
    ],
  },
  {
    phrase: 'make a contribution',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Immigrants have historically made a significant contribution to the cultural and economic life of their host countries.',
      'Every individual can make a meaningful contribution to reducing their household carbon footprint.',
    ],
  },
  {
    phrase: 'meet a deadline',
    type: 'verb+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Remote working has made it increasingly difficult for teams to coordinate and meet project deadlines.',
      'Many students struggle to meet their deadlines when they take on part-time employment alongside their studies.',
    ],
  },

  // ── Adjective + Noun (15) ─────────────────────────────────────────────────────

  {
    phrase: 'significant increase',
    type: 'adj+noun',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The graph shows a significant increase in the number of electric vehicles sold between 2015 and 2023.',
      'There has been a significant increase in public spending on healthcare over the past decade.',
    ],
  },
  {
    phrase: 'rapid growth',
    type: 'adj+noun',
    skills: ['Writing_1', 'Writing_2', 'Speaking'],
    examples: [
      'The chart illustrates the rapid growth of e-commerce in developing economies since 2018.',
      'The rapid growth of urban populations has created enormous pressure on housing and transport systems.',
    ],
  },
  {
    phrase: 'growing concern',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'There is growing concern among scientists that rising ocean temperatures may trigger irreversible climate tipping points.',
      'The mental health of young people has become a growing concern for educators and parents alike.',
    ],
  },
  {
    phrase: 'widespread problem',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Obesity is a widespread problem in many developed countries, driven largely by sedentary lifestyles and poor diet.',
      'Corruption remains a widespread problem in regions where government institutions are weak or poorly regulated.',
    ],
  },
  {
    phrase: 'considerable challenge',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Integrating artificial intelligence into existing healthcare systems presents a considerable challenge for policymakers.',
      'Adapting to a new culture and language can be a considerable challenge for international students.',
    ],
  },
  {
    phrase: 'fundamental change',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Addressing climate change will require a fundamental change in the way societies produce and consume energy.',
      'The digital revolution has brought about a fundamental change in how people access information and news.',
    ],
  },
  {
    phrase: 'negative consequence',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'The overuse of social media has had several negative consequences for the mental health of adolescents.',
      'Unplanned urbanisation can have negative consequences for air quality and public health.',
    ],
  },
  {
    phrase: 'sharp decline',
    type: 'adj+noun',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The data reveals a sharp decline in biodiversity in tropical rainforests over the last 30 years.',
      'The graph shows a sharp decline in newspaper readership following the widespread adoption of smartphones.',
    ],
  },
  {
    phrase: 'key issue',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Unemployment among graduates remains a key issue in many countries with rapidly expanding higher education systems.',
      'Access to clean water is a key issue that affects millions of people in developing nations.',
    ],
  },
  {
    phrase: 'positive outcome',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Early intervention programmes in education have been shown to produce positive outcomes for children from disadvantaged backgrounds.',
      'International cooperation on trade and investment can lead to positive outcomes for all participating economies.',
    ],
  },
  {
    phrase: 'sustainable development',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'The United Nations has identified sustainable development as one of the most pressing global priorities.',
      'Sustainable development requires balancing economic growth with the protection of natural resources for future generations.',
    ],
  },
  {
    phrase: 'public awareness',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Greater public awareness of the health risks associated with processed food could reduce obesity rates significantly.',
      'Public awareness campaigns have contributed to a marked reduction in drink-driving incidents over the past decade.',
    ],
  },
  {
    phrase: 'urban population',
    type: 'adj+noun',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The chart shows that the urban population of Southeast Asia more than doubled between 1990 and 2020.',
      'Rapidly growing urban populations are placing increasing strain on public transport and sanitation systems.',
    ],
  },
  {
    phrase: 'renewable energy',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Investment in renewable energy sources such as solar and wind power has increased dramatically in recent years.',
      'Shifting to renewable energy is essential if nations are to meet their commitments under the Paris Agreement.',
    ],
  },
  {
    phrase: 'social inequality',
    type: 'adj+noun',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Despite decades of economic growth, social inequality has widened in many developed countries.',
      'Education is widely regarded as one of the most effective tools for reducing social inequality.',
    ],
  },

  // ── Adverb + Adjective / Adverb + Verb (10) ──────────────────────────────────

  {
    phrase: 'largely responsible',
    type: 'adv+adj',
    skills: ['Writing_2'],
    examples: [
      'Human activity is largely responsible for the accelerating rate of global warming observed since the industrial era.',
      'Poor urban planning is largely responsible for the severe traffic congestion experienced in many capital cities.',
    ],
  },
  {
    phrase: 'increasingly difficult',
    type: 'adv+adj',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'It is becoming increasingly difficult for young people to purchase their first home in major cities.',
      'With the rise of automation, it is increasingly difficult for low-skilled workers to find stable employment.',
    ],
  },
  {
    phrase: 'deeply concerned',
    type: 'adv+adj',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Many environmental scientists are deeply concerned about the accelerating loss of biodiversity around the world.',
      'Parents are deeply concerned about the amount of time their children spend on screens each day.',
    ],
  },
  {
    phrase: 'widely regarded',
    type: 'adv+adj',
    skills: ['Writing_2'],
    examples: [
      'Access to quality education is widely regarded as the most effective strategy for reducing long-term poverty.',
      'The policy is widely regarded as a failure, having done little to address the underlying causes of inequality.',
    ],
  },
  {
    phrase: 'particularly important',
    type: 'adv+adj',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Early childhood education is particularly important in establishing the cognitive foundations for later learning.',
      'Critical thinking skills are particularly important in an era when misinformation is so easily spread.',
    ],
  },
  {
    phrase: 'strongly suggest',
    type: 'adv+verb',
    skills: ['Writing_2'],
    examples: [
      'The findings strongly suggest that regular physical activity has a protective effect against cognitive decline in older adults.',
      'The data strongly suggest that the policy has had little measurable impact on reducing carbon emissions.',
    ],
  },
  {
    phrase: 'clearly demonstrate',
    type: 'adv+verb',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The graph clearly demonstrates the correlation between rising temperatures and the frequency of extreme weather events.',
      'These statistics clearly demonstrate that investment in public health yields significant economic benefits over time.',
    ],
  },
  {
    phrase: 'significantly affect',
    type: 'adv+verb',
    skills: ['Writing_2'],
    examples: [
      'Air pollution significantly affects the health of people living in densely populated urban areas.',
      'Economic downturns significantly affect the employment prospects of young people entering the labour market.',
    ],
  },
  {
    phrase: 'rapidly increasing',
    type: 'adv+adj',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The rapidly increasing demand for clean water is one of the most urgent environmental challenges of our time.',
      'The chart shows the rapidly increasing share of renewable energy in the national electricity grid.',
    ],
  },
  {
    phrase: 'effectively address',
    type: 'adv+verb',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'To effectively address climate change, governments must work in close coordination with the private sector.',
      'No single policy can effectively address the complex and multifaceted problem of urban homelessness.',
    ],
  },

  // ── Verb + Preposition / Noun + Preposition (10) ──────────────────────────────

  {
    phrase: 'contribute to',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Deforestation contributes significantly to rising carbon dioxide levels in the atmosphere.',
      'Volunteering not only helps the community but also contributes to the personal development of the individual.',
    ],
  },
  {
    phrase: 'result in',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Poor dietary habits in childhood often result in serious health problems in later life.',
      'Rapid urbanisation can result in the destruction of natural habitats and a loss of biodiversity.',
    ],
  },
  {
    phrase: 'lead to',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'A lack of investment in public transport can lead to increased private car use and greater congestion.',
      'Globalisation has led to greater interdependence between national economies, with both benefits and risks.',
    ],
  },
  {
    phrase: 'impact on',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'The widespread use of social media has had a profound impact on the way people form and maintain relationships.',
      'Advances in artificial intelligence are likely to impact on almost every sector of the economy.',
    ],
  },
  {
    phrase: 'solution to',
    type: 'noun+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'There is no simple solution to the problem of urban poverty, which requires a coordinated policy response.',
      'Many experts argue that education is the most sustainable long-term solution to social inequality.',
    ],
  },
  {
    phrase: 'rise in',
    type: 'noun+prep',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The graph shows a steady rise in the proportion of households with access to the internet over the period.',
      'The dramatic rise in housing costs has made homeownership unattainable for many young adults.',
    ],
  },
  {
    phrase: 'decline in',
    type: 'noun+prep',
    skills: ['Writing_1', 'Writing_2'],
    examples: [
      'The chart illustrates a marked decline in the number of people employed in manufacturing since the 1980s.',
      'There has been a noticeable decline in the quality of public services following years of budget cuts.',
    ],
  },
  {
    phrase: 'respond to',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Governments have been slow to respond to the growing threat of cybercrime and digital fraud.',
      'It is vital that international organisations respond to humanitarian crises quickly and effectively.',
    ],
  },
  {
    phrase: 'depend on',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'The success of any environmental policy depends on the willingness of both governments and citizens to change their behaviour.',
      'Many rural communities in developing countries still depend on subsistence farming as their primary source of income.',
    ],
  },
  {
    phrase: 'focus on',
    type: 'verb+prep',
    skills: ['Writing_2', 'Speaking'],
    examples: [
      'Educational reforms should focus on developing critical thinking and problem-solving skills rather than rote learning.',
      'Rather than focusing on economic growth alone, policymakers should also focus on improving quality of life.',
    ],
  },
]

async function seed() {
  console.log(`Seeding ${COLLOCATIONS.length} collocations…`)

  let inserted = 0
  let skipped = 0

  for (const c of COLLOCATIONS) {
    const [row] = await db
      .insert(schema.collocationEntries)
      .values({
        phrase: c.phrase,
        type: c.type,
        skills: c.skills,
        examples: c.examples,
      })
      .onConflictDoNothing()
      .returning({ id: schema.collocationEntries.id })

    if (row) {
      inserted++
      console.log(`  ✓ ${c.phrase}`)
    } else {
      skipped++
      console.log(`  – ${c.phrase} (already exists)`)
    }
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped.`)
  await client.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
