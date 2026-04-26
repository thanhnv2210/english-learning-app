'use client'

import { useState, useMemo, useTransition } from 'react'
import type { WrongDecisionLog, WrongDecisionStats } from '@/lib/db/wrong-decisions'
import type { WrongDecisionAnalysis } from '@/app/api/wrong-decisions/analyse/route'
import {
  saveWrongDecisionAction,
  updateWrongDecisionAction,
  deleteWrongDecisionAction,
} from '@/app/actions/wrong-decisions'

// ── Constants ─────────────────────────────────────────────────────────────────

const SKILLS = ['reading', 'listening', 'speaking', 'writing'] as const
type Skill = (typeof SKILLS)[number]

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
}

const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  reading:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-700 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-800' },
  listening: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  speaking:  { bg: 'bg-green-50 dark:bg-green-900/20',  text: 'text-green-700 dark:text-green-400',  border: 'border-green-200 dark:border-green-800' },
  writing:   { bg: 'bg-amber-50 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-400',  border: 'border-amber-200 dark:border-amber-800' },
}

const QUESTION_TYPES_BY_SKILL: Record<string, string[]> = {
  reading: [
    'True/False/NG',
    'Yes/No/NG',
    'Matching Headings',
    'Matching Information',
    'Multiple Choice',
    'Note/Table Completion',
    'Sentence Completion',
    'Diagram Labelling',
    'Short Answer',
  ],
  listening: [
    'Multiple Choice',
    'Form Completion',
    'Sentence Completion',
    'Note/Table Completion',
    'Diagram/Map Labelling',
    'Matching',
    'Short Answer',
  ],
  writing: [
    'Task 1 – Bar/Line Chart',
    'Task 1 – Pie Chart',
    'Task 1 – Table',
    'Task 1 – Process',
    'Task 1 – Map',
    'Task 1 – Mixed',
    'Task 2 – Opinion',
    'Task 2 – Discussion',
    'Task 2 – Problem/Solution',
    'Task 2 – Two-Part',
  ],
  speaking: [
    'Part 1 – Personal Questions',
    'Part 2 – Long Turn',
    'Part 3 – Discussion',
  ],
}

const QUESTION_ROLES = [
  'question-word',
  'category',
  'exclusion',
  'hedge',
  'relationship',
  'target',
  'time',
] as const

