import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { HotelStatus, RoomStatus, BookingStatus } from '@/lib/constants'

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  guestName: z.string().min(2, 'Guest name is required'),
  guestPhone: z.string().min(5, 'Phone number is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const body = await req.json()

    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { roomId, guestName, guestPhone, checkIn, checkOut } = parsed.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = prisma as any

    const hotel = await p.hotel.findUnique({
      where: { slug, status: HotelStatus.APPROVED },
      select: { id: true },
    })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const room = await p.room.findUnique({
      where: { id: roomId, hotelId: hotel.id },
      select: { id: true, status: true },
    })
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    if (room.status !== RoomStatus.AVAILABLE) {
      return NextResponse.json({ error: 'Room is not available' }, { status: 409 })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
    }
    if (checkInDate < new Date()) {
      return NextResponse.json({ error: 'Check-in date must be in the future' }, { status: 400 })
    }

    const booking = await p.booking.create({
      data: {
        hotelId: hotel.id,
        roomId,
        guestName,
        guestPhone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: BookingStatus.PENDING,
      },
    })

    return NextResponse.json({ booking, message: 'Booking request submitted successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
