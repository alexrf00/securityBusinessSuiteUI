// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔍 Middleware running for:', request.nextUrl.pathname)
  
  const { pathname } = request.nextUrl
  
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/login', '/register']
  
  // Get JWT token from HTTP-only cookie
  const accessToken = request.cookies.get('access_token')?.value
  console.log('🍪 Token found:', !!accessToken)
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.includes(pathname)
  
  console.log('🛡️ Is protected route:', isProtectedRoute)
  
  // For now, just test basic redirect without backend call
  if (isProtectedRoute && !accessToken) {
    console.log('🚫 Redirecting to login - no token')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  console.log('✅ Allowing request to continue')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}