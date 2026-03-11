import { NextRequest, NextResponse } from 'next/server'
import { verifyRequestToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotels = await (prisma as any).hotel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { users: true, rooms: true, bookings: true } },
    },
  })

  return NextResponse.json({ hotels })
}
