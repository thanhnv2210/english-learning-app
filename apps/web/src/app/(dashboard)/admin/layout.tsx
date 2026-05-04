import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/db/user'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (user.role !== 'admin') redirect('/')
  return <>{children}</>
}
