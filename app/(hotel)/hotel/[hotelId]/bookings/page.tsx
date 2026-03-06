'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Booking, BookingStatus, Room } from '@/types'

export default function BookingsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [bookings, setBookings] = useState<(Booking & { room: { id: string; name: string; type: string } })[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ roomId: '', guestName: '', guestPhone: '', checkIn: '', checkOut: '' })

  const fetchAll = useCallback(async () => {
    const [b, r] = await Promise.all([
      fetch(`/api/hotel/${hotelId}/bookings`).then((res) => res.json()),
      fetch(`/api/hotel/${hotelId}/rooms`).then((res) => res.json()),
    ])
    setBookings(b.bookings ?? [])
    setRooms(r.rooms ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/hotel/${hotelId}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await fetchAll()
    setShowForm(false)
    setSaving(false)
    setForm({ roomId: '', guestName: '', guestPhone: '', checkIn: '', checkOut: '' })
  }

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch(`/api/hotel/${hotelId}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  const statusFlow: Record<BookingStatus, BookingStatus | null> = {
    PENDING: 'CONFIRMED',
    CONFIRMED: 'CHECKED_IN',
    CHECKED_IN: 'CHECKED_OUT',
    CHECKED_OUT: null,
    CANCELLED: null,
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage guest reservations</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-bold text-slate-900">New Booking</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room</label>
                <select value={form.roomId} onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="">Select a room</option>
                  {rooms.filter((r) => r.status === 'AVAILABLE').map((r) => (
                    <option key={r.id} value={r.id}>{r.name} — ${Number(r.price)}/night</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Guest Name</label>
                <input value={form.guestName} onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Guest Phone</label>
                <input value={form.guestPhone} onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Check In</label>
                  <input type="date" value={form.checkIn} onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))} required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Check Out</label>
                  <input type="date" value={form.checkOut} onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))} required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((b) => {
                const next = statusFlow[b.status]
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{b.guestName}</p>
                      <p className="text-xs text-slate-400">{b.guestPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.room?.name}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><Badge value={b.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {next && (
                          <button onClick={() => updateStatus(b.id, next)}
                            className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200">
                            → {next.replace('_', ' ')}
                          </button>
                        )}
                        {b.status === 'PENDING' && (
                          <button onClick={() => updateStatus(b.id, 'CANCELLED')}
                            className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {bookings.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
