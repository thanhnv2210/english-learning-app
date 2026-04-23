'use client'

import { useState } from 'react'
import { type Platform, type Skill, type SkillSection, PLATFORM_META } from '@/lib/prompt-library'

const PLATFORMS: Platform[] = ['claude', 'chatgpt', 'gemini']

// ── Token parsing ────────────────────────────────────────────────────────────
// Matches [ANY TEXT INSIDE BRACKETS]
const TOKEN_RE = /(\[[^\]]+\])/g

type TokenMeta = { raw: string; label: string; placeholder: string }

function parseToken(raw: string): TokenMeta {
  const inner = raw.slice(1, -1) // strip [ ]
  const [labelPart, egPart] = inner.split(/, e\.g\. /)
  const label = labelPart
    .replace(/^YOUR\s+/i, '')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) // Title Case
  const placeholder = egPart ? `e.g. ${egPart}` : 'Enter your value…'
  return { raw, label, placeholder }
}

function extractTokens(text: string): TokenMeta[] {
  const seen = new Set<string>()
  const tokens: TokenMeta[] = []
  for (const match of text.matchAll(TOKEN_RE)) {
    const raw = match[0]
    if (!seen.has(raw)) {
      seen.add(raw)
      tokens.push(parseToken(raw))
    }
  }
  return tokens
}

function assembleText(text: string, values: Record<string, string>): string {
  return text.replace(TOKEN_RE, (match) => values[match] || match)
}

// ── Root view ────────────────────────────────────────────────────────────────
export function PromptLibraryView({ sections }: { sections: SkillSection[] }) {
  const [activeSkill, setActiveSkill] = useState<Skill>(sections[0].skill)
  const [activePlatform, setActivePlatform] = useState<Platform>('claude')

  const activeSection = sections.find((s) => s.skill === activeSkill)!

  return (
    <div className="flex flex-col gap-6">
      {/* Skill tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {sections.map((s) => (
          <button
            key={s.skill}
            onClick={() => setActiveSkill(s.skill)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              activeSkill === s.skill
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-1.5">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Platform tabs */}
      <div>
        <div className="flex gap-2 mb-2">
          {PLATFORMS.map((p) => {
            const meta = PLATFORM_META[p]
            const active = activePlatform === p
            return (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span className="text-xs">{meta.icon}</span>
                {meta.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400">{PLATFORM_META[activePlatform].tip}</p>
      </div>

      {/* Prompt cards */}
      <div className="flex flex-col gap-4">
        {activeSection.prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            title={prompt.title}
            description={prompt.description}
            text={prompt.text[activePlatform]}
          />
        ))}
      </div>
    </div>
  )
}

// ── Prompt card ───────────────────────────────────────────────────────────────
function PromptCard({
  title,
  description,
  text,
}: {
  title: string
  description: string
  text: string
}) {
  const tokens = extractTokens(text)
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const finalText = assembleText(text, values)
  const allFilled = tokens.every((t) => values[t.raw]?.trim())

  function setValue(raw: string, val: string) {
    setValues((prev) => ({ ...prev, [raw]: val }))
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(finalText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy prompt'}
          className={`mt-0.5 shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            copied
              ? 'bg-green-50 text-green-600'
              : allFilled
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
          }`}
        >
          {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
        </button>
      </div>

      {/* Input fields for each token */}
      {tokens.length > 0 && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex flex-col gap-2">
          <p className="text-xs font-medium text-amber-700 mb-1">Fill in your details</p>
          {tokens.map((token) => (
            <div key={token.raw} className="flex items-center gap-2">
              <label className="w-28 shrink-0 text-xs font-medium text-amber-800">
                {token.label}
              </label>
              <input
                type="text"
                value={values[token.raw] ?? ''}
                onChange={(e) => setValue(token.raw, e.target.value)}
                placeholder={token.placeholder}
                className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          ))}
        </div>
      )}

      {/* Assembled prompt preview */}
      <pre className="px-4 py-3 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 overflow-x-auto">
        {text.split(TOKEN_RE).map((part, i) => {
          if (part.match(/^\[[^\]]+\]$/)) {
            const filled = values[part]?.trim()
            return filled ? (
              <mark key={i} className="bg-blue-100 text-blue-800 rounded px-0.5 not-italic">
                {filled}
              </mark>
            ) : (
              <mark key={i} className="bg-amber-100 text-amber-700 rounded px-0.5 not-italic">
                {part}
              </mark>
            )
          }
          return <span key={i}>{part}</span>
        })}
      </pre>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
