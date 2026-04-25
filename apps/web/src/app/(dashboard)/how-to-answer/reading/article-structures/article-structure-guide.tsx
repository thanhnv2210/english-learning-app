'use client'

import { useState } from 'react'
import type { ArticleStructure } from '@/lib/guides/article-structures'

// ── Color palette per structure ───────────────────────────────────────────────

type ColorKey = ArticleStructure['color']

const COLOR: Record<ColorKey, {
  badge: string
  slot: string
  slotBorder: string
  slotText: string
  slotNum: string
  openBorder: string
  tip: string
  tipBorder: string
  tipLabel: string
  tipText: string
  signal: string
  signalBorder: string
  activeTitle: string
}> = {
  rose: {
    badge:       'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    slot:        'bg-rose-50 dark:bg-rose-900/20',
    slotBorder:  'border-rose-200 dark:border-rose-800',
    slotText:    'text-rose-900 dark:text-rose-200',
    slotNum:     'bg-rose-500',
    openBorder:  'border-rose-200 dark:border-rose-800',
    tip:         'bg-rose-50 dark:bg-rose-900/20',
    tipBorder:   'border-rose-200 dark:border-rose-800',
    tipLabel:    'text-rose-700 dark:text-rose-400',
    tipText:     'text-rose-900 dark:text-rose-300',
    signal:      'bg-rose-50 dark:bg-rose-900/20',
    signalBorder:'border-rose-100 dark:border-rose-800',
    activeTitle: 'text-rose-700 dark:text-rose-400',
  },
  orange: {
    badge:       'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    slot:        'bg-orange-50 dark:bg-orange-900/20',
    slotBorder:  'border-orange-200 dark:border-orange-800',
    slotText:    'text-orange-900 dark:text-orange-200',
    slotNum:     'bg-orange-500',
    openBorder:  'border-orange-200 dark:border-orange-800',
    tip:         'bg-orange-50 dark:bg-orange-900/20',
    tipBorder:   'border-orange-200 dark:border-orange-800',
    tipLabel:    'text-orange-700 dark:text-orange-400',
    tipText:     'text-orange-900 dark:text-orange-300',
    signal:      'bg-orange-50 dark:bg-orange-900/20',
    signalBorder:'border-orange-100 dark:border-orange-800',
    activeTitle: 'text-orange-700 dark:text-orange-400',
  },
  blue: {
    badge:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    slot:        'bg-blue-50 dark:bg-blue-900/20',
    slotBorder:  'border-blue-200 dark:border-blue-800',
    slotText:    'text-blue-900 dark:text-blue-200',
    slotNum:     'bg-blue-600',
    openBorder:  'border-blue-200 dark:border-blue-800',
    tip:         'bg-blue-50 dark:bg-blue-900/20',
    tipBorder:   'border-blue-200 dark:border-blue-800',
    tipLabel:    'text-blue-700 dark:text-blue-400',
    tipText:     'text-blue-900 dark:text-blue-300',
    signal:      'bg-blue-50 dark:bg-blue-900/20',
    signalBorder:'border-blue-100 dark:border-blue-800',
    activeTitle: 'text-blue-700 dark:text-blue-400',
  },
  purple: {
    badge:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    slot:        'bg-purple-50 dark:bg-purple-900/20',
    slotBorder:  'border-purple-200 dark:border-purple-800',
    slotText:    'text-purple-900 dark:text-purple-200',
    slotNum:     'bg-purple-600',
    openBorder:  'border-purple-200 dark:border-purple-800',
    tip:         'bg-purple-50 dark:bg-purple-900/20',
    tipBorder:   'border-purple-200 dark:border-purple-800',
    tipLabel:    'text-purple-700 dark:text-purple-400',
    tipText:     'text-purple-900 dark:text-purple-300',
    signal:      'bg-purple-50 dark:bg-purple-900/20',
    signalBorder:'border-purple-100 dark:border-purple-800',
    activeTitle: 'text-purple-700 dark:text-purple-400',
  },
  teal: {
    badge:       'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    slot:        'bg-teal-50 dark:bg-teal-900/20',
    slotBorder:  'border-teal-200 dark:border-teal-800',
    slotText:    'text-teal-900 dark:text-teal-200',
    slotNum:     'bg-teal-600',
    openBorder:  'border-teal-200 dark:border-teal-800',
    tip:         'bg-teal-50 dark:bg-teal-900/20',
    tipBorder:   'border-teal-200 dark:border-teal-800',
    tipLabel:    'text-teal-700 dark:text-teal-400',
    tipText:     'text-teal-900 dark:text-teal-300',
    signal:      'bg-teal-50 dark:bg-teal-900/20',
    signalBorder:'border-teal-100 dark:border-teal-800',
    activeTitle: 'text-teal-700 dark:text-teal-400',
  },
  amber: {
    badge:       'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    slot:        'bg-amber-50 dark:bg-amber-900/20',
    slotBorder:  'border-amber-200 dark:border-amber-800',
    slotText:    'text-amber-900 dark:text-amber-200',
    slotNum:     'bg-amber-500',
    openBorder:  'border-amber-200 dark:border-amber-800',
    tip:         'bg-amber-50 dark:bg-amber-900/20',
    tipBorder:   'border-amber-200 dark:border-amber-800',
    tipLabel:    'text-amber-700 dark:text-amber-400',
    tipText:     'text-amber-900 dark:text-amber-300',
    signal:      'bg-amber-50 dark:bg-amber-900/20',
    signalBorder:'border-amber-100 dark:border-amber-800',
    activeTitle: 'text-amber-700 dark:text-amber-400',
  },
  green: {
    badge:       'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    slot:        'bg-green-50 dark:bg-green-900/20',
    slotBorder:  'border-green-200 dark:border-green-800',
    slotText:    'text-green-900 dark:text-green-200',
    slotNum:     'bg-green-600',
    openBorder:  'border-green-200 dark:border-green-800',
    tip:         'bg-green-50 dark:bg-green-900/20',
    tipBorder:   'border-green-200 dark:border-green-800',
    tipLabel:    'text-green-700 dark:text-green-400',
    tipText:     'text-green-900 dark:text-green-300',
    signal:      'bg-green-50 dark:bg-green-900/20',
    signalBorder:'border-green-100 dark:border-green-800',
    activeTitle: 'text-green-700 dark:text-green-400',
  },
}

