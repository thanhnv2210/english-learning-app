/**
 * Seed: speaking_part2_topics
 *
 * Run with:
 *   pnpm db:seed:speaking-part2-topics
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 *
 * To update a topic's rank, name, description, or examplePrompts:
 *   1. Edit the row below.
 *   2. Run: pnpm db:seed:speaking-part2-topics
 *   Note: ON CONFLICT DO NOTHING means existing rows won't be updated.
 *         To force an update, connect to the DB and DELETE the row first,
 *         then re-run the seed.
 *
 * TODO: Replace this seed workflow with an Admin UI once user/role-based
 *       access control is implemented (Phase 4+).
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const PART2_TOPICS = [
  {
    rank: 1,
    name: 'A Person You Admire',
    description: 'Describe a mentor, colleague, or leader who influenced you',
    examplePrompts: [
      'Describe a senior engineer or tech leader who has had a significant impact on your career.\nYou should say:\n  - who this person is and how you know them\n  - what qualities or skills they have\n  - how they influenced your work or thinking\nAnd explain why you find them inspiring.',
      'Describe a colleague who helped you grow as a software engineer.\nYou should say:\n  - who this person is and what their role is\n  - what they did that helped you\n  - how working with them changed your approach\nAnd explain what you learned from the experience.',
    ],
  },
  {
    rank: 2,
    name: 'A Technical Challenge',
    description: 'Describe a difficult bug, outage, or engineering problem you solved',
    examplePrompts: [
      'Describe a difficult technical problem you solved at work.\nYou should say:\n  - what the problem was and why it was difficult\n  - what steps you took to investigate and fix it\n  - who else was involved\nAnd explain what you learned from solving it.',
      'Describe a production incident or system outage you were involved in.\nYou should say:\n  - what happened and how it was discovered\n  - what actions you and your team took\n  - how long it took to resolve\nAnd explain what changes were made afterwards to prevent recurrence.',
    ],
  },
  {
    rank: 3,
    name: 'A Project or Achievement',
    description: 'Describe a software project or professional milestone you are proud of',
    examplePrompts: [
      'Describe a software project you worked on that you are particularly proud of.\nYou should say:\n  - what the project was and what it aimed to do\n  - what your role was in the project\n  - what challenges the team faced\nAnd explain why you consider it a success.',
      'Describe a professional achievement that required significant effort.\nYou should say:\n  - what the achievement was\n  - why it was challenging to accomplish\n  - how you or your team approached it\nAnd explain how it affected your career or your organisation.',
    ],
  },
  {
    rank: 4,
    name: 'A Technology or Tool',
    description: 'Describe a technology, framework, or tool that changed how you work',
    examplePrompts: [
      'Describe a technology or tool that has significantly changed the way you work.\nYou should say:\n  - what the technology or tool is\n  - when and how you started using it\n  - how it improved your productivity or code quality\nAnd explain whether you would recommend it to others and why.',
      'Describe an AI tool or automation you have used in your engineering workflow.\nYou should say:\n  - what the tool is and what it does\n  - how you integrated it into your daily work\n  - what benefits and limitations you noticed\nAnd explain how it has changed your approach to software development.',
    ],
  },
  {
    rank: 5,
    name: 'A Learning Experience',
    description: 'Describe a course, book, conference, or skill you learned',
    examplePrompts: [
      'Describe an important skill you learned recently as a software engineer.\nYou should say:\n  - what the skill is and why you wanted to learn it\n  - how you went about learning it\n  - how long it took and what resources you used\nAnd explain how it has benefited your work.',
      'Describe a technical conference, course, or workshop that was valuable to you.\nYou should say:\n  - what the event or course was\n  - why you chose to attend or take it\n  - what you learned\nAnd explain how you applied what you learned in your job.',
    ],
  },
  {
    rank: 6,
    name: 'A Decision You Made',
    description: 'Describe an important technical or architectural decision and its impact',
    examplePrompts: [
      'Describe an important technical or architectural decision you made on a project.\nYou should say:\n  - what the decision was\n  - what options you considered\n  - why you chose that particular approach\nAnd explain what the outcome was and whether you would make the same decision again.',
      'Describe a time when you had to choose between two technical approaches under time pressure.\nYou should say:\n  - what the two options were\n  - what constraints you were working under\n  - how you made the final decision\nAnd explain what you learned from the experience.',
    ],
  },
  {
    rank: 7,
    name: 'A Collaboration or Teamwork',
    description: 'Describe a successful cross-team collaboration or remote working experience',
    examplePrompts: [
      'Describe a successful collaboration between your team and another team or department.\nYou should say:\n  - who was involved and what each team contributed\n  - what challenges the collaboration presented\n  - how you communicated and coordinated\nAnd explain what made the collaboration successful.',
      'Describe your experience of working effectively in a remote or distributed engineering team.\nYou should say:\n  - how the team was structured and where people were located\n  - what tools and processes you used to stay coordinated\n  - what difficulties you encountered\nAnd explain how remote work has affected your productivity and work-life balance.',
    ],
  },
  {
    rank: 8,
    name: 'A Change You Implemented',
    description: 'Describe a process, workflow, or culture change you drove in your team',
    examplePrompts: [
      'Describe a change to a process or workflow that you introduced in your team.\nYou should say:\n  - what the existing process was and why it needed changing\n  - what change you proposed and how you convinced others\n  - how the change was implemented\nAnd explain what impact it had on the team.',
      'Describe a time when you improved the code quality or engineering practices in your team.\nYou should say:\n  - what the original situation was\n  - what improvements you suggested or introduced\n  - how your teammates reacted\nAnd explain how the change affected the team in the long term.',
    ],
  },
  {
    rank: 9,
    name: 'A Memorable Workplace or Event',
    description: 'Describe a workplace, hackathon, or professional event that stands out',
    examplePrompts: [
      'Describe a workplace or office environment that you found particularly memorable.\nYou should say:\n  - where it was and what kind of company it was\n  - what made the environment stand out\n  - how it affected your work and motivation\nAnd explain what you would take from that experience to your ideal future workplace.',
      'Describe a hackathon, tech event, or company retreat that was memorable for you.\nYou should say:\n  - what the event was and where it took place\n  - what you did or built during the event\n  - who you were with\nAnd explain why it was significant and what you gained from it.',
    ],
  },
  {
    rank: 10,
    name: 'A Future Goal or Plan',
    description: 'Describe a career goal, side project, or ambition you are working towards',
    examplePrompts: [
      'Describe a career goal you are currently working towards as a software engineer.\nYou should say:\n  - what the goal is and when you set it\n  - what steps you are taking to achieve it\n  - what challenges you expect along the way\nAnd explain why this goal is important to you.',
      'Describe a side project or personal tech project you would like to build in the future.\nYou should say:\n  - what the project is and what problem it would solve\n  - what technologies you would use\n  - what has prevented you from starting it so far\nAnd explain what you hope to learn or achieve by building it.',
    ],
  },
]

async function main() {
  for (const topic of PART2_TOPICS) {
    await db
      .insert(schema.speakingPart2Topics)
      .values(topic)
      .onConflictDoNothing()
  }
  console.log(`Seeded ${PART2_TOPICS.length} Part 2 topic(s)`)
  process.exit(0)
}

main()
