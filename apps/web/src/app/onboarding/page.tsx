import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/db/user'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (user.onboardingCompletedAt) redirect('/dashboard')

  return (
    <OnboardingForm
      defaultProfile={user.targetProfile}
    />
  )
}
