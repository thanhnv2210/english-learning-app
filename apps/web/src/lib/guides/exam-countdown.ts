export type WeekPlan = {
  week: 1 | 2
  label: string
  focus: string
  dailyItems: string[]
}

export type SkillPriority = {
  skill: string
  icon: string
  focusOn: string[]
  skip: string[]
}

export type CoreTopic = {
  name: string
  icon: string
  keyVocab: string[]
}

export type GrammarStructure = {
  name: string
  pattern: string
  example: string
  whyItWorks: string
}

export const WEEK_PLANS: WeekPlan[] = [
  {
    week: 1,
    label: 'Week 1 — Foundations & Templates',
    focus: 'Learn the patterns. Stop guessing.',
    dailyItems: [
      'Day 1–2: Write 2 Task 2 opinion essays using one template. Score yourself on Task Response only.',
      'Day 3: Speaking Part 1 — record yourself on 3 topics. Aim for 3-sentence answers (point + reason + example).',
      'Day 4: Reading — do 2 timed T/F/NG passages (20 min each). Mark every wrong answer and find why.',
      'Day 5: Listening — 2 note-completion sections. Predict the answer type (noun? number?) before each gap.',
      'Day 6: Write 1 discussion essay. Review collocations for 2 core topics and use them in the essay.',
      'Day 7: Speaking Part 2 — practise 3 cue cards out loud with 1-min prep. Record and listen back.',
    ],
  },
  {
    week: 2,
    label: 'Week 2 — Timed Practice & Error Drilling',
    focus: 'Simulate exam conditions. Fix your patterns.',
    dailyItems: [
      'Day 8–9: Full timed Writing session (60 min: Task 1 + Task 2). Immediately identify the criterion where you lost the most marks.',
      'Day 10: Speaking Part 1 + 2 + 3 — simulate the full exam back to back without pausing.',
      'Day 11: Full timed Reading section (60 min). Identify which question types cost the most time.',
      'Day 12: Full timed Listening (30 min + 10 min review). Focus on the sections where you dropped marks.',
      'Day 13: Grammar drill — write 5 new sentences using each of the 3 high-ROI structures. Check them.',
      'Day 14: Rest + mental prep. Review your collocation list and core topic vocabulary once only.',
    ],
  },
]

export const SKILL_PRIORITIES: SkillPriority[] = [
  {
    skill: 'Writing',
    icon: '✍️',
    focusOn: [
      'Task 2 opinion & discussion essays — the most frequent types and worth 66% of your Writing marks',
      'One reusable paragraph template (intro paraphrase → thesis → body × 2 → conclusion)',
      'Collocations: 8–10 verb+noun and adj+noun pairs for your 5 core topics',
      'Task Response: answer every part of the question directly — this is the #1 failure point at Band 6',
    ],
    skip: [
      'Task 1 maps and process diagrams — rare, hard to learn quickly',
      'Perfecting grammar beyond the 3 core structures',
      'Writing more than 280 words — length does not raise your band',
    ],
  },
  {
    skill: 'Speaking',
    icon: '🎤',
    focusOn: [
      'Part 1: extend every answer to 3 sentences (point → reason → example or contrast)',
      'Part 2: prepare 3–4 cue cards from your 5 core topics so you never go blank',
      'Fluency over accuracy — keep talking even if imperfect; silence is penalised more than errors',
      'Discourse markers: "In terms of…", "What I find interesting is…", "Building on that…"',
    ],
    skip: [
      'Perfecting pronunciation — Band 6.5 rewards intelligibility, not a native accent',
      'Part 3 complex theoretical arguments — focus on Part 1 and Part 2 gains first',
      'Memorising full scripted answers — examiners detect them and mark you down',
    ],
  },
  {
    skill: 'Reading',
    icon: '📖',
    focusOn: [
      'T/F/NG — the single most frequent question type; master the "not mentioned" vs "contradicted" distinction',
      'Matching Headings — second most frequent; skim the first and last sentence of each paragraph',
      'Scanning speed: find keyword synonyms in the passage rather than reading every word',
      'Time discipline: max 20 minutes per section — move on even if uncertain',
    ],
    skip: [
      'Diagram labelling — rare in the real exam and complex to learn in two weeks',
      'Reading every word of the passage from start to finish',
      'Section 3 complex academic passages until you score reliably on Sections 1–2',
    ],
  },
  {
    skill: 'Listening',
    icon: '🎧',
    focusOn: [
      'Note / Form / Table completion — the most common question type across all four sections',
      'Pre-listening: read ahead and predict answer type (noun, number, adjective) before audio starts',
      'Following sequence: answers always come in the order of the questions — never fall behind',
      'Sections 1 & 2 — highest accuracy rate; dropping marks here is very costly',
    ],
    skip: [
      'Section 4 advanced multiple choice — lowest ROI for a 2-week preparation window',
      'Map and diagram labelling — time-consuming to learn, relatively rare across question sets',
      'Replaying audio to check answers — the real exam gives you no second chance',
    ],
  },
]

export const CORE_TOPICS: CoreTopic[] = [
  {
    name: 'Technology',
    icon: '💻',
    keyVocab: [
      'artificial intelligence',
      'data privacy',
      'digital divide',
      'automation',
      'cybersecurity',
      'disruptive innovation',
      'algorithm',
    ],
  },
  {
    name: 'Environment',
    icon: '🌍',
    keyVocab: [
      'carbon emissions',
      'renewable energy',
      'biodiversity',
      'climate policy',
      'deforestation',
      'net zero',
      'sustainable development',
    ],
  },
  {
    name: 'Education',
    icon: '🎓',
    keyVocab: [
      'critical thinking',
      'curriculum reform',
      'lifelong learning',
      'academic achievement',
      'digital literacy',
      'equity in education',
      'vocational training',
    ],
  },
  {
    name: 'Health',
    icon: '🏥',
    keyVocab: [
      'mental wellbeing',
      'preventive care',
      'sedentary lifestyle',
      'public health',
      'obesity epidemic',
      'healthcare system',
      'life expectancy',
    ],
  },
  {
    name: 'Economy & Work',
    icon: '💼',
    keyVocab: [
      'remote work',
      'gig economy',
      'income inequality',
      'labour market',
      'outsourcing',
      'productivity',
      'economic growth',
    ],
  },
]

export const GRAMMAR_STRUCTURES: GrammarStructure[] = [
  {
    name: 'Conditional',
    pattern: 'If + subject + present simple, subject + will + base verb',
    example:
      'If governments invest in renewable energy, carbon emissions will decline significantly over the next decade.',
    whyItWorks:
      'Signals complex reasoning and cause-effect thinking — both the Task Response and Grammatical Range criteria reward this. Examiners treat first conditional as evidence of Band 6.5 range.',
  },
  {
    name: 'Relative Clause',
    pattern: 'noun + which / that / who + clause',
    example:
      'Social media platforms, which are used by billions of people worldwide, have fundamentally reshaped political discourse.',
    whyItWorks:
      'Increases sentence complexity without making the sentence unclear. Non-defining relative clauses (with commas) show a higher level of control and are one of the clearest markers of Grammatical Range.',
  },
  {
    name: 'Passive Voice',
    pattern: 'subject + is / are / was / were + past participle (+ by agent)',
    example:
      'Personal data is collected by apps without users being fully informed of the associated risks.',
    whyItWorks:
      'Academic and formal register relies heavily on the passive. Using it correctly in Writing Task 2 and Speaking Part 3 demonstrates both Grammatical Range and appropriate register — two criteria in one.',
  },
]
