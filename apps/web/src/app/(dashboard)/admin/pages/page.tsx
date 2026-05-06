import { getAllPageConfigs } from '@/lib/db/page-configs'
import { NAV_GROUPS, STANDALONE, ADMIN_GROUP } from '@/lib/nav-config'
import { PageConfigRow } from './page-config-row'

export const dynamic = 'force-dynamic'

const ALL_GROUPS = [
  { label: 'Standalone', items: STANDALONE },
  ...NAV_GROUPS,
  ADMIN_GROUP,
]

export default async function AdminPagesPage() {
  const pageConfigs = await getAllPageConfigs()

  const totalDisabled = Object.values(pageConfigs).filter((c) => c.isDisabled).length
  const totalTagged = Object.values(pageConfigs).filter((c) => c.tag).length

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Admin
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set tags (New, Beta, Soon, Updated) and hide pages from the sidebar.
          Disabled pages are hidden from navigation but still accessible by URL.
        </p>
        {(totalDisabled > 0 || totalTagged > 0) && (
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            {totalTagged > 0 && <span>{totalTagged} page{totalTagged !== 1 ? 's' : ''} tagged</span>}
            {totalDisabled > 0 && <span className="text-red-500">{totalDisabled} page{totalDisabled !== 1 ? 's' : ''} hidden</span>}
          </div>
        )}
      </div>

      {/* Groups */}
      {ALL_GROUPS.map((group) => (
        <div key={group.label} className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-subtle px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-faint">{group.label}</p>
          </div>
          <div className="divide-y divide-border">
            {group.items.map((item) => {
              const config = pageConfigs[item.href]
              return (
                <PageConfigRow
                  key={item.href}
                  item={item}
                  currentTag={config?.tag ?? null}
                  currentDisabled={config?.isDisabled ?? false}
                />
              )
            })}
          </div>
        </div>
      ))}

    </div>
  )
}
