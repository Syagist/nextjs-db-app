import { NextRequest, NextResponse } from 'next/server'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RoomStatus, BookingStatus, OrderStatus } from '@/lib/constants'

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [totalRooms, availableRooms, totalBookings, activeBookings, todayCheckIns, todayCheckOuts, pendingOrders, recentBookings] =
    await Promise.all([
      p.room.count({ where: { hotelId } }),
      p.room.count({ where: { hotelId, status: RoomStatus.AVAILABLE } }),
      p.booking.count({ where: { hotelId } }),
      p.booking.count({ where: { hotelId, status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] } } }),
      p.booking.count({ where: { hotelId, checkIn: { gte: today, lt: tomorrow } } }),
      p.booking.count({ where: { hotelId, checkOut: { gte: today, lt: tomorrow } } }),
      p.order.count({ where: { hotelId, status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING] } } }),
      p.booking.findMany({
        where: { hotelId },
        include: { room: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

  return NextResponse.json({
    stats: { totalRooms, availableRooms, totalBookings, activeBookings, todayCheckIns, todayCheckOuts, pendingOrders },
    recentBookings,
  })
}
