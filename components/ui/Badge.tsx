import { clsx } from 'clsx'

type BadgeVariant =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'MAINTENANCE'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'PREPARING'
  | 'SERVED'
  | 'OWNER'
  | 'MANAGER'
  | 'RECEPTIONIST'
  | 'KITCHEN'
  | 'SUPER_ADMIN'

const variantClasses: Record<BadgeVariant, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  AVAILABLE: 'bg-green-100 text-green-800',
  OCCUPIED: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-orange-100 text-orange-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  CHECKED_IN: 'bg-green-100 text-green-800',
  CHECKED_OUT: 'bg-slate-100 text-slate-700',
  CANCELLED: 'bg-red-100 text-red-800',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  SERVED: 'bg-green-100 text-green-800',
  OWNER: 'bg-purple-100 text-purple-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  RECEPTIONIST: 'bg-teal-100 text-teal-800',
  KITCHEN: 'bg-orange-100 text-orange-800',
  SUPER_ADMIN: 'bg-red-100 text-red-800',
}

const labelMap: Record<BadgeVariant, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled',
  PREPARING: 'Preparing',
  SERVED: 'Served',
  OWNER: 'Owner',
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  KITCHEN: 'Kitchen',
  SUPER_ADMIN: 'Super Admin',
}

export function Badge({ value }: { value: BadgeVariant }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[value] ?? 'bg-slate-100 text-slate-700',
      )}
    >
      {labelMap[value] ?? value}
    </span>
  )
}
