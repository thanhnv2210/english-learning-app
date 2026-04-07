/**
 * Seed: speaking_topics
 *
 * Run with:
 *   pnpm tsx src/lib/db/seeds/speaking-topics.ts
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const SPEAKING_TOPICS = [
  {
    rank: 1,
    name: 'Work / Study',
    description: 'Questions about your job or course of study',
    exampleQuestions: [
      'Do you work or are you a student?',
      'What do you like most about your job/course?',
      'What are the most challenging parts of your work or studies?',
      'Would you like to change your job or field of study in the future?',
    ],
  },
  {
    rank: 2,
    name: 'Hometown',
    description: 'Questions about where you grew up',
    exampleQuestions: [
      'Where is your hometown?',
      'Has it changed much since you were a child?',
      'What do you like most about your hometown?',
      'Would you prefer to live in a city or in the countryside?',
    ],
  },
  {
    rank: 3,
    name: 'Home / Accommodation',
    description: 'Questions about where you currently live',
    exampleQuestions: [
      'Can you describe the house or apartment you live in?',
      'Which room is your favourite?',
      'Do you prefer living alone or with others?',
      'What would your ideal home look like?',
    ],
  },
  {
    rank: 4,
    name: 'Daily Routine',
    description: 'Questions about how you spend a typical day',
    exampleQuestions: [
      'What is your favourite part of the day?',
      'Do you prefer a busy or a relaxed schedule?',
      'Has your daily routine changed recently?',
      'Do you think it is important to have a routine?',
    ],
  },
  {
    rank: 5,
    name: 'Hobbies / Interests',
    description: 'Questions about what you enjoy doing in your free time',
    exampleQuestions: [
      'What do you like to do in your free time?',
      'Did you have the same hobbies when you were younger?',
      'Do you prefer indoor or outdoor activities?',
      'Is it important to have hobbies?',
    ],
  },
  {
    rank: 6,
    name: 'Technology',
    description: 'Questions about how you use technology and the internet',
    exampleQuestions: [
      'How often do you use social media?',
      'Do you think computers are useful for your studies or work?',
      'What kind of technology do you use most in your daily life?',
      'Do you think people rely too much on technology?',
    ],
  },
  {
    rank: 7,
    name: 'Weather',
    description: 'Questions about weather preferences and climate',
    exampleQuestions: [
      'What kind of weather do you like best?',
      'Does the weather ever affect your mood?',
      'What is the weather like in your hometown?',
      'Do you think weather affects how productive people are?',
    ],
  },
  {
    rank: 8,
    name: 'Transport',
    description: 'Questions about how you get around',
    exampleQuestions: [
      'How do you usually travel to work or school?',
      'Is public transport good in your city?',
      'Do you prefer travelling by public transport or by car?',
      'How important is it for cities to have good transport systems?',
    ],
  },
  {
    rank: 9,
    name: 'Food / Cooking',
    description: 'Questions about eating habits and food culture',
    exampleQuestions: [
      'Do you prefer eating at home or at a restaurant?',
      'What is a popular dish in your country?',
      'Do you enjoy cooking?',
      'How has your diet changed over the years?',
    ],
  },
  {
    rank: 10,
    name: 'Future Plans',
    description: 'Questions about your goals and plans',
    exampleQuestions: [
      'What are you planning to do after you finish your IELTS exam?',
      'Where do you see yourself in five years?',
      'Do you have any plans to travel or live abroad?',
      'What is the most important goal you want to achieve?',
    ],
  },
]

async function main() {
  for (const topic of SPEAKING_TOPICS) {
    await db
      .insert(schema.speakingTopics)
      .values(topic)
      .onConflictDoNothing()
  }
  console.log(`Seeded ${SPEAKING_TOPICS.length} speaking topic(s)`)
  process.exit(0)
}

main()
