import { getTokenFromCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/types'
import { HotelOverviewClient } from '@/components/hotel/HotelOverviewClient'
import { Role as RoleConst } from '@/lib/constants'

// Role → which sections to show
const ROLE_SECTIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['rooms', 'bookings', 'staff', 'menu', 'orders'],
  OWNER:       ['rooms', 'bookings', 'staff', 'menu', 'orders'],
  MANAGER:     ['rooms', 'bookings', 'staff', 'menu', 'orders'],
  RECEPTIONIST:['rooms', 'bookings'],
  KITCHEN:     ['orders', 'rooms'],
}

async function getOverviewData(hotelId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  const [rooms, bookings, staff, menuItems, orders] = await Promise.all([
    p.room.findMany({
      where: { hotelId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, type: true, capacity: true, price: true, status: true, description: true },
    }),
    p.booking.findMany({
      where: { hotelId },
      orderBy: { checkIn: 'desc' },
      take: 50,
      include: { room: { select: { name: true } } },
    }),
    p.user.findMany({
      where: { hotelId, role: { not: RoleConst.SUPER_ADMIN } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    p.menuItem.findMany({
      where: { hotelId },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, category: true, price: true, description: true },
    }),
    p.order.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        items: { select: { name: true, quantity: true } },
      },
    }),
  ])

  return {
    rooms: rooms.map((r: { price: unknown; [key: string]: unknown }) => ({ ...r, price: Number(r.price) })),
    bookings: bookings.map((b: { checkIn: Date; checkOut: Date; [key: string]: unknown }) => ({
      ...b,
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
    })),
    staff,
    menuItems: menuItems.map((m: { price: unknown; [key: string]: unknown }) => ({
      ...m,
      price: Number(m.price),
    })),
    orders: orders.map((o: {
      total: unknown
      createdAt: Date
      items: Array<{ name: string; quantity: number }>
      [key: string]: unknown
    }) => ({
      ...o,
      total: Number(o.total),
      createdAt: o.createdAt.toISOString(),
    })),
  }
}

export default async function HotelOverviewPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params
  const payload = await getTokenFromCookies()
  const role = (payload?.role ?? RoleConst.RECEPTIONIST) as Role
  const sections = ROLE_SECTIONS[role] ?? ['rooms']

  const data = await getOverviewData(hotelId)

  return (
    <HotelOverviewClient
      hotelId={hotelId}
      role={role}
      sections={sections}
      rooms={data.rooms}
      bookings={data.bookings}
      staff={data.staff}
      menuItems={data.menuItems}
      orders={data.orders}
    />
  )
}
