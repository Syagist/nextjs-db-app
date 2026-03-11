import Image from 'next/image'
import { RoomStatus } from '@/lib/constants'

interface Room {
  id: string
  name: string
  type: string
  description: string | null
  price: number
  capacity: number
  images: string[]
  status: string
}

interface RoomsSectionProps {
  rooms: Room[]
}

const TYPE_BADGE: Record<string, string> = {
  Standard:     'bg-slate-100 text-slate-700',
  Deluxe:       'bg-blue-100 text-blue-700',
  Suite:        'bg-purple-100 text-purple-700',
  Presidential: 'bg-amber-100 text-amber-700',
  Family:       'bg-green-100 text-green-700',
}

function CapacityIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  const available = rooms.filter((r) => r.status === RoomStatus.AVAILABLE)

  return (
    <section id="rooms" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">Accommodations</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Rooms & Suites</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Each room is crafted for comfort and elegance, offering a seamless blend of contemporary design and timeless luxury.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {available.map((room) => (
            <article
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {room.images[0] ? (
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200">
                    <span className="text-slate-400 text-sm">No image</span>
                  </div>
                )}
                {/* Type badge */}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_BADGE[room.type] ?? 'bg-slate-100 text-slate-700'}`}>
                  {room.type}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>

                {/* Capacity */}
                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <CapacityIcon />
                  <span>Up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                </div>

                {/* Description */}
                {room.description && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {room.description}
                  </p>
                )}

                {/* Price + CTA */}
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">${Number(room.price).toLocaleString()}</span>
                    <span className="text-sm text-slate-400"> /night</span>
                  </div>
                  <a
                    href="#booking"
                    data-room-id={room.id}
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-500"
                  >
                    Reserve
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {available.length === 0 && (
          <p className="py-12 text-center text-slate-400">No rooms currently available.</p>
        )}
      </div>
    </section>
  )
}