const FREQ_LABEL: Record<ArticleStructure['frequency'], string> = {
  'very common': 'Very common',
  'common': 'Common',
  'occasional': 'Occasional',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleStructureGuide({ structures }: { structures: ArticleStructure[] }) {
  const [openId, setOpenId] = useState<string>(structures[0]?.id ?? '')

  return (
    <div className="flex flex-col gap-2">
      {structures.map((s) => {
        const isOpen = openId === s.id
        const c = COLOR[s.color]
        return (
          <div
            key={s.id}
            className={`rounded-xl border bg-card transition-colors ${isOpen ? c.openBorder : 'border-border'}`}
          >
            {/* ── Header ── */}
            <button
              onClick={() => setOpenId(isOpen ? '' : s.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${c.badge}`}>
                  {FREQ_LABEL[s.frequency]}
                </span>
                <span className={`text-sm font-semibold ${isOpen ? c.activeTitle : 'text-foreground'}`}>
                  {s.name}
                </span>
                {!isOpen && (
                  <span className="hidden text-xs text-faint sm:inline">{s.tagline}</span>
                )}
              </div>
              <span className={`ml-2 shrink-0 text-xs text-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* ── Expanded content ── */}
            {isOpen && (
              <div className="border-t border-border px-5 pb-6 pt-5 flex flex-col gap-6">

                {/* Tagline */}
                <p className="text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>

                {/* Paragraph blueprint */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paragraph Blueprint
                  </p>
                  {/* Flow diagram */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {s.slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${c.slot} ${c.slotBorder} ${c.slotText}`}>
                          {slot.name}
                        </span>
                        {i < s.slots.length - 1 && (
                          <span className="text-xs text-faint">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Slot detail cards */}
                  <div className="flex flex-col gap-2">
                    {s.slots.map((slot, i) => (
                      <div key={i} className={`rounded-lg border p-3 flex gap-3 ${c.slot} ${c.slotBorder}`}>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${c.slotNum}`}>
                          {i + 1}
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className={`text-xs font-bold ${c.slotText}`}>{slot.name}</p>
                          <p className="text-xs leading-relaxed text-muted-foreground">{slot.description}</p>
                          <p className="text-[11px] text-faint mt-0.5">
                            <span className="font-semibold">Heading hint: </span>
                            {slot.headingHint}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signal phrases */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Signal Phrases — Spot the Structure Early
                  </p>
                  <div className={`rounded-lg border p-3 flex flex-col gap-1.5 ${c.signal} ${c.signalBorder}`}>
                    {s.signalPhrases.map((phrase, i) => (
                      <p key={i} className="text-xs leading-relaxed text-foreground font-mono">{phrase}</p>
                    ))}
                  </div>
                </div>

                {/* Matching Headings strategy */}
                <div className={`rounded-lg border p-4 flex flex-col gap-1.5 ${c.tip} ${c.tipBorder}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${c.tipLabel}`}>
                    Matching Headings Strategy
                  </p>
                  <p className={`text-sm leading-relaxed ${c.tipText}`}>{s.headingsStrategy}</p>
                </div>

                {/* Example topics */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Common IELTS Topics Using This Structure
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.exampleTopics.map((topic, i) => (
                      <span key={i} className="rounded-full bg-subtle border border-border px-3 py-0.5 text-xs text-muted-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
