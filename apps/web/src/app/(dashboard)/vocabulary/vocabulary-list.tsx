'use client'

import { useState, useMemo } from 'react'
import type { VocabularyCard } from '@/lib/db/vocabulary'

type Props = {
  words: VocabularyCard[]
  domains: string[]
}

export function VocabularyList({ words, domains }: Props) {
  const [search, setSearch] = useState('')
  const [activeDomain, setActiveDomain] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = words

    if (activeDomain === '__general__') {
      result = result.filter((w) => w.domains.length === 0)
    } else if (activeDomain) {
      result = result.filter((w) => w.domains.includes(activeDomain))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q),
      )
    }

    return result
  }, [words, activeDomain, search])

  return (
    <div className="flex flex-col gap-6">
      {/* ── Filter bar ── */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search word or definition…"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={activeDomain === null}
            onClick={() => setActiveDomain(null)}
          />
          <FilterChip
            label="General"
            active={activeDomain === '__general__'}
            onClick={() => setActiveDomain('__general__')}
          />
          {domains.map((d) => (
            <FilterChip
              key={d}
              label={d}
              active={activeDomain === d}
              onClick={() => setActiveDomain(d)}
            />
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{' '}
        {words.length} words
      </p>

      {/* ── Word grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-400">No words match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((word) => (
            <WordCard key={word.word} word={word} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

export function WordCard({ word }: { word: VocabularyCard }) {
  const [expanded, setExpanded] = useState(false)

  const synonyms = word.synonyms.filter((s) => s.type === 'synonym').slice(0, 3)
  const antonyms = word.synonyms.filter((s) => s.type === 'antonym').slice(0, 2)
  const familyEntries = Object.entries(word.familyWords).filter(([, v]) => v)

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-900">{word.word}</h3>
        {word.domains.length === 0 && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            General
          </span>
        )}
      </div>

      {/* Domain tags */}
      {word.domains.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {word.domains.map((d) => (
            <span key={d} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Definition */}
      <p className="mb-3 text-sm leading-relaxed text-gray-600">{word.definition}</p>

      {/* Family words */}
      {familyEntries.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {familyEntries.map(([pos, form]) => (
            <span key={pos} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              <span className="text-gray-400">{pos}: </span>
              {form}
            </span>
          ))}
        </div>
      )}

      {/* Synonyms / antonyms */}
      {(synonyms.length > 0 || antonyms.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {synonyms.length > 0 && (
            <span>
              <span className="font-medium text-gray-700">Syn: </span>
              {synonyms.map((s) => s.word).join(', ')}
            </span>
          )}
          {antonyms.length > 0 && (
            <span>
              <span className="font-medium text-gray-700">Ant: </span>
              {antonyms.map((s) => s.word).join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Collocations */}
      {word.collocations.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {word.collocations.map((c, i) => (
            <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Examples toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-auto self-start text-xs font-medium text-blue-500 hover:text-blue-700"
      >
        {expanded ? 'Hide examples ▲' : 'Show examples ▼'}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">Speaking</p>
            <p className="text-xs leading-relaxed text-gray-700 italic">
              &ldquo;{word.examples.speaking}&rdquo;
            </p>
          </div>
          {word.examples.writing.map((ex, i) => (
            <div key={i} className="rounded-lg bg-blue-50 p-3">
              <p className="mb-1 text-xs font-semibold text-blue-500">
                Writing Task 2 — example {i + 1}
              </p>
              <p className="text-xs leading-relaxed text-gray-700 italic">
                &ldquo;{ex}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
