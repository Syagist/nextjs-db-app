import type { BookingStatus, HotelStatus, OrderStatus, Role, RoomStatus } from '@/types'

// ─── Roles ────────────────────────────────────────────────────────────────────

export const HOTEL_ROLES: Role[] = ['OWNER', 'MANAGER', 'RECEPTIONIST', 'KITCHEN']
export const MANAGEMENT_ROLES: Role[] = ['OWNER', 'MANAGER']
export const ASSIGNABLE_ROLES: Role[] = ['MANAGER', 'RECEPTIONIST', 'KITCHEN']

// ─── Domain lists ─────────────────────────────────────────────────────────────

export const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'] as const
export const MENU_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Snacks', 'Desserts'] as const

export const BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']
export const ROOM_STATUSES: RoomStatus[] = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']
export const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PREPARING', 'SERVED', 'CANCELLED']
export const HOTEL_STATUSES: HotelStatus[] = ['PENDING', 'APPROVED', 'REJECTED']

// ─── Status flow maps ─────────────────────────────────────────────────────────

export const BOOKING_STATUS_FLOW: Record<BookingStatus, BookingStatus | null> = {
  PENDING:    'CONFIRMED',
  CONFIRMED:  'CHECKED_IN',
  CHECKED_IN: 'CHECKED_OUT',
  CHECKED_OUT: null,
  CANCELLED:  null,
}

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  PENDING:   'PREPARING',
  PREPARING: 'SERVED',
  SERVED:    null,
  CANCELLED: null,
}

// ─── Active status helpers ────────────────────────────────────────────────────

export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CHECKED_IN']
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PREPARING']

// ─── Permission sets (who can mutate each resource) ───────────────────────────

export const CAN_MANAGE_ROOMS: Role[]    = ['OWNER', 'MANAGER', 'SUPER_ADMIN']
export const CAN_MANAGE_BOOKINGS: Role[] = ['OWNER', 'MANAGER', 'RECEPTIONIST', 'SUPER_ADMIN']
export const CAN_DELETE_BOOKING: Role[]  = ['OWNER', 'MANAGER', 'SUPER_ADMIN']
export const CAN_MANAGE_STAFF: Role[]    = ['OWNER', 'SUPER_ADMIN']
export const CAN_VIEW_STAFF: Role[]      = ['OWNER', 'MANAGER', 'SUPER_ADMIN']
export const CAN_MANAGE_MENU: Role[]     = ['OWNER', 'MANAGER', 'KITCHEN', 'SUPER_ADMIN']
