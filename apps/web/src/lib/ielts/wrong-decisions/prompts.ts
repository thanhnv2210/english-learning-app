export type WrongDecisionAnalysis = {
  analytic: string
  solution: string
  roles: string[]
}

const VALID_ROLES = [
  'question-word',
  'category',
  'exclusion',
  'hedge',
  'relationship',
  'target',
  'time',
]

export function WRONG_DECISION_PROMPT(data: {
  skill: string
  sourceText?: string
  question: string
  myThought: string
  actualAnswer: string
}): string {
  const sourceBlock = data.sourceText?.trim()
    ? `\nSOURCE TEXT:\n"""\n${data.sourceText.trim()}\n"""\n`
    : ''

  return `You are a strict IELTS examiner helping a learner understand why they got a question wrong.

SKILL: ${data.skill.toUpperCase()}${sourceBlock}
QUESTION: ${data.question}
LEARNER'S THOUGHT / ANSWER: ${data.myThought}
CORRECT ANSWER: ${data.actualAnswer}

Your job:
1. Explain clearly and specifically why the learner's answer was wrong (2-4 sentences). Reference the exact words in the question or source text that the learner misread or overlooked.
2. Give 2-3 concrete, actionable steps to prevent this mistake in future IELTS practice.
3. Identify which question roles the learner failed to decode correctly. Choose ONLY from this list (use exact strings): question-word, category, exclusion, hedge, relationship, target, time. If none apply clearly, return an empty list.

Reply ONLY in this exact format — no preamble, no extra text:
---ANALYTIC---
<your analytic here>
---SOLUTION---
<your solution here>
---ROLES---
<comma-separated roles, e.g.: exclusion, hedge — or leave blank if none>`
}

export function parseWrongDecisionAnalysis(raw: string): WrongDecisionAnalysis {
  const analyticMatch = raw.match(/---ANALYTIC---\s*\n([\s\S]*?)\n---SOLUTION---/)
  const solutionMatch = raw.match(/---SOLUTION---\s*\n([\s\S]*?)\n---ROLES---/)
  const rolesMatch = raw.match(/---ROLES---\s*\n([\s\S]*)/)

  const analytic = analyticMatch?.[1]?.trim() ?? ''
  const solution = solutionMatch?.[1]?.trim() ?? ''
  const rolesRaw = rolesMatch?.[1]?.trim() ?? ''

  const roles = rolesRaw
    .split(',')
    .map((r) => r.trim().toLowerCase())
    .filter((r) => VALID_ROLES.includes(r))

  return { analytic, solution, roles }
}
