import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  capacity: z.number().int().positive().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
})

type Params = { params: Promise<{ hotelId: string; roomId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, roomId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room = await (prisma as any).room.update({
    where: { id: roomId, hotelId },
    data: parsed.data,
  })

  return NextResponse.json({ room })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, roomId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).room.delete({ where: { id: roomId, hotelId } })
  return NextResponse.json({ message: 'Room deleted' })
}
