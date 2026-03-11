import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CAN_MANAGE_BOOKINGS } from '@/lib/constants'

const createSchema = z.object({
  roomId: z.string().min(1),
  guestName: z.string().min(1),
  guestPhone: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookings = await (prisma as any).booking.findMany({
    where: { hotelId },
    include: { room: { select: { id: true, name: true, type: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ bookings })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_MANAGE_BOOKINGS.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { roomId, guestName, guestPhone, checkIn, checkOut } = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const booking = await (prisma as any).booking.create({
    data: {
      hotelId,
      roomId,
      guestName,
      guestPhone,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      status: 'PENDING',
    },
    include: { room: { select: { id: true, name: true, type: true } } },
  })

  return NextResponse.json({ booking }, { status: 201 })
}
