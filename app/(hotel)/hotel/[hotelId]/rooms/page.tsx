'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Room } from '@/types'
import { ROOM_TYPES, RoomStatus as RS } from '@/lib/constants'
import { roomSchema, type RoomForm } from '@/lib/schemas'

export default function RoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editRoom, setEditRoom] = useState<Room | null>(null)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomForm>({ resolver: zodResolver(roomSchema) as any })

  const fetchRooms = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/rooms`)
    const data = await res.json()
    setRooms(data.rooms ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  function openCreate() {
    setEditRoom(null)
    reset({ name: '', type: 'Standard', price: undefined, capacity: undefined, status: RS.AVAILABLE })
    setShowForm(true)
  }

  function openEdit(room: Room) {
    setEditRoom(room)
    reset({
      name: room.name,
      type: room.type,
      price: Number(room.price),
      capacity: Number(room.capacity),
      status: room.status,
    })
    setShowForm(true)
  }

  function closeForm() {
    reset()
    setShowForm(false)
    setEditRoom(null)
  }

  async function onSave(data: RoomForm) {
    setSaving(true)
    const url = editRoom ? `/api/hotel/${hotelId}/rooms/${editRoom.id}` : `/api/hotel/${hotelId}/rooms`
    await fetch(url, {
      method: editRoom ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await fetchRooms()
    setSaving(false)
    closeForm()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this room?')) return
    await fetch(`/api/hotel/${hotelId}/rooms/${id}`, { method: 'DELETE' })
    fetchRooms()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Rooms"
        subtitle="Manage your hotel rooms"
        action={{ label: 'Add Room', onClick: openCreate }}
      />

      <Modal isOpen={showForm} onClose={closeForm} title={editRoom ? 'Edit Room' : 'Add Room'}>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <FormField label="Room Name" error={errors.name?.message}>
            <Input error={!!errors.name} {...register('name')} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type" error={errors.type?.message}>
              <Select error={!!errors.type} {...register('type')}>
                {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select {...register('status')}>
                <option value={RS.AVAILABLE}>Available</option>
                <option value={RS.OCCUPIED}>Occupied</option>
                <option value={RS.MAINTENANCE}>Maintenance</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price / night ($)" error={errors.price?.message}>
              <Input type="number" min="0" step="0.01" error={!!errors.price} {...register('price', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Capacity" error={errors.capacity?.message}>
              <Input type="number" min="1" error={!!errors.capacity} {...register('capacity', { valueAsNumber: true })} />
            </FormField>
          </div>

          <ModalFooter onCancel={closeForm} saving={saving} submitLabel="Save" />
        </form>
      </Modal>

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
              <p className="text-lg font-bold text-slate-900">
                ${Number(room.price).toFixed(2)}
                <span className="text-sm font-normal text-slate-400">/night</span>
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEdit(room)}
                  className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
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
