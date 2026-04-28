'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveComparisonAction } from '@/app/actions/comparisons'
import type { ComparisonResult } from '@/lib/ielts/comparisons/prompts'
import type { CompareResponse } from '@/app/api/compare/route'

const REGISTER_COLORS: Record<string, string> = {
  formal:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  informal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  neutral:  'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400',
}

type CardState = ComparisonResult & { inLibrary: boolean }

export function ComparisonSearch() {
  const router = useRouter()
  const [termA, setTermA] = useState('')
  const [termB, setTermB] = useState('')
  const [status, setStatus] = useState<'idle' | 'searching' | 'done' | 'invalid' | 'error'>('idle')
  const [card, setCard] = useState<CardState | null>(null)
  const [invalidReason, setInvalidReason] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()

  async function handleSearch() {
    const a = termA.trim()
    const b = termB.trim()
    if (!a || !b) return
    setStatus('searching')
    setCard(null)
    setInvalidReason(null)
    setError(null)

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termA: a, termB: b }),
      })
      if (!res.ok) throw new Error('Server error')
      const data: CompareResponse = await res.json()

      if (data.valid) {
        setCard(data.result)
        setStatus('done')
      } else {
        setInvalidReason(data.reason)
        setStatus('invalid')
      }
    } catch {
      setError('Could not compare terms. Please try again.')
      setStatus('error')
    }
  }

  function handleSave() {
    if (!card) return
    startSaving(async () => {
      await saveComparisonAction({
        termA: card.termA,
        termB: card.termB,
        category: card.category,
        keyDifference: card.keyDifference,
        dimensionA: card.dimensionA,
        dimensionB: card.dimensionB,
        examples: card.examples,
      })
      setCard({ ...card, inLibrary: true })
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Compare two terms</h2>
        <p className="text-xs text-faint mt-0.5">
          Enter any two words or phrases — AI explains the difference in register, IELTS fit, and meaning.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          value={termA}
          onChange={(e) => setTermA(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="First term, e.g. quite"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <span className="flex items-center text-sm font-semibold text-faint">vs</span>
        <input
          type="text"
          value={termB}
          onChange={(e) => setTermB(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Second term, e.g. fairly"
          className="flex-1 rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={handleSearch}
          disabled={!termA.trim() || !termB.trim() || status === 'searching'}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          {status === 'searching' ? 'Comparing…' : 'Compare'}
        </button>
      </div>

      {status === 'error' && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {status === 'invalid' && invalidReason && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-700">Cannot compare these terms</p>
          <p className="text-xs text-amber-600 mt-0.5">{invalidReason}</p>
        </div>
      )}

      {status === 'done' && card && (
        <div className="flex flex-col gap-4">
          {/* Key difference banner */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">Key difference</p>
            <p className="text-sm leading-relaxed text-foreground">{card.keyDifference}</p>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3">
            {([
              { term: card.termA, dim: card.dimensionA },
              { term: card.termB, dim: card.dimensionB },
            ] as const).map(({ term, dim }) => (
              <div key={term} className="rounded-xl border border-border bg-muted p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-base font-bold text-foreground">{term}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REGISTER_COLORS[dim.register] ?? REGISTER_COLORS.neutral}`}>
                    {dim.register}
                  </span>
                </div>

                {dim.intensity !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-faint">Intensity</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`text-sm ${(dim.intensity ?? 0) >= n ? 'text-blue-500' : 'text-border'}`}>●</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs text-faint shrink-0 w-20">Writing</span>
                    <span className="text-xs text-muted-foreground">{dim.ieltsWriting}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-xs text-faint shrink-0 w-20">Speaking</span>
                    <span className="text-xs text-muted-foreground">{dim.ieltsSpeaking}</span>
                  </div>
                </div>

                {dim.note && (
                  <p className="text-xs text-faint italic border-t border-border pt-2 mt-1">{dim.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Example pairs */}
          {card.examples.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-faint uppercase tracking-wide">Contrastive examples</p>
              {card.examples.map((pair, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                  <p className="text-xs text-faint italic">{pair.context}</p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <span className="shrink-0 text-xs font-bold text-blue-600 w-12">{card.termA}</span>
                      <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{pair.withA}&rdquo;</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-xs font-bold text-violet-600 w-12">{card.termB}</span>
                      <p className="text-xs leading-relaxed text-foreground italic">&ldquo;{pair.withB}&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            {card.inLibrary ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ Saved to library</span>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
              >
                {isSaving ? 'Saving…' : 'Save to library'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
