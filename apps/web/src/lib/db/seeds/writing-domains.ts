/**
 * Seed: writing_domains + default user_domain_preferences
 *
 * Run with:
 *   pnpm tsx src/lib/db/seeds/writing-domains.ts
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq, inArray } from 'drizzle-orm'
import * as schema from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

// ─── Top 50 IELTS Writing Task 2 topic domains ────────────────────────────────

const TOP_50_DOMAINS = [
  { rank: 1,  name: "Education & Learning",                category: "Society",     description: "School systems, university access, teaching methods, and lifelong learning" },
  { rank: 2,  name: "Environment & Climate Change",        category: "Environment", description: "Global warming, pollution, conservation, and environmental policy" },
  { rank: 3,  name: "Technology & Innovation",             category: "Technology",  description: "Digital transformation, scientific advances, and technology's impact on society" },
  { rank: 4,  name: "Health & Lifestyle",                  category: "Health",      description: "Diet, exercise, healthcare systems, and public health campaigns" },
  { rank: 5,  name: "Crime & Punishment",                  category: "Society",     description: "Crime prevention, criminal justice, rehabilitation, and law enforcement" },
  { rank: 6,  name: "Work & Employment",                   category: "Economy",     description: "Job markets, workplace trends, unemployment, and worker rights" },
  { rank: 7,  name: "Government & Society",                category: "Politics",    description: "Public policy, social welfare, civic duties, and the role of the state" },
  { rank: 8,  name: "Media & Advertising",                 category: "Media",       description: "News bias, advertising ethics, media influence, and press freedom" },
  { rank: 9,  name: "Transport & Urban Planning",          category: "Urban",       description: "Traffic congestion, public transport, city design, and infrastructure" },
  { rank: 10, name: "Family & Social Values",              category: "Society",     description: "Changing family structures, parenting, marriage, and community bonds" },
  { rank: 11, name: "Globalization",                       category: "Economy",     description: "Cross-border trade, cultural exchange, multinational corporations, and global interdependence" },
  { rank: 12, name: "Economy & Business",                  category: "Economy",     description: "Economic growth, entrepreneurship, taxation, and free markets" },
  { rank: 13, name: "Immigration & Migration",             category: "Society",     description: "Brain drain, refugee policy, cultural integration, and border control" },
  { rank: 14, name: "Arts & Culture",                      category: "Culture",     description: "Funding for arts, cultural heritage, creativity, and national identity" },
  { rank: 15, name: "Science & Research",                  category: "Science",     description: "Scientific funding, peer review, research ethics, and the role of discovery in society" },
  { rank: 16, name: "Social Media & Internet",             category: "Technology",  description: "Online communities, misinformation, social media addiction, and digital identity" },
  { rank: 17, name: "Food & Diet",                         category: "Health",      description: "Nutrition, fast food culture, food security, and vegetarianism" },
  { rank: 18, name: "Housing & Urban Development",         category: "Urban",       description: "Affordable housing, urban sprawl, homelessness, and city regeneration" },
  { rank: 19, name: "Animal Rights & Wildlife",            category: "Environment", description: "Zoos, endangered species, factory farming, and animal welfare legislation" },
  { rank: 20, name: "Sports & Exercise",                   category: "Health",      description: "Amateur vs. professional sport, doping, sports funding, and physical activity" },
  { rank: 21, name: "Gender Equality & Women's Rights",    category: "Society",     description: "Pay gaps, workplace discrimination, gender roles, and feminist policy" },
  { rank: 22, name: "Poverty & Inequality",                category: "Economy",     description: "Wealth gaps, social mobility, poverty traps, and redistributive taxation" },
  { rank: 23, name: "Tourism & Travel",                    category: "Culture",     description: "Over-tourism, cultural impact, sustainable travel, and the travel industry" },
  { rank: 24, name: "Language & Communication",            category: "Culture",     description: "English as global lingua franca, language extinction, bilingual education" },
  { rank: 25, name: "Elderly Care & Aging Society",        category: "Society",     description: "Aging populations, pension systems, elder care, and intergenerational conflict" },
  { rank: 26, name: "Youth & Generation Gap",              category: "Society",     description: "Young people and their values, political engagement, parental authority, and peer pressure" },
  { rank: 27, name: "Politics & Democracy",                category: "Politics",    description: "Voting systems, political engagement, populism, and democratic institutions" },
  { rank: 28, name: "Space Exploration",                   category: "Science",     description: "Public vs. private space programs, colonization, and the cost of space research" },
  { rank: 29, name: "Energy & Sustainability",             category: "Environment", description: "Renewable energy, nuclear power, fossil fuels, and energy independence" },
  { rank: 30, name: "Consumerism & Materialism",           category: "Economy",     description: "Overconsumption, planned obsolescence, minimalism, and the role of advertising" },
  { rank: 31, name: "Volunteering & Charity",              category: "Society",     description: "Charitable giving, NGOs, voluntourism, and corporate social responsibility" },
  { rank: 32, name: "Artificial Intelligence & Automation", category: "Technology", description: "Job displacement, AI ethics, algorithmic bias, and machine decision-making" },
  { rank: 33, name: "Remote Work & Flexibility",           category: "Technology",  description: "Work-from-home culture, productivity, digital nomads, and office redesign" },
  { rank: 34, name: "Cybersecurity & Data Privacy",        category: "Technology",  description: "Data breaches, surveillance, personal privacy online, and cyber warfare" },
  { rank: 35, name: "Mental Health & Well-being",          category: "Health",      description: "Stress, depression stigma, therapy access, and workplace mental health" },
  { rank: 36, name: "Traditional vs. Modern Values",       category: "Culture",     description: "Clash between heritage and progress across generations and cultures" },
  { rank: 37, name: "Urban vs. Rural Living",              category: "Urban",       description: "Rural depopulation, city overcrowding, and quality of life comparisons" },
  { rank: 38, name: "Agriculture & Food Security",         category: "Environment", description: "GMO crops, sustainable farming, food supply chains, and global hunger" },
  { rank: 39, name: "Water & Natural Resources",           category: "Environment", description: "Water scarcity, resource depletion, mining rights, and conservation policy" },
  { rank: 40, name: "Waste Management & Recycling",        category: "Environment", description: "Plastic waste, circular economy, landfill policy, and consumer responsibility" },
  { rank: 41, name: "Higher Education vs. Vocational Training", category: "Society", description: "University vs. trade skills, student debt, graduate employability" },
  { rank: 42, name: "Digital Literacy & Online Learning",  category: "Technology",  description: "E-learning platforms, digital divide, screen time, and online credentials" },
  { rank: 43, name: "Drug Policy & Substance Use",         category: "Society",     description: "Legalisation debates, addiction treatment, harm reduction, and enforcement" },
  { rank: 44, name: "National Security & Terrorism",       category: "Politics",    description: "Anti-terrorism measures, surveillance states, civil liberties, and radicalization" },
  { rank: 45, name: "Freedom of Speech & Censorship",      category: "Politics",    description: "Online content moderation, hate speech laws, and press freedom limits" },
  { rank: 46, name: "Animal Testing & Medical Research",   category: "Science",     description: "Ethics of animal experimentation, alternatives, and pharmaceutical testing" },
  { rank: 47, name: "Biotechnology & Genetic Engineering", category: "Science",     description: "Gene editing, designer babies, GMO ethics, and biomedical patents" },
  { rank: 48, name: "International Aid & Development",     category: "Politics",    description: "Foreign aid effectiveness, dependency risks, and humanitarian intervention" },
  { rank: 49, name: "Cultural Preservation",               category: "Culture",     description: "Protecting indigenous languages, heritage sites, and minority traditions" },
  { rank: 50, name: "Public Health & Epidemics",           category: "Health",      description: "Pandemic response, vaccination policy, healthcare access, and disease prevention" },
] as const

// Default top 10 domain ranks assigned to every new user
const DEFAULT_DOMAIN_RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const DEFAULT_EMAIL = 'default@local.dev'

async function seed() {
  console.log('Seeding writing_domains …')

  // Upsert all 50 domains (safe to re-run)
  for (const domain of TOP_50_DOMAINS) {
    await db
      .insert(schema.writingDomains)
      .values(domain)
      .onConflictDoUpdate({
        target: schema.writingDomains.rank,
        set: {
          name: domain.name,
          description: domain.description,
          category: domain.category,
        },
      })
  }
  console.log(`  ✓ ${TOP_50_DOMAINS.length} domains upserted`)

  // Ensure default user exists
  let [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, DEFAULT_EMAIL))
    .limit(1)

  if (!user) {
    ;[user] = await db
      .insert(schema.users)
      .values({ email: DEFAULT_EMAIL, targetProfile: 'IELTS_6.5' })
      .returning()
    console.log('  ✓ Default user created')
  } else {
    console.log('  ✓ Default user already exists')
  }

  // Fetch domain IDs for the default top-10 ranks
  const defaultDomains = await db
    .select({ id: schema.writingDomains.id })
    .from(schema.writingDomains)
    .where(inArray(schema.writingDomains.rank, [...DEFAULT_DOMAIN_RANKS]))

  // Insert default preferences (ignore if already set)
  for (const { id: domainId } of defaultDomains) {
    await db
      .insert(schema.userDomainPreferences)
      .values({ userId: user.id, domainId })
      .onConflictDoNothing()
  }
  console.log(`  ✓ Top-${DEFAULT_DOMAIN_RANKS.length} domains assigned to default user`)

  await client.end()
  console.log('Done.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
