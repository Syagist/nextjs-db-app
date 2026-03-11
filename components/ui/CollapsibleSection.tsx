'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CollapsibleSectionProps {
  title: string
  count?: number
  href?: string        // "View all" link
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: { label: string; color: 'green' | 'blue' | 'yellow' | 'red' | 'slate' }
}

const badgeColors = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function CollapsibleSection({
  title, count, href, defaultOpen = false, children, badge,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Header row — click to toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 010-1.06z" />
        </svg>

        <span className="flex-1 text-sm font-semibold text-slate-800">{title}</span>

        {count !== undefined && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {count}
          </span>
        )}

        {badge && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[badge.color]}`}>
            {badge.label}
          </span>
        )}

        {href && (
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Manage →
          </Link>
        )}
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  )
}
