'use client'

import { useState, useTransition } from 'react'
import { saveWrongDecisionAction } from '@/app/actions/wrong-decisions'
import type { WrongDecisionLog } from '@/lib/db/wrong-decisions'
import type { WrongDecisionAnalysis } from '@/app/api/wrong-decisions/analyse/route'
import {
  SKILLS,
  SKILL_LABELS,
  SKILL_COLORS,
  QUESTION_TYPES_BY_SKILL,
  QUESTION_ROLES,
  ROLE_LABELS,
  ARTICLE_STRUCTURES,
  roleColor,
  type Skill,
} from './constants'

const EMPTY_FORM = {
  skill: 'reading' as Skill,
  questionType: '',
  articleStructure: '',
  sourceText: '',
  question: '',
  myThought: '',
  actualAnswer: '',
  analytic: '',
  solution: '',
  questionRoles: [] as string[],
}

export function EntryForm({
  onSaved,
  onCancel,
}: {
  onSaved: (log: WrongDecisionLog) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [analyseError, setAnalyseError] = useState('')
  const [isSaving, startSaving] = useTransition()

  function set<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleRole(role: string) {
    set(
      'questionRoles',
      form.questionRoles.includes(role)
        ? form.questionRoles.filter((r) => r !== role)
        : [...form.questionRoles, role],
    )
  }

  async function handleAnalyse() {
    if (!form.myThought.trim() || !form.actualAnswer.trim()) {
      setAnalyseError('Fill in My thought and Correct answer before analysing.')
      return
    }
    setAnalyseError('')
    setIsAnalysing(true)
    try {
      const res = await fetch('/api/wrong-decisions/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: form.skill,
          sourceText: form.sourceText || undefined,
          question: form.question || undefined,
          myThought: form.myThought,
          actualAnswer: form.actualAnswer,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data: WrongDecisionAnalysis = await res.json()
      setForm((prev) => ({
        ...prev,
        analytic: data.analytic,
        solution: data.solution,
        questionRoles: data.roles,
      }))
    } catch {
      setAnalyseError('AI analysis failed. Fill in analytic and solution manually.')
    } finally {
      setIsAnalysing(false)
    }
  }

  function handleSave() {
    if (!form.myThought.trim() || !form.actualAnswer.trim()) return
    startSaving(async () => {
      const id = await saveWrongDecisionAction({
        skill: form.skill,
        questionType: form.questionType || undefined,
        articleStructure: form.articleStructure || undefined,
        sourceText: form.sourceText || undefined,
        question: form.question,
        myThought: form.myThought,
        actualAnswer: form.actualAnswer,
        analytic: form.analytic || undefined,
        solution: form.solution || undefined,
        questionRoles: form.questionRoles,
      })
      onSaved({
        id,
        skill: form.skill,
        questionType: form.questionType || null,
        articleStructure: form.articleStructure || null,
        sourceText: form.sourceText || null,
        question: form.question,
        myThought: form.myThought,
        actualAnswer: form.actualAnswer,
        analytic: form.analytic || null,
        solution: form.solution || null,
        questionRoles: form.questionRoles,
        createdAt: new Date(),
      })
    })
  }

  const canSave = form.myThought.trim() && form.actualAnswer.trim()

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5 mb-6 space-y-4">
      <h2 className="text-sm font-bold text-foreground">Log a wrong decision</h2>

      {/* Skill selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Skill *</p>
        <div className="flex gap-2 flex-wrap">
          {SKILLS.map((s) => {
            const c = SKILL_COLORS[s]
            return (
              <button
                key={s}
                onClick={() => setForm((prev) => ({ ...prev, skill: s, questionType: '', articleStructure: '' }))}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  form.skill === s ? `${c.bg} ${c.text} ${c.border}` : 'bg-card text-muted-foreground border-border hover:opacity-70'
                }`}
              >
                {SKILL_LABELS[s]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Question type */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
          Question type <span className="font-normal text-faint">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(QUESTION_TYPES_BY_SKILL[form.skill] ?? []).map((qt) => (
            <button
              key={qt}
              onClick={() => set('questionType', form.questionType === qt ? '' : qt)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                form.questionType === qt
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:opacity-70'
              }`}
            >
              {qt}
            </button>
          ))}
        </div>
      </div>

      {/* Article structure — reading only */}
      {form.skill === 'reading' && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">
            Article structure <span className="font-normal text-faint">(optional — helpful for Matching Headings)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ARTICLE_STRUCTURES.map((s) => (
              <button
                key={s}
                onClick={() => set('articleStructure', form.articleStructure === s ? '' : s)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                  form.articleStructure === s
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-card text-muted-foreground border-border hover:opacity-70'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Source text */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
          Source text <span className="font-normal text-faint">(optional — paste passage or transcript)</span>
        </p>
        <textarea
          value={form.sourceText}
          onChange={(e) => set('sourceText', e.target.value)}
          rows={4}
          placeholder="Paste the relevant passage, transcript or context here…"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* Question */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">
          Question <span className="font-normal text-faint">(optional — skip if question type covers it)</span>
        </p>
        <textarea
          value={form.question}
          onChange={(e) => set('question', e.target.value)}
          rows={2}
          placeholder="What was the question? (leave blank if question type is self-explanatory)"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* My thought */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">My thought / answer *</p>
        <textarea
          value={form.myThought}
          onChange={(e) => set('myThought', e.target.value)}
          rows={2}
          placeholder="What did you think or answer? Why did it seem right at the time?"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* Correct answer */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Correct answer *</p>
        <input
          type="text"
          value={form.actualAnswer}
          onChange={(e) => set('actualAnswer', e.target.value)}
          placeholder="What was the correct answer?"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* AI Analyse */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAnalyse}
          disabled={isAnalysing || !form.myThought.trim() || !form.actualAnswer.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
        >
          {isAnalysing ? 'Analysing…' : 'AI Analyse'}
        </button>
        <p className="text-xs text-faint">or fill in analytic and solution manually below</p>
      </div>
      {analyseError && <p className="text-xs text-rose-600">{analyseError}</p>}

      {/* Analytic */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Analytic</p>
        <textarea
          value={form.analytic}
          onChange={(e) => set('analytic', e.target.value)}
          rows={3}
          placeholder="Why was this answer wrong? What did you misread?"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* Solution */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Solution / prevention</p>
        <textarea
          value={form.solution}
          onChange={(e) => set('solution', e.target.value)}
          rows={2}
          placeholder="What will you do differently next time?"
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* Question roles */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">Question roles misread</p>
        <div className="flex flex-wrap gap-1.5">
          {QUESTION_ROLES.map((role) => {
            const c = roleColor(role)
            const selected = form.questionRoles.includes(role)
            return (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                  selected
                    ? `${c.bg} ${c.text} border-transparent`
                    : 'bg-card text-faint border-border hover:opacity-70'
                }`}
              >
                {ROLE_LABELS[role]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {isSaving ? 'Saving…' : 'Save entry'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
