/**
 * Seed the 3-month IELTS study plan into the Projects system.
 *
 * Creates:
 *   - Project  "IELTS 3-Month Plan"  (key: IELTS)
 *   - Sprint 1 "Month 1 – Listening Foundation"    May 11 – Jun 10  (active)
 *   - Sprint 2 "Month 2 – Full Study + Euro Trip"  Jun 11 – Jul 19  (planning)
 *   - Sprint 3 "Month 3 – Mock Exam Sprint"        Jul 19 – Aug 11  (planning)
 *   - Tickets per sprint derived from the plan weeks
 *
 * Idempotent: skips project/sprints/tickets that already exist.
 * Run: pnpm db:seed:ielts-plan
 */

import { db } from '@/lib/db'
import { projects, sprints, tickets } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'

// ── Plan data ─────────────────────────────────────────────────────────────────

type TicketSeed = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  epic: 'listening' | 'reading' | 'writing' | 'speaking' | 'cross-skill'
  week: string     // human label shown in description header
}

type SprintSeed = {
  name: string
  goal: string
  startDate: Date
  endDate: Date
  status: 'active' | 'planning'
  tickets: TicketSeed[]
}

const PLAN_SPRINTS: SprintSeed[] = [
  {
    name: 'Month 1 – Listening Foundation',
    goal: 'Build the daily 3-step listening loop and introduce reading argument mapping.',
    startDate: new Date('2026-05-11'),
    endDate: new Date('2026-06-10'),
    status: 'active',
    tickets: [
      // Week 1-2
      {
        week: 'Week 1–2',
        title: 'Daily Listening Loop – Blind Listen (Section 3 or 4)',
        description:
          'Listen to an IELTS Section 3 or 4 recording once without transcript. Answer questions under exam conditions. Goal: simulate real listening pressure and identify where comprehension breaks down.\n\nUse /listening in the app.',
        priority: 'critical',
        epic: 'listening',
      },
      {
        week: 'Week 1–2',
        title: 'Daily Listening Loop – Transcript Analysis',
        description:
          "After blind listening, read the transcript carefully. Mark every answer you missed. For each miss, write WHY: Was it a linking word? A correction ('actually')? A contrast ('however')? Over-focusing on a keyword?\n\nLog patterns in /wrong-decisions.",
        priority: 'high',
        epic: 'listening',
      },
      {
        week: 'Week 1–2',
        title: 'Daily Listening Loop – Shadow Practice (15 min)',
        description:
          "Play the audio again and speak softly along with it. Don't read the transcript — listen and match rhythm and connected speech. This trains processing speed and natural English rhythm.\n\nUse /speaking/drill for connected speech analysis.",
        priority: 'high',
        epic: 'listening',
      },
      {
        week: 'Week 1–2',
        title: 'Relaxed Tech Podcast Listening (10–15 min daily)',
        description:
          'Listen to a technical podcast (e.g. Lex Fridman, BBC Tech, Software Engineering Daily) without pausing. Do not try to catch every word — focus on following the argument thread.\n\nYour engineering background helps prediction: use it.',
        priority: 'medium',
        epic: 'listening',
      },
      // Week 3-4
      {
        week: 'Week 3–4',
        title: 'Reading Argument Mapping – Aeon or BBC Future Article',
        description:
          'Read one article from Aeon, BBC Future, or The Conversation. For each paragraph, write one sentence: "This paragraph EXISTS to ___." (introduce / criticise / provide evidence / conclude)\n\nThis trains the paragraph-function awareness needed for Passage 3.',
        priority: 'high',
        epic: 'reading',
      },
      {
        week: 'Week 3–4',
        title: 'IELTS Reading Passage 3 – Timed 20 min + Review',
        description:
          'Complete one IELTS Reading Passage 3 under timed conditions (20 min). After: review every wrong answer — focus on True/False/NG traps and matching-headings logic.\n\nUse /reading in the app.',
        priority: 'high',
        epic: 'reading',
      },
      {
        week: 'Week 3–4',
        title: 'Writing – Essay Outline (Plan Verbally First)',
        description:
          'For this week\'s Writing Task 2 topic: spend 5 minutes planning aloud before writing. Say your thesis, 2 body paragraph ideas, and conclusion out loud. Then write.\n\nThis improves coherence and argument flow. Use /writing for the full audit.',
        priority: 'medium',
        epic: 'writing',
      },
    ],
  },

  {
    name: 'Month 2 – Full Study + Euro Trip',
    goal: 'Intensive study Jun 11–Jul 4, then passive immersion during Euro trip Jul 5–19.',
    startDate: new Date('2026-06-11'),
    endDate: new Date('2026-07-19'),
    status: 'planning',
    tickets: [
      // Pre-trip
      {
        week: 'Jun 11 – Jul 4 (Pre-trip)',
        title: 'Listening – Section 4 Full Set + Transcript Review (daily)',
        description:
          'Focus on Section 4 (academic monologue) — your weakest section. Listen blind → transcript review → shadow. Track: what % of answers did you get right this week vs last week?\n\nLog misses in /wrong-decisions.',
        priority: 'critical',
        epic: 'listening',
      },
      {
        week: 'Jun 11 – Jul 4 (Pre-trip)',
        title: 'Reading Passage 3 – Argument Mapping (3×/week)',
        description:
          'Three sessions per week: complete a Passage 3 (20 min timed), then map each paragraph\'s function. Focus on: author opinion vs researcher opinion vs historical opinion vs counterargument.\n\nUse /reading.',
        priority: 'high',
        epic: 'reading',
      },
      {
        week: 'Jun 11 – Jul 4 (Pre-trip)',
        title: 'Writing Task 2 – Full Essay + Writing Evaluator',
        description:
          'Write one full Task 2 essay per week. Run it through the full audit + score pipeline. Focus on idea extension: take each argument one sentence further than feels natural.\n\nTarget: every body paragraph has a specific example or consequence, not just a general claim.',
        priority: 'high',
        epic: 'writing',
      },
      {
        week: 'Jun 11 – Jul 4 (Pre-trip)',
        title: 'Speaking Part 3 – Abstract Topics (2×/week)',
        description:
          "Record yourself answering 2 Part 3 questions per week on abstract topics (technology & society, environment, education). Listen back: are you using complex grammar structures, or defaulting to simple sentences?\n\nUse /speaking/session.",
        priority: 'medium',
        epic: 'speaking',
      },
      // Euro Trip
      {
        week: 'Jul 5–19 (Euro Trip)',
        title: '🛫 Euro Trip – Passive Listening (15 min/day)',
        description:
          'During the trip: 15 min/day of English podcast while commuting, walking, or cooling down. Recommended: BBC Global News, TED Radio Hour, or 6 Minute English.\n\nNo tests, no pressure — just stay connected to English rhythm and vocabulary.',
        priority: 'low',
        epic: 'cross-skill',
      },
      {
        week: 'Jul 5–19 (Euro Trip)',
        title: '🛫 Euro Trip – Optional Article Reading',
        description:
          'If you have downtime (airports, trains): read one article on your phone from Aeon or The Conversation. No time pressure. Just read for enjoyment and notice how arguments are structured.',
        priority: 'low',
        epic: 'reading',
      },
    ],
  },

  {
    name: 'Month 3 – Mock Exam Sprint',
    goal: 'Return from trip, ramp up quickly, run full mock exams, and polish all 4 skills for retake.',
    startDate: new Date('2026-07-19'),
    endDate: new Date('2026-08-11'),
    status: 'planning',
    tickets: [
      // Re-entry
      {
        week: 'Jul 19–27 (Re-entry)',
        title: 'Resume Daily Listening Loop (Section 3 + 4)',
        description:
          "First week back: re-establish the daily 3-step loop immediately. Don't ease in — jump straight to Section 3 or 4. The trip break is short enough that your ear hasn't fully reset.\n\nUse /listening.",
        priority: 'critical',
        epic: 'listening',
      },
      {
        week: 'Jul 19–27 (Re-entry)',
        title: 'Reading Passage 3 – Argument Mapping Re-entry (3 sessions)',
        description:
          "Three Passage 3 sessions this week to shake off the rust. Use argument mapping: why does each paragraph exist? Do not panic-scan — read with purpose.\n\nUse /reading.",
        priority: 'high',
        epic: 'reading',
      },
      {
        week: 'Jul 19–27 (Re-entry)',
        title: 'Vocabulary Precision Drill – Replace Weak Collocations',
        description:
          "Find 10 sentences in your old essays that use weak collocations: 'get benefits', 'make problems', 'have effects'. Replace each with a precise formal alternative.\n\nUse /vocabulary and /collocations to find academic replacements.",
        priority: 'medium',
        epic: 'writing',
      },
      {
        week: 'Jul 19–27 (Re-entry)',
        title: 'Speaking Part 3 – Daily Recording to Rebuild Momentum',
        description:
          'Record one Part 3 answer per day on a different abstract topic. Listen back and check: Did you use any complex structures (conditionals, passive, hedging)? Or did you simplify under pressure?\n\nUse /speaking.',
        priority: 'medium',
        epic: 'speaking',
      },
      // Mock Sprint
      {
        week: 'Jul 28 – Aug 4 (Mock Sprint)',
        title: 'Full IELTS Mock Test – All 4 Skills, Timed',
        description:
          "Saturday: complete a full IELTS mock under strict exam conditions. Listening (30 min) → Reading (60 min) → Writing (60 min) → Speaking (recorded).\n\nSunday: review every wrong answer. Log all reasoning errors in /wrong-decisions.",
        priority: 'critical',
        epic: 'cross-skill',
      },
      {
        week: 'Jul 28 – Aug 4 (Mock Sprint)',
        title: 'Writing Task 2 – Idea Extension Focus (2 essays/week)',
        description:
          "Write two essays this week. For each body paragraph, apply the Band 7 extension rule: every claim must be followed by a specific consequence, example, or contrast.\n\nCompare: Band 6 'Technology improves communication.' vs Band 7 'Technology enables real-time collaboration across time zones, removing a key barrier to global business.'",
        priority: 'high',
        epic: 'writing',
      },
      {
        week: 'Jul 28 – Aug 4 (Mock Sprint)',
        title: 'Speaking – Part 3 Abstract & Controversial Topics',
        description:
          "Practice Part 3 questions on controversial topics: Is technology harmful to society? Should universities be free? Does economic growth justify environmental damage?\n\nFocus on hedging language: 'It could be argued that...', 'There is a case to be made for...', 'One perspective holds that...'",
        priority: 'high',
        epic: 'speaking',
      },
      // Final Polish
      {
        week: 'Aug 5–11 (Final Polish)',
        title: 'Mock Test – Weak Area Focus Only',
        description:
          "Based on your Week 1 mock results: identify the 2 weakest question types. Spend Saturday doing targeted practice only on those types. Review Sunday.\n\nBook your official retake exam this week if scores look ready.",
        priority: 'critical',
        epic: 'cross-skill',
      },
      {
        week: 'Aug 5–11 (Final Polish)',
        title: 'Listening Section 4 – Track % Correct',
        description:
          "Do 3 Section 4 practices this week. Record your % correct for each. Compare to Week 1 of Month 1. This is your key metric: has your real-time processing speed improved?\n\nTarget: 70%+ correct on Section 4 before retake.",
        priority: 'high',
        epic: 'listening',
      },
      {
        week: 'Aug 5–11 (Final Polish)',
        title: 'Reading – True/False/NG Intensive Practice',
        description:
          "Practice 3 True/False/NG question sets. The trap: 'False' means the text CONTRADICTS the statement. 'Not Given' means there is NO information either way — not that it seems unlikely.\n\nThis distinction is the most common Band 6 reading error.",
        priority: 'high',
        epic: 'reading',
      },
      {
        week: 'Aug 5–11 (Final Polish)',
        title: 'Review Old Essays – Identify Cohesion Issues',
        description:
          "Read your 3 most recent essays. Highlight every linking word (Moreover, Furthermore, However...). Ask: does it feel mechanical or natural? Replace overused connectors with structural cohesion (pronoun reference, parallel structure, topic sentence echo).",
        priority: 'medium',
        epic: 'writing',
      },
    ],
  },
]

