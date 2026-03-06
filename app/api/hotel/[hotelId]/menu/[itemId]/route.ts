import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
})

type Params = { params: Promise<{ hotelId: string; itemId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, itemId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'KITCHEN', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = await (prisma as any).menuItem.update({
    where: { id: itemId, hotelId },
    data: parsed.data,
  })

  return NextResponse.json({ item })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, itemId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!['OWNER', 'MANAGER', 'KITCHEN', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).menuItem.delete({ where: { id: itemId, hotelId } })
  return NextResponse.json({ message: 'Menu item deleted' })
}
