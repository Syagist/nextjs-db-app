'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { MenuItem } from '@/types'
import { MENU_CATEGORIES } from '@/lib/constants'
import { menuItemSchema, type MenuItemForm } from '@/lib/schemas'

export default function MenuPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemForm>({ resolver: zodResolver(menuItemSchema) as any })

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/menu`)
    const data = await res.json()
    setItems(data.items ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setEditItem(null)
    reset({ name: '', price: undefined, category: 'Breakfast' })
    setShowForm(true)
  }

  function openEdit(item: MenuItem) {
    setEditItem(item)
    reset({ name: item.name, price: Number(item.price), category: item.category })
    setShowForm(true)
  }

  function closeForm() {
    reset()
    setShowForm(false)
    setEditItem(null)
  }

  async function onSave(data: MenuItemForm) {
    setSaving(true)
    const url = editItem ? `/api/hotel/${hotelId}/menu/${editItem.id}` : `/api/hotel/${hotelId}/menu`
    await fetch(url, {
      method: editItem ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await fetchItems()
    setSaving(false)
    closeForm()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this menu item?')) return
    await fetch(`/api/hotel/${hotelId}/menu/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const grouped = MENU_CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})

  return (
    <div className="p-8">
      <PageHeader
        title="Menu"
        subtitle="Manage in-room dining menu"
        action={{ label: 'Add Item', onClick: openCreate }}
      />

      <Modal isOpen={showForm} onClose={closeForm} title={editItem ? 'Edit Item' : 'Add Menu Item'} width="sm">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <FormField label="Item Name" error={errors.name?.message}>
            <Input error={!!errors.name} {...register('name')} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price ($)" error={errors.price?.message}>
              <Input type="number" min="0" step="0.01" error={!!errors.price} {...register('price', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Category" error={errors.category?.message}>
              <Select error={!!errors.category} {...register('category')}>
                {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </FormField>
          </div>

          <ModalFooter onCancel={closeForm} saving={saving} submitLabel="Save" />
        </form>
      </Modal>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{category}</h2>
              <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 divide-y divide-slate-50">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-slate-900">${Number(item.price).toFixed(2)}</p>
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">No menu items yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
