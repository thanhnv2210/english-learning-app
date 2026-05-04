import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === '/login'
  const isPublicPage = pathname === '/' || pathname === '/pending' || pathname === '/auth-error'

  // Public pages — no auth required
  if (isPublicPage) return NextResponse.next()

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }
})

export const config = {
  // Only protect page routes — API routes handle their own auth
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
