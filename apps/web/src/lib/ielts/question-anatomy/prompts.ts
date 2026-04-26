import type { QuestionFragment } from '@/lib/guides/question-anatomy'

export type QuestionAnatomyResult = {
  fragments: QuestionFragment[]
  answerType: string
  scanPlan: string
}

// ── Prompt ─────────────────────────────────────────────────────────────────────

export function QUESTION_ANATOMY_PROMPT(question: string, skill: string): string {
  return `You are an IELTS question anatomy expert. Identify the functional role of each meaningful phrase in the following IELTS ${skill} question.

QUESTION: "${question}"

ROLES — use only these exact role IDs:
- question-word: The interrogative that determines answer type (What / Which / How / Who / When / Where / Why / How many / How long / How often / To what extent)
- category: Topic noun phrase that scopes where to search (e.g. "the researchers", "urban farming", "the policy")
- target: The specific piece of information to extract (e.g. "main reason", "primary benefit", "most effective solution")
- hedge: Words that restrict scope or source (e.g. "according to the author", "based on the passage", "primarily", "only", "in the writer's opinion")
- exclusion: Words that flip logic — find what does NOT fit (e.g. NOT, EXCEPT, apart from, other than)
- relationship: The logical connection being tested (e.g. "led to", "result in", "compared to", "unlike", "because of", "despite")
- time: Temporal boundary restricting which period applies (e.g. "currently", "in the past", "by 2050", "at that time", "initially")

RULES:
- Cover every meaningful part of the question; skip only minor articles and prepositions
- Use the EXACT text from the question for each fragment's "text" field
- Include only the roles actually present — not every role appears in every question
- Each fragment gets exactly one role
- Write the "instruction" as a direct command to the test-taker (start with an action verb)
- Keep each instruction to 1-2 sentences maximum
- label should be a short display name (e.g. "Question word", "Hedge signal", "Exclusion")

OUTPUT — use exactly this format, nothing else before or after:
---FRAGMENT---
role: [role-id]
label: [short display label]
text: [exact phrase from question]
instruction: [what this tells the test-taker to do]
---FRAGMENT---
role: [role-id]
label: [short display label]
text: [exact phrase from question]
instruction: [what this tells the test-taker to do]
---ANSWER_TYPE---
[what form the answer must take, e.g. "a noun — a named substance or process"]
---SCAN_PLAN---
[one sentence: where to look and what pattern to find]`
}

// ── Parser ─────────────────────────────────────────────────────────────────────

const VALID_ROLES = new Set([
  'question-word', 'category', 'target', 'hedge', 'exclusion', 'relationship', 'time',
])

const DEFAULT_LABELS: Record<string, string> = {
  'question-word': 'Question word',
  'category':      'Category',
  'target':        'Target',
  'hedge':         'Hedge signal',
  'exclusion':     'Exclusion',
  'relationship':  'Relationship',
  'time':          'Time constraint',
}

function extractField(block: string, field: string): string {
  const prefix = `${field}: `
  const lines = block.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith(prefix)) {
      // Collect continuation lines (indented or non-field lines)
      let value = line.slice(prefix.length).trim()
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim()
        if (!next || /^[a-z-]+: /.test(next)) break
        value += ' ' + next
      }
      return value
    }
  }
  return ''
}

function extractSection(raw: string, marker: string): string {
  const idx = raw.indexOf(marker)
  if (idx === -1) return ''
  const after = raw.slice(idx + marker.length)
  const nextMarker = after.search(/---[A-Z_]+---/)
  const section = nextMarker === -1 ? after : after.slice(0, nextMarker)
  return section.trim()
}

export function parseQuestionAnatomyResult(raw: string): QuestionAnatomyResult {
  // Split into fragment blocks
  const parts = raw.split('---FRAGMENT---').map((p) => p.trim()).filter(Boolean)

  // The last "part" may contain ANSWER_TYPE and SCAN_PLAN after the final fragment
  // Separate fragment blocks from trailing sections
  const fragmentBlocks: string[] = []
  for (const part of parts) {
    if (part.includes('---ANSWER_TYPE---') || part.includes('---SCAN_PLAN---')) {
      // This block has a fragment + trailing sections
      const cutoff = part.search(/---ANSWER_TYPE---|---SCAN_PLAN---/)
      if (cutoff > 0) fragmentBlocks.push(part.slice(0, cutoff).trim())
      break
    }
    fragmentBlocks.push(part)
  }

  const fragments: QuestionFragment[] = []
  for (const block of fragmentBlocks) {
    if (!block) continue
    const role = extractField(block, 'role')
    if (!VALID_ROLES.has(role)) continue
    const text = extractField(block, 'text')
    const label = extractField(block, 'label') || DEFAULT_LABELS[role] || role
    const instruction = extractField(block, 'instruction')
    if (!text) continue
    fragments.push({
      text,
      role: role as QuestionFragment['role'],
      label,
      instruction,
    })
  }

  const answerType = extractSection(raw, '---ANSWER_TYPE---')
  const scanPlan   = extractSection(raw, '---SCAN_PLAN---')

  if (fragments.length === 0) {
    throw new Error('No valid fragments parsed')
  }

  return { fragments, answerType, scanPlan }
}
