/**
 * Seed default IELTS Academic template tickets.
 * Safe to re-run — skips templates that already exist (matched by title + isSystem).
 * Run: pnpm db:seed:projects
 */

import { db } from '@/lib/db'
import { projects, tickets } from '@/lib/db/schema'
import { eq, and, isNull, sql } from 'drizzle-orm'

// ── Seed data ────────────────────────────────────────────────────────────────

type SeedTemplate = {
  title: string
  description: string
  type: 'task' | 'bug' | 'story'
  priority: 'low' | 'medium' | 'high' | 'critical'
  epic: 'writing' | 'reading' | 'listening' | 'speaking' | 'cross-skill'
}

const IELTS_TEMPLATES: SeedTemplate[] = [
  // ── Writing ──────────────────────────────────────────────────────────────
  {
    title: 'Writing Task 1 – Describe a Graph or Chart',
    description:
      'Choose a bar, line, or pie chart. Write a 150-word academic description covering the overview and key comparisons. Use /writing to draft and score.',
    type: 'task',
    priority: 'high',
    epic: 'writing',
  },
  {
    title: 'Writing Task 1 – Describe a Process or Diagram',
    description:
      'Select a process diagram (e.g. water cycle, manufacturing). Write a 150-word description using passive voice and sequencing language.',
    type: 'task',
    priority: 'medium',
    epic: 'writing',
  },
  {
    title: 'Writing Task 2 – Agree or Disagree Essay',
    description:
      'Write a 250-word essay taking a clear position. Use the Essay Builder (/essay-builder) to generate a draft, then run the full audit + score pipeline.',
    type: 'story',
    priority: 'high',
    epic: 'writing',
  },
  {
    title: 'Writing Task 2 – Discussion Essay',
    description:
      'Present both sides of an argument with equal weight. Write 250 words covering 2 body paragraphs + a balanced conclusion. Target Band 6.5+.',
    type: 'story',
    priority: 'high',
    epic: 'writing',
  },
  {
    title: 'Writing Task 2 – Problem and Solution Essay',
    description:
      'Identify 2 problems and propose 2 solutions for a given topic. 250 words. Focus on cohesion using discourse markers (Furthermore, As a result, …).',
    type: 'task',
    priority: 'medium',
    epic: 'writing',
  },
  {
    title: 'Writing Task 2 – Advantages and Disadvantages Essay',
    description:
      'Write a balanced 250-word essay discussing pros and cons. Conclude with your own opinion or a neutral summary. Use /writing for vocabulary audit.',
    type: 'task',
    priority: 'medium',
    epic: 'writing',
  },

  // ── Speaking ─────────────────────────────────────────────────────────────
  {
    title: 'Speaking Part 1 – Personal Topics Practice',
    description:
      'Complete a Part 1 session using /speaking. Focus on 3 topics: Hometown, Work/Study, and a hobby. Aim for 2–3 sentences per answer with natural connectors.',
    type: 'task',
    priority: 'high',
    epic: 'speaking',
  },
  {
    title: 'Speaking Part 2 – Cue Card Practice',
    description:
      'Use /speaking/part2 to practice a 2-minute monologue. Prepare for 1 minute, then speak. Review filler words in the post-session report.',
    type: 'task',
    priority: 'high',
    epic: 'speaking',
  },
  {
    title: 'Speaking Part 3 – Abstract Discussion',
    description:
      'Practice abstract Part 3 questions linked to your Part 2 topic. Use complex structures: conditionals, passive voice, hedging (It could be argued that…).',
    type: 'task',
    priority: 'medium',
    epic: 'speaking',
  },
  {
    title: 'Full Speaking Mock Test',
    description:
      'Run a complete Part 1 → Part 2 → Part 3 session using /speaking/session. Record time per part and review filler detection results after.',
    type: 'story',
    priority: 'critical',
    epic: 'speaking',
  },

  // ── Reading ───────────────────────────────────────────────────────────────
  {
    title: 'Reading Practice – True / False / Not Given',
    description:
      'Complete a TF/NG passage on /reading. Focus on distinguishing "False" (contradicts) vs "Not Given" (not mentioned). Time yourself: 20 min per passage.',
    type: 'task',
    priority: 'high',
    epic: 'reading',
  },
  {
    title: 'Reading Practice – Matching Headings',
    description:
      "Practice a matching headings task. Strategy: read each paragraph's topic sentence first, then match. Avoid reading entire paragraphs in one pass.",
    type: 'task',
    priority: 'medium',
    epic: 'reading',
  },
  {
    title: 'Reading Practice – Short Answer Questions',
    description:
      'Complete a short-answer reading task. Focus on keyword scanning and paraphrasing awareness. Use the /how-to-answer guide for strategies.',
    type: 'task',
    priority: 'medium',
    epic: 'reading',
  },
  {
    title: 'Full Reading Mock Test (60 min)',
    description:
      'Simulate exam conditions: 3 passages × 20 min. No pausing. Review wrong answers using /wrong-decisions to log your reasoning errors.',
    type: 'story',
    priority: 'high',
    epic: 'reading',
  },

  // ── Listening ────────────────────────────────────────────────────────────
  {
    title: 'Listening Section 1 & 2 – Form Completion',
    description:
      'Practice form-completion and table-completion questions. Focus on spelling and number accuracy. Use /listening and play the audio max 2 times.',
    type: 'task',
    priority: 'medium',
    epic: 'listening',
  },
  {
    title: 'Listening Section 3 & 4 – Academic Monologue',
    description:
      'Practice note-completion for an academic lecture. Focus on predicting answer types before listening. Review /how-to-answer/listening for Section 4 tips.',
    type: 'task',
    priority: 'high',
    epic: 'listening',
  },
  {
    title: 'Full Listening Mock Test (30 min)',
    description:
      'Complete all 4 sections in one sitting on /listening. Simulate exam: no pausing between sections. Log any tricky questions in /wrong-decisions.',
    type: 'story',
    priority: 'high',
    epic: 'listening',
  },

  // ── Cross-Skill ───────────────────────────────────────────────────────────
  {
    title: 'Learn 20 AWL Words',
    description:
      'Pick 20 Academic Word List words from /vocabulary. For each: read the definition, save 1–2 example sentences, and practice via the fill-in-the-blank game.',
    type: 'task',
    priority: 'medium',
    epic: 'cross-skill',
  },
  {
    title: 'Review 10 Key Collocations',
    description:
      'Find 10 topic collocations in /collocations. Save examples and play the multiple-choice game to reinforce them. Focus on Writing/Speaking contexts.',
    type: 'task',
    priority: 'medium',
    epic: 'cross-skill',
  },
  {
    title: 'Paraphrase Practice – 5 Sentences',
    description:
      'Take 5 sentences from your writing drafts. Rewrite each using synonyms and structural changes. Use /paraphrase for technique guidance.',
    type: 'task',
    priority: 'medium',
    epic: 'cross-skill',
  },
  {
    title: 'Review Wrong Answers from This Week',
    description:
      'Open /wrong-decisions and analyse your logged mistakes. For each: understand why your answer was wrong, read the AI analysis, and note the pattern.',
    type: 'task',
    priority: 'high',
    epic: 'cross-skill',
  },
  {
    title: 'Weekly Score Check & Analytics Review',
    description:
      'Go to /analytics. Check your average band per skill vs your target. Identify the skill with the largest gap and plan next sprint tasks accordingly.',
    type: 'story',
    priority: 'medium',
    epic: 'cross-skill',
  },
]

