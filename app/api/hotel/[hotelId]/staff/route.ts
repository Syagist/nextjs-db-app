import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { verifyRequestToken, hasHotelAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CAN_VIEW_STAFF, CAN_MANAGE_STAFF, ASSIGNABLE_ROLES, Role } from '@/lib/constants'

const createSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_VIEW_STAFF.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staff = await (prisma as any).user.findMany({
    where: { hotelId, role: { not: Role.SUPER_ADMIN } },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ staff })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const payload = await verifyRequestToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { hotelId } = await params
  if (!hasHotelAccess(payload, hotelId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!CAN_MANAGE_STAFF.includes(payload.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const member = await (prisma as any).user.create({
    data: {
      email: parsed.data.email,
      password: hashed,
      name: parsed.data.name,
      role: parsed.data.role,
      hotelId,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json({ member }, { status: 201 })
}
