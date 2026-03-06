import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { HotelStatus } from '@/types'

async function getAnalytics() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any
  const [totalHotels, pendingHotels, approvedHotels, totalUsers, totalBookings, recentHotels] =
    await Promise.all([
      p.hotel.count(),
      p.hotel.count({ where: { status: 'PENDING' } }),
      p.hotel.count({ where: { status: 'APPROVED' } }),
      p.user.count({ where: { role: { not: 'SUPER_ADMIN' } } }),
      p.booking.count(),
      p.hotel.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: { id: true, name: true, location: true, status: true, createdAt: true },
      }),
    ])
  return { totalHotels, pendingHotels, approvedHotels, totalUsers, totalBookings, recentHotels }
}

export default async function AdminDashboardPage() {
  const { totalHotels, pendingHotels, approvedHotels, totalUsers, totalBookings, recentHotels } =
    await getAnalytics()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor all hotels and platform activity</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatsCard title="Total Hotels" value={totalHotels} color="blue" />
        <StatsCard title="Pending Approval" value={pendingHotels} color="yellow" />
        <StatsCard title="Approved Hotels" value={approvedHotels} color="green" />
        <StatsCard title="Hotel Staff" value={totalUsers} color="purple" />
        <StatsCard title="Total Bookings" value={totalBookings} color="slate" />
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent Hotels</h2>
          <a href="/admin/hotels" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </a>
        </div>
        <div className="divide-y divide-slate-50">
          {recentHotels.map((hotel: { id: string; name: string; location: string; status: HotelStatus; createdAt: Date }) => (
            <div key={hotel.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{hotel.name}</p>
                <p className="text-sm text-slate-500">{hotel.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge value={hotel.status} />
                <a
                  href={`/admin/hotels?id=${hotel.id}`}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Manage
                </a>
              </div>
            </div>
          ))}
          {recentHotels.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-slate-400">No hotels registered yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
