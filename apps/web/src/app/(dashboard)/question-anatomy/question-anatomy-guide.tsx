'use client'

import { useState } from 'react'
import type { SkillSection, QuestionExample, QuestionRole } from '@/lib/guides/question-anatomy'

const ROLE_STYLES: Record<QuestionRole, { bg: string; border: string; text: string; badge: string }> = {
  'question-word': { bg: 'bg-blue-100',   border: 'border-blue-300',   text: 'text-blue-900',   badge: 'bg-blue-600'   },
  'category':      { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-900', badge: 'bg-indigo-600' },
  'exclusion':     { bg: 'bg-rose-100',   border: 'border-rose-300',   text: 'text-rose-900',   badge: 'bg-rose-600'   },
  'hedge':         { bg: 'bg-amber-100',  border: 'border-amber-300',  text: 'text-amber-900',  badge: 'bg-amber-500'  },
  'relationship':  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900', badge: 'bg-purple-600' },
  'target':        { bg: 'bg-green-100',  border: 'border-green-300',  text: 'text-green-900',  badge: 'bg-green-600'  },
  'time':          { bg: 'bg-gray-100',   border: 'border-gray-300',   text: 'text-gray-700',   badge: 'bg-gray-500'   },
}

const SKILL_ACCENT: Record<string, { active: string; tab: string }> = {
  Reading:  { active: 'border-blue-500 text-blue-700 bg-blue-50',   tab: 'hover:text-blue-600'   },
  Listening:{ active: 'border-purple-500 text-purple-700 bg-purple-50', tab: 'hover:text-purple-600'},
  Speaking: { active: 'border-green-500 text-green-700 bg-green-50',  tab: 'hover:text-green-600'  },
  Writing:  { active: 'border-amber-500 text-amber-700 bg-amber-50',  tab: 'hover:text-amber-600'  },
}

export function QuestionAnatomyGuide({ sections }: { sections: SkillSection[] }) {
  const [activeSkill, setActiveSkill] = useState(sections[0]?.skill ?? '')
  const [openIdx, setOpenIdx] = useState<number>(0)

  const section = sections.find((s) => s.skill === activeSkill)

  return (
    <section className="space-y-5">
      <h2 className="text-base font-bold text-gray-900">Question Breakdowns by Skill</h2>

      {/* Skill tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {sections.map((s) => {
          const isActive = s.skill === activeSkill
          const accent = SKILL_ACCENT[s.skill] ?? { active: 'border-gray-500 text-gray-700 bg-gray-50', tab: '' }
          return (
            <button
              key={s.skill}
              onClick={() => { setActiveSkill(s.skill); setOpenIdx(0) }}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? `${accent.active} border-current`
                  : `border-transparent text-gray-500 ${accent.tab}`
              }`}
            >
              <span>{s.icon}</span>
              {s.skill}
            </button>
          )
        })}
      </div>

      {section && (
        <div className="space-y-4">
          {/* Skill intro */}
          <p className="text-sm leading-relaxed text-gray-600">{section.intro}</p>

          {/* Question cards */}
          {section.examples.map((ex, idx) => (
            <QuestionCard
              key={idx}
              ex={ex}
              idx={idx}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function QuestionCard({
  ex,
  idx,
  isOpen,
  onToggle,
}: {
  ex: QuestionExample
  idx: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-gray-50"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white mt-0.5">
          {idx + 1}
        </span>

        {/* Color-coded question inline */}
        <p className="flex-1 text-sm font-medium leading-relaxed text-gray-800">
          {ex.fragments.map((f, fi) => {
            const s = ROLE_STYLES[f.role]
            const needsSpace = fi > 0 && !f.text.startsWith(' ')
            return (
              <span key={fi}>
                {needsSpace ? ' ' : ''}
                <span
                  className={`rounded px-0.5 py-px ${s.bg} ${s.text}`}
                  title={`${f.label}: ${f.instruction}`}
                >
                  {f.text.trim()}
                </span>
              </span>
            )
          })}
          ?
        </p>

        <span className={`shrink-0 text-xs text-gray-400 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded breakdown */}
      {isOpen && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">

          {/* Fragment breakdown */}
          <div className="flex flex-col gap-2">
            {ex.fragments.map((f, fi) => {
              const s = ROLE_STYLES[f.role]
              return (
                <div key={fi} className={`flex gap-3 rounded-lg border p-3 ${s.bg} ${s.border}`}>
                  <div className="w-40 shrink-0 space-y-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${s.badge}`}>
                      {f.label}
                    </span>
                    <p className={`font-mono text-xs font-semibold break-words ${s.text}`}>
                      "{f.text.trim()}"
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-700">{f.instruction}</p>
                </div>
              )
            })}
          </div>

          {/* Answer type + scan plan */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Answer type
              </p>
              <p className="text-xs font-medium text-gray-700">{ex.answerType}</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-500">
                Scan plan
              </p>
              <p className="text-xs leading-relaxed text-blue-800">{ex.scanPlan}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
