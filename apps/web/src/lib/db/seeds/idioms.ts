/**
 * Seed: idiom_entries
 *
 * Top 30 IELTS-relevant idioms for Band 6.5–7, useful for Speaking and Writing Task 2.
 *
 * Run with:
 *   pnpm db:seed:idioms
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'
import type { IdiomSkill, IdiomContext } from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

type SeedIdiom = {
  idiom: string
  meaning: string
  register: string
  skills: IdiomSkill[]
  contexts: IdiomContext[]
  examples: string[]
}

const IDIOMS: SeedIdiom[] = [
  {
    idiom: 'a double-edged sword',
    meaning: 'Something that has both advantages and disadvantages at the same time.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Social media is a double-edged sword: it connects people globally but also spreads misinformation rapidly.',
      'Technological automation is a double-edged sword, creating new industries while displacing millions of workers.',
      'Free trade is often described as a double-edged sword for developing economies.',
    ],
  },
  {
    idiom: 'the tip of the iceberg',
    meaning: 'A small visible part of a much larger problem or issue.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'The reported cases of cybercrime are merely the tip of the iceberg, with countless incidents going undetected.',
      'Rising youth unemployment is just the tip of the iceberg of a deeper structural economic problem.',
      'What we see in published statistics is only the tip of the iceberg when it comes to workplace stress.',
    ],
  },
  {
    idiom: 'in the long run',
    meaning: 'Over a long period of time; eventually.',
    register: 'neutral',
    skills: ['Writing_1', 'Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Investing in renewable energy is costly initially, but in the long run it reduces dependence on fossil fuels.',
      'Stricter education policies may seem burdensome, but in the long run they produce more capable graduates.',
      'In the long run, preventive healthcare is far more cost-effective than treating chronic diseases.',
    ],
  },
  {
    idiom: 'pave the way for',
    meaning: 'To create conditions that make something possible or easier in the future.',
    register: 'formal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'The development of the internet paved the way for the digital economy we rely on today.',
      'Early research into renewable energy paved the way for affordable solar panels.',
      'International cooperation on climate agreements can pave the way for broader environmental reforms.',
    ],
  },
  {
    idiom: 'a vicious cycle',
    meaning: 'A situation where one problem causes another, which then makes the first problem worse.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Poverty and poor education form a vicious cycle that is extremely difficult to break without government intervention.',
      'Stress leads to poor sleep, which reduces productivity, creating a vicious cycle in the modern workplace.',
      'Urban overcrowding creates a vicious cycle of rising housing costs and falling quality of life.',
    ],
  },
  {
    idiom: 'go hand in hand',
    meaning: 'To be closely associated or naturally connected.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Economic growth and environmental degradation do not have to go hand in hand if sustainable practices are adopted.',
      'Innovation and risk go hand in hand in the technology sector.',
      'Higher education and better employment prospects tend to go hand in hand in most economies.',
    ],
  },
  {
    idiom: 'shed light on',
    meaning: 'To clarify or make something easier to understand.',
    register: 'formal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News', 'Book'],
    examples: [
      'Recent studies shed light on the relationship between social media use and adolescent mental health.',
      'The documentary shed light on the living conditions of factory workers in developing countries.',
      'This research sheds light on why urban areas consistently outperform rural regions in educational outcomes.',
    ],
  },
  {
    idiom: 'hit the nail on the head',
    meaning: 'To describe or identify something exactly correctly.',
    register: 'informal',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'The professor really hit the nail on the head when she argued that inequality is fundamentally a political problem.',
      'The journalist hit the nail on the head by pointing out that the policy ignored its impact on rural communities.',
      'I think you have hit the nail on the head — lack of affordable housing is the core issue.',
    ],
  },
  {
    idiom: 'scratch the surface',
    meaning: 'To deal with only a small part of a subject or problem, leaving most of it unexplored.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Current environmental policies barely scratch the surface of what is needed to combat climate change.',
      'A single academic course can only scratch the surface of a complex field like artificial intelligence.',
      'The government\'s investment in mental health services merely scratches the surface of the real demand.',
    ],
  },
  {
    idiom: 'take centre stage',
    meaning: 'To become the main focus of attention or the most important element.',
    register: 'formal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'News', 'Speaking'],
    examples: [
      'Artificial intelligence has taken centre stage in debates about the future of employment.',
      'Climate change took centre stage at the international summit, overshadowing other economic discussions.',
      'As urban populations grow, sustainable city planning is taking centre stage in policy discussions.',
    ],
  },
  {
    idiom: 'raise the bar',
    meaning: 'To set a higher standard of quality or performance.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'Finland has consistently raised the bar in global education standards through its student-centred approach.',
      'Innovative start-ups raise the bar for established companies, forcing them to modernise or lose market share.',
      'International competitions raise the bar for athletes, motivating them to push beyond their limits.',
    ],
  },
  {
    idiom: 'a drop in the ocean',
    meaning: 'A very small amount compared to what is needed; insufficient.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'The aid provided to disaster-affected regions was a drop in the ocean compared to the scale of destruction.',
      'Individual recycling efforts, while positive, are a drop in the ocean without systemic industrial change.',
      'The budget allocated to public health research is a drop in the ocean relative to defence spending.',
    ],
  },
  {
    idiom: 'the bottom line',
    meaning: 'The most important factor or the final conclusion; the essential point.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'The bottom line is that without addressing income inequality, social stability will remain at risk.',
      'Corporations may cite various reasons for offshoring, but the bottom line is reducing labour costs.',
      'Politicians debate endlessly, but the bottom line remains: education funding needs to increase significantly.',
    ],
  },
  {
    idiom: 'on the fence',
    meaning: 'Undecided or neutral about an issue; not having taken a clear position.',
    register: 'informal',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'Many voters remain on the fence about nuclear energy, recognising both its benefits and its risks.',
      'I was on the fence about the new policy until I read the detailed economic analysis.',
      'Governments often sit on the fence regarding controversial technologies to avoid alienating voters.',
    ],
  },
  {
    idiom: 'cut corners',
    meaning: 'To do something in the easiest or cheapest way, often at the cost of quality or safety.',
    register: 'informal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Speaking', 'Writing', 'News'],
    examples: [
      'Construction companies that cut corners on safety measures put both workers and residents at risk.',
      'Cutting corners in pharmaceutical testing to speed up drug approval can have devastating consequences.',
      'Schools that cut corners on teacher training ultimately disadvantage the students they serve.',
    ],
  },
  {
    idiom: 'in the same boat',
    meaning: 'In the same difficult or unfortunate situation as others.',
    register: 'informal',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'Developing nations are in the same boat when it comes to bearing the consequences of climate change they did not cause.',
      'Most young graduates are in the same boat, facing high student debt and a competitive job market.',
      'During the economic crisis, both employers and employees were in the same boat, struggling to survive.',
    ],
  },
  {
    idiom: 'ahead of the curve',
    meaning: 'More advanced or progressive than others; anticipating future trends.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'Countries that invest heavily in digital infrastructure are ahead of the curve in attracting international business.',
      'The company stayed ahead of the curve by adopting artificial intelligence before its competitors.',
      'By prioritising renewable energy a decade ago, this nation is now well ahead of the curve on carbon reduction.',
    ],
  },
  {
    idiom: 'from the ground up',
    meaning: 'From the very beginning; starting with the most basic elements.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'Rebuilding trust between citizens and institutions must happen from the ground up through local community engagement.',
      'The city redesigned its public transport system from the ground up to prioritise sustainability.',
      'Effective healthcare reform requires rethinking the system from the ground up rather than patching existing flaws.',
    ],
  },
  {
    idiom: 'at the expense of',
    meaning: 'By causing harm, loss, or disadvantage to something or someone else.',
    register: 'formal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'Rapid economic growth has often been achieved at the expense of environmental sustainability.',
      'Focusing exclusively on standardised testing improves scores at the expense of creative thinking.',
      'Urban development should not proceed at the expense of green spaces and biodiversity.',
    ],
  },
  {
    idiom: 'on the right track',
    meaning: 'Making progress in the correct or appropriate direction.',
    register: 'neutral',
    skills: ['Speaking', 'Writing_2'],
    contexts: ['Speaking', 'Writing'],
    examples: [
      'While there is still much work to be done, global efforts to reduce carbon emissions appear to be on the right track.',
      'The government\'s early investment in digital education suggests it is on the right track for long-term growth.',
      'Experts agree that introducing coding in schools is on the right track for preparing a future-ready workforce.',
    ],
  },
  {
    idiom: 'bite the bullet',
    meaning: 'To endure a painful or unpleasant situation with courage because it is unavoidable.',
    register: 'informal',
    skills: ['Speaking', 'Writing_2'],
    contexts: ['Speaking', 'Writing', 'Podcast'],
    examples: [
      'Governments may need to bite the bullet and impose unpopular carbon taxes to meet climate targets.',
      'Companies must bite the bullet and invest in retraining their workforce rather than replacing workers with machines.',
      'At some point, society will need to bite the bullet and have an honest conversation about pension reform.',
    ],
  },
  {
    idiom: 'a blessing in disguise',
    meaning: 'Something that seems bad or unfortunate at first but turns out to be beneficial.',
    register: 'neutral',
    skills: ['Speaking', 'Writing_2'],
    contexts: ['Speaking', 'Writing', 'Podcast'],
    examples: [
      'The economic recession proved to be a blessing in disguise for some industries, as it forced long-overdue structural reforms.',
      'Losing that initial contract was a blessing in disguise; it pushed us to develop a far superior product.',
      'For some workers, redundancy was a blessing in disguise, prompting career changes that proved more fulfilling.',
    ],
  },
  {
    idiom: 'kill two birds with one stone',
    meaning: 'To achieve two things with a single action, saving time or effort.',
    register: 'informal',
    skills: ['Speaking', 'Writing_2'],
    contexts: ['Speaking', 'Writing'],
    examples: [
      'Investing in urban green spaces kills two birds with one stone by improving air quality and mental wellbeing.',
      'Introducing cycling infrastructure kills two birds with one stone, reducing traffic and promoting public health.',
      'Teaching financial literacy in schools kills two birds with one stone, addressing both economic inequality and personal debt.',
    ],
  },
  {
    idiom: 'turn the tables',
    meaning: 'To reverse a situation so that someone who was in a weaker position gains advantage.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking', 'News'],
    examples: [
      'Digital technology has turned the tables on traditional media, empowering ordinary citizens to become publishers.',
      'Developing countries are beginning to turn the tables on wealthier nations in terms of renewable energy adoption.',
      'The rise of remote work has turned the tables in favour of employees, giving them more bargaining power.',
    ],
  },
  {
    idiom: 'face the music',
    meaning: 'To accept and deal with the unpleasant consequences of one\'s actions.',
    register: 'informal',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'Corporations that have ignored environmental regulations for decades will eventually have to face the music.',
      'Politicians who made unrealistic promises will face the music when voters demand accountability.',
      'It is time for the industry to face the music and acknowledge the harm its products have caused.',
    ],
  },
  {
    idiom: 'get the ball rolling',
    meaning: 'To start a process or activity, prompting others to follow.',
    register: 'informal',
    skills: ['Speaking', 'Writing_2'],
    contexts: ['Speaking', 'Writing'],
    examples: [
      'The government needs to get the ball rolling on housing reform before the situation becomes a full crisis.',
      'International summits get the ball rolling on agreements, but implementation remains the real challenge.',
      'A small pilot programme can get the ball rolling for large-scale national education reforms.',
    ],
  },
  {
    idiom: 'see eye to eye',
    meaning: 'To agree with someone; to share the same view or opinion.',
    register: 'neutral',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'World leaders rarely see eye to eye on how to distribute the financial burden of addressing climate change.',
      'Employers and trade unions do not always see eye to eye on working hour regulations.',
      'The two governments see eye to eye on border security but disagree sharply on trade policy.',
    ],
  },
  {
    idiom: 'paint the full picture',
    meaning: 'To give a complete and accurate description of a situation.',
    register: 'neutral',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Writing', 'Speaking'],
    examples: [
      'GDP figures alone do not paint the full picture of a country\'s standard of living.',
      'To paint the full picture of inequality, we must consider access to healthcare and education, not just income.',
      'Statistics can be misleading if they fail to paint the full picture of what communities actually experience.',
    ],
  },
  {
    idiom: 'burn bridges',
    meaning: 'To permanently destroy a relationship or opportunity through one\'s actions.',
    register: 'informal',
    skills: ['Speaking'],
    contexts: ['Speaking', 'Podcast'],
    examples: [
      'Nations that impose punitive tariffs risk burning bridges with their most important trading partners.',
      'A company that mistreats its workforce burns bridges with talented professionals who will avoid working there.',
      'Diplomatic insults burn bridges that may take decades to rebuild.',
    ],
  },
  {
    idiom: 'pull strings',
    meaning: 'To use personal influence or connections to gain an unfair advantage.',
    register: 'informal',
    skills: ['Writing_2', 'Speaking'],
    contexts: ['Speaking', 'Writing', 'News'],
    examples: [
      'Nepotism occurs when powerful individuals pull strings to secure positions for family members regardless of merit.',
      'Wealthier families can pull strings to gain access to elite educational institutions, deepening social inequality.',
      'In transparent democratic systems, it should be impossible to pull strings to avoid legal consequences.',
    ],
  },
]

async function seed() {
  console.log(`Seeding ${IDIOMS.length} idioms…`)
  let inserted = 0

  for (const item of IDIOMS) {
    const result = await db
      .insert(schema.idiomEntries)
      .values({ ...item, idiom: item.idiom.toLowerCase(), isSystem: true })
      .onConflictDoUpdate({
        target: schema.idiomEntries.idiom,
        set: { isSystem: true },
      })
      .returning({ id: schema.idiomEntries.id, idiom: schema.idiomEntries.idiom })

    if (result.length > 0) inserted++
  }

  console.log(`Done — ${inserted} new, ${IDIOMS.length - inserted} already existed.`)
  await client.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
