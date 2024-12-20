import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Allow these paths without authentication
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const isAuthenticated = req.cookies.get('auth')

  if (!isAuthenticated) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

