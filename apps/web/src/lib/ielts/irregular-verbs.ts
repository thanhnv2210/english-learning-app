/**
 * Irregular verb lookup table — base form → extra forms not derivable by suffix rules.
 *
 * Regular suffix rules already handle:
 *   +s, +es, +ed, +ing, +er, +ly, +ment, +tion  (see buildInflectPattern)
 *
 * This table only lists forms that those rules would MISS (irregular past simple /
 * past participle). Present tense and -ing forms are covered by suffix rules even
 * for irregular verbs (rises, rising are regular; only rose/risen are irregular).
 *
 * Scope: ~90 verbs most relevant to IELTS writing + speaking topics.
 * Known gap: consonant-doubling gerunds (running, cutting) — separate problem.
 */
export const IRREGULAR_VERBS = new Map<string, string[]>([
  // ── Economics / finance / trends ────────────────────────────────────────────
  ['rise',        ['rose', 'risen']],
  ['fall',        ['fell', 'fallen']],
  ['grow',        ['grew', 'grown']],
  ['shrink',      ['shrank', 'shrunk', 'shrunken']],
  ['spend',       ['spent']],
  ['cost',        ['cost']],           // base = past = pp (suffix rule adds 'costs')
  ['sell',        ['sold']],
  ['buy',         ['bought']],
  ['lend',        ['lent']],
  ['lose',        ['lost']],
  ['win',         ['won']],
  ['withdraw',    ['withdrew', 'withdrawn']],
  ['spread',      ['spread']],         // base = past = pp
  ['forecast',    ['forecast']],       // base = past = pp

  // ── Policy / government / society ───────────────────────────────────────────
  ['become',      ['became']],
  ['overcome',    ['overcame', 'overcome']],
  ['undergo',     ['underwent', 'undergone']],
  ['undertake',   ['undertook', 'undertaken']],
  ['forbid',      ['forbade', 'forbidden']],
  ['arise',       ['arose', 'arisen']],
  ['deal',        ['dealt']],
  ['lead',        ['led']],
  ['hold',        ['held']],
  ['keep',        ['kept']],
  ['seek',        ['sought']],
  ['find',        ['found']],
  ['build',       ['built']],
  ['make',        ['made']],
  ['take',        ['took', 'taken']],
  ['give',        ['gave', 'given']],
  ['bring',       ['brought']],
  ['leave',       ['left']],
  ['mean',        ['meant']],
  ['set',         ['set']],            // base = past = pp
  ['let',         ['let']],            // base = past = pp
  ['put',         ['put']],            // base = past = pp
  ['cut',         ['cut']],            // base = past = pp
  ['hit',         ['hit']],            // base = past = pp
  ['output',      ['output']],         // base = past = pp

  // ── Education / research / technology ───────────────────────────────────────
  ['know',        ['knew', 'known']],
  ['understand',  ['understood']],
  ['teach',       ['taught']],
  ['learn',       ['learnt', 'learned']],   // both valid
  ['think',       ['thought']],
  ['show',        ['showed', 'shown']],
  ['prove',       ['proved', 'proven']],    // both valid
  ['choose',      ['chose', 'chosen']],
  ['begin',       ['began', 'begun']],
  ['break',       ['broke', 'broken']],
  ['write',       ['wrote', 'written']],
  ['read',        ['read']],               // base = past = pp (homograph)
  ['send',        ['sent']],
  ['tell',        ['told']],
  ['say',         ['said']],
  ['speak',       ['spoke', 'spoken']],
  ['hear',        ['heard']],
  ['draw',        ['drew', 'drawn']],
  ['drive',       ['drove', 'driven']],

  // ── Health / environment / movement ─────────────────────────────────────────
  ['run',         ['ran']],
  ['swim',        ['swam', 'swum']],
  ['fly',         ['flew', 'flown']],
  ['ride',        ['rode', 'ridden']],
  ['strike',      ['struck', 'stricken']],
  ['feed',        ['fed']],
  ['meet',        ['met']],
  ['feel',        ['felt']],
  ['stand',       ['stood']],
  ['sit',         ['sat']],
  ['eat',         ['ate', 'eaten']],
  ['drink',       ['drank', 'drunk']],
  ['fight',       ['fought']],
  ['catch',       ['caught']],
  ['throw',       ['threw', 'thrown']],

  // ── General academic ─────────────────────────────────────────────────────────
  ['get',         ['got', 'gotten']],
  ['go',          ['went', 'gone']],
  ['do',          ['did', 'done']],
  ['have',        ['had']],
  ['come',        ['came', 'come']],
  ['see',         ['saw', 'seen']],
  ['pay',         ['paid']],
  ['stand',       ['stood']],
  ['forget',      ['forgot', 'forgotten']],
  ['begin',       ['began', 'begun']],
  ['bind',        ['bound']],
  ['bear',        ['bore', 'borne']],
  ['ring',        ['rang', 'rung']],
])

/**
 * Builds a regex pattern string for a single word that matches:
 *  - Regular inflected forms (+s, +es, +ed, +er, +ing, +ly, +ment, +tion)
 *  - Silent-e drop forms (utilize → utilizing)
 *  - Consonant+y forms (vary → varies, varied)
 *  - Irregular past simple / past participle (rise → rose, risen)
 *
 * Returns a raw pattern string (no leading/trailing slash).
 * Caller wraps in `new RegExp(...)` as needed.
 */
export function buildInflectPattern(word: string): string {
  const w = word.toLowerCase()
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // ── Regular suffix base pattern ──────────────────────────────────────────
  let regularPart: string

  if (w.length > 3 && w.endsWith('e') && !/[aeiou]e$/.test(w)) {
    // Silent-e drop: utilize → utiliz(e|es|ed|ing|ation)
    const stem = esc.slice(0, -1)
    regularPart = `${stem}(?:e|es|ed|er|ing|ely|ation|ations)?`
  } else if (w.length > 3 && w.endsWith('y') && !/[aeiou]y$/.test(w)) {
    // Consonant+y: vary → varies/varied
    const stem = esc.slice(0, -1)
    regularPart = `(?:${esc}|${stem}(?:ies|ied|ier|iest))`
  } else {
    regularPart = `${esc}(?:s|es|ed|er|ing|ly|ment|ments|tion|tions)?`
  }

  // ── Irregular forms ──────────────────────────────────────────────────────
  const irregulars = IRREGULAR_VERBS.get(w) ?? []
  if (irregulars.length === 0) {
    return `\\b${regularPart}\\b`
  }

  const escapedIrregulars = irregulars
    .filter((f) => f !== w) // skip if same as base (e.g. cost, put)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (escapedIrregulars.length === 0) {
    return `\\b${regularPart}\\b`
  }

  return `\\b(?:${regularPart}|${escapedIrregulars.join('|')})\\b`
}
