import { NextRequest, NextResponse } from 'next/server'
import { verifyRequestToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role, ACTIVE_BOOKING_STATUSES } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  const hotels = await p.hotel.findMany({
    orderBy: { name: 'asc' },
    include: {
      rooms: {
        orderBy: { name: 'asc' },
        select: { id: true, name: true, type: true, capacity: true, price: true, status: true },
      },
      bookings: {
        where: { status: { in: ACTIVE_BOOKING_STATUSES } },
        orderBy: { checkIn: 'asc' },
        take: 20,
        include: { room: { select: { name: true } } },
      },
      users: {
        where: { role: { not: Role.SUPER_ADMIN } },
        orderBy: { createdAt: 'asc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: {
          items: {
            select: { name: true, quantity: true },
          },
        },
      },
    },
  })

  return NextResponse.json({ hotels })
}
