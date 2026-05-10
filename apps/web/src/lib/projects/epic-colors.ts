// Color palette for custom (user-created) epics.
// System epics (writing/reading/listening/speaking/cross-skill) use their own colors in constants.ts.

export const CUSTOM_EPIC_COLOR_KEYS = [
  'rose', 'cyan', 'teal', 'indigo', 'pink', 'lime', 'sky', 'violet',
] as const

export type EpicColorKey = typeof CUSTOM_EPIC_COLOR_KEYS[number]

export const CUSTOM_EPIC_COLORS: Record<EpicColorKey, { color: string; dot: string }> = {
  rose:   { color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',     dot: 'bg-rose-500' },
  cyan:   { color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',     dot: 'bg-cyan-500' },
  teal:   { color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',     dot: 'bg-teal-500' },
  indigo: { color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400', dot: 'bg-indigo-500' },
  pink:   { color: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',     dot: 'bg-pink-500' },
  lime:   { color: 'bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400',     dot: 'bg-lime-500' },
  sky:    { color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',         dot: 'bg-sky-500' },
  violet: { color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400', dot: 'bg-violet-500' },
}

export function getEpicColor(colorKey: string): { color: string; dot: string } {
  return CUSTOM_EPIC_COLORS[colorKey as EpicColorKey] ?? CUSTOM_EPIC_COLORS.rose
}

/** Pick the next color key not yet used in the existing set, cycling if all used. */
export function nextColorKey(usedKeys: string[]): EpicColorKey {
  const unused = CUSTOM_EPIC_COLOR_KEYS.find((k) => !usedKeys.includes(k))
  if (unused) return unused
  return CUSTOM_EPIC_COLOR_KEYS[usedKeys.length % CUSTOM_EPIC_COLOR_KEYS.length]
}
