'use server'

import { revalidatePath } from 'next/cache'
import { updateTargetProfile, updateModelPreference, updateShowSystemData, getCurrentUser } from '@/lib/db/user'

const VALID_PROFILES = ['IELTS_Academic_5', 'IELTS_Academic_5.5', 'IELTS_Academic_6', 'IELTS_Academic_6.5', 'IELTS_Academic_7', 'Business_Fluent'] as const

export async function updateModelPreferenceAction(preference: 'auto' | 'free'): Promise<void> {
  const user = await getCurrentUser()
  if (user.tier !== 'vip') return // only vip can switch
  await updateModelPreference(user.id, preference)
  revalidatePath('/settings')
}

export async function updateShowSystemDataAction(showSystemData: boolean): Promise<void> {
  const user = await getCurrentUser()
  await updateShowSystemData(user.id, showSystemData)
  revalidatePath('/', 'layout')
}

export async function updateTargetProfileAction(
  profile: (typeof VALID_PROFILES)[number],
): Promise<void> {
  if (!VALID_PROFILES.includes(profile)) return
  const user = await getCurrentUser()
  await updateTargetProfile(user.id, profile)
  revalidatePath('/', 'layout')
}
