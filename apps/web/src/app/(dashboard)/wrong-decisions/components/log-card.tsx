'use client'

import { useState, useTransition } from 'react'
import { updateWrongDecisionAction, deleteWrongDecisionAction } from '@/app/actions/wrong-decisions'
import type { WrongDecisionLog } from '@/lib/db/wrong-decisions'
import type { WrongDecisionAnalysis } from '@/app/api/wrong-decisions/analyse/route'
import {
  SKILL_LABELS,
  SKILL_COLORS,
  QUESTION_TYPES_BY_SKILL,
  QUESTION_ROLES,
  ROLE_LABELS,
  ARTICLE_STRUCTURES,
  roleColor,
  relativeDate,
} from './constants'

export function LogCard({
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
        className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-muted transition-colors"
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
            <span className="text-xs text-faint">+{log.questionRoles.length - 2}</span>
          )}
          <span className="text-xs text-faint ml-1">{relativeDate(log.createdAt)}</span>
          <span className={`text-xs text-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">

          {log.sourceText && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-faint mb-1">Source text</p>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto rounded bg-muted p-2 border border-border">
                {log.sourceText}
              </p>
            </div>
          )}

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
                  <button onClick={() => setConfirmDelete(false)} className="text-muted-foreground hover:underline">
                    No
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-faint hover:text-rose-500 transition-colors ml-auto"
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
