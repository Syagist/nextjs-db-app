import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getApprovedHotels() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any).hotel.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      slug: true,
      name: true,
      location: true,
      description: true,
      heroImage: true,
      _count: { select: { rooms: true } },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function HomePage() {
  const hotels = await getApprovedHotels()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-xl font-bold text-slate-900">HotelHub</span>
            <span className="ml-2 text-xs font-medium text-slate-400">Hotel Management Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Register Hotel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Multi-tenant Hotel Management Platform
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Register your hotel, manage rooms, bookings, staff and in-room dining — all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              List Your Hotel
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Hotels listing */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Featured Hotels</h2>
        <p className="mb-8 text-slate-500">Discover approved properties on our platform</p>

        {hotels.length === 0 ? (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-400">No hotels available yet.</p>
            <Link href="/register" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
              Be the first to register →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel: { id: string; slug: string; name: string; location: string; description: string | null; heroImage: string | null; _count: { rooms: number } }) => (
              <Link
                key={hotel.id}
                href={`/stay/${hotel.slug}`}
                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-blue-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xl font-bold">
                  {hotel.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{hotel.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{hotel.location}</p>
                {hotel.description && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{hotel.description}</p>
                )}
                <p className="mt-4 text-xs font-medium text-slate-400">{hotel._count.rooms} rooms available</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-16 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Ready to manage your hotel?</h2>
          <p className="mt-3 text-slate-500">Register your property and get approved to start managing bookings, rooms, and more.</p>
          <Link href="/register" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}
