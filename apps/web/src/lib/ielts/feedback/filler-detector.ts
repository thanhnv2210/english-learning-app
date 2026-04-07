const FILLERS: string[] = ['um', 'uh', 'ah', 'er', 'like', 'you know', 'basically', 'literally', 'right']

export type FillerCount = { word: string; count: number }

export function detectFillers(text: string): FillerCount[] {
  const lower = text.toLowerCase()
  return FILLERS
    .map((word) => ({
      word,
      count: (lower.match(new RegExp(`\\b${word}\\b`, 'g')) ?? []).length,
    }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
}

export function totalFillerCount(results: FillerCount[]): number {
  return results.reduce((sum, r) => sum + r.count, 0)
}
