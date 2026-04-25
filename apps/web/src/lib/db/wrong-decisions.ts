import { db } from '@/lib/db'
import { wrongDecisionLogs } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { getDefaultUser } from '@/lib/db/user'

export type WrongDecisionLog = {
  id: number
  skill: string
  questionType: string | null
  sourceText: string | null
  question: string
  myThought: string
  actualAnswer: string
  analytic: string | null
  solution: string | null
  questionRoles: string[]
  createdAt: Date
}

export type WrongDecisionStats = {
  total: number
  bySkill: Record<string, number>
  byRole: { role: string; count: number }[]
}

export async function saveWrongDecision(data: {
  skill: string
  questionType?: string
  sourceText?: string
  question?: string
  myThought: string
  actualAnswer: string
  analytic?: string
  solution?: string
  questionRoles: string[]
}): Promise<number> {
  const user = await getDefaultUser()
  const [row] = await db
    .insert(wrongDecisionLogs)
    .values({
      userId: user.id,
      skill: data.skill,
      questionType: data.questionType ?? null,
      sourceText: data.sourceText ?? null,
      question: data.question ?? '',
      myThought: data.myThought,
      actualAnswer: data.actualAnswer,
      analytic: data.analytic ?? null,
      solution: data.solution ?? null,
      questionRoles: data.questionRoles,
    })
    .returning({ id: wrongDecisionLogs.id })
  return row.id
}

export async function getAllWrongDecisions(): Promise<WrongDecisionLog[]> {
  const user = await getDefaultUser()
  return db
    .select()
    .from(wrongDecisionLogs)
    .where(eq(wrongDecisionLogs.userId, user.id))
    .orderBy(desc(wrongDecisionLogs.createdAt)) as Promise<WrongDecisionLog[]>
}

export async function updateWrongDecision(
  id: number,
  data: {
    questionType?: string
    analytic?: string
    solution?: string
    questionRoles?: string[]
    question?: string
    myThought?: string
    actualAnswer?: string
    sourceText?: string
  },
): Promise<void> {
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  )
  if (Object.keys(filtered).length === 0) return
  await db
    .update(wrongDecisionLogs)
    .set(filtered)
    .where(eq(wrongDecisionLogs.id, id))
}

export async function deleteWrongDecision(id: number): Promise<void> {
  await db.delete(wrongDecisionLogs).where(eq(wrongDecisionLogs.id, id))
}

export async function getWrongDecisionStats(): Promise<WrongDecisionStats> {
  const user = await getDefaultUser()
  const rows = (await db
    .select()
    .from(wrongDecisionLogs)
    .where(eq(wrongDecisionLogs.userId, user.id))) as WrongDecisionLog[]

  const bySkill: Record<string, number> = {}
  const roleCount: Record<string, number> = {}

  for (const row of rows) {
    bySkill[row.skill] = (bySkill[row.skill] ?? 0) + 1
    for (const role of row.questionRoles) {
      roleCount[role] = (roleCount[role] ?? 0) + 1
    }
  }

  const byRole = Object.entries(roleCount)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  return { total: rows.length, bySkill, byRole }
}
