import { NavSidebar } from '@/components/nav-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { OllamaDisabledBanner } from '@/components/ollama-disabled-banner'
import { getCurrentUser } from '@/lib/db/user'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <>
      {/* MobileHeader must live outside the overflow-hidden container —
          iOS Safari clips position:fixed children of overflow:hidden parents */}
      <MobileHeader targetProfile={user.targetProfile} favouritePages={user.favouritePages ?? []} />

      <div className="flex h-screen overflow-hidden bg-background">
        <NavSidebar
          targetProfile={user.targetProfile}
          favouritePages={user.favouritePages ?? []}
          userEmail={user.email}
          userName={user.name ?? undefined}
          userImage={user.image ?? undefined}
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {process.env.NEXT_PUBLIC_OLLAMA_ENABLED === 'false' && <OllamaDisabledBanner />}
          <main className="flex-1 overflow-y-auto overflow-x-hidden pt-12 sm:pt-0 p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-12">{children}</main>
        </div>
      </div>
    </>
  )
}
