'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { StaffMember, Role } from '@/types'

const ROLES: Role[] = ['MANAGER', 'RECEPTIONIST', 'KITCHEN']

export default function StaffPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'RECEPTIONIST' as Role })

  const fetchStaff = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/staff`)
    const data = await res.json()
    setStaff(data.staff ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchStaff() }, [fetchStaff])

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(`/api/hotel/${hotelId}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setSaving(false)
      return
    }
    await fetchStaff()
    setShowForm(false)
    setSaving(false)
    setForm({ name: '', email: '', password: '', role: 'RECEPTIONIST' })
  }

  async function handleRemove(id: string, name: string | null) {
    if (!confirm(`Remove ${name ?? 'this staff member'}?`)) return
    await fetch(`/api/hotel/${hotelId}/staff/${id}`, { method: 'DELETE' })
    fetchStaff()
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your hotel team</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Add Staff
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-bold text-slate-900">Add Staff Member</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={6}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? 'Adding...' : 'Add'}
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{member.name ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{member.email}</td>
                  <td className="px-6 py-4"><Badge value={member.role} /></td>
                  <td className="px-6 py-4 text-slate-500">{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleRemove(member.id, member.name)}
                      className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No staff members yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
