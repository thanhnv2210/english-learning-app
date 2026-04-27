'use client'

import { useState } from 'react'
import {
  VI_SCHEMA,
  EN_SCHEMA,
  LANGUAGE_DIMENSIONS,
  CRITICAL_TRANSFERS,
  HIGH_TRANSFERS,
} from '@/lib/guides/language-comparison'
import type { RiskLevel, ComparisonRow } from '@/lib/guides/language-comparison'

// ── Risk badge ────────────────────────────────────────────────────────────────

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-rose-100',   text: 'text-rose-700',   label: 'Critical' },
  high:     { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
  medium:   { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Medium' },
  low:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Low' },
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const s = RISK_STYLES[risk]
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

// ── Schema code block ─────────────────────────────────────────────────────────

function SchemaBlock({ title, schema, accent }: { title: string; schema: string; accent: string }) {
  return (
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-bold mb-2 ${accent}`}>{title}</p>
      <pre className="rounded-xl bg-gray-950 text-gray-200 text-[11px] leading-relaxed p-4 overflow-x-auto font-mono whitespace-pre">
        {schema}
      </pre>
    </div>
  )
}

// ── Comparison row ────────────────────────────────────────────────────────────

function CompRow({ row }: { row: ComparisonRow }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{row.attribute}</p>
          <p className="text-xs text-faint mt-0.5">{row.description}</p>
        </div>
        <RiskBadge risk={row.risk} />
        <span className={`text-xs text-faint transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {/* Side-by-side values */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Vietnamese */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-1">Vietnamese</p>
              <p className="text-xs font-semibold text-emerald-900 mb-1">{row.vi.label}</p>
              <p className="text-xs leading-relaxed text-emerald-800">{row.vi.detail}</p>
              {row.vi.examples && row.vi.examples.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {row.vi.examples.map((ex, i) => (
                    <li key={i} className="text-[11px] font-mono text-emerald-700 bg-emerald-100 rounded px-2 py-0.5">
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* English */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 mb-1">English</p>
              <p className="text-xs font-semibold text-blue-900 mb-1">{row.en.label}</p>
              <p className="text-xs leading-relaxed text-blue-800">{row.en.detail}</p>
              {row.en.examples && row.en.examples.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {row.en.examples.map((ex, i) => (
                    <li key={i} className="text-[11px] font-mono text-blue-700 bg-blue-100 rounded px-2 py-0.5">
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* IELTS tip */}
          {row.ieltsTip && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500 mb-1">IELTS tip</p>
              <p className="text-xs leading-relaxed text-indigo-900">{row.ieltsTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function LanguageComparisonView() {
  const [activeDim, setActiveDim] = useState(LANGUAGE_DIMENSIONS[0].id)
  const [showSchema, setShowSchema] = useState(false)

  const dimension = LANGUAGE_DIMENSIONS.find((d) => d.id === activeDim)!

  return (
    <div className="mx-auto max-w-3xl space-y-8 xl:max-w-4xl 2xl:max-w-5xl">

      {/* Hero */}
      <div className="rounded-2xl border-2 border-gray-800 bg-gray-900 px-8 py-7 text-white">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-900">
            Language as an Object
          </span>
        </div>
        <h1 className="text-2xl font-bold">Vietnamese → English</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Every language is a specification: it defines a sound system, a word-structure engine,
          a sentence-assembly grammar, and a writing codec. Understanding <em>where</em> Vietnamese
          and English differ — and <em>how much</em> — tells you exactly where to focus your IELTS preparation.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
          {[
            { label: 'Phonology', sub: 'sound system' },
            { label: 'Morphology', sub: 'word structure' },
            { label: 'Syntax', sub: 'sentence rules' },
            { label: 'Orthography', sub: 'writing codec' },
          ].map((a) => (
            <div key={a.label} className="rounded-lg bg-white/10 px-3 py-2">
              <p className="text-xs font-bold text-white">{a.label}</p>
              <p className="text-[10px] text-gray-400">{a.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer risk legend */}
      <div className="flex flex-wrap gap-3 items-center">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transfer risk to IELTS:</p>
        {(Object.entries(RISK_STYLES) as [RiskLevel, typeof RISK_STYLES[RiskLevel]][]).map(([r, s]) => (
          <span key={r} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.label}
          </span>
        ))}
        <p className="text-xs text-faint ml-1">— how hard this difference is to overcome for a Vietnamese IELTS learner</p>
      </div>

      {/* Schema toggle */}
      <div>
        <button
          onClick={() => setShowSchema((s) => !s)}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-subtle transition-colors"
        >
          <span className="font-mono text-muted-foreground">{'{}'}</span>
          {showSchema ? 'Hide language schema' : 'Show language schema'}
        </button>

        {showSchema && (
          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
            <SchemaBlock
              title="const Vietnamese: Language = {"
              schema={VI_SCHEMA}
              accent="text-emerald-700"
            />
            <SchemaBlock
              title="const English: Language = {"
              schema={EN_SCHEMA}
              accent="text-blue-700"
            />
          </div>
        )}
      </div>

      {/* Dimension tabs + rows */}
      <div className="space-y-4">
        {/* Tab strip */}
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
          {LANGUAGE_DIMENSIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDim(d.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeDim === d.id
                  ? 'border-foreground text-foreground bg-muted'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{d.icon}</span>
              {d.label}
            </button>
          ))}
        </div>

        {/* Dimension header */}
        <div>
          <p className="text-base font-bold text-foreground">{dimension.label}</p>
          <p className="text-xs text-muted-foreground">{dimension.tagline}</p>
        </div>

        {/* Comparison rows */}
        <div className="space-y-2">
          {dimension.rows.map((row) => (
            <CompRow key={row.id} row={row} />
          ))}
        </div>
      </div>

      {/* IELTS transfer summary */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">IELTS Transfer Summary</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          These are the structural differences that directly cost band points. Every item below stems
          from a feature Vietnamese has (or lacks) that English handles the opposite way.
        </p>

        {/* Critical */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${RISK_STYLES.critical.bg} ${RISK_STYLES.critical.text}`}>
              Critical
            </span>
            <p className="text-xs text-muted-foreground">Fix these first — they affect every IELTS task</p>
          </div>
          {CRITICAL_TRANSFERS.map((item) => (
            <div key={item.area} className="rounded-lg border border-rose-200 bg-rose-50 p-4 space-y-2">
              <p className="text-sm font-bold text-rose-800">{item.area}</p>
              <p className="text-xs text-rose-700 leading-relaxed">{item.impact}</p>
              <ul className="space-y-1 pt-1">
                {item.fixes.map((fix, i) => (
                  <li key={i} className="flex gap-2 text-xs text-rose-900">
                    <span className="shrink-0 text-rose-400 mt-0.5">→</span>
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* High */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${RISK_STYLES.high.bg} ${RISK_STYLES.high.text}`}>
              High
            </span>
            <p className="text-xs text-muted-foreground">Important for Speaking band and grammar accuracy</p>
          </div>
          {HIGH_TRANSFERS.map((item) => (
            <div key={item.area} className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-2">
              <p className="text-sm font-bold text-orange-800">{item.area}</p>
              <p className="text-xs text-orange-700 leading-relaxed">{item.impact}</p>
              <ul className="space-y-1 pt-1">
                {item.fixes.map((fix, i) => (
                  <li key={i} className="flex gap-2 text-xs text-orange-900">
                    <span className="shrink-0 text-orange-400 mt-0.5">→</span>
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
