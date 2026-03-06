import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']).optional(),
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
  const booking = await (prisma as any).booking.update({
    where: { id: bookingId, hotelId },
    data,
    include: { room: { select: { id: true, name: true, type: true } } },
  })

  return NextResponse.json({ booking })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, bookingId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).booking.delete({ where: { id: bookingId, hotelId } })
  return NextResponse.json({ message: 'Booking deleted' })
}
