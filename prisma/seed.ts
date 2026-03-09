import { PrismaClient, Role, HotelStatus, RoomStatus, BookingStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Unsplash images — no API key required for these static URLs
const IMG = {
  hotelHero:    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
  lobby:        'https://images.unsplash.com/photo-1551882547-ff40c599934b?w=1200&q=80',
  pool:         'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  restaurant:   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  spa:          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
  exterior:     'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
  roomStd:      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
  roomDeluxe:   'https://images.unsplash.com/photo-1591088936032-16e5e0c5efd4?w=900&q=80',
  roomSuite:    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
  roomPrestige: 'https://images.unsplash.com/photo-1549294413-26f195471011?w=900&q=80',
  breakfast:    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  steak:        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  pasta:        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
  salad:        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  cocktail:     'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80',
  dessert:      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80',
  juice:        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80',
  coffee:       'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
}

async function main() {
  console.log('Seeding database...')

  // ─── Super Admin ────────────────────────────────────────────────────────────
  const superAdminPassword = await bcrypt.hash('superadmin123', 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@hotelplatform.com' },
    update: {},
    create: {
      email: 'admin@hotelplatform.com',
      password: superAdminPassword,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
    },
  })
  console.log('✓ Super admin:', superAdmin.email)

  // ─── Hotel 1: The Grand Palace (full landing page demo) ─────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = prisma as any

  const grandPalace = await p.hotel.upsert({
    where: { slug: 'grand-palace' },
    update: {},
    create: {
      id: 'hotel-grand-palace-001',
      name: 'The Grand Palace',
      slug: 'grand-palace',
      location: 'New York, USA',
      description:
        'An iconic 5-star sanctuary in the heart of Manhattan. The Grand Palace blends timeless elegance with modern luxury, offering world-class dining, a full-service spa, and breathtaking skyline views from every suite.',
      heroImage: IMG.hotelHero,
      amenities: [
        'Free High-Speed WiFi',
        'Infinity Pool',
        'Fitness Center',
        'Spa & Wellness',
        'Fine Dining Restaurant',
        'Rooftop Bar',
        'Valet Parking',
        '24/7 Concierge',
        'Room Service',
        'Airport Shuttle',
        'Business Center',
        'Air Conditioning',
      ],
      contactEmail: 'reservations@grandpalace.com',
      contactPhone: '+1 (212) 555-0100',
      status: HotelStatus.APPROVED,
    },
  })
  console.log('✓ Hotel:', grandPalace.name)

  // Gallery images
  await p.hotelImage.createMany({
    skipDuplicates: true,
    data: [
      { id: 'img-gp-1', hotelId: grandPalace.id, url: IMG.lobby,      altText: 'Grand lobby' },
      { id: 'img-gp-2', hotelId: grandPalace.id, url: IMG.pool,       altText: 'Infinity pool' },
      { id: 'img-gp-3', hotelId: grandPalace.id, url: IMG.restaurant, altText: 'Fine dining restaurant' },
      { id: 'img-gp-4', hotelId: grandPalace.id, url: IMG.spa,        altText: 'Spa & wellness' },
      { id: 'img-gp-5', hotelId: grandPalace.id, url: IMG.exterior,   altText: 'Hotel exterior' },
    ],
  })
  console.log('✓ Gallery images added')

  // Owner
  const ownerPassword = await bcrypt.hash('owner123', 10)
  await p.user.upsert({
    where: { email: 'owner@grandpalace.com' },
    update: {},
    create: {
      email: 'owner@grandpalace.com',
      password: ownerPassword,
      name: 'John Smith',
      role: Role.OWNER,
      hotelId: grandPalace.id,
    },
  })

  // ─── Rooms ──────────────────────────────────────────────────────────────────
  const rooms = await Promise.all([
    p.room.upsert({
      where: { id: 'room-gp-std-101' },
      update: {},
      create: {
        id: 'room-gp-std-101',
        hotelId: grandPalace.id,
        name: 'Classic Room',
        type: 'Standard',
        description:
          'Elegantly appointed with king-sized bed, marble bathroom, and city views. Perfect for solo travelers and couples seeking comfort and style.',
        price: 220.00,
        capacity: 2,
        images: [IMG.roomStd],
        status: RoomStatus.AVAILABLE,
      },
    }),
    p.room.upsert({
      where: { id: 'room-gp-dlx-201' },
      update: {},
      create: {
        id: 'room-gp-dlx-201',
        hotelId: grandPalace.id,
        name: 'Deluxe Suite',
        type: 'Deluxe',
        description:
          'A spacious retreat featuring a separate living area, soaking tub, and panoramic views of Central Park. Includes daily breakfast and evening turndown service.',
        price: 480.00,
        capacity: 3,
        images: [IMG.roomDeluxe],
        status: RoomStatus.AVAILABLE,
      },
    }),
    p.room.upsert({
      where: { id: 'room-gp-ste-301' },
      update: {},
      create: {
        id: 'room-gp-ste-301',
        hotelId: grandPalace.id,
        name: 'Grand Suite',
        type: 'Suite',
        description:
          'Two-bedroom luxury suite with a private terrace, butler service, fully stocked bar, and sweeping skyline views. Ideal for families and extended stays.',
        price: 850.00,
        capacity: 4,
        images: [IMG.roomSuite],
        status: RoomStatus.AVAILABLE,
      },
    }),
    p.room.upsert({
      where: { id: 'room-gp-prs-401' },
      update: {},
      create: {
        id: 'room-gp-prs-401',
        hotelId: grandPalace.id,
        name: 'Presidential Suite',
        type: 'Presidential',
        description:
          'The pinnacle of luxury — a two-floor private residence with a grand piano, private terrace jacuzzi, personal chef, and 24/7 dedicated butler. The ultimate New York experience.',
        price: 2200.00,
        capacity: 6,
        images: [IMG.roomPrestige],
        status: RoomStatus.AVAILABLE,
      },
    }),
  ])
  console.log('✓ Rooms created:', rooms.length)

  // ─── Menu Items ─────────────────────────────────────────────────────────────
  await p.menuItem.createMany({
    skipDuplicates: true,
    data: [
      // Breakfast
      {
        id: 'menu-gp-b1', hotelId: grandPalace.id, category: 'Breakfast',
        name: 'Grand Continental',
        description: 'Freshly baked croissants, seasonal fruits, yogurt parfait, and premium orange juice.',
        price: 38.00, image: IMG.breakfast,
      },
      {
        id: 'menu-gp-b2', hotelId: grandPalace.id, category: 'Breakfast',
        name: 'Eggs Benedict Royale',
        description: 'Poached eggs, smoked salmon, hollandaise sauce on toasted English muffin.',
        price: 28.00, image: IMG.breakfast,
      },
      {
        id: 'menu-gp-b3', hotelId: grandPalace.id, category: 'Breakfast',
        name: 'Avocado Toast',
        description: 'Sourdough, smashed avocado, poached egg, micro herbs, chili flakes.',
        price: 22.00, image: IMG.breakfast,
      },

      // Lunch & Dinner
      {
        id: 'menu-gp-d1', hotelId: grandPalace.id, category: 'Dinner',
        name: 'Prime Wagyu Steak',
        description: 'A5 Wagyu beef tenderloin, truffle butter, roasted asparagus, red wine jus.',
        price: 145.00, image: IMG.steak,
      },
      {
        id: 'menu-gp-d2', hotelId: grandPalace.id, category: 'Dinner',
        name: 'Lobster Linguine',
        description: 'Fresh Maine lobster, handmade linguine, saffron bisque, cherry tomatoes.',
        price: 88.00, image: IMG.pasta,
      },
      {
        id: 'menu-gp-d3', hotelId: grandPalace.id, category: 'Dinner',
        name: 'Roasted Duck Confit',
        description: 'Slow-cooked duck leg, orange glaze, sautéed greens, pommes sarladaises.',
        price: 72.00, image: IMG.steak,
      },
      {
        id: 'menu-gp-l1', hotelId: grandPalace.id, category: 'Lunch',
        name: 'Nicoise Salad',
        description: 'Seared yellowfin tuna, haricots verts, quail eggs, olives, anchovy dressing.',
        price: 34.00, image: IMG.salad,
      },
      {
        id: 'menu-gp-l2', hotelId: grandPalace.id, category: 'Lunch',
        name: 'Truffle Mushroom Risotto',
        description: 'Arborio rice, wild mushrooms, aged parmesan, black truffle shavings.',
        price: 42.00, image: IMG.pasta,
      },

      // Desserts
      {
        id: 'menu-gp-ds1', hotelId: grandPalace.id, category: 'Desserts',
        name: 'Grand Chocolate Fondant',
        description: 'Warm Valrhona chocolate cake, vanilla bean ice cream, gold leaf.',
        price: 24.00, image: IMG.dessert,
      },
      {
        id: 'menu-gp-ds2', hotelId: grandPalace.id, category: 'Desserts',
        name: 'Crème Brûlée',
        description: 'Classic Tahitian vanilla custard with caramelized sugar crust.',
        price: 18.00, image: IMG.dessert,
      },

      // Beverages
      {
        id: 'menu-gp-bv1', hotelId: grandPalace.id, category: 'Beverages',
        name: 'Grand Palace Cocktail',
        description: 'Signature blend of Hendrick\'s gin, elderflower, cucumber, and prosecco.',
        price: 28.00, image: IMG.cocktail,
      },
      {
        id: 'menu-gp-bv2', hotelId: grandPalace.id, category: 'Beverages',
        name: 'Fresh Pressed Juices',
        description: 'Seasonal fruits cold-pressed to order. Ask for today\'s selection.',
        price: 14.00, image: IMG.juice,
      },
      {
        id: 'menu-gp-bv3', hotelId: grandPalace.id, category: 'Beverages',
        name: 'Specialty Coffee',
        description: 'Single-origin pour-over, espresso, or cappuccino with house-made pastry.',
        price: 12.00, image: IMG.coffee,
      },
    ],
  })
  console.log('✓ Menu items created')

  // Sample bookings
  await p.booking.upsert({
    where: { id: 'booking-gp-demo-1' },
    update: {},
    create: {
      id: 'booking-gp-demo-1',
      hotelId: grandPalace.id,
      roomId: rooms[1].id,
      guestName: 'Alice Chen',
      guestPhone: '+1-555-0202',
      checkIn: new Date('2026-03-10'),
      checkOut: new Date('2026-03-15'),
      status: BookingStatus.CONFIRMED,
    },
  })

  // ─── Hotel 2: Ocean View Resort ─────────────────────────────────────────────
  const oceanView = await p.hotel.upsert({
    where: { slug: 'ocean-view-resort' },
    update: {},
    create: {
      id: 'hotel-ocean-view-001',
      name: 'Ocean View Resort',
      slug: 'ocean-view-resort',
      location: 'Miami Beach, USA',
      description: 'A beachfront paradise with stunning Atlantic views, water sports, and fresh seafood dining.',
      heroImage: IMG.pool,
      amenities: ['Private Beach', 'Free WiFi', 'Water Sports', 'Infinity Pool', 'Seafood Restaurant'],
      contactEmail: 'hello@oceanviewresort.com',
      contactPhone: '+1 (305) 555-0200',
      status: HotelStatus.PENDING,
    },
  })
  console.log('✓ Hotel:', oceanView.name)

  const owner2Password = await bcrypt.hash('owner123', 10)
  await p.user.upsert({
    where: { email: 'owner@oceanview.com' },
    update: {},
    create: {
      email: 'owner@oceanview.com',
      password: owner2Password,
      name: 'Emma Ocean',
      role: Role.OWNER,
      hotelId: oceanView.id,
    },
  })

  // ─── Hotel 3: Mountain Lodge ─────────────────────────────────────────────────
  const mountainLodge = await p.hotel.upsert({
    where: { slug: 'mountain-lodge' },
    update: {},
    create: {
      id: 'hotel-mountain-lodge-001',
      name: 'Mountain Lodge',
      slug: 'mountain-lodge',
      location: 'Aspen, Colorado',
      description: 'A cozy alpine retreat with ski-in/ski-out access, roaring fireplaces, and mountain cuisine.',
      heroImage: IMG.exterior,
      amenities: ['Ski-In/Ski-Out', 'Fireplace Lounge', 'Mountain Restaurant', 'Spa', 'Free WiFi'],
      contactEmail: 'stay@mountainlodge.com',
      contactPhone: '+1 (970) 555-0300',
      status: HotelStatus.APPROVED,
    },
  })
  console.log('✓ Hotel:', mountainLodge.name)

  const owner3Password = await bcrypt.hash('owner123', 10)
  await p.user.upsert({
    where: { email: 'owner@mountainlodge.com' },
    update: {},
    create: {
      email: 'owner@mountainlodge.com',
      password: owner3Password,
      name: 'Tom Mountain',
      role: Role.OWNER,
      hotelId: mountainLodge.id,
    },
  })

  // Additional Grand Palace staff
  const staffData = [
    { email: 'manager@grandpalace.com',   password: 'manager123',  name: 'Sarah Johnson', role: Role.MANAGER },
    { email: 'reception@grandpalace.com', password: 'recep123',    name: 'Mike Davis',    role: Role.RECEPTIONIST },
    { email: 'kitchen@grandpalace.com',   password: 'kitchen123',  name: 'Chef Antonio',  role: Role.KITCHEN },
  ]
  for (const s of staffData) {
    await p.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        password: await bcrypt.hash(s.password, 10),
        name: s.name,
        role: s.role,
        hotelId: grandPalace.id,
      },
    })
  }

  console.log('\n✅ Seed complete!\n')
  console.log('─── Test Accounts ───────────────────────────────')
  console.log('Super Admin      admin@hotelplatform.com  / superadmin123')
  console.log('Owner (GP)       owner@grandpalace.com    / owner123')
  console.log('Manager (GP)     manager@grandpalace.com  / manager123')
  console.log('Receptionist     reception@grandpalace.com/ recep123')
  console.log('Kitchen          kitchen@grandpalace.com  / kitchen123')
  console.log('Owner (Ocean)    owner@oceanview.com      / owner123')
  console.log('Owner (Mountain) owner@mountainlodge.com  / owner123')
  console.log('\n─── Landing Pages ───────────────────────────────')
  console.log('http://localhost:3000/stay/grand-palace')
  console.log('http://localhost:3000/stay/mountain-lodge')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
