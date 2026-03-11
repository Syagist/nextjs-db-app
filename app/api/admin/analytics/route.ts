import { NextRequest, NextResponse } from 'next/server'
import { verifyRequestToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { HotelStatus, Role } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  const [totalHotels, pendingHotels, approvedHotels, rejectedHotels, totalUsers, totalBookings, recentHotels] =
    await Promise.all([
      p.hotel.count(),
      p.hotel.count({ where: { status: HotelStatus.PENDING } }),
      p.hotel.count({ where: { status: HotelStatus.APPROVED } }),
      p.hotel.count({ where: { status: HotelStatus.REJECTED } }),
      p.user.count({ where: { role: { not: Role.SUPER_ADMIN } } }),
      p.booking.count(),
      p.hotel.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, location: true, status: true, createdAt: true },
      }),
    ])

  return NextResponse.json({
    stats: { totalHotels, pendingHotels, approvedHotels, rejectedHotels, totalUsers, totalBookings },
    recentHotels,
  })
}
