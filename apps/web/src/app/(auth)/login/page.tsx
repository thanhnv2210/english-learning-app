'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-subtle">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">IELTS Accelerator</p>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.532 24.552c0-1.636-.132-3.2-.38-4.704H24v8.896h13.228c-.572 3.064-2.308 5.656-4.92 7.392v6.14h7.968c4.664-4.296 7.256-10.62 7.256-17.724z" fill="#4285F4"/>
            <path d="M24 48c6.48 0 11.916-2.148 15.888-5.824l-7.968-6.14c-2.148 1.44-4.896 2.292-7.92 2.292-6.096 0-11.256-4.116-13.092-9.648H2.62v6.34C6.576 42.58 14.724 48 24 48z" fill="#34A853"/>
            <path d="M10.908 28.68A14.46 14.46 0 0 1 9.6 24c0-1.632.28-3.216.78-4.68v-6.34H2.62A23.988 23.988 0 0 0 0 24c0 3.876.928 7.548 2.62 10.82l8.288-6.14z" fill="#FBBC05"/>
            <path d="M24 9.672c3.432 0 6.516 1.18 8.94 3.492l6.708-6.708C35.9 2.58 30.472 0 24 0 14.724 0 6.576 5.42 2.62 13.32l8.288 6.34C12.744 13.788 17.904 9.672 24 9.672z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-faint">or admin</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              suppressHydrationWarning
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
