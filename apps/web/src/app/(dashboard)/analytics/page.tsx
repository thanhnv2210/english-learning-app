import { getAnalyticsStats } from '@/lib/db/analytics'
import { getWrongDecisionStats } from '@/lib/db/wrong-decisions'
import { getCurrentUser } from '@/lib/db/user'
import { AnalyticsView } from './analytics-view'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  const isNewUser = !user.returningUser
  const [stats, wrongStats] = await Promise.all([
    getAnalyticsStats(user.id),
    isNewUser ? Promise.resolve(null) : getWrongDecisionStats(),
  ])
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Progress Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rolling performance across all skills vs your target band.</p>
      </div>
      <AnalyticsView stats={stats} wrongDecisionStats={wrongStats} isNewUser={isNewUser} />
    </div>
  )
}
