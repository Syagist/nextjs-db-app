import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HotelStatus } from '@/lib/constants'

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotels = await (prisma as any).hotel.findMany({
    where: { status: HotelStatus.APPROVED },
    select: {
      id: true,
      name: true,
      location: true,
      description: true,
      status: true,
      createdAt: true,
      _count: { select: { rooms: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ hotels })
}
