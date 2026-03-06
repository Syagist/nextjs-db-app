'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Order, OrderStatus, MenuItem } from '@/types'

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  PENDING: 'PREPARING',
  PREPARING: 'SERVED',
  SERVED: null,
  CANCELLED: null,
}

export default function OrdersPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [roomNumber, setRoomNumber] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ menuItemId: string; quantity: number }[]>([])

  const fetchAll = useCallback(async () => {
    const [o, m] = await Promise.all([
      fetch(`/api/hotel/${hotelId}/orders`).then((r) => r.json()),
      fetch(`/api/hotel/${hotelId}/menu`).then((r) => r.json()),
    ])
    setOrders(o.orders ?? [])
    setMenuItems(m.items ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchAll() }, [fetchAll])

  function toggleItem(menuItemId: string) {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItemId)
      if (existing) return prev.filter((i) => i.menuItemId !== menuItemId)
      return [...prev, { menuItemId, quantity: 1 }]
    })
  }

  function setQty(menuItemId: string, qty: number) {
    setSelectedItems((prev) => prev.map((i) => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
  }

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!selectedItems.length) return
    setSaving(true)
    await fetch(`/api/hotel/${hotelId}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber, items: selectedItems }),
    })
    await fetchAll()
    setShowForm(false)
    setSaving(false)
    setRoomNumber('')
    setSelectedItems([])
  }

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/hotel/${hotelId}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">In-room dining orders</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          New Order
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-bold text-slate-900">New Room Order</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room Number</label>
                <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required placeholder="e.g. 201"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Select Items</label>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                  {menuItems.map((item) => {
                    const sel = selectedItems.find((i) => i.menuItemId === item.id)
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <input type="checkbox" checked={!!sel} onChange={() => toggleItem(item.id)}
                          className="h-4 w-4 rounded border-slate-300" />
                        <span className="flex-1 text-sm text-slate-700">{item.name}</span>
                        <span className="text-sm font-medium text-slate-500">${Number(item.price).toFixed(2)}</span>
                        {sel && (
                          <input type="number" min={1} value={sel.quantity} onChange={(e) => setQty(item.id, Number(e.target.value))}
                            className="w-16 rounded border border-slate-200 px-2 py-1 text-sm text-center outline-none focus:border-blue-500" />
                        )}
                      </div>
                    )
                  })}
                  {menuItems.length === 0 && <p className="py-2 text-center text-sm text-slate-400">No menu items available.</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving || !selectedItems.length}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Placing...' : 'Place Order'}
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
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => {
                const next = STATUS_FLOW[order.status]
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Room {order.roomNumber}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ') ?? '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td className="px-6 py-4"><Badge value={order.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {next && (
                          <button onClick={() => updateStatus(order.id, next)}
                            className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200">
                            → {next}
                          </button>
                        )}
                        {order.status === 'PENDING' && (
                          <button onClick={() => updateStatus(order.id, 'CANCELLED')}
                            className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
