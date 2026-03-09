'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MenuItemData {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image: string | null
}

interface RestaurantMenuSectionProps {
  menuItems: MenuItemData[]
}

export function RestaurantMenuSection({ menuItems }: RestaurantMenuSectionProps) {
  const categories = Array.from(new Set(menuItems.map((i) => i.category)))
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? '')

  const filtered = menuItems.filter((i) => i.category === activeCategory)

  if (!menuItems.length) return null

  return (
    <section id="dining" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">Culinary Excellence</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Fine Dining & Room Service</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Award-winning chefs craft every dish with the finest seasonal ingredients, served in our elegant restaurant or delivered to your suite.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 16.5v-1.5m-6 1.5v-1.5M3 19.5h18M3.75 19.5v-3.75A2.25 2.25 0 016 13.5h12a2.25 2.25 0 012.25 2.25V19.5" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{item.name}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400 line-clamp-2">{item.description}</p>
                )}
                <p className="mt-1.5 text-sm font-bold text-amber-400">${Number(item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
