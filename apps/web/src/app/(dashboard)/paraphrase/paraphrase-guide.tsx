'use client'

import { useState } from 'react'
import type { ParaphraseSkillGuide, ParaphraseLevel, ParaphraseTechnique, ParaphraseExample } from '@/lib/guides/paraphrase'

// ── Constants ─────────────────────────────────────────────────────────────────

const SKILL_ACCENT: Record<string, { tab: string; active: string; badge: string; example: string; border: string }> = {
  writing: {
    tab:     'hover:text-amber-600',
    active:  'border-amber-500 text-amber-700 bg-amber-50',
    badge:   'bg-amber-600',
    example: 'bg-amber-50 border-amber-200 text-amber-900',
    border:  'border-amber-300',
  },
  reading: {
    tab:     'hover:text-blue-600',
    active:  'border-blue-500 text-blue-700 bg-blue-50',
    badge:   'bg-blue-600',
    example: 'bg-blue-50 border-blue-200 text-blue-900',
    border:  'border-blue-300',
  },
}

const LEVEL_COLORS: Record<number, { bg: string; text: string; border: string; active: string }> = {
  1: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200', active: 'bg-green-600 text-white border-green-600' },
  2: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200', active: 'bg-amber-600 text-white border-amber-600' },
  3: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', active: 'bg-purple-600 text-white border-purple-600' },
}

// ── Change table ──────────────────────────────────────────────────────────────

function ChangeTable({ changes }: { changes: ParaphraseExample['changes'] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-2 text-left font-semibold text-gray-500 w-1/3">Original</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-500 w-1/3">Paraphrased</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-500">Reason</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((c, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 font-mono text-rose-700 align-top">{c.from}</td>
              <td className="px-3 py-2 font-mono text-green-700 align-top">{c.to}</td>
              <td className="px-3 py-2 text-gray-600 align-top leading-relaxed">{c.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Example card ──────────────────────────────────────────────────────────────

function ExampleCard({ ex, accent }: { ex: ParaphraseExample; accent: typeof SKILL_ACCENT[string] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{ex.label}</span>
        <span className={`text-xs text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {/* Original */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Original</p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 leading-relaxed">
              {ex.original}
            </p>
          </div>

          {/* Paraphrased */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Paraphrased</p>
            <p className={`rounded-lg border px-3 py-2.5 text-sm leading-relaxed font-medium ${accent.example} ${accent.border}`}>
              {ex.paraphrased}
            </p>
          </div>

          {/* Change table */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">What changed</p>
            <ChangeTable changes={ex.changes} />
          </div>

          {/* Trap */}
          {ex.trap && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-rose-500 mb-1">Common trap</p>
              <p className="text-xs leading-relaxed text-rose-800">{ex.trap}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Technique block ───────────────────────────────────────────────────────────

function TechniqueBlock({ technique, accent }: { technique: ParaphraseTechnique; accent: typeof SKILL_ACCENT[string] }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">{technique.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{technique.description}</p>
      </div>
      <div className="space-y-2">
        {technique.examples.map((ex, i) => (
          <ExampleCard key={i} ex={ex} accent={accent} />
        ))}
      </div>
    </div>
  )
}

// ── Level panel ───────────────────────────────────────────────────────────────

function LevelPanel({ level, accent }: { level: ParaphraseLevel; accent: typeof SKILL_ACCENT[string] }) {
  const lc = LEVEL_COLORS[level.level]
  return (
    <div className="space-y-6">
      {/* Level header */}
      <div className={`rounded-xl border p-4 ${lc.bg} ${lc.border}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${accent.badge}`}>
            Level {level.level}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${lc.bg} ${lc.text} ${lc.border}`}>
            {level.badge}
          </span>
        </div>
        <p className={`text-base font-bold ${lc.text}`}>{level.title}</p>
        <p className={`mt-0.5 text-xs ${lc.text} opacity-80`}>{level.focus}</p>
      </div>

      {/* Techniques */}
      <div className="space-y-6">
        {level.techniques.map((t, i) => (
          <TechniqueBlock key={i} technique={t} accent={accent} />
        ))}
      </div>

      {/* Exam tip */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500 mb-1">Exam tip</p>
        <p className="text-xs leading-relaxed text-blue-900">{level.examTip}</p>
      </div>
    </div>
  )
}

// ── Main guide ────────────────────────────────────────────────────────────────

export function ParaphraseGuide({ guides }: { guides: ParaphraseSkillGuide[] }) {
  const [activeSkill, setActiveSkill] = useState(guides[0]?.skill ?? 'writing')
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1)

  const guide = guides.find((g) => g.skill === activeSkill)
  const accent = SKILL_ACCENT[activeSkill] ?? SKILL_ACCENT.writing
  const level = guide?.levels.find((l) => l.level === activeLevel)

  return (
    <div className="space-y-6">
      {/* Skill tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {guides.map((g) => {
          const isActive = g.skill === activeSkill
          const a = SKILL_ACCENT[g.skill]
          return (
            <button
              key={g.skill}
              onClick={() => { setActiveSkill(g.skill); setActiveLevel(1) }}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? `${a.active} border-current` : `border-transparent text-gray-500 ${a.tab}`
              }`}
            >
              <span>{g.icon}</span>
              {g.label}
            </button>
          )
        })}
      </div>

      {guide && (
        <>
          {/* Skill intro + purpose */}
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-gray-600">{guide.intro}</p>
            <div className={`rounded-lg border px-4 py-3 ${accent.example} ${accent.border}`}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2 opacity-70">
                Why paraphrase matters in {guide.label}
              </p>
              <ul className="space-y-1">
                {guide.purpose.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed">
                    <span className="shrink-0 mt-0.5 opacity-60">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Level pills */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Select level</p>
            <div className="flex gap-2 flex-wrap">
              {guide.levels.map((l) => {
                const isActive = activeLevel === l.level
                const lc = LEVEL_COLORS[l.level]
                return (
                  <button
                    key={l.level}
                    onClick={() => setActiveLevel(l.level as 1 | 2 | 3)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                      isActive ? lc.active : `bg-white ${lc.text} ${lc.border} hover:${lc.bg}`
                    }`}
                  >
                    Level {l.level} — {l.badge}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active level */}
          {level && <LevelPanel level={level} accent={accent} />}
        </>
      )}
    </div>
  )
}
