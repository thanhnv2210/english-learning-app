import { describe, it, expect } from 'vitest'
import { getCurrentPhaseStatus, daysUntil, PLAN_START, PLAN_END, PHASES } from './plan-phases'

describe('getCurrentPhaseStatus', () => {
  it('returns before when date is before plan start', () => {
    const result = getCurrentPhaseStatus(new Date('2026-01-01'))
    expect(result.type).toBe('before')
  })

  it('returns complete when date is on or after plan end', () => {
    expect(getCurrentPhaseStatus(new Date('2026-08-11')).type).toBe('complete')
    expect(getCurrentPhaseStatus(new Date('2026-12-31')).type).toBe('complete')
  })

  it('returns active with the correct phase during month1', () => {
    const result = getCurrentPhaseStatus(new Date('2026-05-15'))
    expect(result.type).toBe('active')
    if (result.type === 'active') {
      expect(result.phase.id).toBe('month1')
    }
  })

  it('returns active with the correct phase during the trip', () => {
    const result = getCurrentPhaseStatus(new Date('2026-07-10'))
    expect(result.type).toBe('active')
    if (result.type === 'active') {
      expect(result.phase.id).toBe('trip')
    }
  })

  it('returns active with correct daysIntoPhase', () => {
    // month1 starts 2026-05-11; check 5 days in
    const result = getCurrentPhaseStatus(new Date('2026-05-16'))
    expect(result.type).toBe('active')
    if (result.type === 'active') {
      expect(result.daysIntoPhase).toBe(5)
    }
  })

  it('returns overallPct between 0 and 100 for mid-plan dates', () => {
    const result = getCurrentPhaseStatus(new Date('2026-06-15'))
    expect(result.type).toBe('active')
    if (result.type === 'active') {
      expect(result.overallPct).toBeGreaterThan(0)
      expect(result.overallPct).toBeLessThan(100)
    }
  })

  it('returns daysRemaining > 0 when not at end of phase', () => {
    const result = getCurrentPhaseStatus(new Date('2026-05-20'))
    expect(result.type).toBe('active')
    if (result.type === 'active') {
      expect(result.daysRemaining).toBeGreaterThan(0)
    }
  })

  it('accepts custom planStart and planEnd', () => {
    const customStart = new Date('2030-01-01')
    const customEnd   = new Date('2030-04-01')
    expect(getCurrentPhaseStatus(new Date('2029-12-31'), customStart, customEnd).type).toBe('before')
    expect(getCurrentPhaseStatus(new Date('2030-04-01'), customStart, customEnd).type).toBe('complete')
  })
})

describe('daysUntil', () => {
  it('returns positive days for a future date', () => {
    const from   = new Date('2026-05-11')
    const target = new Date('2026-07-05')
    expect(daysUntil(target, from)).toBe(55)
  })

  it('returns 0 for same day', () => {
    const d = new Date('2026-06-01')
    expect(daysUntil(d, d)).toBe(0)
  })

  it('returns negative days for a past date', () => {
    const from   = new Date('2026-07-05')
    const target = new Date('2026-05-11')
    expect(daysUntil(target, from)).toBeLessThan(0)
  })
})

describe('PHASES', () => {
  it('each phase has start before end', () => {
    for (const phase of PHASES) {
      expect(phase.start.getTime()).toBeLessThan(phase.end.getTime())
    }
  })

  it('phases are ordered chronologically', () => {
    for (let i = 1; i < PHASES.length; i++) {
      expect(PHASES[i].start.getTime()).toBeGreaterThanOrEqual(PHASES[i - 1].end.getTime())
    }
  })

  it('first phase starts on PLAN_START', () => {
    expect(PHASES[0].start.getTime()).toBe(PLAN_START.getTime())
  })

  it('last phase ends on PLAN_END', () => {
    expect(PHASES[PHASES.length - 1].end.getTime()).toBe(PLAN_END.getTime())
  })

  it('every phase has required fields', () => {
    for (const phase of PHASES) {
      expect(typeof phase.id).toBe('string')
      expect(typeof phase.name).toBe('string')
      expect(Array.isArray(phase.todayTasks)).toBe(true)
      expect(phase.todayTasks.length).toBeGreaterThan(0)
      expect(['normal', 'warning', 'trip', 'complete']).toContain(phase.alertLevel)
    }
  })
})
