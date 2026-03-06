import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  price: z.number().positive(),
  capacity: z.number().int().positive(),
  images: z.array(z.string()).default([]),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).default('AVAILABLE'),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rooms = await (prisma as any).room.findMany({
    where: { hotelId },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ rooms })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room = await (prisma as any).room.create({
    data: { ...parsed.data, hotelId },
  })

  return NextResponse.json({ room }, { status: 201 })
}
