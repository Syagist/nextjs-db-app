'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { RoomStatus, OrderStatus, HotelStatus } from '@/lib/constants'

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomRow = { id: string; name: string; type: string; capacity: number; price: number; status: string }
type BookingRow = { id: string; guestName: string; guestPhone: string; checkIn: string; checkOut: string; status: string; room: { name: string } }
type StaffRow = { id: string; name: string | null; email: string; role: string; createdAt: string }
type OrderRow = { id: string; roomNumber: string; total: number; status: string; createdAt: string; items: { name: string; quantity: number }[] }

type HotelOverview = {
  id: string
  name: string
  slug: string
  location: string
  status: string
  description: string | null
  rooms: RoomRow[]
  bookings: BookingRow[]
  users: StaffRow[]
  orders: OrderRow[]
}

// ─── Sub-tables ───────────────────────────────────────────────────────────────

function RoomsTable({ rooms }: { rooms: RoomRow[] }) {
  if (!rooms.length) return <p className="px-5 py-4 text-sm text-slate-400">No rooms yet.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Type</th>
          <th className="px-5 py-3">Capacity</th>
          <th className="px-5 py-3">Price/night</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {rooms.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <td className="px-5 py-3 font-medium text-slate-900">{r.name}</td>
            <td className="px-5 py-3 text-slate-600">{r.type}</td>
            <td className="px-5 py-3 text-slate-600">{r.capacity}</td>
            <td className="px-5 py-3 text-slate-600">${Number(r.price).toFixed(2)}</td>
            <td className="px-5 py-3"><Badge value={r.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  if (!bookings.length) return <p className="px-5 py-4 text-sm text-slate-400">No active bookings.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Guest</th>
          <th className="px-5 py-3">Room</th>
          <th className="px-5 py-3">Check In</th>
          <th className="px-5 py-3">Check Out</th>
          <th className="px-5 py-3">Status</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StaffTable({ staff }: { staff: StaffRow[] }) {
  if (!staff.length) return <p className="px-5 py-4 text-sm text-slate-400">No staff members.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Email</th>
          <th className="px-5 py-3">Role</th>
          <th className="px-5 py-3">Joined</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {staff.map((m) => (
          <tr key={m.id} className="hover:bg-slate-50">
            <td className="px-5 py-3 font-medium text-slate-900">{m.name ?? '—'}</td>
            <td className="px-5 py-3 text-slate-600">{m.email}</td>
            <td className="px-5 py-3"><Badge value={m.role} /></td>
            <td className="px-5 py-3 text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (!orders.length) return <p className="px-5 py-4 text-sm text-slate-400">No orders yet.</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
          <th className="px-5 py-3">Room</th>
          <th className="px-5 py-3">Items</th>
          <th className="px-5 py-3">Total</th>
          <th className="px-5 py-3">Time</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {orders.map((o) => (
          <tr key={o.id} className="hover:bg-slate-50">
            <td className="px-5 py-3 font-medium text-slate-900">Room {o.roomNumber}</td>
            <td className="px-5 py-3 text-slate-600">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</td>
            <td className="px-5 py-3 font-semibold text-slate-900">${Number(o.total).toFixed(2)}</td>
            <td className="px-5 py-3 text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
            <td className="px-5 py-3"><Badge value={o.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Hotel card ───────────────────────────────────────────────────────────────

function HotelCard({ hotel }: { hotel: HotelOverview }) {
  const [open, setOpen] = useState(false)
  const availableRooms = hotel.rooms.filter((r) => r.status === RoomStatus.AVAILABLE).length
  const activeOrders = hotel.orders.filter((o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PREPARING).length

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Hotel header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 010-1.06z" />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{hotel.name}</p>
          <p className="text-xs text-slate-500">{hotel.location}</p>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <span className="text-slate-500"><span className="font-semibold text-slate-900">{availableRooms}/{hotel.rooms.length}</span> rooms free</span>
          <span className="text-slate-500"><span className="font-semibold text-slate-900">{hotel.bookings.length}</span> active bookings</span>
          {activeOrders > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 font-semibold text-orange-700">{activeOrders} pending orders</span>
          )}
        </div>

        <Badge value={hotel.status} />

        <Link
          href={`/admin/hotels`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs font-medium text-blue-600 hover:underline"
        >
          Manage
        </Link>
      </button>

      {/* Sections */}
      {open && (
        <div className="border-t border-slate-100 space-y-3 p-4">
          <CollapsibleSection
            title="Rooms"
            count={hotel.rooms.length}
            href={hotel.status === HotelStatus.APPROVED ? undefined : undefined}
            badge={availableRooms > 0 ? { label: `${availableRooms} available`, color: 'green' } : { label: 'all occupied', color: 'red' }}
          >
            <RoomsTable rooms={hotel.rooms} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Active Bookings"
            count={hotel.bookings.length}
            badge={hotel.bookings.length > 0 ? { label: 'live', color: 'blue' } : undefined}
          >
            <BookingsTable bookings={hotel.bookings} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Staff"
            count={hotel.users.length}
          >
            <StaffTable staff={hotel.users} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Recent Orders"
            count={hotel.orders.length}
            badge={activeOrders > 0 ? { label: `${activeOrders} needs action`, color: 'yellow' } : undefined}
          >
            <OrdersTable orders={hotel.orders} />
          </CollapsibleSection>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [hotels, setHotels] = useState<HotelOverview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((d) => {
        setHotels(d.hotels ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Expand any hotel to inspect its rooms, bookings, staff, and orders.
        </p>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {hotels.length === 0 && (
            <p className="py-16 text-center text-sm text-slate-400">No hotels registered yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
