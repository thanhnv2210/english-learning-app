import { redirect } from 'next/navigation'
import { NavSidebar } from '@/components/nav-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { OllamaDisabledBanner } from '@/components/ollama-disabled-banner'
import { getCurrentUser } from '@/lib/db/user'
import { getAllPageConfigs } from '@/lib/db/page-configs'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, pageConfigs] = await Promise.all([getCurrentUser(), getAllPageConfigs()])
  if (user.status === 'pending') redirect('/pending')
  return (
    <>
      {/* MobileHeader must live outside the overflow-hidden container —
          iOS Safari clips position:fixed children of overflow:hidden parents */}
      <MobileHeader
        targetProfile={user.targetProfile}
        favouritePages={user.favouritePages ?? []}
        isAdmin={user.role === 'admin'}
        userEmail={user.email}
        userName={user.name ?? undefined}
        userImage={user.image ?? undefined}
        pageConfigs={pageConfigs}
      />

      <div className="flex h-screen overflow-hidden bg-background">
        <NavSidebar
          targetProfile={user.targetProfile}
          favouritePages={user.favouritePages ?? []}
          userEmail={user.email}
          userName={user.name ?? undefined}
          userImage={user.image ?? undefined}
          isAdmin={user.role === 'admin'}
          pageConfigs={pageConfigs}
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {process.env.NEXT_PUBLIC_OLLAMA_ENABLED === 'false' && <OllamaDisabledBanner />}
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-12 sm:pt-0 p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-12">{children}</main>
        </div>
      </div>
    </>
  )
}
