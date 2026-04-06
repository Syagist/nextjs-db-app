import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import type { RoomStatus } from '@/types'
import { HotelStatus, RoomStatus as RS } from '@/lib/constants'

async function getHotel(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = await (prisma as any).hotel.findUnique({
    where: { id, status: HotelStatus.APPROVED },
    include: {
      rooms: {
        select: { id: true, name: true, type: true, price: true, capacity: true, status: true },
        orderBy: { name: 'asc' },
      },
    },
  })
  return hotel
}

export default async function PublicHotelPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params
  const hotel = await getHotel(hotelId)

  if (!hotel) notFound()

  const availableRooms = hotel.rooms.filter((r: { status: RoomStatus }) => r.status === RS.AVAILABLE)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">HotelHub</Link>
          <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:underline">Sign In</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Hotel Header */}
        <div className="mb-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-2xl font-bold">
            {hotel.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{hotel.name}</h1>
          <p className="mt-1 text-slate-500">{hotel.location}</p>
          {hotel.description && (
            <p className="mt-3 max-w-2xl text-slate-600">{hotel.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span>{hotel.rooms.length} total rooms</span>
            <span>·</span>
            <span className="text-green-600 font-medium">{availableRooms.length} available</span>
          </div>
        </div>

        {/* Rooms */}
        <h2 className="mb-4 text-xl font-bold text-slate-900">Available Rooms</h2>
        {availableRooms.length === 0 ? (
          <div className="rounded-xl bg-white py-12 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-400">No rooms currently available.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableRooms.map((room: { id: string; name: string; type: string; price: number; capacity: number; status: RoomStatus }) => (
              <div key={room.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{room.name}</p>
                    <p className="text-sm text-slate-500">{room.type} · Up to {room.capacity} guests</p>
                  </div>
                  <Badge value={room.status} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  ${Number(room.price).toFixed(2)}
                  <span className="text-sm font-normal text-slate-400">/night</span>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center ring-1 ring-blue-200">
          <p className="font-semibold text-slate-900">Want to book a room?</p>
          <p className="mt-1 text-sm text-slate-500">Contact {hotel.name} directly or sign in to make a reservation.</p>
          <Link href="/auth/login" className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Sign In to Book
          </Link>
        </div>
      </main>
    </div>
  )
}