// ── Runner ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding IELTS 3-Month Plan project…\n')

  // 1. Get or create project
  const [existing] = await db.select().from(projects).where(eq(projects.key, 'IELTS')).limit(1)
  let project = existing
  if (!project) {
    const [created] = await db
      .insert(projects)
      .values({
        name: 'IELTS 3-Month Plan',
        key: 'IELTS',
        description: 'Structured 3-month plan to reach Overall Band 6.5. Listening is the critical path.',
      })
      .returning()
    project = created
    console.log(`Created project: ${project.name} (${project.key})`)
  } else {
    console.log(`Using project: ${project.name} (${project.key})`)
  }

  // 2. Create sprints + tickets
  for (const sprintSeed of PLAN_SPRINTS) {
    // Check if sprint already exists by name
    const [existingSprint] = await db
      .select()
      .from(sprints)
      .where(and(eq(sprints.projectId, project.id), eq(sprints.name, sprintSeed.name)))
      .limit(1)

    let sprint = existingSprint
    if (!sprint) {
      const [created] = await db
        .insert(sprints)
        .values({
          projectId: project.id,
          name: sprintSeed.name,
          goal: sprintSeed.goal,
          status: sprintSeed.status,
          startDate: sprintSeed.startDate,
          endDate: sprintSeed.endDate,
        })
        .returning()
      sprint = created
      console.log(`\n  + Sprint: ${sprint.name}`)
    } else {
      console.log(`\n  ~ Sprint exists: ${sprint.name}`)
    }

    // 3. Create tickets
    let inserted = 0
    for (const ticketSeed of sprintSeed.tickets) {
      const [existingTicket] = await db
        .select({ id: tickets.id })
        .from(tickets)
        .where(and(eq(tickets.projectId, project.id), eq(tickets.title, ticketSeed.title)))
        .limit(1)

      if (existingTicket) {
        continue
      }

      // Atomically increment ticket counter
      const [proj] = await db
        .update(projects)
        .set({ ticketCounter: sql`${projects.ticketCounter} + 1` })
        .where(eq(projects.id, project.id))
        .returning({ key: projects.key, counter: projects.ticketCounter })

      const key = `${proj.key}-${proj.counter}`

      await db.insert(tickets).values({
        projectId: project.id,
        sprintId: sprint.id,
        key,
        title: ticketSeed.title,
        description: `[${ticketSeed.week}]\n\n${ticketSeed.description}`,
        type: 'task',
        priority: ticketSeed.priority,
        epic: ticketSeed.epic,
        status: 'todo',
        isTemplate: false,
        isSystem: false,
      })

      console.log(`     + ${key}  ${ticketSeed.title}`)
      inserted++
    }

    if (inserted === 0) console.log('     (all tickets already exist)')
  }

  console.log('\nDone. Visit /projects to view the IELTS 3-Month Plan board.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
