import { prisma } from '@/lib/prisma'
import { getTokenFromCookies } from '@/lib/auth'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import type { BookingStatus } from '@/types'
import { RoomStatus, BookingStatus as BS, OrderStatus } from '@/lib/constants'

async function getDashboardData(hotelId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [totalRooms, availableRooms, activeBookings, todayCheckIns, todayCheckOuts, pendingOrders, recentBookings] =
    await Promise.all([
      p.room.count({ where: { hotelId } }),
      p.room.count({ where: { hotelId, status: RoomStatus.AVAILABLE } }),
      p.booking.count({ where: { hotelId, status: { in: [BS.CONFIRMED, BS.CHECKED_IN] } } }),
      p.booking.count({ where: { hotelId, checkIn: { gte: today, lt: tomorrow } } }),
      p.booking.count({ where: { hotelId, checkOut: { gte: today, lt: tomorrow } } }),
      p.order.count({ where: { hotelId, status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING] } } }),
      p.booking.findMany({
        where: { hotelId },
        include: { room: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

  return { totalRooms, availableRooms, activeBookings, todayCheckIns, todayCheckOuts, pendingOrders, recentBookings }
}

export default async function HotelDashboardPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params
  const payload = await getTokenFromCookies()
  const data = await getDashboardData(hotelId)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back, {payload?.name ?? 'team member'}</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard title="Available Rooms" value={`${data.availableRooms}/${data.totalRooms}`} color="green" />
        <StatsCard title="Active Bookings" value={data.activeBookings} color="blue" />
        <StatsCard title="Today Check-ins" value={data.todayCheckIns} color="purple" />
        <StatsCard title="Today Check-outs" value={data.todayCheckOuts} color="slate" />
      </div>

      {data.pendingOrders > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-orange-50 px-5 py-4 ring-1 ring-orange-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-200 text-orange-800 text-sm font-bold">
            {data.pendingOrders}
          </div>
          <p className="text-sm font-medium text-orange-800">
            {data.pendingOrders} order{data.pendingOrders > 1 ? 's' : ''} need attention
          </p>
          <a href={`/hotel/${hotelId}/orders`} className="ml-auto text-sm font-medium text-orange-700 hover:underline">
            View Orders →
          </a>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <a href={`/hotel/${hotelId}/bookings`} className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </a>
        </div>
        <div className="divide-y divide-slate-50">
          {data.recentBookings.map((booking: {
            id: string
            guestName: string
            guestPhone: string
            checkIn: Date
            checkOut: Date
            status: BookingStatus
            room: { name: string }
          }) => (
            <div key={booking.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{booking.guestName}</p>
                <p className="text-sm text-slate-500">{booking.room.name}</p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <Badge value={booking.status} />
              </div>
            </div>
          ))}
          {data.recentBookings.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-slate-400">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
