import type { BookingStatus as BookingStatusType, HotelStatus as HotelStatusType, OrderStatus as OrderStatusType, Role as RoleType, RoomStatus as RoomStatusType } from '@/types'

// ─── Enum-style value constants ───────────────────────────────────────────────

export const BookingStatus = {
  PENDING:     'PENDING',
  CONFIRMED:   'CONFIRMED',
  CHECKED_IN:  'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED:   'CANCELLED',
} as const

export const RoomStatus = {
  AVAILABLE:   'AVAILABLE',
  OCCUPIED:    'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
} as const

export const OrderStatus = {
  PENDING:   'PENDING',
  PREPARING: 'PREPARING',
  SERVED:    'SERVED',
  CANCELLED: 'CANCELLED',
} as const

export const HotelStatus = {
  PENDING:  'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export const Role = {
  SUPER_ADMIN:  'SUPER_ADMIN',
  OWNER:        'OWNER',
  MANAGER:      'MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  KITCHEN:      'KITCHEN',
} as const

// ─── Roles ────────────────────────────────────────────────────────────────────

export const HOTEL_ROLES: RoleType[] = [Role.OWNER, Role.MANAGER, Role.RECEPTIONIST, Role.KITCHEN]
export const MANAGEMENT_ROLES: RoleType[] = [Role.OWNER, Role.MANAGER]
export const ASSIGNABLE_ROLES: RoleType[] = [Role.MANAGER, Role.RECEPTIONIST, Role.KITCHEN]

// ─── Domain lists ─────────────────────────────────────────────────────────────

export const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'] as const
export const MENU_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Snacks', 'Desserts'] as const

export const BOOKING_STATUSES = Object.values(BookingStatus) as BookingStatusType[]
export const ROOM_STATUSES    = Object.values(RoomStatus) as RoomStatusType[]
export const ORDER_STATUSES   = Object.values(OrderStatus) as OrderStatusType[]
export const HOTEL_STATUSES   = Object.values(HotelStatus) as HotelStatusType[]

// ─── Status flow maps ─────────────────────────────────────────────────────────

export const BOOKING_STATUS_FLOW: Record<BookingStatusType, BookingStatusType | null> = {
  [BookingStatus.PENDING]:    BookingStatus.CONFIRMED,
  [BookingStatus.CONFIRMED]:  BookingStatus.CHECKED_IN,
  [BookingStatus.CHECKED_IN]: BookingStatus.CHECKED_OUT,
  [BookingStatus.CHECKED_OUT]: null,
  [BookingStatus.CANCELLED]:  null,
}

export const ORDER_STATUS_FLOW: Record<OrderStatusType, OrderStatusType | null> = {
  [OrderStatus.PENDING]:   OrderStatus.PREPARING,
  [OrderStatus.PREPARING]: OrderStatus.SERVED,
  [OrderStatus.SERVED]:    null,
  [OrderStatus.CANCELLED]: null,
}

// ─── Active status helpers ────────────────────────────────────────────────────

export const ACTIVE_BOOKING_STATUSES: BookingStatusType[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]
export const ACTIVE_ORDER_STATUSES: OrderStatusType[] = [OrderStatus.PENDING, OrderStatus.PREPARING]

// ─── Permission sets (who can mutate each resource) ───────────────────────────

export const CAN_MANAGE_ROOMS: RoleType[]    = [Role.OWNER, Role.MANAGER, Role.SUPER_ADMIN]
export const CAN_MANAGE_BOOKINGS: RoleType[] = [Role.OWNER, Role.MANAGER, Role.RECEPTIONIST, Role.SUPER_ADMIN]
export const CAN_DELETE_BOOKING: RoleType[]  = [Role.OWNER, Role.MANAGER, Role.SUPER_ADMIN]
export const CAN_MANAGE_STAFF: RoleType[]    = [Role.OWNER, Role.SUPER_ADMIN]
export const CAN_VIEW_STAFF: RoleType[]      = [Role.OWNER, Role.MANAGER, Role.SUPER_ADMIN]
export const CAN_MANAGE_MENU: RoleType[]     = [Role.OWNER, Role.MANAGER, Role.KITCHEN, Role.SUPER_ADMIN]
