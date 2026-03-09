import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/hotel-landing/HeroSection'
import { HotelGallerySlider } from '@/components/hotel-landing/HotelGallerySlider'
import { RoomsSection } from '@/components/hotel-landing/RoomsSection'
import { RestaurantMenuSection } from '@/components/hotel-landing/RestaurantMenuSection'
import { AmenitiesSection } from '@/components/hotel-landing/AmenitiesSection'
import { BookingCTA } from '@/components/hotel-landing/BookingCTA'
import { ContactSection } from '@/components/hotel-landing/ContactSection'

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getHotel(slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = await (prisma as any).hotel.findUnique({
    where: { slug, status: 'APPROVED' },
    include: {
      images: { orderBy: { id: 'asc' } },
      rooms: {
        where: { status: 'AVAILABLE' },
        orderBy: { price: 'asc' },
      },
      menuItems: {
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      },
    },
  })
  return hotel
}

// ─── Static params (ISR / SSG for known hotels) ──────────────────────────────

export async function generateStaticParams() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotels = await (prisma as any).hotel.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true },
  })
  return hotels.map((h: { slug: string }) => ({ slug: h.slug }))
}

// ─── Dynamic metadata ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const hotel = await getHotel(slug)

  if (!hotel) {
    return { title: 'Hotel Not Found' }
  }

  const description =
    hotel.description ??
    `Welcome to ${hotel.name} in ${hotel.location}. Book your stay and enjoy world-class hospitality.`

  return {
    title: `${hotel.name} — ${hotel.location}`,
    description,
    openGraph: {
      title: hotel.name,
      description,
      type: 'website',
      images: hotel.heroImage
        ? [{ url: hotel.heroImage, width: 1920, height: 1080, alt: hotel.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: hotel.name,
      description,
      images: hotel.heroImage ? [hotel.heroImage] : [],
    },
    alternates: {
      canonical: `/stay/${slug}`,
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HotelLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hotel = await getHotel(slug)

  if (!hotel) notFound()

  const rooms = hotel.rooms.map((r: {
    id: string
    name: string
    type: string
    description: string | null
    price: unknown
    capacity: number
    images: string[]
    status: string
  }) => ({
    ...r,
    price: Number(r.price),
  }))

  const menuItems = hotel.menuItems.map((m: {
    id: string
    name: string
    description: string | null
    price: unknown
    category: string
    image: string | null
  }) => ({
    ...m,
    price: Number(m.price),
  }))

  return (
    <>
      {/* 1 — Hero */}
      <HeroSection
        name={hotel.name}
        location={hotel.location}
        description={hotel.description}
        heroImage={hotel.heroImage}
        slug={slug}
      />

      {/* 2 — Gallery slider */}
      {hotel.images.length > 0 && (
        <HotelGallerySlider images={hotel.images} hotelName={hotel.name} />
      )}

      {/* 3 — Rooms */}
      <RoomsSection rooms={rooms} />

      {/* 4 — Restaurant menu */}
      <RestaurantMenuSection menuItems={menuItems} />

      {/* 5 — Amenities */}
      <AmenitiesSection amenities={hotel.amenities} />

      {/* 6 — Booking CTA */}
      <BookingCTA rooms={rooms} hotelSlug={slug} />

      {/* 7 — Contact */}
      <ContactSection
        name={hotel.name}
        location={hotel.location}
        contactEmail={hotel.contactEmail}
        contactPhone={hotel.contactPhone}
      />

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-sm text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} {hotel.name}. All rights reserved.
          {' '}Powered by{' '}
          <a href="/" className="font-medium text-amber-500 hover:underline">HotelHub</a>.
        </p>
      </footer>
    </>
  )
}

// Revalidate every hour — balances freshness with performance
export const revalidate = 3600
