export const WRITING_DOMAINS = [
  'AI & Automation',
  'Remote Work',
  'Cybersecurity',
  'System Design',
  'Open Source',
  'Climate Tech',
] as const

export type WritingDomain = (typeof WRITING_DOMAINS)[number]

// ─── Topic generation ─────────────────────────────────────────────────────────

export type WritingTaskType = 'opinion' | 'discussion' | 'problem_solution' | 'two_part'

const TASK_TYPE_CONFIGS: Record<WritingTaskType, { instruction: string; ending: string }> = {
  opinion: {
    instruction: 'Present a debatable claim about ${domain} that engineers or tech workers might disagree on.',
    ending: 'To what extent do you agree or disagree?',
  },
  discussion: {
    instruction: 'Present two opposing perspectives on a ${domain} issue without favouring either side.',
    ending: 'Discuss both views and give your own opinion.',
  },
  problem_solution: {
    instruction: 'Describe a real problem caused by ${domain} trends in the tech industry.',
    ending: 'What are the causes of this problem and what measures could be taken to address it?',
  },
  two_part: {
    instruction: 'Make a statement about how ${domain} is changing the way software engineers or organisations work.',
    ending: 'Do you think this is a positive or negative development? What can individuals do to adapt?',
  },
}

const TASK_TYPES = Object.keys(TASK_TYPE_CONFIGS) as WritingTaskType[]

const ANGLES: Record<WritingDomain, string[]> = {
  'AI & Automation': [
    'AI replacing junior developers', 'automated code review tools', 'AI-generated documentation',
    'LLMs in production systems', 'bias in AI hiring tools', 'AI pair programming',
  ],
  'Remote Work': [
    'asynchronous communication norms', 'remote team trust and monitoring', 'home-office productivity',
    'global hiring and time-zone coordination', 'virtual onboarding', 'remote work and career progression',
  ],
  'Cybersecurity': [
    'zero-trust architecture adoption', 'developer responsibility for security', 'open-source dependency risks',
    'ransomware targeting tech companies', 'password-less authentication', 'security vs usability trade-offs',
  ],
  'System Design': [
    'microservices vs monoliths', 'event-driven architecture complexity', 'database per service pattern',
    'API versioning strategies', 'over-engineering in startups', 'distributed system observability',
  ],
  'Open Source': [
    'corporate sponsorship of open-source projects', 'maintainer burnout', 'open-source licensing conflicts',
    'open-source in safety-critical systems', 'contribution inequality', 'forking as a community conflict tool',
  ],
  'Climate Tech': [
    'the energy cost of large AI models', 'cloud computing carbon footprints', 'software engineers\' role in sustainability',
    'green coding practices', 'tech industry net-zero pledges', 'remote work reducing commute emissions',
  ],
}

export function TOPIC_GENERATION_PROMPT(domain: string): string {
  const taskType = TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)]
  const config = TASK_TYPE_CONFIGS[taskType]
  const domainAngles = ANGLES[domain as WritingDomain] ?? []
  const angle = domainAngles.length > 0
    ? domainAngles[Math.floor(Math.random() * domainAngles.length)]
    : domain

  const instruction = config.instruction.replace('${domain}', domain)

  return `You are an IELTS Academic Writing Task 2 examiner. Generate one IELTS Academic Task 2 essay question.

Task type: ${taskType}
Domain: ${domain}
Specific angle to focus on: "${angle}"

Instructions:
- ${instruction}
- The question must be 2–4 sentences: open with a factual or debatable statement about "${angle}", then end with exactly this instruction: "${config.ending}"
- Write in formal academic English. Do not use the word "delve". Do not repeat the angle word-for-word in the closing instruction.
- Do NOT produce a generic question — make it specific to "${angle}".

Return ONLY valid JSON — no markdown, no explanation:
{
  "prompt": "<the full essay question>",
  "taskType": "${taskType}"
}`
}

// ─── Drafting Mode ────────────────────────────────────────────────────────────

