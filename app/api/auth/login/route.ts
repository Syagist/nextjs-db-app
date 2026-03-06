import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { TokenPayload, Role } from '@/types'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, password } = parsed.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await prisma.user.findUnique({ where: { email } }) as any
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
      hotelId: user.hotelId ?? null,
      name: user.name ?? null,
    }

    const token = await signToken(payload)

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, hotelId: user.hotelId },
    })

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
