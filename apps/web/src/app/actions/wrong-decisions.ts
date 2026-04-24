'use server'

import {
  saveWrongDecision,
  updateWrongDecision,
  deleteWrongDecision,
} from '@/lib/db/wrong-decisions'
import { revalidatePath } from 'next/cache'

export async function saveWrongDecisionAction(data: {
  skill: string
  questionType?: string
  sourceText?: string
  question: string
  myThought: string
  actualAnswer: string
  analytic?: string
  solution?: string
  questionRoles: string[]
}): Promise<number> {
  const id = await saveWrongDecision(data)
  revalidatePath('/wrong-decisions')
  return id
}

export async function updateWrongDecisionAction(
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
  await updateWrongDecision(id, data)
  revalidatePath('/wrong-decisions')
}

export async function deleteWrongDecisionAction(id: number): Promise<void> {
  await deleteWrongDecision(id)
  revalidatePath('/wrong-decisions')
}
