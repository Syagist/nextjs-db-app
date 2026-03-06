'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { MenuItem } from '@/types'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Snacks', 'Desserts']

export default function MenuPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', category: 'Breakfast' })

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/menu`)
    const data = await res.json()
    setItems(data.items ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', price: '', category: 'Breakfast' })
    setShowForm(true)
  }

  function openEdit(item: MenuItem) {
    setEditItem(item)
    setForm({ name: item.name, price: String(item.price), category: item.category })
    setShowForm(true)
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, price: Number(form.price), category: form.category }

    if (editItem) {
      await fetch(`/api/hotel/${hotelId}/menu/${editItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch(`/api/hotel/${hotelId}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    await fetchItems()
    setShowForm(false)
    setSaving(false)
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu</h1>
          <p className="mt-1 text-sm text-slate-500">Manage in-room dining menu</p>
        </div>
        <button onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-bold text-slate-900">{editItem ? 'Edit Item' : 'Add Menu Item'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Item Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
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
                      <button onClick={() => openEdit(item)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">Edit</button>
                      <button onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
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
