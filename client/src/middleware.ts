import { NextRequest, NextResponse } from 'next/server'

import { authRoutes, protectedRoutes } from '@/config/routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
