import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRequestToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = await (prisma as any).hotel.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, email: true, name: true, role: true, createdAt: true } },
      _count: { select: { rooms: true, bookings: true } },
    },
  })

  if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  return NextResponse.json({ hotel })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = await (prisma as any).hotel.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json({ hotel })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).hotel.delete({ where: { id } })
  return NextResponse.json({ message: 'Hotel deleted' })
}
