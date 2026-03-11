import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ORDER_STATUSES } from '@/lib/constants'

const updateSchema = z.object({
  status: z.enum(ORDER_STATUSES as [string, ...string[]]),
})

type Params = { params: Promise<{ hotelId: string; orderId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, orderId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await (prisma as any).order.update({
    where: { id: orderId, hotelId },
    data: { status: parsed.data.status },
    include: { items: true },
  })

  return NextResponse.json({ order })
}
