'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Awaiting Approval</h1>
        <p className="mt-3 text-slate-500">
          Your hotel registration has been submitted and is pending review by our team. You will be able to access
          your dashboard once approved.
        </p>

        <div className="mt-8 rounded-xl bg-yellow-50 px-6 py-4 text-left ring-1 ring-yellow-200">
          <p className="text-sm font-medium text-yellow-800">What happens next?</p>
          <ul className="mt-2 space-y-1.5 text-sm text-yellow-700">
            <li>• Our team reviews your hotel details</li>
            <li>• Approval typically takes 1–2 business days</li>
            <li>• You will receive an email confirmation</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
