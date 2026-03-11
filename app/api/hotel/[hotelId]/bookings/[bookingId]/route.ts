import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CAN_DELETE_BOOKING, BOOKING_STATUSES, BookingStatus, RoomStatus } from '@/lib/constants'

const updateSchema = z.object({
  status: z.enum(BOOKING_STATUSES as [string, ...string[]]).optional(),
  guestName: z.string().min(1).optional(),
  guestPhone: z.string().min(1).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
})

type Params = { params: Promise<{ hotelId: string; bookingId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, bookingId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const data: Record<string, unknown> = { ...parsed.data }
  if (data.checkIn) data.checkIn = new Date(data.checkIn as string)
  if (data.checkOut) data.checkOut = new Date(data.checkOut as string)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  // Fetch roomId before update for room status automation
  const existing = await p.booking.findUnique({
    where: { id: bookingId, hotelId },
    select: { roomId: true },
  })

  const booking = await p.booking.update({
    where: { id: bookingId, hotelId },
    data,
    include: { room: { select: { id: true, name: true, type: true } } },
  })

  // Auto-sync room status: CHECKED_IN → OCCUPIED, CHECKED_OUT/CANCELLED → AVAILABLE
  if (parsed.data.status && existing?.roomId) {
    const roomStatus =
      parsed.data.status === BookingStatus.CHECKED_IN ? RoomStatus.OCCUPIED :
      parsed.data.status === BookingStatus.CHECKED_OUT || parsed.data.status === BookingStatus.CANCELLED ? RoomStatus.AVAILABLE :
      null
    if (roomStatus) {
      await p.room.update({ where: { id: existing.roomId }, data: { status: roomStatus } })
    }
  }

  return NextResponse.json({ booking })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, bookingId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_DELETE_BOOKING.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).booking.delete({ where: { id: bookingId, hotelId } })
  return NextResponse.json({ message: 'Booking deleted' })
}
