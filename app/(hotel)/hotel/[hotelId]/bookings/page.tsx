'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { Booking, BookingStatus, Room } from '@/types'

const DEFAULT_FORM = { roomId: '', guestName: '', guestPhone: '', checkIn: '', checkOut: '' }

const STATUS_FLOW: Record<BookingStatus, BookingStatus | null> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'CHECKED_IN',
  CHECKED_IN: 'CHECKED_OUT',
  CHECKED_OUT: null,
  CANCELLED: null,
}

export default function BookingsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [bookings, setBookings] = useState<(Booking & { room: { id: string; name: string; type: string } })[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)

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

  function closeForm() {
    setShowForm(false)
    setForm(DEFAULT_FORM)
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/hotel/${hotelId}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await fetchAll()
    setSaving(false)
    closeForm()
  }

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch(`/api/hotel/${hotelId}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Bookings"
        subtitle="Manage guest reservations"
        action={{ label: 'New Booking', onClick: () => setShowForm(true) }}
      />

      <Modal isOpen={showForm} onClose={closeForm} title="New Booking">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Room">
            <Select value={form.roomId} onChange={(e) => set('roomId', e.target.value)} required>
              <option value="">Select a room</option>
              {rooms.filter((r) => r.status === 'AVAILABLE').map((r) => (
                <option key={r.id} value={r.id}>{r.name} — ${Number(r.price)}/night</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Guest Name">
            <Input value={form.guestName} onChange={(e) => set('guestName', e.target.value)} required />
          </FormField>

          <FormField label="Guest Phone">
            <Input value={form.guestPhone} onChange={(e) => set('guestPhone', e.target.value)} required />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Check In">
              <Input type="date" value={form.checkIn} onChange={(e) => set('checkIn', e.target.value)} required />
            </FormField>
            <FormField label="Check Out">
              <Input type="date" value={form.checkOut} onChange={(e) => set('checkOut', e.target.value)} required />
            </FormField>
          </div>

          <ModalFooter onCancel={closeForm} saving={saving} submitLabel="Create" />
        </form>
      </Modal>

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
                const next = STATUS_FLOW[b.status]
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
                          <button
                            onClick={() => updateStatus(b.id, next)}
                            className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                          >
                            → {next.replace('_', ' ')}
                          </button>
                        )}
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(b.id, 'CANCELLED')}
                            className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                          >
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
