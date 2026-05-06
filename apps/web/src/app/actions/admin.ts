'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function approveUserAction(userId: number): Promise<void> {
  await db.update(users).set({ status: 'active' }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
}

export async function updateUserTierAction(userId: number, tier: 'free' | 'vip'): Promise<void> {
  await db.update(users).set({ tier }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
  revalidatePath('/admin/engagement')
}

export async function updateUserModelPreferenceAction(
  userId: number,
  preference: 'auto' | 'free',
): Promise<void> {
  await db.update(users).set({ modelPreference: preference }).where(eq(users.id, userId))
  revalidatePath('/admin/users')
}
