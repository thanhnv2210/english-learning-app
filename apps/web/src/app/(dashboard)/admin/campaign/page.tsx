import { getCampaignConfig, getCampaignStats } from '@/lib/db/campaign'
import { CampaignForm } from '@/components/campaign-form'

export const dynamic = 'force-dynamic'

export default async function AdminCampaignPage() {
  const [config, stats] = await Promise.all([
    getCampaignConfig(),
    getCampaignStats(),
  ])

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Admin
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            config?.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-subtle text-muted-foreground'
          }`}>
            {config?.isActive ? 'Campaign ON' : 'Campaign OFF'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Campaign Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control signup access and manage the waitlist.
        </p>
      </div>

      <CampaignForm
        config={config}
        activeCount={stats.activeCount}
        pendingCount={stats.pendingCount}
      />
    </div>
  )
}
