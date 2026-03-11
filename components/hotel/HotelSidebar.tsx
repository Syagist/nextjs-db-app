'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import type { Role } from '@/types'
import { Role as RoleConst } from '@/lib/constants'

interface HotelSidebarProps {
  hotelId: string
  hotelName: string
  role: Role
}

function getNavItems(hotelId: string, role: Role) {
  const base = `/hotel/${hotelId}`
  const all = [
    { href: `${base}/dashboard`, label: 'Dashboard' },
    { href: `${base}/rooms`, label: 'Rooms', roles: [RoleConst.OWNER, RoleConst.MANAGER, RoleConst.RECEPTIONIST] },
    { href: `${base}/bookings`, label: 'Bookings', roles: [RoleConst.OWNER, RoleConst.MANAGER, RoleConst.RECEPTIONIST] },
    { href: `${base}/staff`, label: 'Staff', roles: [RoleConst.OWNER, RoleConst.MANAGER] },
    { href: `${base}/menu`, label: 'Menu', roles: [RoleConst.OWNER, RoleConst.MANAGER, RoleConst.KITCHEN] },
    { href: `${base}/orders`, label: 'Orders', roles: [RoleConst.OWNER, RoleConst.MANAGER, RoleConst.KITCHEN, RoleConst.RECEPTIONIST] },
    { href: `${base}/overview`, label: 'Overview' },
  ]
  return all.filter((item) => !item.roles || (item.roles as string[]).includes(role))
}

export function HotelSidebar({ hotelId, hotelName, role }: HotelSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = getNavItems(hotelId, role)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-6 py-5">
        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">HotelHub</span>
        <p className="mt-0.5 truncate text-xs font-medium text-white">{hotelName}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 px-3 py-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
