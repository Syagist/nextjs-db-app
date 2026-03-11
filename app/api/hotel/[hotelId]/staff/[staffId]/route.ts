import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CAN_MANAGE_STAFF, ASSIGNABLE_ROLES } from '@/lib/constants'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]).optional(),
})

type Params = { params: Promise<{ hotelId: string; staffId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, staffId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_MANAGE_STAFF.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const member = await (prisma as any).user.update({
    where: { id: staffId, hotelId },
    data: parsed.data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json({ member })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId, staffId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_MANAGE_STAFF.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).user.delete({ where: { id: staffId, hotelId } })
  return NextResponse.json({ message: 'Staff member removed' })
}
