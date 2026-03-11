'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { Role } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomRow     = { id: string; name: string; type: string; capacity: number; price: number; status: string; description: string | null }
type BookingRow  = { id: string; guestName: string; guestPhone: string; checkIn: string; checkOut: string; status: string; room: { name: string } }
type StaffRow    = { id: string; name: string | null; email: string; role: string; createdAt: string }
type MenuRow     = { id: string; name: string; category: string; price: number; description: string | null }
type OrderRow    = { id: string; roomNumber: string; total: number; status: string; createdAt: string; items: { name: string; quantity: number }[] }

interface Props {
  hotelId: string
  role: Role
  sections: string[]
  rooms: RoomRow[]
  bookings: BookingRow[]
  staff: StaffRow[]
  menuItems: MenuRow[]
  orders: OrderRow[]
}

// ─── Tables ───────────────────────────────────────────────────────────────────

function RoomsTable({ rooms, hotelId, isKitchen }: { rooms: RoomRow[]; hotelId: string; isKitchen: boolean }) {
  if (!rooms.length) return <p className="px-5 py-4 text-sm text-slate-400">No rooms yet.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Room</th>
          <th className="px-5 py-3">Type</th>
          {!isKitchen && <th className="px-5 py-3">Capacity</th>}
          {!isKitchen && <th className="px-5 py-3">Price/night</th>}
          <th className="px-5 py-3">Status</th>
          {!isKitchen && <th className="px-5 py-3"></th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {rooms.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <td className="px-5 py-3">
              <p className="font-medium text-slate-900">{r.name}</p>
              {r.description && <p className="text-xs text-slate-400 truncate max-w-xs">{r.description}</p>}
            </td>
            <td className="px-5 py-3 text-slate-600">{r.type}</td>
            {!isKitchen && <td className="px-5 py-3 text-slate-600">{r.capacity} guests</td>}
            {!isKitchen && <td className="px-5 py-3 text-slate-600">${r.price.toFixed(2)}</td>}
            <td className="px-5 py-3"><Badge value={r.status} /></td>
            {!isKitchen && (
              <td className="px-5 py-3">
                <Link href={`/hotel/${hotelId}/rooms`} className="text-xs font-medium text-blue-600 hover:underline">
                  View all →
                </Link>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BookingsTable({ bookings, hotelId }: { bookings: BookingRow[]; hotelId: string }) {
  if (!bookings.length) return <p className="px-5 py-4 text-sm text-slate-400">No bookings yet.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Guest</th>
          <th className="px-5 py-3">Room</th>
          <th className="px-5 py-3">Check In</th>
          <th className="px-5 py-3">Check Out</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {bookings.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50">
            <td className="px-5 py-3">
              <p className="font-medium text-slate-900">{b.guestName}</p>
              <p className="text-xs text-slate-400">{b.guestPhone}</p>
            </td>
            <td className="px-5 py-3 text-slate-600">{b.room?.name}</td>
            <td className="px-5 py-3 text-slate-600">{new Date(b.checkIn).toLocaleDateString()}</td>
            <td className="px-5 py-3 text-slate-600">{new Date(b.checkOut).toLocaleDateString()}</td>
            <td className="px-5 py-3"><Badge value={b.status} /></td>
            <td className="px-5 py-3">
              <Link href={`/hotel/${hotelId}/bookings`} className="text-xs font-medium text-blue-600 hover:underline">
                Manage →
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StaffTable({ staff, hotelId }: { staff: StaffRow[]; hotelId: string }) {
  if (!staff.length) return <p className="px-5 py-4 text-sm text-slate-400">No staff members.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Email</th>
          <th className="px-5 py-3">Role</th>
          <th className="px-5 py-3">Joined</th>
          <th className="px-5 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {staff.map((m) => (
          <tr key={m.id} className="hover:bg-slate-50">
            <td className="px-5 py-3 font-medium text-slate-900">{m.name ?? '—'}</td>
            <td className="px-5 py-3 text-slate-600">{m.email}</td>
            <td className="px-5 py-3"><Badge value={m.role} /></td>
            <td className="px-5 py-3 text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</td>
            <td className="px-5 py-3">
              <Link href={`/hotel/${hotelId}/staff`} className="text-xs font-medium text-blue-600 hover:underline">
                Manage →
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function MenuTable({ items, hotelId }: { items: MenuRow[]; hotelId: string }) {
  if (!items.length) return <p className="px-5 py-4 text-sm text-slate-400">No menu items.</p>
  const grouped = items.reduce<Record<string, MenuRow[]>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})
  return (
    <div>
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat}>
          <p className="px-5 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-50">{cat}</p>
          {catItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-t border-slate-50 px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-900">${item.price.toFixed(2)}</p>
                <Link href={`/hotel/${hotelId}/menu`} className="text-xs font-medium text-blue-600 hover:underline">
                  Manage →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function OrdersTable({ orders, hotelId, isKitchen }: { orders: OrderRow[]; hotelId: string; isKitchen: boolean }) {
  if (!orders.length) return <p className="px-5 py-4 text-sm text-slate-400">No orders yet.</p>

  // Kitchen sees pending/preparing first
  const sorted = isKitchen
    ? [...orders].sort((a, b) => {
        const priority: Record<string, number> = { PENDING: 0, PREPARING: 1, SERVED: 2, CANCELLED: 3 }
        return (priority[a.status] ?? 9) - (priority[b.status] ?? 9)
      })
    : orders

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Room</th>
          <th className="px-5 py-3">Items</th>
          <th className="px-5 py-3">Total</th>
          <th className="px-5 py-3">{isKitchen ? 'Time' : 'Time'}</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {sorted.map((o) => (
          <tr
            key={o.id}
            className={
              isKitchen && o.status === 'PENDING'
                ? 'bg-orange-50 hover:bg-orange-100'
                : isKitchen && o.status === 'PREPARING'
                ? 'bg-blue-50 hover:bg-blue-100'
                : 'hover:bg-slate-50'
            }
          >
            <td className="px-5 py-3 font-semibold text-slate-900">Room {o.roomNumber}</td>
            <td className="px-5 py-3 text-slate-600 max-w-xs">
              {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
            </td>
            <td className="px-5 py-3 font-semibold text-slate-900">${o.total.toFixed(2)}</td>
            <td className="px-5 py-3 text-slate-500">{new Date(o.createdAt).toLocaleTimeString()}</td>
            <td className="px-5 py-3"><Badge value={o.status} /></td>
            <td className="px-5 py-3">
              <Link href={`/hotel/${hotelId}/orders`} className="text-xs font-medium text-blue-600 hover:underline">
                {isKitchen ? 'Process →' : 'Manage →'}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Section config ───────────────────────────────────────────────────────────

function getSectionConfig(
  key: string,
  props: Props,
) {
  const { hotelId, rooms, bookings, staff, menuItems, orders } = props
  const isKitchen = props.role === 'KITCHEN'

  const activeBookings = bookings.filter((b) => ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status))
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length
  const pendingOrders  = orders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING').length

  switch (key) {
    case 'rooms':
      return {
        title: isKitchen ? 'Rooms — Delivery Map' : 'Rooms',
        count: rooms.length,
        href: `/hotel/${hotelId}/rooms`,
        defaultOpen: isKitchen,
        badge: availableRooms > 0
          ? { label: `${availableRooms} available`, color: 'green' as const }
          : rooms.length > 0 ? { label: 'all occupied', color: 'red' as const } : undefined,
        children: <RoomsTable rooms={rooms} hotelId={hotelId} isKitchen={isKitchen} />,
      }
    case 'bookings':
      return {
        title: 'Bookings',
        count: bookings.length,
        href: `/hotel/${hotelId}/bookings`,
        badge: activeBookings.length > 0 ? { label: `${activeBookings.length} active`, color: 'blue' as const } : undefined,
        children: <BookingsTable bookings={activeBookings} hotelId={hotelId} />,
      }
    case 'staff':
      return {
        title: 'Staff',
        count: staff.length,
        href: `/hotel/${hotelId}/staff`,
        children: <StaffTable staff={staff} hotelId={hotelId} />,
      }
    case 'menu':
      return {
        title: 'Menu',
        count: menuItems.length,
        href: `/hotel/${hotelId}/menu`,
        children: <MenuTable items={menuItems} hotelId={hotelId} />,
      }
    case 'orders':
      return {
        title: isKitchen ? 'Orders — Kitchen Queue' : 'Orders',
        count: orders.length,
        href: `/hotel/${hotelId}/orders`,
        defaultOpen: isKitchen,
        badge: pendingOrders > 0 ? { label: `${pendingOrders} needs action`, color: 'yellow' as const } : undefined,
        children: <OrdersTable orders={orders} hotelId={hotelId} isKitchen={isKitchen} />,
      }
    default:
      return null
  }
}

// ─── Page subtitles per role ──────────────────────────────────────────────────

const ROLE_SUBTITLE: Record<Role, string> = {
  SUPER_ADMIN: 'Full platform visibility',
  OWNER:       'Full hotel visibility — rooms, bookings, staff, menu & orders',
  MANAGER:     'Hotel management overview — all sections',
  RECEPTIONIST:'Front desk overview — rooms & guest bookings',
  KITCHEN:     'Kitchen view — order queue & room delivery map',
}

// ─── Main client component ────────────────────────────────────────────────────

export function HotelOverviewClient(props: Props) {
  const { sections, role } = props

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">{ROLE_SUBTITLE[role]}</p>
      </div>

      <div className="space-y-4">
        {sections.map((key) => {
          const config = getSectionConfig(key, props)
          if (!config) return null
          return (
            <CollapsibleSection
              key={key}
              title={config.title}
              count={config.count}
              href={config.href}
              defaultOpen={config.defaultOpen}
              badge={config.badge}
            >
              {config.children}
            </CollapsibleSection>
          )
        })}
      </div>
    </div>
  )
}
