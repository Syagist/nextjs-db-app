import { redirect } from 'next/navigation'
import { getTokenFromCookies } from '@/lib/auth'
import { HOTEL_ROLES, HotelStatus } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { HotelSidebar } from '@/components/hotel/HotelSidebar'

export default async function HotelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ hotelId: string }>
}) {
  const payload = await getTokenFromCookies()
  if (!payload) redirect('/auth/login')

  const { hotelId } = await params
  if (!HOTEL_ROLES.includes(payload.role)) redirect('/unauthorized')
  if (payload.hotelId !== hotelId) redirect('/unauthorized')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = await (prisma as any).hotel.findUnique({
    where: { id: hotelId },
    select: { id: true, name: true, status: true },
  })

  if (!hotel) redirect('/unauthorized')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <HotelSidebar hotelId={hotelId} hotelName={hotel.name} role={payload.role} />
      <main className="flex-1 overflow-y-auto">
        {hotel.status !== HotelStatus.APPROVED && (
          <div className="border-b border-yellow-200 bg-yellow-50 px-6 py-3 text-sm text-yellow-800">
            This hotel is currently <strong>{hotel.status.toLowerCase()}</strong> and not publicly visible.
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
