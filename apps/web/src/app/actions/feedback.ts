'use server'

import { db } from '@/lib/db'
import { feedbacks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/db/user'
import { sendFeedbackNotificationEmail } from '@/lib/email'

export async function submitFeedbackAction(type: string, message: string): Promise<void> {
  const user = await getCurrentUser()
  await db.insert(feedbacks).values({ userId: user.id, type, message })

  // Fire-and-forget — do not block the user if email fails
  sendFeedbackNotificationEmail({
    type,
    message,
    userName: user.name ?? null,
    userEmail: user.email ?? null,
  }).catch((err) => console.error('[feedback] email notification failed:', err))
}

export async function updateFeedbackStatusAction(
  id: number,
  status: string,
  adminNote?: string,
): Promise<void> {
  await db
    .update(feedbacks)
    .set({ status, ...(adminNote !== undefined ? { adminNote } : {}) })
    .where(eq(feedbacks.id, id))
  revalidatePath('/admin/feedback')
}
