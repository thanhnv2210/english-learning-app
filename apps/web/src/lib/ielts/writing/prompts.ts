export const WRITING_DOMAINS = [
  'AI & Automation',
  'Remote Work',
  'Cybersecurity',
  'System Design',
  'Open Source',
  'Climate Tech',
] as const

export type WritingDomain = (typeof WRITING_DOMAINS)[number]

export function TOPIC_GENERATION_PROMPT(domain: string): string {
  return `You are an IELTS Writing Task 2 examiner. Generate one IELTS Task 2 essay question on the topic of "${domain}".

The question must:
- Be 2–4 sentences long
- Present a statement or issue related to ${domain} in the context of modern technology or software engineering
- End with a clear instruction such as "Discuss both views and give your own opinion." or "To what extent do you agree or disagree?"

Output ONLY the essay question. No preamble, no labels.`
}

export function EVALUATION_PROMPT(targetBand: number): string {
  return `You are a certified IELTS examiner evaluating a Writing Task 2 essay. Score strictly against IELTS band descriptors.

Target band: ${targetBand}

Return ONLY valid JSON in this exact shape — no markdown, no explanation:
{
  "overallBand": <number 0-9 in 0.5 steps>,
  "targetBand": ${targetBand},
  "criteria": [
    {
      "criterion": "Task Achievement",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific feedback>", ...]
    },
    {
      "criterion": "Coherence & Cohesion",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific feedback>", ...]
    },
    {
      "criterion": "Lexical Resource",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific feedback>", ...]
    },
    {
      "criterion": "Grammatical Range & Accuracy",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific feedback>", ...]
    }
  ]
}`
}
