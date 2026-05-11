'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/db/user'
import { saveOfficialResult, deleteOfficialResult } from '@/lib/db/learning-plan'

export async function saveOfficialResultAction(formData: FormData) {
  const user = await getCurrentUser()

  const listening = parseFloat(formData.get('listening') as string)
  const reading = parseFloat(formData.get('reading') as string)
  const writing = parseFloat(formData.get('writing') as string)
  const speaking = parseFloat(formData.get('speaking') as string)
  const overall = parseFloat(formData.get('overall') as string)
  const examDate = formData.get('examDate') as string
  const notes = (formData.get('notes') as string) || null

  if (!examDate || [listening, reading, writing, speaking, overall].some(isNaN)) {
    throw new Error('Invalid form data')
  }

  await saveOfficialResult({ userId: user.id, examDate, listening, reading, writing, speaking, overall, notes })
  revalidatePath('/learning-plan')
}

export async function deleteOfficialResultAction(id: number) {
  await deleteOfficialResult(id)
  revalidatePath('/learning-plan')
}
