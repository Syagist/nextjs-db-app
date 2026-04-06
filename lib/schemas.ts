import { z } from 'zod'
import { ASSIGNABLE_ROLES, ROOM_STATUSES, ROOM_TYPES, MENU_CATEGORIES } from '@/lib/constants'

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
})

export type LoginForm = z.infer<typeof loginSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  hotelName: z.string().min(1, 'Hotel name is required'),
  hotelLocation: z.string().min(1, 'Location is required'),
  hotelDescription: z.string().optional(),
})
export type RegisterForm = z.infer<typeof registerSchema>

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  type: z.enum(ROOM_TYPES as [string, ...string[]]),
  price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
  capacity: z.number({ invalid_type_error: 'Capacity must be a number' }).int().min(1, 'Capacity must be at least 1'),
  status: z.enum(ROOM_STATUSES as [string, ...string[]]).default('AVAILABLE'),
})
export type RoomForm = z.infer<typeof roomSchema>

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  roomId: z.string().min(1, 'Please select a room'),
  guestName: z.string().min(1, 'Guest name is required'),
  guestPhone: z.string().min(1, 'Phone number is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
}).refine(
  (d) => !d.checkIn || !d.checkOut || new Date(d.checkOut) > new Date(d.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] },
)
export type BookingForm = z.infer<typeof bookingSchema>

// ─── Staff ────────────────────────────────────────────────────────────────────

export const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]),
})
export type StaffForm = z.infer<typeof staffSchema>

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
  category: z.enum(MENU_CATEGORIES as [string, ...string[]]),
})
export type MenuItemForm = z.infer<typeof menuItemSchema>

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
})
export type OrderForm = z.infer<typeof orderSchema>
