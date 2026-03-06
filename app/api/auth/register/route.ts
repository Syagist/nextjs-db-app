import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { TokenPayload } from '@/types'

const registerSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  hotelName: z.string().min(1, 'Hotel name is required'),
  hotelLocation: z.string().min(1, 'Hotel location is required'),
  hotelDescription: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, password, name, hotelName, hotelLocation, hotelDescription } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (prisma as any).$transaction(async (tx: any) => {
      const newHotel = await tx.hotel.create({
        data: {
          name: hotelName,
          location: hotelLocation,
          description: hotelDescription ?? null,
          status: 'PENDING',
        },
      })

      const newUser = await tx.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: 'OWNER',
          hotelId: newHotel.id,
        },
      })

      return { user: newUser, hotel: newHotel }
    })

    const { user, hotel } = result

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: 'OWNER',
      hotelId: hotel.id,
      name: user.name ?? null,
    }

    const token = await signToken(payload)

    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name, role: 'OWNER', hotelId: hotel.id } },
      { status: 201 },
    )

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
