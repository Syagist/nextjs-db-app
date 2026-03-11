'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Booking, BookingStatus, Room } from '@/types'
import { BOOKING_STATUSES, BOOKING_STATUS_FLOW, BookingStatus as BS, RoomStatus } from '@/lib/constants'

const DEFAULT_FORM = { roomId: '', guestName: '', guestPhone: '', checkIn: '', checkOut: '' }

const ALL_STATUSES = BOOKING_STATUSES

const ALL_ACTIONS = ['Confirm', 'Check In', 'Check Out', 'Cancel'] as const
type ActionLabel = typeof ALL_ACTIONS[number]

const STATUS_FLOW = BOOKING_STATUS_FLOW

// Map next-status → button label
const ACTION_LABEL: Partial<Record<BookingStatus, ActionLabel>> = {
  [BS.CONFIRMED]: 'Confirm',
  [BS.CHECKED_IN]: 'Check In',
  [BS.CHECKED_OUT]: 'Check Out',
}

// Map action label → statuses that have that action available
const ACTION_STATUS_MAP: Record<ActionLabel, BookingStatus[]> = {
  'Confirm':   [BS.PENDING],
  'Check In':  [BS.CONFIRMED],
  'Check Out': [BS.CHECKED_IN],
  'Cancel':    [BS.PENDING],
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

interface Filters {
  guest: string
  roomId: string
  checkInToday: boolean
  checkOutToday: boolean
  statuses: Set<BookingStatus>
  actions: Set<ActionLabel>
}

const DEFAULT_FILTERS: Filters = {
  guest: '',
  roomId: '',
  checkInToday: false,
  checkOutToday: false,
  statuses: new Set(),
  actions: new Set(),
}

function isToday(dateStr: string | Date) {
  const d = new Date(dateStr)
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

interface FilterBarProps {
  filters: Filters
  rooms: Room[]
  onChange: (f: Filters) => void
  onReset: () => void
  activeCount: number
}

function FilterBar({ filters, rooms, onChange, onReset, activeCount }: FilterBarProps) {
  function toggleAction(a: ActionLabel) {
    const next = new Set(filters.actions)
    next.has(a) ? next.delete(a) : next.add(a)
    onChange({ ...filters, actions: next })
  }

  return (
    <div className="mb-4 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-end gap-4 px-5 py-4">

        {/* Guest search */}
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Guest</label>
          <div className="relative">
            <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 2a4 4 0 100 8A4 4 0 006 2zM0 6a6 6 0 1110.89 3.477l4.817 4.816a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 010 6z" />
            </svg>
            <input
              type="text"
              placeholder="Search guest…"
              value={filters.guest}
              onChange={(e) => onChange({ ...filters, guest: e.target.value })}
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Room select */}
        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-slate-500">Room</label>
          <select
            value={filters.roomId}
            onChange={(e) => onChange({ ...filters, roomId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 py-1.5 px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Dates checkboxes */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Dates</label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.checkInToday}
                onChange={(e) => onChange({ ...filters, checkInToday: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
              />
              Check-in today
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.checkOutToday}
                onChange={(e) => onChange({ ...filters, checkOutToday: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
              />
              Check-out today
            </label>
          </div>
        </div>

        {/* Status radio group */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ALL_STATUSES.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="radio"
                  name="booking-status-filter"
                  checked={filters.statuses.size === 1 && filters.statuses.has(s)}
                  onChange={() => onChange({ ...filters, statuses: new Set([s]) })}
                  className="h-3.5 w-3.5 accent-blue-600"
                />
                {s.replace('_', ' ')}
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-400">
              <input
                type="radio"
                name="booking-status-filter"
                checked={filters.statuses.size === 0}
                onChange={() => onChange({ ...filters, statuses: new Set() })}
                className="h-3.5 w-3.5 accent-blue-600"
              />
              All
            </label>
          </div>
        </div>

        {/* Action checkboxes */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Action</label>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ALL_ACTIONS.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.actions.has(a)}
                  onChange={() => toggleAction(a)}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="self-end rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            Reset ({activeCount})
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [bookings, setBookings] = useState<(Booking & { room: { id: string; name: string; type: string } })[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

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

  function setField<K extends keyof typeof form>(key: K, value: string) {
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

  // Count active filters for the reset badge
  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.guest) n++
    if (filters.roomId) n++
    if (filters.checkInToday) n++
    if (filters.checkOutToday) n++
    if (filters.statuses.size) n++
    if (filters.actions.size) n++
    return n
  }, [filters])

  // Apply all filters
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filters.guest && !b.guestName.toLowerCase().includes(filters.guest.toLowerCase())) return false
      if (filters.roomId && b.room?.id !== filters.roomId) return false
      if (filters.checkInToday && !isToday(b.checkIn)) return false
      if (filters.checkOutToday && !isToday(b.checkOut)) return false
      if (filters.statuses.size && !filters.statuses.has(b.status)) return false
      if (filters.actions.size) {
        // Booking must have at least one of the selected actions available
        const hasAction = [...filters.actions].some((a) => {
          const requiredStatuses = ACTION_STATUS_MAP[a]
          return requiredStatuses.includes(b.status)
        })
        if (!hasAction) return false
      }
      return true
    })
  }, [bookings, filters])

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
            <Select value={form.roomId} onChange={(e) => setField('roomId', e.target.value)} required>
              <option value="">Select a room</option>
              {rooms.filter((r) => r.status === RoomStatus.AVAILABLE).map((r) => (
                <option key={r.id} value={r.id}>{r.name} — ${Number(r.price)}/night</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Guest Name">
            <Input value={form.guestName} onChange={(e) => setField('guestName', e.target.value)} required />
          </FormField>

          <FormField label="Guest Phone">
            <Input value={form.guestPhone} onChange={(e) => setField('guestPhone', e.target.value)} required />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Check In">
              <Input type="date" value={form.checkIn} onChange={(e) => setField('checkIn', e.target.value)} required />
            </FormField>
            <FormField label="Check Out">
              <Input type="date" value={form.checkOut} onChange={(e) => setField('checkOut', e.target.value)} required />
            </FormField>
          </div>

          <ModalFooter onCancel={closeForm} saving={saving} submitLabel="Create" />
        </form>
      </Modal>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        rooms={rooms}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        activeCount={activeFilterCount}
      />

      {/* Results summary */}
      {activeFilterCount > 0 && (
        <p className="mb-3 text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filtered.length}</span> of {bookings.length} bookings
        </p>
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
              {filtered.map((b) => {
                const next = STATUS_FLOW[b.status]
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{b.guestName}</p>
                      <p className="text-xs text-slate-400">{b.guestPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.room?.name}</td>
                    <td className={`px-6 py-4 ${isToday(b.checkIn) ? 'font-semibold text-blue-700' : 'text-slate-600'}`}>
                      {new Date(b.checkIn).toLocaleDateString()}
                      {isToday(b.checkIn) && <span className="ml-1 text-xs font-normal text-blue-500">today</span>}
                    </td>
                    <td className={`px-6 py-4 ${isToday(b.checkOut) ? 'font-semibold text-orange-700' : 'text-slate-600'}`}>
                      {new Date(b.checkOut).toLocaleDateString()}
                      {isToday(b.checkOut) && <span className="ml-1 text-xs font-normal text-orange-500">today</span>}
                    </td>
                    <td className="px-6 py-4"><Badge value={b.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {next && (
                          <button
                            onClick={() => updateStatus(b.id, next)}
                            className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                          >
                            {ACTION_LABEL[next] ?? next.replace('_', ' ')}
                          </button>
                        )}
                        {b.status === BS.PENDING && (
                          <button
                            onClick={() => updateStatus(b.id, BS.CANCELLED)}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    {activeFilterCount > 0 ? 'No bookings match your filters.' : 'No bookings yet.'}
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
