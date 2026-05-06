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

  const isSuspended = user.status === 'suspended'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${isSuspended ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
            {isSuspended ? '🚫' : '⏳'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-foreground">
          {isSuspended ? 'Account suspended' : "You're on the waitlist"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSuspended
            ? 'Your account has been suspended. Please contact us if you believe this is a mistake.'
            : "Thanks for signing up! We've received your request and will activate your account as soon as a spot opens up. We'll let you know."}
        </p>

        <div className="mt-6 rounded-lg border border-border bg-subtle px-4 py-3 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {!isSuspended && (
            <Link
              href="/pending"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Check status
            </Link>
          )}
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
