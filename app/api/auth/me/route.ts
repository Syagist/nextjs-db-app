import { NextResponse } from 'next/server'
import { getTokenFromCookies } from '@/lib/auth'

export async function GET() {
  const payload = await getTokenFromCookies()
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      hotelId: payload.hotelId,
    },
  })
}
