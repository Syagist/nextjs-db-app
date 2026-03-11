import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CAN_MANAGE_MENU } from '@/lib/constants'

const createSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = await (prisma as any).menuItem.findMany({
    where: { hotelId },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ items })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_MANAGE_MENU.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = await (prisma as any).menuItem.create({
    data: { ...parsed.data, hotelId },
  })

  return NextResponse.json({ item }, { status: 201 })
}
