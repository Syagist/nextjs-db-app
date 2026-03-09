'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  altText: string | null
}

interface HotelGallerySliderProps {
  images: GalleryImage[]
  hotelName: string
}

export function HotelGallerySlider({ images, hotelName }: HotelGallerySliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback(
    (index: number) => {
      if (animating || index === current) return
      setAnimating(true)
      setCurrent(index)
      setTimeout(() => setAnimating(false), 400)
    },
    [animating, current],
  )

  const prev = useCallback(() => go((current - 1 + images.length) % images.length), [go, current, images.length])
  const next = useCallback(() => go((current + 1) % images.length), [go, current, images.length])

  if (!images.length) return null

  return (
    <section id="gallery" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">Our Property</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Experience {hotelName}</h2>
        </div>

        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900" style={{ aspectRatio: '16/9' }}>
          <Image
            key={current}
            src={images[current].url}
            alt={images[current].altText ?? hotelName}
            fill
            className={`object-cover transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          {/* Gradient sides for arrows */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />

          {/* Arrow buttons */}
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>

          {/* Caption */}
          {images[current].altText && (
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-4 py-1 text-sm text-white backdrop-blur-sm">
              {images[current].altText}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === current
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `Gallery ${i + 1}`}
                fill
                className="object-cover"
                sizes="128px"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
