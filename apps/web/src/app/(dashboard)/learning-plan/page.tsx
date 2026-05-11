import { getCurrentUser } from '@/lib/db/user'
import { getOfficialResults } from '@/lib/db/learning-plan'
import { LearningPlanView } from './learning-plan-view'

export const dynamic = 'force-dynamic'

export default async function LearningPlanPage() {
  const user = await getCurrentUser()
  const results = await getOfficialResults(user.id)
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Learning Journey</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track official IELTS scores, review insights, and follow your 3-month study plan.
        </p>
      </div>
      <LearningPlanView initialResults={results} />
    </div>
  )
}
