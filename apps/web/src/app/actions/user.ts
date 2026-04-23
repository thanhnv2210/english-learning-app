'use server'

import { revalidatePath } from 'next/cache'
import { updateTargetProfile } from '@/lib/db/user'

const VALID_PROFILES = ['IELTS_Academic_6.5', 'IELTS_Academic_7.5', 'Business_Fluent'] as const

export async function updateTargetProfileAction(
  profile: (typeof VALID_PROFILES)[number],
): Promise<void> {
  if (!VALID_PROFILES.includes(profile)) return
  await updateTargetProfile(profile)
  revalidatePath('/', 'layout')
}
