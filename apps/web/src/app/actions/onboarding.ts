'use server'

import { redirect } from 'next/navigation'
import { getCurrentUser, completeOnboarding } from '@/lib/db/user'

export async function completeOnboardingAction(data: {
  bio: string
  weakSkills: string[]
  targetProfile: string
  onboardingReasons: string[]
  favouritePages: string[]
}): Promise<void> {
  const user = await getCurrentUser()
  await completeOnboarding(user.id, data)
  redirect('/dashboard')
}
