/** Quality scale: 0=blackout, 2=hard, 3=good, 5=easy */
export type ReviewQuality = 0 | 2 | 3 | 5

/**
 * SM-2 spaced repetition algorithm.
 * Returns updated interval (days), ease factor, and repetition count.
 */
export function sm2(
  quality: ReviewQuality,
  state: { interval: number; easeFactor: number; repetitions: number },
): { interval: number; easeFactor: number; repetitions: number } {
  if (quality < 3) {
    return { interval: 1, easeFactor: Math.max(1.3, state.easeFactor - 0.2), repetitions: 0 }
  }
  const reps = state.repetitions + 1
  const ef = Math.max(
    1.3,
    state.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  )
  let interval: number
  if (reps === 1) interval = 1
  else if (reps === 2) interval = 6
  else interval = Math.round(state.interval * ef)
  return { interval, easeFactor: ef, repetitions: reps }
}

export function intervalLabel(days: number): string {
  if (days <= 1) return '1d'
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.round(days / 7)}w`
  return `${Math.round(days / 30)}mo`
}
