import { db } from '@/lib/db'
import { drillTexts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type SeedText = {
  title: string
  text: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  rank: number
}

const SEED_TEXTS: SeedText[] = [
  // ── Daily Life — Easy ─────────────────────────────────────────────────────

  {
    title: 'Morning Routine',
    text: "I usually wake up at seven o'clock and have a cup of coffee. Then I check my emails and get ready for work. It takes about an hour to get everything done.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'Weekend Plans',
    text: "What do you want to do this weekend? I was thinking we could go out for dinner and catch a film afterwards. It would be good to get out of the house for a bit.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'At the Coffee Shop',
    text: "Can I get a large coffee to go, please? Actually, let me think about it — I'll have a flat white with an extra shot. And could I get a piece of cake as well?",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'The Daily Commute',
    text: "I take the train to work every day. It usually takes about forty minutes, but when there are delays it can be over an hour. I like to listen to podcasts on the way.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'Talking About the Weather',
    text: "The weather has been absolutely terrible this week. It rained every single day and the temperature dropped quite a lot. I hope it gets better by the weekend.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'Going Shopping',
    text: "I need to pick up a few things from the supermarket on my way home. I want to get some fresh vegetables, a bit of cheese, and a loaf of bread. Do you need anything while I'm there?",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'Using a Smartphone',
    text: "My phone has become an essential part of my daily life. I use it for everything — sending messages, checking the news, and finding directions. I can't imagine going anywhere without it.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },
  {
    title: 'Free Time Activities',
    text: "In my free time, I like to go for a run in the park or read a good book. It helps me switch off after a long day at work. Sometimes I meet up with friends for a coffee as well.",
    category: 'Daily Life',
    difficulty: 'easy',
    rank: 4,
  },

  // ── IELTS Topics — Medium ─────────────────────────────────────────────────

  {
    title: 'The Value of Education',
    text: "A good education opens doors to better opportunities in life. It helps people develop critical thinking and problem-solving skills that are useful in any career. Without access to quality education, many people struggle to reach their full potential.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Protecting the Environment',
    text: "We need to take better care of our planet before it is too late. Small changes in our daily habits — such as reducing plastic use and choosing public transport — can make a real difference. Every individual has a part to play.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Staying Healthy',
    text: "A balanced diet and regular exercise are essential for good health. Eating plenty of fruit and vegetables can reduce the risk of serious diseases. It is also important to get enough sleep and manage stress effectively.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'The Benefits of Travel',
    text: "Travelling to new places broadens your perspective and helps you understand different cultures. It teaches you to be adaptable and open-minded, which are valuable qualities in both work and life. Even short trips can leave a lasting impression.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: "Social Media's Impact",
    text: "Social media has transformed the way we communicate and share information. While it allows people to stay connected across great distances, it can also spread misinformation and have a negative effect on mental health. We need to use it more mindfully.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Work-Life Balance',
    text: "Many people find it difficult to balance their professional and personal lives. When work takes over, relationships and health can suffer. Setting clear boundaries and making time for rest and leisure is essential for long-term wellbeing.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Public Transport',
    text: "Investing in public transport is one of the most effective ways to reduce traffic congestion and air pollution. It also makes cities more accessible for people who cannot afford private cars. A well-connected transport network benefits everyone.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Climate Change',
    text: "Climate change is one of the most pressing challenges of our time. Rising temperatures and extreme weather events are already affecting communities around the world. Urgent action from both governments and individuals is needed to reduce carbon emissions.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'City Life',
    text: "More and more people are moving to cities in search of better jobs and higher living standards. This rapid growth puts pressure on housing, infrastructure, and public services. Urban planners need to find sustainable solutions to manage this trend.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'The Role of the Arts',
    text: "Art, music, and literature have always been a fundamental part of human culture. They allow us to express complex emotions and make sense of the world around us. Funding for the arts should be protected, even in difficult economic times.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Sport and Society',
    text: "Sport plays an important role in promoting physical and mental health across all age groups. It also teaches valuable life skills such as teamwork, discipline, and resilience. Communities that invest in sport tend to be healthier and more cohesive.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Family and Society',
    text: "The family unit remains the foundation of most societies around the world. Strong family relationships provide emotional support and a sense of belonging. However, the definition of family has broadened significantly over recent decades.",
    category: 'IELTS Topics',
    difficulty: 'medium',
    rank: 4,
  },

  // ── Academic — Hard ───────────────────────────────────────────────────────

  {
    title: 'Globalisation',
    text: "Globalisation has transformed the global economy by enabling the free movement of goods, services, and capital across national borders. While it has lifted millions out of poverty, it has also widened the gap between the wealthy and the disadvantaged.",
    category: 'Academic',
    difficulty: 'hard',
    rank: 4,
  },
  {
    title: 'Artificial Intelligence',
    text: "Artificial intelligence is rapidly transforming industries ranging from healthcare to finance and education. As these technologies become increasingly sophisticated, questions about ethics, privacy, and employment become more urgent and complex.",
    category: 'Academic',
    difficulty: 'hard',
    rank: 4,
  },
  {
    title: 'Renewable Energy',
    text: "The transition to renewable energy sources such as solar and wind power is critical if we are to meet international climate targets. This shift requires significant investment in infrastructure, research, and the retraining of workers in fossil-fuel industries.",
    category: 'Academic',
    difficulty: 'hard',
    rank: 4,
  },
  {
    title: 'Biodiversity Loss',
    text: "The accelerating loss of biodiversity threatens the stability of ecosystems that all forms of life depend upon. Protecting natural habitats, reducing pollution, and regulating unsustainable industries are essential steps in reversing this deeply concerning trend.",
    category: 'Academic',
    difficulty: 'hard',
    rank: 4,
  },
  {
    title: 'Mental Health Crisis',
    text: "Mental health conditions affect a significant proportion of the global population, yet access to adequate treatment remains insufficient in many countries. Reducing stigma, increasing funding, and integrating mental health into primary healthcare are key priorities.",
    category: 'Academic',
    difficulty: 'hard',
    rank: 4,
  },

  // ── Connected Speech Focus — designed with high-density CS patterns ───────

  {
    title: 'Connected Speech: Catenation & Weakening',
    text: "I want to pick it up and put it on the table. I need to ask about the kind of work you have done and find out what kind of help you can get from the team.",
    category: 'Connected Speech',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Connected Speech: Elision',
    text: "Last night I must have left my best friend's number at the office. You just have to look at it and decide if it is the right thing to do.",
    category: 'Connected Speech',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: "Connected Speech: Contractions & Gonna",
    text: "It's going to take a lot of effort to get this done properly. We've been working on it for a while and I don't think we're going to give up now. They're going to need our help.",
    category: 'Connected Speech',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Connected Speech: Assimilation',
    text: "Ten boys from the local team stood on the green. That person said that at ten past nine, ten more students would arrive. The whole team met at the same place every time.",
    category: 'Connected Speech',
    difficulty: 'medium',
    rank: 5,
  },
  {
    title: 'Connected Speech: Mixed Patterns',
    text: "I want to go on and tell you about the kind of thing that happens when people get together and try to pick it up and run with it. Last night's event was the best kind of evening out.",
    category: 'Connected Speech',
    difficulty: 'hard',
    rank: 5,
  },
]

async function seed() {
  console.log(`Seeding ${SEED_TEXTS.length} drill texts…`)

  let inserted = 0
  let skipped = 0

  for (const item of SEED_TEXTS) {
    const existing = await db
      .select({ id: drillTexts.id })
      .from(drillTexts)
      .where(eq(drillTexts.title, item.title))

    if (existing.length > 0) {
      skipped++
      continue
    }

    await db.insert(drillTexts).values({ ...item, isSystem: true })
    inserted++
  }

  console.log(`Done — inserted: ${inserted}, skipped (already exist): ${skipped}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
