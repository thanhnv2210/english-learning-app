import { describe, it, expect } from 'vitest'
import { detectFillers, totalFillerCount } from './filler-detector'

describe('detectFillers', () => {
  it('returns empty array for clean speech', () => {
    expect(detectFillers('I enjoy working with distributed systems')).toEqual([])
  })

  it('detects a single filler word', () => {
    const result = detectFillers('um I think this is correct')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ word: 'um', count: 1 })
  })

  it('counts repeated fillers', () => {
    const result = detectFillers('um um um I said um four times')
    const um = result.find((r) => r.word === 'um')
    expect(um?.count).toBe(4)
  })

  it('detects multiple distinct fillers', () => {
    const result = detectFillers('uh so like you know I was basically just like doing it')
    const words = result.map((r) => r.word)
    expect(words).toContain('uh')
    expect(words).toContain('like')
    expect(words).toContain('you know')
    expect(words).toContain('basically')
  })

  it('is case-insensitive', () => {
    const result = detectFillers('Um UH Like YOU KNOW')
    expect(result.length).toBeGreaterThan(0)
    expect(result.find((r) => r.word === 'um')?.count).toBe(1)
  })

  it('sorts results by count descending', () => {
    const result = detectFillers('like like like um um uh')
    expect(result[0].word).toBe('like')
    expect(result[0].count).toBe(3)
    expect(result[1].count).toBeLessThanOrEqual(result[0].count)
  })

  it('does not match partial words', () => {
    // "umbrella" contains "um" but should not be counted
    const result = detectFillers('The umbrella is right there')
    expect(result.find((r) => r.word === 'um')).toBeUndefined()
    // "righteous" contains "right" but "right" is a standalone filler
    const result2 = detectFillers('righteous path')
    expect(result2.find((r) => r.word === 'right')).toBeUndefined()
  })
})

describe('totalFillerCount', () => {
  it('returns 0 for empty array', () => {
    expect(totalFillerCount([])).toBe(0)
  })

  it('sums counts correctly', () => {
    expect(
      totalFillerCount([
        { word: 'um', count: 3 },
        { word: 'uh', count: 2 },
        { word: 'like', count: 5 },
      ]),
    ).toBe(10)
  })

  it('works with single entry', () => {
    expect(totalFillerCount([{ word: 'basically', count: 7 }])).toBe(7)
  })
})