export function OUTLINE_CRITIQUE_PROMPT(topic: string): string {
  return `You are an experienced IELTS Writing Task 2 examiner reviewing an essay outline before the candidate writes the full essay.

Essay topic: ${topic}

Evaluate the outline against these four areas and give specific, actionable feedback:
1. **Introduction thesis** — Is the position clear and directly answerable? Does it paraphrase the topic without copying it?
2. **Body 1 argument** — Is the claim logical and relevant? Does it support the stated position? Is there a risk of going off-topic?
3. **Body 2 argument** — Is it distinct from Body 1? Does it add a genuinely different angle or is it repetitive?
4. **Conclusion stance** — Does it follow from the two body arguments? Does it restate (not introduce new ideas)?

Be concise and direct. Flag any logical gaps or IELTS pitfalls (e.g. agreeing then disagreeing, unsupported generalisations). End with one sentence summarising whether the outline is ready to write or needs revision.`
}

// ─── Pass 1 — Structural Audit ────────────────────────────────────────────────

export const AUDIT_PROMPT = `You are an IELTS Academic examiner performing a structural audit of a Writing Task 2 essay.

Return ONLY valid JSON — no markdown, no explanation:
{
  "wordCount": <integer — count every word in the essay>,
  "paragraphCount": <integer — number of distinct paragraphs>,
  "hasIntroduction": <boolean>,
  "hasConclusion": <boolean>,
  "taskFulfilled": <boolean — essay addresses the question directly>,
  "notes": ["<specific structural observation>"]
}`

// ─── Pass 2 — Vocabulary Analysis ────────────────────────────────────────────

export const VOCABULARY_PROMPT = `You are an IELTS Academic examiner analysing vocabulary in a Writing Task 2 essay.
Identify informal words, dev-slang, or basic vocabulary that should be replaced with Academic Word List (AWL) equivalents to improve the Lexical Resource band score.

Return ONLY valid JSON — no markdown, no explanation:
{
  "informalWords": [
    {
      "word": "<exact word or short phrase as it appears in the essay>",
      "suggestion": "<academic or AWL alternative>",
      "reason": "<one sentence: why this change improves the band score>"
    }
  ]
}

If no informal words are found, return: { "informalWords": [] }
Limit to the 5 most impactful replacements.`

// ─── Pass 3 — Scoring ─────────────────────────────────────────────────────────

export function SCORING_PROMPT(targetBand: number): string {
  return `You are a certified IELTS Academic examiner scoring a Writing Task 2 essay using official IELTS Academic band descriptors. You have already reviewed its structure and vocabulary in earlier passes.

Target band: ${targetBand}

Return ONLY valid JSON — no markdown, no explanation:
{
  "overallBand": <number 0–9 in 0.5 steps>,
  "targetBand": ${targetBand},
  "criteria": [
    {
      "criterion": "Task Response",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific, evidence-based observation>"]
    },
    {
      "criterion": "Coherence & Cohesion",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific observation>"]
    },
    {
      "criterion": "Lexical Resource",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific observation>"]
    },
    {
      "criterion": "Grammatical Range & Accuracy",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific observation>"]
    }
  ]
}`
}

// ─── Gap Analysis (on-demand) ─────────────────────────────────────────────────

export function GAP_ANALYSIS_PROMPT(targetBand: number): string {
  return `You are an IELTS Academic examiner explaining exactly what a candidate must change to reach Band ${targetBand} on the IELTS Academic test.

You will receive the essay and its current band scores per criterion. For each criterion where the score is below the target, state the precise changes needed — not generic advice.

Return ONLY valid JSON — no markdown, no explanation:
{
  "criteria": [
    {
      "criterion": "<criterion name>",
      "currentBand": <number>,
      "targetBand": ${targetBand},
      "requiredChanges": ["<specific, actionable change — quote or reference the essay directly where possible>"]
    }
  ]
}

Only include criteria where currentBand < targetBand. If all criteria meet the target, return { "criteria": [] }.`
}
