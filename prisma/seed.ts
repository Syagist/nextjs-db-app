import { PrismaClient, Role, HotelStatus, RoomStatus, BookingStatus, OrderStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Super Admin
  const superAdminPassword = await bcrypt.hash('superadmin123', 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@hotelplatform.com' },
    update: {},
    create: {
      email: 'admin@hotelplatform.com',
      password: superAdminPassword,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      hotelId: null,
    },
  })
  console.log('Created super admin:', superAdmin.email)

  // Hotel 1: The Grand Palace
  const hotel1 = await prisma.hotel.upsert({
    where: { id: 'hotel-grand-palace-001' },
    update: {},
    create: {
      id: 'hotel-grand-palace-001',
      name: 'The Grand Palace',
      location: 'New York, USA',
      description: 'A luxury 5-star hotel in the heart of Manhattan.',
      status: HotelStatus.APPROVED,
    },
  })
  console.log('Created hotel:', hotel1.name)

  // Owner for Hotel 1
  const ownerPassword = await bcrypt.hash('owner123', 10)
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@grandpalace.com' },
    update: {},
    create: {
      email: 'owner@grandpalace.com',
      password: ownerPassword,
      name: 'John Smith',
      role: Role.OWNER,
      hotelId: hotel1.id,
    },
  })
  console.log('Created owner:', owner1.email)

  // Manager for Hotel 1
  const managerPassword = await bcrypt.hash('manager123', 10)
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager@grandpalace.com' },
    update: {},
    create: {
      email: 'manager@grandpalace.com',
      password: managerPassword,
      name: 'Sarah Johnson',
      role: Role.MANAGER,
      hotelId: hotel1.id,
    },
  })
  console.log('Created manager:', manager1.email)

  // Receptionist for Hotel 1
  const recepPassword = await bcrypt.hash('recep123', 10)
  await prisma.user.upsert({
    where: { email: 'reception@grandpalace.com' },
    update: {},
    create: {
      email: 'reception@grandpalace.com',
      password: recepPassword,
      name: 'Mike Davis',
      role: Role.RECEPTIONIST,
      hotelId: hotel1.id,
    },
  })

  // Kitchen staff for Hotel 1
  const kitchenPassword = await bcrypt.hash('kitchen123', 10)
  await prisma.user.upsert({
    where: { email: 'kitchen@grandpalace.com' },
    update: {},
    create: {
      email: 'kitchen@grandpalace.com',
      password: kitchenPassword,
      name: 'Chef Antonio',
      role: Role.KITCHEN,
      hotelId: hotel1.id,
    },
  })

  // Rooms for Hotel 1
  const room1 = await prisma.room.upsert({
    where: { id: 'room-gp-101' },
    update: {},
    create: {
      id: 'room-gp-101',
      hotelId: hotel1.id,
      name: 'Room 101 - Standard',
      type: 'Standard',
      price: 150.00,
      capacity: 2,
      images: [],
      status: RoomStatus.AVAILABLE,
    },
  })

  const room2 = await prisma.room.upsert({
    where: { id: 'room-gp-201' },
    update: {},
    create: {
      id: 'room-gp-201',
      hotelId: hotel1.id,
      name: 'Room 201 - Deluxe Suite',
      type: 'Suite',
      price: 350.00,
      capacity: 4,
      images: [],
      status: RoomStatus.OCCUPIED,
    },
  })

  const room3 = await prisma.room.upsert({
    where: { id: 'room-gp-301' },
    update: {},
    create: {
      id: 'room-gp-301',
      hotelId: hotel1.id,
      name: 'Room 301 - Presidential Suite',
      type: 'Presidential',
      price: 900.00,
      capacity: 6,
      images: [],
      status: RoomStatus.AVAILABLE,
    },
  })
  console.log('Created rooms for Hotel 1')

  // Bookings for Hotel 1
  await prisma.booking.upsert({
    where: { id: 'booking-gp-001' },
    update: {},
    create: {
      id: 'booking-gp-001',
      hotelId: hotel1.id,
      roomId: room2.id,
      guestName: 'Alice Brown',
      guestPhone: '+1-555-0101',
      checkIn: new Date('2026-03-05'),
      checkOut: new Date('2026-03-10'),
      status: BookingStatus.CHECKED_IN,
    },
  })

  await prisma.booking.upsert({
    where: { id: 'booking-gp-002' },
    update: {},
    create: {
      id: 'booking-gp-002',
      hotelId: hotel1.id,
      roomId: room1.id,
      guestName: 'Bob Wilson',
      guestPhone: '+1-555-0102',
      checkIn: new Date('2026-03-10'),
      checkOut: new Date('2026-03-15'),
      status: BookingStatus.CONFIRMED,
    },
  })
  console.log('Created bookings for Hotel 1')

  // Menu items for Hotel 1
  await prisma.menuItem.createMany({
    skipDuplicates: true,
    data: [
      { id: 'menu-gp-001', hotelId: hotel1.id, name: 'Continental Breakfast', price: 25.00, category: 'Breakfast' },
      { id: 'menu-gp-002', hotelId: hotel1.id, name: 'Full English Breakfast', price: 32.00, category: 'Breakfast' },
      { id: 'menu-gp-003', hotelId: hotel1.id, name: 'Club Sandwich', price: 18.00, category: 'Lunch' },
      { id: 'menu-gp-004', hotelId: hotel1.id, name: 'Caesar Salad', price: 15.00, category: 'Lunch' },
      { id: 'menu-gp-005', hotelId: hotel1.id, name: 'Grilled Salmon', price: 45.00, category: 'Dinner' },
      { id: 'menu-gp-006', hotelId: hotel1.id, name: 'Beef Tenderloin', price: 65.00, category: 'Dinner' },
      { id: 'menu-gp-007', hotelId: hotel1.id, name: 'Sparkling Water', price: 8.00, category: 'Beverages' },
      { id: 'menu-gp-008', hotelId: hotel1.id, name: 'Freshly Squeezed OJ', price: 12.00, category: 'Beverages' },
    ],
  })
  console.log('Created menu items for Hotel 1')

  // Orders for Hotel 1
  const order1 = await prisma.order.upsert({
    where: { id: 'order-gp-001' },
    update: {},
    create: {
      id: 'order-gp-001',
      hotelId: hotel1.id,
      roomNumber: '201',
      total: 57.00,
      status: OrderStatus.SERVED,
    },
  })

  await prisma.orderItem.createMany({
    skipDuplicates: true,
    data: [
      { id: 'oi-gp-001', orderId: order1.id, menuItemId: 'menu-gp-001', name: 'Continental Breakfast', price: 25.00, quantity: 1 },
      { id: 'oi-gp-002', orderId: order1.id, menuItemId: 'menu-gp-007', name: 'Sparkling Water', price: 8.00, quantity: 2 },
      { id: 'oi-gp-003', orderId: order1.id, menuItemId: 'menu-gp-008', name: 'Freshly Squeezed OJ', price: 12.00, quantity: 1 },
    ],
  })
  console.log('Created orders for Hotel 1')

  // Hotel 2: Pending approval
  const hotel2 = await prisma.hotel.upsert({
    where: { id: 'hotel-ocean-view-001' },
    update: {},
    create: {
      id: 'hotel-ocean-view-001',
      name: 'Ocean View Resort',
      location: 'Miami, USA',
      description: 'A beachfront resort with stunning ocean views.',
      status: HotelStatus.PENDING,
    },
  })
  console.log('Created hotel:', hotel2.name)

  const owner2Password = await bcrypt.hash('owner123', 10)
  await prisma.user.upsert({
    where: { email: 'owner@oceanview.com' },
    update: {},
    create: {
      email: 'owner@oceanview.com',
      password: owner2Password,
      name: 'Emma Ocean',
      role: Role.OWNER,
      hotelId: hotel2.id,
    },
  })

  // Hotel 3: Another approved hotel
  const hotel3 = await prisma.hotel.upsert({
    where: { id: 'hotel-mountain-lodge-001' },
    update: {},
    create: {
      id: 'hotel-mountain-lodge-001',
      name: 'Mountain Lodge',
      location: 'Denver, USA',
      description: 'A cozy mountain retreat perfect for winter getaways.',
      status: HotelStatus.APPROVED,
    },
  })
  console.log('Created hotel:', hotel3.name)

  const owner3Password = await bcrypt.hash('owner123', 10)
  await prisma.user.upsert({
    where: { email: 'owner@mountainlodge.com' },
    update: {},
    create: {
      email: 'owner@mountainlodge.com',
      password: owner3Password,
      name: 'Tom Mountain',
      role: Role.OWNER,
      hotelId: hotel3.id,
    },
  })

  console.log('\nSeed completed successfully!')
  console.log('\nTest accounts:')
  console.log('Super Admin: admin@hotelplatform.com / superadmin123')
  console.log('Hotel Owner (Grand Palace): owner@grandpalace.com / owner123')
  console.log('Manager (Grand Palace): manager@grandpalace.com / manager123')
  console.log('Receptionist (Grand Palace): reception@grandpalace.com / recep123')
  console.log('Kitchen (Grand Palace): kitchen@grandpalace.com / kitchen123')
  console.log('Hotel Owner (Ocean View - Pending): owner@oceanview.com / owner123')
  console.log('Hotel Owner (Mountain Lodge): owner@mountainlodge.com / owner123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
