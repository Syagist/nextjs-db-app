import { redirect } from 'next/navigation'
import { getTokenFromCookies } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Role } from '@/lib/constants'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getTokenFromCookies()

  if (!payload || payload.role !== Role.SUPER_ADMIN) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
