import { NavSidebar } from '@/components/nav-sidebar'
import { OllamaDisabledBanner } from '@/components/ollama-disabled-banner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <NavSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {process.env.NEXT_PUBLIC_OLLAMA_ENABLED === 'false' && <OllamaDisabledBanner />}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 2xl:p-12">{children}</main>
      </div>
    </div>
  )
}
