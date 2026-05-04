import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === '/login'
  const isLandingPage = pathname === '/'

  // Landing page is public — anyone can see it
  if (isLandingPage) return NextResponse.next()

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/speaking', req.nextUrl.origin))
  }
})

export const config = {
  // Only protect page routes — API routes handle their own auth
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
