import { getAnalyticsStats } from '@/lib/db/analytics'
import { AnalyticsView } from './analytics-view'

export default async function AnalyticsPage() {
  const stats = await getAnalyticsStats()
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Rolling performance across all skills vs your target band.</p>
      </div>
      <AnalyticsView stats={stats} />
    </div>
  )
}
