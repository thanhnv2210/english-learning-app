export type EssayBuilderSkill = 'writing_task1' | 'writing_task2' | 'speaking'

const SKILL_INSTRUCTIONS: Record<EssayBuilderSkill, string> = {
  writing_task1: `Write an IELTS Academic Writing Task 1 response (150–180 words) describing a hypothetical chart, graph, or diagram. Include a brief one-sentence description of what the visual shows, then write the response as if describing it. Do NOT use headers or bullet points.`,
  writing_task2: `Write an IELTS Academic Writing Task 2 essay (250–280 words). Structure: introduction (thesis) → 2 body paragraphs → conclusion. Do NOT use headers or bullet points.`,
  speaking: `Write a natural, fluent IELTS Speaking Part 2 response (around 150 words) as if spoken aloud. Include discourse markers and natural transitions. Avoid overly formal language.`,
}

/**
 * Generates a domain-specific topic and a full response that incorporates
 * as many of the selected vocabulary words and collocations as possible.
 *
 * Returns JSON: { topic: string, text: string }
 */
export function ESSAY_BUILDER_PROMPT(
  skill: EssayBuilderSkill,
  domain: string,
  vocabulary: string[],
  collocations: string[],
  targetBand: number,
): string {
  const vocabList = vocabulary.length > 0 ? vocabulary.join(', ') : 'none specified'
  const collocList = collocations.length > 0 ? collocations.join(', ') : 'none specified'

  return `You are an IELTS ${targetBand} band writing coach. Your task is to generate a realistic IELTS practice item for the domain "${domain}".

Skill: ${skill.replace('_', ' ').toUpperCase()}
${SKILL_INSTRUCTIONS[skill]}

You MUST incorporate as many of the following words and phrases as naturally as possible:

Vocabulary words: ${vocabList}
Collocations: ${collocList}

Instructions:
- Generate a realistic topic/question appropriate for the domain and skill.
- Write the full response, using the vocabulary and collocations naturally in context.
- Do not force words that don't fit — prioritise natural flow at Band ${targetBand} level.
- Do not label which words you used.

Output format — use EXACTLY these two delimiters on their own lines, nothing else:
---TOPIC---
<the question or task prompt, single line>
---TEXT---
<the full response, plain text, paragraphs separated by blank lines>`
}

/**
 * Analyses a pasted text to detect IELTS domain, skill, and a matching question.
 *
 * Output format uses delimiters to avoid JSON issues with long text.
 */
export function ESSAY_ANALYSE_PROMPT(text: string, domains: string[]): string {
  return `You are an IELTS examiner. Analyse the following text and determine:
1. The most fitting IELTS domain from this list: ${domains.join(', ')}
2. The IELTS skill it belongs to: writing_task1, writing_task2, or speaking
3. A realistic IELTS question/prompt that this text could be a response to (one sentence)

Text to analyse:
"""
${text}
"""

Output format — use EXACTLY these three delimiters on their own lines, nothing else:
---DOMAIN---
<one domain name from the list above, exactly as written>
---SKILL---
<writing_task1 | writing_task2 | speaking>
---QUESTION---
<the generated IELTS question, single line>`
}