// ── Runner ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding IELTS Academic project templates…')

  // Get or create the default project
  const existing = await db.select().from(projects).limit(1)
  let project = existing[0]
  if (!project) {
    const [created] = await db
      .insert(projects)
      .values({ name: 'My Project', key: 'PROJ', description: 'Default project' })
      .returning()
    project = created
    console.log(`Created project: ${project.name} (${project.key})`)
  } else {
    console.log(`Using project: ${project.name} (${project.key})`)
  }

  let inserted = 0
  let updated = 0

  for (const tmpl of IELTS_TEMPLATES) {
    // Check if a system template with this title already exists
    const existing = await db
      .select({ id: tickets.id, epic: tickets.epic })
      .from(tickets)
      .where(and(
        eq(tickets.projectId, project.id),
        eq(tickets.title, tmpl.title),
        eq(tickets.isSystem, true),
      ))
      .limit(1)

    if (existing[0]) {
      // Patch epic if it's missing (backfill for records seeded before epic column was added)
      if (!existing[0].epic) {
        await db
          .update(tickets)
          .set({ epic: tmpl.epic })
          .where(eq(tickets.id, existing[0].id))
        console.log(`  ~ patched epic="${tmpl.epic}" on: ${tmpl.title}`)
        updated++
      }
      continue
    }

    // New record — atomically increment ticket counter and insert
    const [proj] = await db
      .update(projects)
      .set({ ticketCounter: sql`${projects.ticketCounter} + 1` })
      .where(eq(projects.id, project.id))
      .returning({ key: projects.key, counter: projects.ticketCounter })
    const key = `${proj.key}-${proj.counter}`

    await db.insert(tickets).values({
      projectId: project.id,
      sprintId: null,
      key,
      title: tmpl.title,
      description: tmpl.description,
      type: tmpl.type,
      priority: tmpl.priority,
      epic: tmpl.epic,
      status: 'todo',
      isTemplate: true,
      isSystem: true,
    })

    console.log(`  + ${key}  ${tmpl.title}`)
    inserted++
  }

  console.log(`\nDone. Inserted: ${inserted}, Updated (epic backfill): ${updated}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
