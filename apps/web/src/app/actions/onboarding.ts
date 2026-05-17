'use server'

import { redirect } from 'next/navigation'
import { getCurrentUser, completeOnboarding, resetOnboarding } from '@/lib/db/user'

export async function completeOnboardingAction(data: {
  bio: string
  weakSkills: string[]
  targetProfile: string
  onboardingReasons: string[]
  favouritePages: string[]
  returningUser: boolean
}): Promise<void> {
  const user = await getCurrentUser()
  await completeOnboarding(user.id, data)
  redirect('/dashboard')
}

export async function resetOnboardingAction(): Promise<void> {
  const user = await getCurrentUser()
  await resetOnboarding(user.id)
  redirect('/onboarding')
}
