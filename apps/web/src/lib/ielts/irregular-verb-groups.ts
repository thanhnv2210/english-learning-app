export type VerbEntry = {
  base: string
  past: string
  pp: string
  note?: string // e.g. "AmE: gotten", "also: learnt"
}

export type VerbGroup = {
  id: string
  name: string
  pattern: string       // short formula shown in badge e.g. "A / A / A"
  description: string
  tip: string           // one-line learning tip
  color: {
    badge: string       // Tailwind classes for the group badge
    header: string      // card header bg
    border: string
    cell: string        // verb cell bg
  }
  verbs: VerbEntry[]
}

export const VERB_GROUPS: VerbGroup[] = [
  // ── 1. No Change ────────────────────────────────────────────────────────────
  {
    id: 'no-change',
    name: 'No Change',
    pattern: 'A / A / A',
    description: 'Base form, past simple, and past participle are identical. Only 3rd-person -s changes.',
    tip: 'These are easy — just remember they never change. "It cost a lot" not "it costed".',
    color: {
      badge:  'bg-slate-600 text-white',
      header: 'bg-slate-50 dark:bg-slate-800/40',
      border: 'border-slate-200 dark:border-slate-700',
      cell:   'bg-slate-100 dark:bg-slate-800/60',
    },
    verbs: [
      { base: 'cut',      past: 'cut',      pp: 'cut' },
      { base: 'put',      past: 'put',      pp: 'put' },
      { base: 'cost',     past: 'cost',     pp: 'cost' },
      { base: 'hit',      past: 'hit',      pp: 'hit' },
      { base: 'let',      past: 'let',      pp: 'let' },
      { base: 'set',      past: 'set',      pp: 'set' },
      { base: 'hurt',     past: 'hurt',     pp: 'hurt' },
      { base: 'spread',   past: 'spread',   pp: 'spread' },
      { base: 'forecast', past: 'forecast', pp: 'forecast' },
      { base: 'read',     past: 'read',     pp: 'read',     note: 'Spelling same; pronunciation changes: /riːd/ → /rɛd/' },
      { base: 'output',   past: 'output',   pp: 'output' },
    ],
  },

  // ── 2. Long Vowel Shortens → -t ─────────────────────────────────────────────
  {
    id: 'vowel-t',
    name: 'Long Vowel → -t',
    pattern: 'V / Vt / Vt',
    description: 'A long vowel in the base shortens and the verb gains a -t or -d ending. Past simple = past participle.',
    tip: 'The vowel always shortens: FEEL → FELT (ee → e). Think of it as the word "tightening up".',
    color: {
      badge:  'bg-blue-600 text-white',
      header: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      cell:   'bg-blue-50 dark:bg-blue-900/30',
    },
    verbs: [
      { base: 'feel',  past: 'felt',  pp: 'felt' },
      { base: 'keep',  past: 'kept',  pp: 'kept' },
      { base: 'leave', past: 'left',  pp: 'left' },
      { base: 'deal',  past: 'dealt', pp: 'dealt' },
      { base: 'mean',  past: 'meant', pp: 'meant' },
      { base: 'lose',  past: 'lost',  pp: 'lost' },
      { base: 'spend', past: 'spent', pp: 'spent' },
      { base: 'build', past: 'built', pp: 'built' },
      { base: 'send',  past: 'sent',  pp: 'sent' },
      { base: 'lend',  past: 'lent',  pp: 'lent' },
      { base: 'hold',  past: 'held',  pp: 'held' },
      { base: 'lead',  past: 'led',   pp: 'led' },
      { base: 'hear',  past: 'heard', pp: 'heard' },
      { base: 'meet',  past: 'met',   pp: 'met' },
      { base: 'feed',  past: 'fed',   pp: 'fed' },
    ],
  },

  // ── 3. -ought / -aught ─────────────────────────────────────────────────────
  {
    id: 'ought',
    name: '-ought / -aught',
    pattern: '_ / -ought / -ought',
    description: 'The entire ending is replaced by the cluster -ought or -aught, pronounced /ɔːt/. Past = past participle.',
    tip: 'All of these sound like "ort" at the end. If you know one, you know the pattern.',
    color: {
      badge:  'bg-orange-600 text-white',
      header: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      cell:   'bg-orange-50 dark:bg-orange-900/30',
    },
    verbs: [
      { base: 'think',  past: 'thought',  pp: 'thought' },
      { base: 'buy',    past: 'bought',   pp: 'bought' },
      { base: 'bring',  past: 'brought',  pp: 'brought' },
      { base: 'catch',  past: 'caught',   pp: 'caught' },
      { base: 'teach',  past: 'taught',   pp: 'taught' },
      { base: 'seek',   past: 'sought',   pp: 'sought' },
      { base: 'fight',  past: 'fought',   pp: 'fought' },
    ],
  },

  // ── 4. -ew / -own ───────────────────────────────────────────────────────────
  {
    id: 'ew-own',
    name: '-ew → -own',
    pattern: '_ / -ew / -own',
    description: 'Past simple takes -ew; past participle adds -n or -wn. Common with verbs of movement and growth.',
    tip: '"Grew / grown", "flew / flown" — the past participle always ends in the -n sound.',
    color: {
      badge:  'bg-green-600 text-white',
      header: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      cell:   'bg-green-50 dark:bg-green-900/30',
    },
    verbs: [
      { base: 'grow',     past: 'grew',      pp: 'grown' },
      { base: 'know',     past: 'knew',      pp: 'known' },
      { base: 'fly',      past: 'flew',      pp: 'flown' },
      { base: 'throw',    past: 'threw',     pp: 'thrown' },
      { base: 'draw',     past: 'drew',      pp: 'drawn' },
      { base: 'withdraw', past: 'withdrew',  pp: 'withdrawn' },
    ],
  },

  // ── 5. Vowel Shifts to -o- ──────────────────────────────────────────────────
  {
    id: 'vowel-o',
    name: 'Stem → -o- (past)',
    pattern: '_ / -oke/-ose/-ove / -en',
    description: 'The stem vowel shifts to an -o- sound in the past, and the past participle adds -en or -n. Three distinct forms.',
    tip: 'The past participle almost always ends in -en: spoken, broken, chosen, written, risen, driven.',
    color: {
      badge:  'bg-purple-600 text-white',
      header: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      cell:   'bg-purple-50 dark:bg-purple-900/30',
    },
    verbs: [
      { base: 'speak',    past: 'spoke',    pp: 'spoken' },
      { base: 'break',    past: 'broke',    pp: 'broken' },
      { base: 'choose',   past: 'chose',    pp: 'chosen' },
      { base: 'drive',    past: 'drove',    pp: 'driven' },
      { base: 'write',    past: 'wrote',    pp: 'written' },
      { base: 'rise',     past: 'rose',     pp: 'risen' },
      { base: 'arise',    past: 'arose',    pp: 'arisen' },
      { base: 'ride',     past: 'rode',     pp: 'ridden' },
      { base: 'forget',   past: 'forgot',   pp: 'forgotten' },
    ],
  },

  // ── 6. -a- / -am- → -u- ────────────────────────────────────────────────────
  {
    id: 'a-u',
    name: '-a- past, -u- pp',
    pattern: '_ / -an/-am / -un/-um',
    description: 'Past simple uses an -a- vowel; past participle shifts to -u-. Common with short, physical-action verbs.',
    tip: 'The vowel "rises" from a → u across the three forms: begin → began → begun.',
    color: {
      badge:  'bg-teal-600 text-white',
      header: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800',
      cell:   'bg-teal-50 dark:bg-teal-900/30',
    },
    verbs: [
      { base: 'begin',  past: 'began',  pp: 'begun' },
      { base: 'swim',   past: 'swam',   pp: 'swum' },
      { base: 'drink',  past: 'drank',  pp: 'drunk' },
      { base: 'shrink', past: 'shrank', pp: 'shrunk' },
      { base: 'ring',   past: 'rang',   pp: 'rung' },
      { base: 'run',    past: 'ran',    pp: 'run',   note: 'pp = base form' },
      { base: 'sing',   past: 'sang',   pp: 'sung' },
    ],
  },

  // ── 7. -came / -went (stem swap) ────────────────────────────────────────────
  {
    id: 'stem-swap',
    name: 'Stem Swap',
    pattern: '_ / different stem / _',
    description: 'The entire stem changes in the past simple. The past participle often returns to a form close to the base.',
    tip: '"Go" is the most irregular verb in English — went comes from an entirely different word (wend).',
    color: {
      badge:  'bg-indigo-600 text-white',
      header: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      cell:   'bg-indigo-50 dark:bg-indigo-900/30',
    },
    verbs: [
      { base: 'go',         past: 'went',        pp: 'gone' },
      { base: 'come',       past: 'came',        pp: 'come',       note: 'pp = base form' },
      { base: 'become',     past: 'became',      pp: 'become',     note: 'pp = base form' },
      { base: 'overcome',   past: 'overcame',    pp: 'overcome',   note: 'pp = base form' },
      { base: 'undergo',    past: 'underwent',   pp: 'undergone' },
      { base: 'undertake',  past: 'undertook',   pp: 'undertaken' },
      { base: 'have',       past: 'had',         pp: 'had' },
      { base: 'do',         past: 'did',         pp: 'done' },
    ],
  },

  // ── 8. Other Vowel Shifts ───────────────────────────────────────────────────
  {
    id: 'other',
    name: 'Other Vowel Shifts',
    pattern: 'varies',
    description: 'Each verb has its own vowel shift pattern. These are best learned individually — frequent exposure is the most reliable path.',
    tip: 'Focus on the high-frequency ones first: see/saw/seen, give/gave/given, take/took/taken, fall/fell/fallen.',
    color: {
      badge:  'bg-amber-600 text-white',
      header: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      cell:   'bg-amber-50 dark:bg-amber-900/30',
    },
    verbs: [
      { base: 'see',         past: 'saw',         pp: 'seen' },
      { base: 'give',        past: 'gave',        pp: 'given' },
      { base: 'fall',        past: 'fell',        pp: 'fallen' },
      { base: 'take',        past: 'took',        pp: 'taken' },
      { base: 'make',        past: 'made',        pp: 'made' },
      { base: 'find',        past: 'found',       pp: 'found' },
      { base: 'stand',       past: 'stood',       pp: 'stood' },
      { base: 'understand',  past: 'understood',  pp: 'understood' },
      { base: 'tell',        past: 'told',        pp: 'told' },
      { base: 'sell',        past: 'sold',        pp: 'sold' },
      { base: 'get',         past: 'got',         pp: 'got',        note: 'AmE pp: gotten' },
      { base: 'say',         past: 'said',        pp: 'said' },
      { base: 'pay',         past: 'paid',        pp: 'paid' },
      { base: 'win',         past: 'won',         pp: 'won' },
      { base: 'sit',         past: 'sat',         pp: 'sat' },
      { base: 'bear',        past: 'bore',        pp: 'borne' },
      { base: 'bind',        past: 'bound',       pp: 'bound' },
      { base: 'show',        past: 'showed',      pp: 'shown',      note: 'also: showed' },
      { base: 'prove',       past: 'proved',      pp: 'proven',     note: 'also: proved' },
      { base: 'strike',      past: 'struck',      pp: 'struck',     note: 'also: stricken' },
    ],
  },
]
