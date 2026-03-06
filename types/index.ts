export type Role = 'SUPER_ADMIN' | 'OWNER' | 'MANAGER' | 'RECEPTIONIST' | 'KITCHEN'
export type HotelStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'
export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'CANCELLED'

export interface TokenPayload {
  sub: string
  email: string
  role: Role
  hotelId: string | null
  name: string | null
}

export interface Hotel {
  id: string
  name: string
  location: string
  description: string | null
  status: HotelStatus
  createdAt: string
}

export interface Room {
  id: string
  hotelId: string
  name: string
  type: string
  price: number
  capacity: number
  images: string[]
  status: RoomStatus
}

export interface Booking {
  id: string
  hotelId: string
  roomId: string
  room?: Room
  guestName: string
  guestPhone: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  createdAt: string
}

export interface StaffMember {
  id: string
  email: string
  name: string | null
  role: Role
  hotelId: string | null
  createdAt: string
}

export interface MenuItem {
  id: string
  hotelId: string
  name: string
  price: number
  category: string
}

export interface Order {
  id: string
  hotelId: string
  roomNumber: string
  total: number
  status: OrderStatus
  createdAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}
