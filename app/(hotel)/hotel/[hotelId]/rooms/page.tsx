'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Room, RoomStatus } from '@/types'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family']

export default function RoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editRoom, setEditRoom] = useState<Room | null>(null)
  const [form, setForm] = useState({ name: '', type: 'Standard', price: '', capacity: '', status: 'AVAILABLE' as RoomStatus })
  const [saving, setSaving] = useState(false)

  const fetchRooms = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/rooms`)
    const data = await res.json()
    setRooms(data.rooms ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  function openCreate() {
    setEditRoom(null)
    setForm({ name: '', type: 'Standard', price: '', capacity: '', status: 'AVAILABLE' })
    setShowForm(true)
  }

  function openEdit(room: Room) {
    setEditRoom(room)
    setForm({ name: room.name, type: room.type, price: String(room.price), capacity: String(room.capacity), status: room.status })
    setShowForm(true)
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, type: form.type, price: Number(form.price), capacity: Number(form.capacity), status: form.status }

    if (editRoom) {
      await fetch(`/api/hotel/${hotelId}/rooms/${editRoom.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch(`/api/hotel/${hotelId}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    await fetchRooms()
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this room?')) return
    await fetch(`/api/hotel/${hotelId}/rooms/${id}`, { method: 'DELETE' })
    fetchRooms()
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your hotel rooms</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Room
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-bold text-slate-900">{editRoom ? 'Edit Room' : 'Add Room'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                    {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RoomStatus }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price / night ($)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Capacity</label>
                  <input type="number" min="1" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{room.name}</p>
                  <p className="text-sm text-slate-500">{room.type} · {room.capacity} guests</p>
                </div>
                <Badge value={room.status} />
              </div>
              <p className="text-lg font-bold text-slate-900">${Number(room.price).toFixed(2)}<span className="text-sm font-normal text-slate-400">/night</span></p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(room)}
                  className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  Edit
                </button>
                <button onClick={() => handleDelete(room.id)}
                  className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="col-span-3 py-10 text-center text-sm text-slate-400">No rooms yet. Add your first room.</p>
          )}
        </div>
      )}
    </div>
  )
}
