'use client'

import { useState } from 'react'
import type { QuestionTypeGuide } from '@/lib/guides/listening'

const PRE_LISTENING_STEPS = [
  {
    heading: 'Use every second of reading time',
    body: 'The examiner will say "You now have X seconds to look at the questions." This is your only chance. Start reading immediately — do not wait.',
  },
  {
    heading: 'Read the question stem first, not the options or gaps',
    body: 'The stem tells you the topic and what to listen for. Options and gaps give detail, but the stem gives direction. One second on the stem is worth three seconds on the options.',
  },
  {
    heading: 'Highlight keywords directly on screen — then use scratch paper for the rest',
    body: 'The IELTS computer interface supports highlighting: left-click and drag over any text, then right-click and select "Highlight" to mark it yellow. Use this to mark the key noun or verb in each question before the recording starts. For notes that go beyond what you can highlight — predicted word type, shorthand symbols, a rough diagram sketch — use the scratch paper provided.',
  },
  {
    heading: 'Use shorthand symbols on your scratch paper',
    body: 'Speed up your note-taking with symbols: → (leads to / causes), ↑↓ (increase/decrease), ? (problem/question), # (number/quantity), @ (location/place). This frees up 1–2 seconds per question that you can spend reading ahead on screen.',
  },
  {
    heading: 'If the recording starts before you finish reading — do not panic',
    body: 'The first 5–10 seconds of every section are always scene-setting: the speakers introduce themselves and state the context. No answers appear yet. Use those seconds to finish reading the remaining questions on screen. You will not miss anything.',
  },
  {
    heading: 'Read one question ahead at all times',
    body: "Once you have typed an answer, immediately scroll to and read the next question on screen. Never be caught reading a question while the speaker has already moved past it. Being one question ahead is the single most effective habit to build for computer-based testing.",
  },
  {
    heading: 'Accept that you will sometimes miss an answer — type a guess and move on',
    body: "If you miss an answer, type your best guess into the field and move on immediately. On a computer you can flag the question if the interface allows it and return during review time. Dwelling on a missed question causes you to miss the next one too — a cascade failure. One blank is recoverable; three blanks from dwelling is not.",
  },
]

export function ListeningGuide({ guides }: { guides: QuestionTypeGuide[] }) {
  const [openId, setOpenId] = useState<string>(guides[0]?.id ?? '')
  const [preOpen, setPreOpen] = useState(true)

  return (
    <div className="flex flex-col gap-2">
      {/* ── Special tip: reading before the recording ── */}
      <div className="rounded-xl border-2 border-orange-200 bg-orange-50">
        <button
          onClick={() => setPreOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
              CRITICAL SKILL
            </span>
            <span className="text-sm font-semibold text-orange-900">
              Reading the Questions Before the Recording Starts
            </span>
          </div>
          <span className={`ml-4 shrink-0 text-xs transition-transform ${preOpen ? 'rotate-180' : ''} text-orange-400`}>
            ▼
          </span>
        </button>

        {preOpen && (
          <div className="border-t border-orange-200 px-5 pb-6 pt-5">
            <p className="mb-4 text-sm leading-relaxed text-orange-900">
              The most common reason candidates lose marks is not vocabulary or grammar — it is running out of time to read the questions before the recording starts. By the time they find their place, the speaker has already given the answer. This skill is trainable. Apply these steps every time you practise.
            </p>
            <ol className="flex flex-col gap-4">
              {PRE_LISTENING_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-orange-900">{step.heading}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-orange-800">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {guides.map((guide) => {
        const isOpen = openId === guide.id
        return (
          <div
            key={guide.id}
            className={`rounded-xl border transition-colors ${
              isOpen ? 'border-blue-200 bg-white' : 'border-gray-200 bg-white'
            }`}
          >
            {/* Header */}
            <button
              onClick={() => setOpenId(isOpen ? '' : guide.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className={`text-sm font-semibold ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
                {guide.name}
              </span>
              <span className={`ml-4 shrink-0 text-xs transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                ▼
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="flex flex-col gap-6 border-t border-gray-100 px-5 pb-6 pt-5">
                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">{guide.description}</p>

                {/* Word limit badge */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">WORD LIMIT</span>
                  <p className="text-xs leading-relaxed text-amber-800">{guide.wordLimit}</p>
                </div>

                {/* Step-by-step */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Step-by-Step Approach
                  </p>
                  <ol className="flex flex-col gap-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-gray-700">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Strategies */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Key Strategies
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.strategies.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common mistakes */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Common Mistakes to Avoid
                  </p>
                  <ul className="flex flex-col gap-2">
                    {guide.mistakes.map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                        <span className="mt-0.5 shrink-0 text-xs text-red-400">✕</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
