'use client'

import { useState } from 'react'
import type { DrillResult, DrillMistakeSaved, DrillCsAnalysis } from '@/lib/db/schema'
import { PHENOMENON_LABELS, getPhenomenonColor } from '@/lib/ielts/connected-speech/prompts'
import type { Phenomenon } from '@/lib/ielts/connected-speech/prompts'

// ── Alignment helpers (same logic as drill-view.tsx) ─────────────────────────

type EditOp =
  | { op: 'match'; orig: string; spoken: string }
  | { op: 'sub'; orig: string; spoken: string }
  | { op: 'del'; orig: string }
  | { op: 'ins'; spoken: string }

function normalize(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/g, '')
}

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

function alignWords(orig: string[], spoken: string[]): EditOp[] {
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

// ── Component ─────────────────────────────────────────────────────────────────

export function DrillHistoryView({ records }: { records: DrillResult[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  if (records.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-faint">
        No drill results saved yet. Complete a Read-Aloud Drill and click &ldquo;Save result&rdquo;.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {records.map((record) => {
        const isExpanded = expandedId === record.id
        const ops = isExpanded
          ? alignWords(tokenize(record.originalText), tokenize(record.spokenText))
          : []
        const plainText = ops
          .filter((op) => op.op !== 'ins')
          .map((op) => {
            if (op.op === 'sub') return `[${op.orig}]`
            if (op.op === 'del') return `~~${op.orig}~~`
            return op.orig
          })
          .join(' ')

        const csAnalysis = record.csAnalysis as DrillCsAnalysis | null | undefined

        return (
          <div key={record.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Card header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : record.id)}
              className="w-full text-left px-5 py-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold tabular-nums ${
                    record.accuracy >= 90 ? 'text-green-600' :
                    record.accuracy >= 70 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {record.accuracy}%
                  </span>
                  <span className="text-xs text-faint">
                    {record.correctCount}/{record.totalCount} words
                  </span>
                  {(record.mistakes as DrillMistakeSaved[]).length > 0 && (
                    <span className="rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                      {(record.mistakes as DrillMistakeSaved[]).length} mistake{(record.mistakes as DrillMistakeSaved[]).length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-faint">
                    {new Date(record.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className="text-faint text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>
              <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                {record.originalText}
              </p>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-border px-5 py-4 space-y-5">

                {/* Annotated transcript */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      Annotated transcript
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(plainText)
                        setCopiedId(record.id)
                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                      className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 hover:bg-subtle transition-colors"
                    >
                      {copiedId === record.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm leading-8 overflow-y-auto"
                    style={{ maxHeight: '200px' }}
                  >
                    {ops.filter((op) => op.op !== 'ins').map((op, idx) => {
                      if (op.op === 'match') return <span key={idx} className="mr-1 text-foreground">{op.orig}</span>
                      if (op.op === 'sub') return (
                        <span
                          key={idx}
                          className="mr-1 rounded px-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 cursor-help"
                          title={`You said: "${op.spoken}"`}
                        >{op.orig}</span>
                      )
                      return (
                        <span
                          key={idx}
                          className="mr-1 rounded px-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through cursor-help"
                          title="Skipped"
                        >{op.orig}</span>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      <span className="rounded px-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">Orange</span>{' '}= wrong word (hover)
                    </span>
                    <span>
                      <span className="rounded px-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through font-medium">Red</span>{' '}= skipped
                    </span>
                  </div>
                </div>

                {/* Mistakes */}
                {(record.mistakes as DrillMistakeSaved[]).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      Top mistakes
                    </p>
                    {(record.mistakes as DrillMistakeSaved[]).map((m, idx) => (
                      <SavedMistakeCard key={idx} mistake={m} rank={idx + 1} />
                    ))}
                  </div>
                )}

                {/* Connected speech analysis */}
                {csAnalysis && csAnalysis.instances.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      Connected speech in this text
                    </p>
                    <div className="space-y-2">
                      {csAnalysis.instances.map((inst, idx) => {
                        const c = getPhenomenonColor(inst.phenomenon as Phenomenon)
                        return (
                          <div key={idx} className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
                            <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${c.text}`}>
                              {PHENOMENON_LABELS[inst.phenomenon as Phenomenon] ?? inst.phenomenon}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className={`font-mono font-semibold ${c.text}`}>
                                {inst.original} → {inst.transformed}
                              </span>
                              {' — '}{inst.tip}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* What was heard */}
                <div className="rounded-lg border border-border bg-muted px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint mb-1">
                    What was heard
                  </p>
                  <p className="text-sm text-muted-foreground">{record.spokenText || <em>Nothing captured</em>}</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── SavedMistakeCard ──────────────────────────────────────────────────────────

function SavedMistakeCard({ mistake, rank }: { mistake: DrillMistakeSaved; rank: number }) {
  const c = mistake.csPhenomenon ? getPhenomenonColor(mistake.csPhenomenon as Phenomenon) : null
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-sm font-bold text-faint w-6 text-right">#{rank}</span>
        <div className="flex-1 space-y-1.5">
          {mistake.type === 'sub' ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">Wrong word:</span>
              <span className="font-mono rounded px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                &ldquo;{mistake.original}&rdquo;
              </span>
              <span className="text-faint text-xs">— you said —</span>
              <span className="font-mono rounded px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                &ldquo;{mistake.spoken}&rdquo;
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">Skipped:</span>
              <span className="font-mono rounded px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through">
                &ldquo;{mistake.original}&rdquo;
              </span>
            </div>
          )}
          <p className="text-xs text-faint">
            Context: &ldquo;<span className="italic">{mistake.context}</span>&rdquo;
          </p>
        </div>
      </div>
      {mistake.csPhenomenon && mistake.csTip && c && (
        <div className={`rounded-lg border p-3 ${c.bg} ${c.border} ml-9`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${c.text}`}>
            Connected Speech: {PHENOMENON_LABELS[mistake.csPhenomenon as Phenomenon] ?? mistake.csPhenomenon}
          </p>
          <p className="text-xs text-muted-foreground">
            {mistake.csTip}
          </p>
        </div>
      )}
    </div>
  )
}
