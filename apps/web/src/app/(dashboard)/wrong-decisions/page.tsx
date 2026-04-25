import { getAllWrongDecisions, getWrongDecisionStats } from '@/lib/db/wrong-decisions'
import { WrongDecisionsView } from './wrong-decisions-view'

export default async function WrongDecisionsPage() {
  const [logs, stats] = await Promise.all([
    getAllWrongDecisions(),
    getWrongDecisionStats(),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wrong Decision Log</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Record mistakes, understand why they happened, and build strategies to avoid them.
        </p>
      </div>
      <WrongDecisionsView initialLogs={logs} initialStats={stats} />
    </div>
  )
}
