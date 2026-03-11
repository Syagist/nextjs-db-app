'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { StaffMember, Role } from '@/types'
import { ASSIGNABLE_ROLES } from '@/lib/constants'

const DEFAULT_FORM = { name: '', email: '', password: '', role: 'RECEPTIONIST' as Role }

export default function StaffPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(DEFAULT_FORM)

  const fetchStaff = useCallback(async () => {
    const res = await fetch(`/api/hotel/${hotelId}/staff`)
    const data = await res.json()
    setStaff(data.staff ?? [])
    setLoading(false)
  }, [hotelId])

  useEffect(() => { fetchStaff() }, [fetchStaff])

  function closeForm() {
    setShowForm(false)
    setError('')
    setForm(DEFAULT_FORM)
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

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
    setSaving(false)
    closeForm()
  }

  async function handleRemove(id: string, name: string | null) {
    if (!confirm(`Remove ${name ?? 'this staff member'}?`)) return
    await fetch(`/api/hotel/${hotelId}/staff/${id}`, { method: 'DELETE' })
    fetchStaff()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Staff"
        subtitle="Manage your hotel team"
        action={{ label: 'Add Staff', onClick: () => setShowForm(true) }}
      />

      <Modal isOpen={showForm} onClose={closeForm} title="Add Staff Member">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <FormField label="Full Name">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </FormField>

          <FormField label="Email">
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </FormField>

          <FormField label="Password">
            <Input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          </FormField>

          <FormField label="Role">
            <Select value={form.role} onChange={(e) => set('role', e.target.value as Role)}>
              {ASSIGNABLE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </FormField>

          <ModalFooter onCancel={closeForm} saving={saving} submitLabel="Add" savingLabel="Adding..." />
        </form>
      </Modal>

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
                    <button
                      onClick={() => handleRemove(member.id, member.name)}
                      className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                    >
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