const ROLE_LABELS: Record<string, string> = {
  'question-word': 'Question word',
  'category':      'Category',
  'exclusion':     'Exclusion',
  'hedge':         'Hedge signal',
  'relationship':  'Relationship',
  'target':        'Target',
  'time':          'Time constraint',
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  'question-word': { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-800 dark:text-blue-300'   },
  'category':      { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300' },
  'exclusion':     { bg: 'bg-rose-100 dark:bg-rose-900/30',   text: 'text-rose-800 dark:text-rose-300'   },
  'hedge':         { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-800 dark:text-amber-300'  },
  'relationship':  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300' },
  'target':        { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-800 dark:text-green-300'  },
  'time':          { bg: 'bg-subtle',       text: 'text-foreground'   },
}

const ARTICLE_STRUCTURES = [
  'Problem → Solution',
  'Cause → Effect',
  'Scientific Discovery / Research Study',
  'Historical Evolution / Chronological',
  'Comparison / Contrast',
  'Argument → Counter-argument → Rebuttal',
  'General → Specific (Classificatory)',
]

function roleColor(role: string) {
  return ROLE_COLORS[role] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
}

function relativeDate(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return new Date(date).toLocaleDateString()
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: WrongDecisionStats }) {
  const topSkill = Object.entries(stats.bySkill).sort(([, a], [, b]) => b - a)[0]
  const topRole = stats.byRole[0]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Total logged', value: stats.total },
        { label: 'Most errors in', value: topSkill ? SKILL_LABELS[topSkill[0]] ?? topSkill[0] : '—' },
        { label: 'Most missed role', value: topRole ? (ROLE_LABELS[topRole.role] ?? topRole.role) : '—' },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-border bg-card px-5 py-4">
          <p className="text-xs text-faint">{label}</p>
          <p className="mt-1 text-lg font-bold text-foreground truncate">{value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Skill breakdown mini-bars ─────────────────────────────────────────────────

function SkillBreakdown({ bySkill, total }: { bySkill: Record<string, number>; total: number }) {
  if (total === 0) return null
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Errors by skill</p>
      <div className="flex flex-col gap-2">
        {SKILLS.map((skill) => {
          const count = bySkill[skill] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const c = SKILL_COLORS[skill]
          return (
            <div key={skill} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{SKILL_LABELS[skill]}</span>
              <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.bg.replace('50', '400')}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-foreground">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Entry form ────────────────────────────────────────────────────────────────

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

function EntryForm({
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

// ── Log entry card ────────────────────────────────────────────────────────────

function LogCard({
  log,
  onDelete,
  onUpdate,
}: {
  log: WrongDecisionLog
  onDelete: (id: number) => void
  onUpdate: (id: number, data: Partial<WrongDecisionLog>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Edit state
  const [editQuestionType, setEditQuestionType] = useState(log.questionType ?? '')
  const [editArticleStructure, setEditArticleStructure] = useState(log.articleStructure ?? '')
  const [editQuestion, setEditQuestion] = useState(log.question)
  const [editMyThought, setEditMyThought] = useState(log.myThought)
  const [editAnalytic, setEditAnalytic] = useState(log.analytic ?? '')
  const [editSolution, setEditSolution] = useState(log.solution ?? '')
  const [editRoles, setEditRoles] = useState<string[]>(log.questionRoles)
  const [isReanalysing, setIsReanalysing] = useState(false)

  const c = SKILL_COLORS[log.skill] ?? SKILL_COLORS.reading

  function toggleEditRole(role: string) {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  async function handleReanalyse() {
    setIsReanalysing(true)
    try {
      const res = await fetch('/api/wrong-decisions/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: log.skill,
          sourceText: log.sourceText ?? undefined,
          question: log.question,
          myThought: log.myThought,
          actualAnswer: log.actualAnswer,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data: WrongDecisionAnalysis = await res.json()
      setEditAnalytic(data.analytic)
      setEditSolution(data.solution)
      setEditRoles(data.roles)
    } catch {
      // silent — user can edit manually
    } finally {
      setIsReanalysing(false)
    }
  }

  function handleSaveEdit() {
    if (!editMyThought.trim()) return
    startTransition(async () => {
      await updateWrongDecisionAction(log.id, {
        questionType: editQuestionType || undefined,
        articleStructure: editArticleStructure || undefined,
        question: editQuestion,
        myThought: editMyThought,
        analytic: editAnalytic || undefined,
        solution: editSolution || undefined,
        questionRoles: editRoles,
      })
      onUpdate(log.id, {
        questionType: editQuestionType || null,
        articleStructure: editArticleStructure || null,
        question: editQuestion,
        myThought: editMyThought,
        analytic: editAnalytic || null,
        solution: editSolution || null,
        questionRoles: editRoles,
      })
      setIsEditing(false)
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteWrongDecisionAction(log.id)
      onDelete(log.id)
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => { setIsOpen((o) => !o); setIsEditing(false) }}
        className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
          {SKILL_LABELS[log.skill] ?? log.skill}
        </span>
        {log.questionType && (
          <span className="shrink-0 rounded-full border border-border bg-subtle px-2.5 py-0.5 text-[10px] font-semibold text-foreground">
            {log.questionType}
          </span>
        )}
        {log.articleStructure && (
          <span className="shrink-0 rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-2.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-400">
            {log.articleStructure}
          </span>
        )}
        {log.question ? (
          <p className="flex-1 text-sm font-medium text-foreground line-clamp-2">{log.question}</p>
        ) : (
          <p className="flex-1 text-sm text-faint italic line-clamp-1">My thought: {log.myThought}</p>
        )}
        <div className="flex shrink-0 items-center gap-2 ml-2">
          {log.questionRoles.slice(0, 2).map((role) => {
            const rc = roleColor(role)
            return (
              <span key={role} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${rc.bg} ${rc.text}`}>
                {ROLE_LABELS[role] ?? role}
              </span>
            )
          })}
          {log.questionRoles.length > 2 && (
            <span className="text-xs text-gray-400">+{log.questionRoles.length - 2}</span>
          )}
          <span className="text-xs text-gray-400 ml-1">{relativeDate(log.createdAt)}</span>
          <span className={`text-xs text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">

          {/* Source text */}
          {log.sourceText && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-faint mb-1">Source text</p>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto rounded bg-muted p-2 border border-border">
                {log.sourceText}
              </p>
            </div>
          )}

          {/* My thought / Correct answer */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-rose-400 mb-1">My thought / answer</p>
              <p className="text-xs text-rose-800 dark:text-rose-300">{log.myThought}</p>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-green-500 mb-1">Correct answer</p>
              <p className="text-xs font-semibold text-green-800 dark:text-green-300">{log.actualAnswer}</p>
            </div>
          </div>

          {/* Analytic + Solution + Roles — view or edit mode */}
          {isEditing ? (
            <div className="space-y-3 rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4">
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Question type</p>
              <div className="flex flex-wrap gap-1.5">
                {(QUESTION_TYPES_BY_SKILL[log.skill] ?? []).map((qt) => (
                  <button
                    key={qt}
                    onClick={() => setEditQuestionType(editQuestionType === qt ? '' : qt)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                      editQuestionType === qt
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card text-faint border-border hover:opacity-70'
                    }`}
                  >
                    {qt}
                  </button>
                ))}
              </div>

              {log.skill === 'reading' && (
                <>
                  <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Article structure <span className="font-normal opacity-70">(optional)</span></p>
                  <div className="flex flex-wrap gap-1.5">
                    {ARTICLE_STRUCTURES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setEditArticleStructure(editArticleStructure === s ? '' : s)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                          editArticleStructure === s
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-card text-faint border-border hover:opacity-70'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Question <span className="font-normal opacity-70">(optional)</span></p>
              <textarea
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-violet-200 dark:border-violet-700 bg-card px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
              />

              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">My thought / answer *</p>
              <textarea
                value={editMyThought}
                onChange={(e) => setEditMyThought(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-violet-200 dark:border-violet-700 bg-card px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
              />

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Analytic</p>
                <button
                  onClick={handleReanalyse}
                  disabled={isReanalysing}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-40"
                >
                  {isReanalysing ? 'Analysing…' : '↻ Re-analyse with AI'}
                </button>
              </div>
              <textarea
                value={editAnalytic}
                onChange={(e) => setEditAnalytic(e.target.value)}
                rows={3}
                placeholder="Why was this wrong?"
                className="w-full rounded-lg border border-violet-200 dark:border-violet-700 bg-card px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
              />
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Solution</p>
              <textarea
                value={editSolution}
                onChange={(e) => setEditSolution(e.target.value)}
                rows={2}
                placeholder="How to prevent this?"
                className="w-full rounded-lg border border-violet-200 dark:border-violet-700 bg-card px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y"
              />
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Question roles misread</p>
              <div className="flex flex-wrap gap-1.5">
                {QUESTION_ROLES.map((role) => {
                  const rc = roleColor(role)
                  const selected = editRoles.includes(role)
                  return (
                    <button
                      key={role}
                      onClick={() => toggleEditRole(role)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                        selected
                          ? `${rc.bg} ${rc.text} border-transparent`
                          : 'bg-card text-faint border-border hover:opacity-70'
                      }`}
                    >
                      {ROLE_LABELS[role]}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveEdit}
                  disabled={isPending || !editMyThought.trim()}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
                >
                  {isPending ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditQuestionType(log.questionType ?? '')
                    setEditArticleStructure(log.articleStructure ?? '')
                    setEditQuestion(log.question)
                    setEditMyThought(log.myThought)
                    setEditAnalytic(log.analytic ?? '')
                    setEditSolution(log.solution ?? '')
                    setEditRoles(log.questionRoles)
                  }}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {(log.analytic || log.solution) && (
                <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4 space-y-3">
                  {log.analytic && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500 mb-1">Analytic</p>
                      <p className="text-xs leading-relaxed text-violet-900 dark:text-violet-300">{log.analytic}</p>
                    </div>
                  )}
                  {log.solution && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500 mb-1">Solution</p>
                      <p className="text-xs leading-relaxed text-violet-900 dark:text-violet-300">{log.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {log.questionRoles.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-faint mb-1.5">Roles misread</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.questionRoles.map((role) => {
                      const rc = roleColor(role)
                      return (
                        <span key={role} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rc.bg} ${rc.text}`}>
                          {ROLE_LABELS[role] ?? role}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Card actions */}
          {!isEditing && (
            <div className="flex items-center gap-3 pt-1 border-t border-border">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Edit analytic
              </button>
              {confirmDelete ? (
                <span className="flex items-center gap-2 text-xs">
                  <span className="text-rose-600">Delete this entry?</span>
                  <button onClick={handleDelete} disabled={isPending} className="font-semibold text-rose-600 hover:underline disabled:opacity-40">
                    Yes
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="text-gray-500 hover:underline">
                    No
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-gray-400 hover:text-rose-500 transition-colors ml-auto"
                >
                  ✕ Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function WrongDecisionsView({
  initialLogs,
  initialStats,
}: {
  initialLogs: WrongDecisionLog[]
  initialStats: WrongDecisionStats
}) {
  const [logs, setLogs] = useState<WrongDecisionLog[]>(initialLogs)
  const [stats, setStats] = useState<WrongDecisionStats>(initialStats)
  const [showForm, setShowForm] = useState(false)
  const [skillFilter, setSkillFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  function rebuildStats(nextLogs: WrongDecisionLog[]): WrongDecisionStats {
    const bySkill: Record<string, number> = {}
    const roleCount: Record<string, number> = {}
    for (const log of nextLogs) {
      bySkill[log.skill] = (bySkill[log.skill] ?? 0) + 1
      for (const role of log.questionRoles) {
        roleCount[role] = (roleCount[role] ?? 0) + 1
      }
    }
    const byRole = Object.entries(roleCount)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
    return { total: nextLogs.length, bySkill, byRole }
  }

  function handleSaved(log: WrongDecisionLog) {
    const next = [log, ...logs]
    setLogs(next)
    setStats(rebuildStats(next))
    setShowForm(false)
  }

  function handleDelete(id: number) {
    const next = logs.filter((l) => l.id !== id)
    setLogs(next)
    setStats(rebuildStats(next))
  }

  function handleUpdate(id: number, data: Partial<WrongDecisionLog>) {
    const next = logs.map((l) => (l.id === id ? { ...l, ...data } : l))
    setLogs(next)
    setStats(rebuildStats(next))
  }

  // Question types present in current logs (for the type filter chips)
  const presentTypes = useMemo(() => {
    const types = new Set<string>()
    for (const l of logs) {
      if (l.questionType) types.add(l.questionType)
    }
    return [...types].sort()
  }, [logs])

  // Reset type filter when skill filter changes
  function setSkillFilterAndResetType(skill: string) {
    setSkillFilter(skill)
    setTypeFilter('all')
  }

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (skillFilter !== 'all' && l.skill !== skillFilter) return false
      if (typeFilter !== 'all' && l.questionType !== typeFilter) return false
      if (roleFilter !== 'all' && !l.questionRoles.includes(roleFilter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !(l.question ?? '').toLowerCase().includes(q) &&
          !(l.questionType ?? '').toLowerCase().includes(q) &&
          !(l.articleStructure ?? '').toLowerCase().includes(q) &&
          !l.myThought.toLowerCase().includes(q) &&
          !l.actualAnswer.toLowerCase().includes(q) &&
          !(l.analytic ?? '').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [logs, skillFilter, typeFilter, roleFilter, search])

  return (
    <div>
      <StatsBar stats={stats} />
      {stats.total > 0 && <SkillBreakdown bySkill={stats.bySkill} total={stats.total} />}

      {/* Log button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          + Log a wrong decision
        </button>
      )}

      {/* Entry form */}
      {showForm && (
        <EntryForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      )}

      {/* Filters */}
      {logs.length > 0 && (
        <div className="mb-4 space-y-3">
          {/* Skill filter */}
          <div className="flex flex-wrap gap-1.5">
            {['all', ...SKILLS].map((s) => {
              const isActive = skillFilter === s
              const c = s !== 'all' ? SKILL_COLORS[s] : null
              return (
                <button
                  key={s}
                  onClick={() => setSkillFilterAndResetType(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                    isActive && c
                      ? `${c.bg} ${c.text} ${c.border}`
                      : isActive
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {s === 'all' ? 'All skills' : SKILL_LABELS[s]}
                </button>
              )
            })}
          </div>

          {/* Question type filter — only show types present in logged data */}
          {presentTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTypeFilter('all')}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:opacity-70'
                }`}
              >
                All types
              </button>
              {presentTypes.map((qt) => (
                <button
                  key={qt}
                  onClick={() => setTypeFilter(typeFilter === qt ? 'all' : qt)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                    typeFilter === qt
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {qt}
                </button>
              ))}
            </div>
          )}

          {/* Role filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setRoleFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                roleFilter === 'all'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:opacity-70'
              }`}
            >
              All roles
            </button>
            {stats.byRole.map(({ role }) => {
              const rc = roleColor(role)
              const isActive = roleFilter === role
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(isActive ? 'all' : role)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                    isActive ? `${rc.bg} ${rc.text} border-transparent` : 'bg-card text-muted-foreground border-border hover:opacity-70'
                  }`}
                >
                  {ROLE_LABELS[role] ?? role}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question, answer, analytic…"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-faint focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Log list */}
      {filtered.length === 0 && logs.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-card p-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">No wrong decisions logged yet.</p>
          <p className="mt-1 text-xs text-faint">
            Record a mistake after each practice session to build your error pattern library.
          </p>
        </div>
      )}

      {filtered.length === 0 && logs.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No entries match the current filter.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((log) => (
          <LogCard
            key={log.id}
            log={log}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  )
}
