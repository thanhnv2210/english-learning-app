import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getCurrentUser } from '@/lib/db/user'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PendingPage() {
  const session = await auth()

  // Not logged in — send to landing
  if (!session?.user) redirect('/')

  // Re-check live DB status in case admin has approved them
  const user = await getCurrentUser()
  if (user.status === 'active') redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-3xl">
            ⏳
          </span>
        </div>

        <h1 className="text-xl font-bold text-foreground">You&apos;re on the waitlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for signing up! We&apos;ve received your request and will activate your account
          as soon as a spot opens up. We&apos;ll let you know.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-subtle px-4 py-3 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {/* Reload the page to re-check DB status */}
          <Link
            href="/pending"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Check status
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
