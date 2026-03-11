'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { MenuItem } from '@/types'
import { MENU_CATEGORIES } from '@/lib/constants'

const CATEGORIES = MENU_CATEGORIES

const DEFAULT_FORM = { name: '', price: '', category: 'Breakfast' }

export default function MenuPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/menu`)
    const data = await res.json()
    setItems(data.items ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setEditItem(null)
    setForm(DEFAULT_FORM)
    setShowForm(true)
  }

  function openEdit(item: MenuItem) {
    setEditItem(item)
    setForm({ name: item.name, price: String(item.price), category: item.category })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditItem(null)
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, price: Number(form.price), category: form.category }
    const url = editItem ? `/api/hotel/${hotelId}/menu/${editItem.id}` : `/api/hotel/${hotelId}/menu`
    await fetch(url, {
      method: editItem ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

  const grouped = CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, cat) => {
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
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Item Name">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price ($)">
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required />
            </FormField>
            <FormField label="Category">
              <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
