'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { upsertPageConfig } from '@/lib/db/page-configs'
import { getCurrentUser } from '@/lib/db/user'
import { sendAccountActivatedEmail } from '@/lib/email'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (user.role !== 'admin') throw new Error('Forbidden')
}

export async function approveUserAction(userId: number): Promise<void> {
  await requireAdmin()
  const [updated] = await db
    .update(users)
    .set({ status: 'active' })
    .where(eq(users.id, userId))
    .returning({ email: users.email, name: users.name })
  revalidatePath('/admin/users')
  if (updated) {
    // fire-and-forget — don't block the UI on email delivery
    sendAccountActivatedEmail(updated.email, updated.name).catch(() => null)
  }
}

export async function suspendUserAction(userId: number): Promise<void> {
  await requireAdmin()
  await db.update(users).set({ status: 'suspended' }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
}

export async function updateUserTierAction(userId: number, tier: 'free' | 'vip'): Promise<void> {
  await requireAdmin()
  await db.update(users).set({ tier }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
  revalidatePath('/admin/engagement')
}

export async function updateUserModelPreferenceAction(
  userId: number,
  preference: 'auto' | 'free',
): Promise<void> {
  await requireAdmin()
  await db.update(users).set({ modelPreference: preference }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
}

export async function sendCustomEmailAction(
  userId: number,
  subject: string,
  content: string,
): Promise<{ ok: boolean }> {
  await requireAdmin()
  const [user] = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!user) return { ok: false }
  await sendAccountActivatedEmail(user.email, user.name, subject, content)
  return { ok: true }
}

export async function upsertPageConfigAction(
  href: string,
  tag: string | null,
  isDisabled: boolean
): Promise<void> {
  await upsertPageConfig(href, tag, isDisabled)
  revalidatePath('/', 'layout')
}
