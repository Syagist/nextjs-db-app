import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Role } from '@/types'

const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin']
const HOTEL_ROUTES = ['/hotel']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('access_token')?.value

  let payload = null
  if (token) {
    payload = await verifyToken(token)
  }

  const isAuthenticated = payload !== null
  const role: Role | null = payload?.role ?? null

  // Auth routes: redirect authenticated users to their dashboard
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboardUrl(payload!.role, payload!.hotelId), req.url))
    }
    return NextResponse.next()
  }

  // Admin routes: require SUPER_ADMIN
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?from=${pathname}`, req.url))
    }
    if (role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.next()
  }

  // Hotel workspace routes: require any hotel role
  if (HOTEL_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?from=${pathname}`, req.url))
    }

    const hotelRoles: Role[] = ['OWNER', 'MANAGER', 'RECEPTIONIST', 'KITCHEN']
    if (!hotelRoles.includes(role!)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Extract hotelId from URL: /hotel/[hotelId]/...
    const segments = pathname.split('/')
    const hotelIdFromUrl = segments[2]

    if (role !== 'SUPER_ADMIN' && payload!.hotelId !== hotelIdFromUrl) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  }

  // Pending page: require authenticated non-super-admin
  if (pathname.startsWith('/pending')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

function getDashboardUrl(role: Role, hotelId: string | null): string {
  if (role === 'SUPER_ADMIN') return '/admin'
  if (hotelId) return `/hotel/${hotelId}/dashboard`
  return '/pending'
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/hotel/:path*',
    '/login',
    '/register',
    '/pending',
    '/unauthorized',
  ],
}
