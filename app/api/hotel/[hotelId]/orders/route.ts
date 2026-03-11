import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@/lib/constants'

const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
})

const createSchema = z.object({
  roomNumber: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders = await (prisma as any).order.findMany({
    where: { hotelId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { roomNumber, items } = parsed.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  // Fetch menu items to get prices and names
  const menuItemIds = items.map((i) => i.menuItemId)
  const menuItems = await p.menuItem.findMany({
    where: { id: { in: menuItemIds }, hotelId },
  })

  if (menuItems.length !== menuItemIds.length) {
    return NextResponse.json({ error: 'One or more menu items not found' }, { status: 400 })
  }

  const menuItemMap = new Map(menuItems.map((m: { id: string; name: string; price: number }) => [m.id, m]))

  let total = 0
  const orderItems = items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId) as { id: string; name: string; price: number }
    const lineTotal = Number(menuItem.price) * item.quantity
    total += lineTotal
    return {
      menuItemId: item.menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    }
  })

  const order = await p.order.create({
    data: {
      hotelId,
      roomNumber,
      total,
      status: OrderStatus.PENDING,
      items: { create: orderItems },
    },
    include: { items: true },
  })

  return NextResponse.json({ order }, { status: 201 })
}
