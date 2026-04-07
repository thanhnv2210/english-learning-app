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

export function TOPIC_GENERATION_PROMPT(domain: string): string {
  return `You are an IELTS Academic Writing Task 2 examiner. Generate one IELTS Academic Task 2 essay question on the topic of "${domain}".

The question must:
- Be 2–4 sentences long
- Present a statement or issue related to ${domain} in the context of modern technology or software engineering
- End with a clear instruction such as "Discuss both views and give your own opinion." or "To what extent do you agree or disagree?"

Output ONLY the essay question. No preamble, no labels.`
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
