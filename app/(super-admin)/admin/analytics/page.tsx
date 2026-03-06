import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/ui/StatsCard'

async function getAnalytics() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any
  const [totalHotels, pendingHotels, approvedHotels, rejectedHotels, totalUsers, totalBookings, totalOrders, totalRooms] =
    await Promise.all([
      p.hotel.count(),
      p.hotel.count({ where: { status: 'PENDING' } }),
      p.hotel.count({ where: { status: 'APPROVED' } }),
      p.hotel.count({ where: { status: 'REJECTED' } }),
      p.user.count({ where: { role: { not: 'SUPER_ADMIN' } } }),
      p.booking.count(),
      p.order.count(),
      p.room.count(),
    ])
  return { totalHotels, pendingHotels, approvedHotels, rejectedHotels, totalUsers, totalBookings, totalOrders, totalRooms }
}

export default async function AdminAnalyticsPage() {
  const stats = await getAnalytics()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time platform statistics</p>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Hotels</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard title="Total Hotels" value={stats.totalHotels} color="blue" />
          <StatsCard title="Approved" value={stats.approvedHotels} color="green" />
          <StatsCard title="Pending" value={stats.pendingHotels} color="yellow" />
          <StatsCard title="Rejected" value={stats.rejectedHotels} color="red" />
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Platform Activity</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard title="Hotel Staff" value={stats.totalUsers} color="purple" />
          <StatsCard title="Total Rooms" value={stats.totalRooms} color="slate" />
          <StatsCard title="Total Bookings" value={stats.totalBookings} color="blue" />
          <StatsCard title="Total Orders" value={stats.totalOrders} color="green" />
        </div>
      </div>
    </div>
  )
}
