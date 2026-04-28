// ─── Task 1 chart types ───────────────────────────────────────────────────────

export const TASK1_CHART_TYPES = ['bar chart', 'line graph', 'pie chart', 'table'] as const
export type Task1ChartType = (typeof TASK1_CHART_TYPES)[number]

// ─── Topic generation ─────────────────────────────────────────────────────────

export function TASK1_TOPIC_GENERATION_PROMPT(domain: string, chartType: string): string {
  return `You are an IELTS Academic Writing Task 1 examiner. Generate one realistic Task 1 question with data for a ${chartType} about "${domain}".

This is a text-based learning app, so include both a question description AND the underlying data values so the student can write their response.

Rules:
- The question must start with "The ${chartType} below shows/illustrates..." and end with "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
- Use realistic numbers relevant to ${domain} (years 2015–2024 or comparable recent period).
- Data table/list must include all numbers needed to write a complete response. Use clear column headers and consistent units.
- Do not use the word "delve".

Return ONLY valid JSON — no markdown, no explanation:
{
  "chartType": "${chartType}",
  "title": "<concise chart title, e.g. 'Proportion of remote workers by sector, 2020 and 2023'>",
  "question": "<the full IELTS-style question>",
  "data": "<the chart data as a plain-text table or labelled list — include all values the student needs>"
}`
}

// ─── Pass 1 — Structural Audit ────────────────────────────────────────────────

export const TASK1_AUDIT_PROMPT = `You are an IELTS Academic examiner auditing a Writing Task 1 response.

Return ONLY valid JSON — no markdown, no explanation:
{
  "wordCount": <integer — count every word in the response>,
  "paragraphCount": <integer>,
  "hasIntroduction": <boolean — does it paraphrase the question as an opening sentence?>,
  "hasOverview": <boolean — does it include a clear overview paragraph summarising the dominant trend or comparison?>,
  "usesData": <boolean — are specific data values cited to support the description?>,
  "hasPersonalOpinion": <boolean — does it incorrectly include personal opinions or explain reasons (a Task 1 error)?>,
  "notes": ["<specific structural observation>"]
}`

// ─── Pass 2 — Scoring (Task Achievement criterion) ────────────────────────────

export function TASK1_SCORING_PROMPT(targetBand: number): string {
  return `You are a certified IELTS Academic examiner scoring a Writing Task 1 response using official IELTS Academic band descriptors. You have already reviewed its structure in an earlier pass.

Target band: ${targetBand}

Return ONLY valid JSON — no markdown, no explanation:
{
  "overallBand": <number 0–9 in 0.5 steps>,
  "targetBand": ${targetBand},
  "criteria": [
    {
      "criterion": "Task Achievement",
      "score": <number>,
      "targetScore": ${targetBand},
      "keyPoints": ["<specific observation about overview, key features, data accuracy, or inappropriate opinion>"]
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
