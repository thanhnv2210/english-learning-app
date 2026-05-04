import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; error?: string }>
}) {
  const params = await searchParams
  const isClosed = params.reason === 'closed'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-3xl">
            {isClosed ? '🔒' : '⚠️'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-foreground">
          {isClosed ? 'Signups are closed' : 'Something went wrong'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isClosed
            ? "We're not accepting new accounts at the moment. Check back soon or contact the team if you think this is a mistake."
            : 'There was a problem signing you in. Please try again.'}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Back to sign in
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  )
}
