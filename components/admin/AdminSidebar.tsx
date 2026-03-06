'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clsx } from 'clsx'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/hotels', label: 'Hotels' },
  { href: '/admin/analytics', label: 'Analytics' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-6 py-5">
        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">HotelHub</span>
        <p className="mt-0.5 text-xs text-slate-500">Super Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
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
