import { NavSidebar } from '@/components/nav-sidebar'
import { OllamaDisabledBanner } from '@/components/ollama-disabled-banner'
import { getDefaultUser } from '@/lib/db/user'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getDefaultUser()
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <NavSidebar targetProfile={user.targetProfile} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {process.env.NEXT_PUBLIC_OLLAMA_ENABLED === 'false' && <OllamaDisabledBanner />}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-12">{children}</main>
      </div>
    </div>
  )
}
