import type { ConnectedSpeechInstance } from '@/lib/ielts/connected-speech/prompts'

// ── Types ─────────────────────────────────────────────────────────────────────

export type EditOp =
  | { op: 'match'; orig: string; spoken: string }
  | { op: 'sub'; orig: string; spoken: string }
  | { op: 'del'; orig: string }
  | { op: 'ins'; spoken: string }

export type Mistake = {
  type: 'sub' | 'del'
  original: string
  spoken?: string
  context: string
  csTip?: ConnectedSpeechInstance
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function normalize(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/g, '')
}

export function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

export function alignWords(orig: string[], spoken: string[]): EditOp[] {
  const n = orig.length
  const m = spoken.length
  const origN = orig.map(normalize)
  const spokenN = spoken.map(normalize)

  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        origN[i - 1] === spokenN[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    }
  }

  const ops: EditOp[] = []
  let i = n
  let j = m
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origN[i - 1] === spokenN[j - 1]) {
      ops.unshift({ op: 'match', orig: orig[i - 1], spoken: spoken[j - 1] })
      i--; j--
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.unshift({ op: 'sub', orig: orig[i - 1], spoken: spoken[j - 1] })
      i--; j--
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      ops.unshift({ op: 'del', orig: orig[i - 1] })
      i--
    } else {
      ops.unshift({ op: 'ins', spoken: spoken[j - 1] })
      j--
    }
  }
  return ops
}

export function computeMistakes(ops: EditOp[], csInstances: ConnectedSpeechInstance[]): Mistake[] {
  function findCsTip(word: string): ConnectedSpeechInstance | undefined {
    const wn = normalize(word)
    return csInstances.find((inst) =>
      inst.original.toLowerCase().split(/\s+/).some((w) => normalize(w) === wn),
    )
  }

  const origWords: string[] = ops
    .filter((o) => o.op !== 'ins')
    .map((o) => (o as { orig: string }).orig)

  let origIdx = 0
  const mistakes: Mistake[] = []

  for (const op of ops) {
    if (op.op === 'ins') continue
    const idx = origIdx++
    if (op.op === 'match') continue
    const contextWords = origWords.slice(Math.max(0, idx - 2), idx + 3)
    if (op.op === 'sub') {
      mistakes.push({ type: 'sub', original: op.orig, spoken: op.spoken, context: contextWords.join(' '), csTip: findCsTip(op.orig) })
    } else {
      mistakes.push({ type: 'del', original: op.orig, context: contextWords.join(' '), csTip: findCsTip(op.orig) })
    }
  }

  return mistakes
    .sort((a, b) => ((b.csTip ? 2 : 0) + (b.type === 'sub' ? 1 : 0)) - ((a.csTip ? 2 : 0) + (a.type === 'sub' ? 1 : 0)))
    .slice(0, 5)
}

export function countMatchedWords(origWords: string[], spokenWords: string[]): number {
  if (spokenWords.length === 0) return 0
  const ops = alignWords(origWords, spokenWords)
  let origIdx = 0
  let lastMatchedOrig = -1
  for (const op of ops) {
    if (op.op === 'ins') continue
    if (op.op === 'match') lastMatchedOrig = origIdx
    origIdx++
  }
  return lastMatchedOrig + 1
}

export function opsToPlainText(ops: EditOp[]): string {
  return ops
    .filter((op) => op.op !== 'ins')
    .map((op) => {
      if (op.op === 'sub') return `[${op.orig}]`
      if (op.op === 'del') return `~~${op.orig}~~`
      return op.orig
    })
    .join(' ')
}
