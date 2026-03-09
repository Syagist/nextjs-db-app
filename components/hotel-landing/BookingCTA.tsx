'use client'

import { useState } from 'react'

interface Room {
  id: string
  name: string
  type: string
  price: number
}

interface BookingCTAProps {
  rooms: Room[]
  hotelSlug: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function BookingCTA({ rooms, hotelSlug }: BookingCTAProps) {
  const available = rooms.filter((r) => true) // All rooms shown; API validates availability
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)

  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const [form, setForm] = useState({
    roomId: available[0]?.id ?? '',
    guestName: '',
    guestPhone: '',
    checkIn: fmt(tomorrow),
    checkOut: fmt(dayAfter),
  })
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/public/hotel/${hotelSlug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Booking failed. Please try again.')
        setState('error')
        return
      }

      setState('success')
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setState('error')
    }
  }

  return (
    <section id="booking" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: text */}
          <div className="text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">Reservations</p>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Begin Your<br />Luxury Experience
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              Reserve your room directly and enjoy the best available rate. Our reservations team is ready to curate every detail of your stay.
            </p>

            {/* Perks */}
            <ul className="mt-8 space-y-3">
              {[
                'Best rate guaranteed — no booking fees',
                'Free cancellation up to 48 hours before arrival',
                'Complimentary room upgrade subject to availability',
                'Dedicated pre-arrival concierge service',
              ].map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            {state === 'success' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Booking Received!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Thank you, {form.guestName}. Your reservation request has been submitted. Our team will contact you shortly to confirm.
                </p>
                <button
                  onClick={() => setState('idle')}
                  className="mt-6 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="mb-5 text-lg font-bold text-slate-900">Reserve a Room</h3>

                {state === 'error' && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Room */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Select Room
                  </label>
                  <select
                    name="roomId"
                    value={form.roomId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  >
                    {available.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — ${Number(r.price).toLocaleString()}/night
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check In
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={form.checkIn}
                      onChange={handleChange}
                      required
                      min={fmt(new Date())}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check Out
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={form.checkOut}
                      onChange={handleChange}
                      required
                      min={form.checkIn}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                {/* Guest name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={form.guestName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={form.guestPhone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-60"
                >
                  {state === 'loading' ? 'Submitting...' : 'Request Reservation'}
                </button>

                <p className="text-center text-xs text-slate-400">
                  No payment required now · Confirmation within 2 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
