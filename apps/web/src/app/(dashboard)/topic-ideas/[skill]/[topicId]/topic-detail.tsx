'use client'

import Link from 'next/link'
import { useState } from 'react'
import { type Topic, type Skill, SKILL_LABELS } from '@/lib/topic-ideas'

type Props = {
  topic: Topic
  skill: Skill
}

function renderPassageWithLabels(passage: string) {
  // Split on [Label] annotations and render them as inline blue tags
  const parts = passage.split(/(\[[^\]]+\])/)
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]$/)
        if (match) {
          return (
            <span
              key={i}
              className="ml-1 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700"
            >
              {match[1]}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function TopicDetail({ topic, skill }: Props) {
  const [activeFrameworkId, setActiveFrameworkId] = useState(topic.frameworks[0]?.id ?? '')

  const activeFramework = topic.frameworks.find((f) => f.id === activeFrameworkId)
  const skillLabel = SKILL_LABELS[skill]

  // Determine which speakers are "left" (examiner/lecturer/host/moderator/presenter) vs "right"
  const LEFT_SPEAKERS = new Set(['examiner', 'lecturer', 'host', 'moderator', 'presenter', 'colleague'])

  function isLeftSpeaker(speaker: string) {
    return LEFT_SPEAKERS.has(speaker.toLowerCase())
  }

  return (
    <div className="mx-auto max-w-3xl xl:max-w-4xl 2xl:max-w-7xl">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href={`/topic-ideas/${skill}`}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          ← {skillLabel} Topics
        </Link>
      </div>

      {/* Topic heading */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{topic.icon}</span>
        <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
      </div>

      {/* Framework selector tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {topic.frameworks.map((framework) => (
          <button
            key={framework.id}
            onClick={() => setActiveFrameworkId(framework.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFrameworkId === framework.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {framework.name}
          </button>
        ))}
      </div>

      {/* Active framework detail */}
      {activeFramework && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {/* Framework name + issue badge */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">{activeFramework.name}</h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              {activeFramework.issue}
            </span>
          </div>

          {/* Description */}
          <p className="mb-6 text-sm text-gray-600">{activeFramework.description}</p>

          {/* Framework Steps */}
          <section className="mb-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Framework Steps
            </h3>
            <ol className="flex flex-col gap-4">
              {activeFramework.steps.map((step, index) => (
                <li key={step.label} className="flex gap-3">
                  {/* Step number circle */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{step.label}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{step.description}</p>
                    {/* Vocabulary pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {step.vocabulary.map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Skill-specific example */}
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Example — {skillLabel}
            </h3>

            {(skill === 'speaking') && (
              <div>
                <p className="mb-3 text-xs text-gray-500 italic">
                  {activeFramework.examples.speaking.context}
                </p>
                <div className="flex flex-col gap-2">
                  {activeFramework.examples.speaking.dialogue.map((turn, i) => {
                    const left = isLeftSpeaker(turn.speaker)
                    return (
                      <div
                        key={i}
                        className={`flex flex-col gap-0.5 ${left ? 'items-start' : 'items-end'}`}
                      >
                        <span className="px-1 text-[10px] font-semibold text-gray-400">
                          {turn.speaker}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                            left
                              ? 'rounded-tl-sm bg-gray-100 text-gray-800'
                              : 'rounded-tr-sm bg-blue-600 text-white'
                          }`}
                        >
                          {turn.text}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {skill === 'listening' && (
              <div>
                <p className="mb-3 text-xs text-gray-500 italic">
                  {activeFramework.examples.listening.context}
                </p>
                <div className="flex flex-col gap-2">
                  {activeFramework.examples.listening.script.map((turn, i) => {
                    const left = isLeftSpeaker(turn.speaker)
                    return (
                      <div
                        key={i}
                        className={`flex flex-col gap-0.5 ${left ? 'items-start' : 'items-end'}`}
                      >
                        <span className="px-1 text-[10px] font-semibold text-gray-400">
                          {turn.speaker}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                            left
                              ? 'rounded-tl-sm bg-gray-100 text-gray-800'
                              : 'rounded-tr-sm bg-blue-600 text-white'
                          }`}
                        >
                          {turn.text}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {skill === 'reading' && (
              <div>
                <p className="mb-3 text-xs text-gray-500 italic">
                  {activeFramework.examples.reading.context}
                </p>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-gray-800">
                  {renderPassageWithLabels(activeFramework.examples.reading.passage)}
                </div>
              </div>
            )}

            {skill === 'writing' && (
              <div>
                <p className="mb-3 text-xs text-gray-500 italic">
                  {activeFramework.examples.writing.context}
                </p>
                <span className="mb-3 inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  {activeFramework.examples.writing.taskType}
                </span>
                <blockquote className="mb-4 rounded-lg border-l-4 border-gray-300 bg-gray-50 px-4 py-3 text-sm italic text-gray-700">
                  {activeFramework.examples.writing.prompt}
                </blockquote>
                <p className="text-sm leading-relaxed text-gray-800">
                  {activeFramework.examples.writing.sample}
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
