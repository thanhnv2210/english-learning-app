import { describe, it, expect } from 'vitest'
import { IELTS_PART1_EXAMINER_PROMPT } from './prompt'
import {
  IELTS_PART2_EXAMINER_PROMPT,
  CUE_CARD_GENERATION_PROMPT,
  IELTS_PART3_EXAMINER_PROMPT,
  FEEDBACK_SYSTEM_PROMPT,
} from './part2-prompt'

describe('IELTS_PART1_EXAMINER_PROMPT', () => {
  it('returns a non-empty string', () => {
    expect(typeof IELTS_PART1_EXAMINER_PROMPT()).toBe('string')
    expect(IELTS_PART1_EXAMINER_PROMPT().length).toBeGreaterThan(50)
  })

  it('contains examiner role without a topic', () => {
    const prompt = IELTS_PART1_EXAMINER_PROMPT()
    expect(prompt).toContain('IELTS Academic Speaking examiner')
    expect(prompt).toContain('Part 1')
  })

  it('includes topic name and description when topic is provided', () => {
    const topic = {
      name: 'Technology',
      description: 'Questions about daily tech use',
      exampleQuestions: ['Do you use social media?', 'How often do you use your phone?'],
    }
    const prompt = IELTS_PART1_EXAMINER_PROMPT(topic)
    expect(prompt).toContain('Technology')
    expect(prompt).toContain('Questions about daily tech use')
    expect(prompt).toContain('Do you use social media?')
  })

  it('includes default topic coverage when no topic is given', () => {
    const prompt = IELTS_PART1_EXAMINER_PROMPT()
    expect(prompt).toContain('hometown')
  })

  it('instructs examiner not to give feedback during session', () => {
    const prompt = IELTS_PART1_EXAMINER_PROMPT()
    expect(prompt.toLowerCase()).toMatch(/do not give feedback|not give feedback|no.*feedback/i)
  })
})

describe('IELTS_PART2_EXAMINER_PROMPT', () => {
  it('opens with "Please begin." instruction', () => {
    const prompt = IELTS_PART2_EXAMINER_PROMPT('Describe a challenging bug you fixed.')
    expect(prompt).toContain('Please begin.')
  })

  it('includes the cue card text', () => {
    const cueCard = 'Describe a time you mentored a junior developer.'
    const prompt  = IELTS_PART2_EXAMINER_PROMPT(cueCard)
    expect(prompt).toContain(cueCard)
  })
})

describe('CUE_CARD_GENERATION_PROMPT', () => {
  it('returns a string containing the format skeleton', () => {
    const prompt = CUE_CARD_GENERATION_PROMPT()
    expect(prompt).toContain('Describe')
    expect(prompt).toContain('You should say')
  })

  it('includes topic name when provided', () => {
    const topic = {
      name: 'Open Source',
      description: 'Contributions to open-source projects',
      examplePrompts: ['Describe a PR you submitted to an open-source project.'],
    }
    const prompt = CUE_CARD_GENERATION_PROMPT(topic)
    expect(prompt).toContain('Open Source')
    expect(prompt).toContain('Contributions to open-source projects')
  })

  it('uses default tech topics when no topic is provided', () => {
    const prompt = CUE_CARD_GENERATION_PROMPT()
    expect(prompt).toMatch(/system design|debugging|remote work|AI tools/i)
  })
})

describe('IELTS_PART3_EXAMINER_PROMPT', () => {
  it('contains the provided cue card topic', () => {
    const topic  = 'automation replacing jobs'
    const prompt = IELTS_PART3_EXAMINER_PROMPT(topic)
    expect(prompt).toContain(topic)
  })

  it('instructs abstract society-level questions', () => {
    const prompt = IELTS_PART3_EXAMINER_PROMPT('AI ethics')
    expect(prompt).toContain('Part 3')
    expect(prompt.toLowerCase()).toContain('abstract')
  })
})

describe('FEEDBACK_SYSTEM_PROMPT', () => {
  it('is a non-empty string constant', () => {
    expect(typeof FEEDBACK_SYSTEM_PROMPT).toBe('string')
    expect(FEEDBACK_SYSTEM_PROMPT.length).toBeGreaterThan(100)
  })

  it('references all four IELTS speaking criteria', () => {
    expect(FEEDBACK_SYSTEM_PROMPT).toContain('Fluency & Coherence')
    expect(FEEDBACK_SYSTEM_PROMPT).toContain('Lexical Resource')
    expect(FEEDBACK_SYSTEM_PROMPT).toContain('Grammatical Range & Accuracy')
    expect(FEEDBACK_SYSTEM_PROMPT).toContain('Pronunciation')
  })

  it('instructs return of valid JSON only', () => {
    expect(FEEDBACK_SYSTEM_PROMPT).toMatch(/return only a valid json/i)
  })
})
