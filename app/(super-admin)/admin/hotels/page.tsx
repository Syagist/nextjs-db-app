'use client'

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { HotelStatus } from '@/types'

interface Hotel {
  id: string
  name: string
  location: string
  description: string | null
  status: HotelStatus
  createdAt: string
  _count: { users: number; rooms: number; bookings: number }
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchHotels = useCallback(async () => {
    const res = await fetch('/api/admin/hotels')
    const data = await res.json()
    setHotels(data.hotels ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchHotels() }, [fetchHotels])

  async function updateStatus(id: string, status: HotelStatus) {
    setUpdating(id)
    await fetch(`/api/admin/hotels/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchHotels()
    setUpdating(null)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hotel Management</h1>
        <p className="mt-1 text-sm text-slate-500">Approve or reject hotel registrations</p>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Hotel</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4">Rooms</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{hotel.name}</p>
                    <p className="text-xs text-slate-400">{hotel.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{hotel.location}</td>
                  <td className="px-6 py-4 text-slate-600">{hotel._count.users}</td>
                  <td className="px-6 py-4 text-slate-600">{hotel._count.rooms}</td>
                  <td className="px-6 py-4 text-slate-600">{hotel._count.bookings}</td>
                  <td className="px-6 py-4">
                    <Badge value={hotel.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {hotel.status !== 'APPROVED' && (
                        <button
                          onClick={() => updateStatus(hotel.id, 'APPROVED')}
                          disabled={updating === hotel.id}
                          className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 transition hover:bg-green-200 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {hotel.status !== 'REJECTED' && (
                        <button
                          onClick={() => updateStatus(hotel.id, 'REJECTED')}
                          disabled={updating === hotel.id}
                          className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                      {hotel.status !== 'PENDING' && (
                        <button
                          onClick={() => updateStatus(hotel.id, 'PENDING')}
                          disabled={updating === hotel.id}
                          className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition hover:bg-yellow-200 disabled:opacity-50"
                        >
                          Pending
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No hotels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
