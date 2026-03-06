import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { TokenPayload, Role } from '@/types'

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'hotel-platform-secret-change-in-production')

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function getTokenFromCookies(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get('access_token')?.value ?? null
}

export async function verifyRequestToken(req: NextRequest): Promise<TokenPayload | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function hasHotelAccess(payload: TokenPayload, hotelId: string): boolean {
  if (payload.role === 'SUPER_ADMIN') return true
  return payload.hotelId === hotelId
}

export const HOTEL_ROLES: Role[] = ['OWNER', 'MANAGER', 'RECEPTIONIST', 'KITCHEN']
export const MANAGEMENT_ROLES: Role[] = ['OWNER', 'MANAGER']
