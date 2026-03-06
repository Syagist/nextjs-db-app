'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    hotelName: '',
    hotelLocation: '',
    hotelDescription: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Registration failed')
        return
      }

      router.push('/pending')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">HotelHub</h1>
          <p className="mt-2 text-slate-500">Register your hotel property</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your Account</p>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="you@hotel.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Min. 6 characters"
              />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Hotel Details</p>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Hotel Name</label>
              <input
                name="hotelName"
                value={form.hotelName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="The Grand Hotel"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
              <input
                name="hotelLocation"
                value={form.hotelLocation}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="New York, USA"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (optional)</label>
              <textarea
                name="hotelDescription"
                value={form.hotelDescription}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Tell guests about your property..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Register Hotel'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
