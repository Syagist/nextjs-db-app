import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-200">403</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-slate-500">You do not have permission to view this page.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
