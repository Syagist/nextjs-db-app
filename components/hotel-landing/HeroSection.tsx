import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  name: string
  location: string
  description: string | null
  heroImage: string | null
  slug: string
}

export function HeroSection({ name, location, description, heroImage, slug }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      {heroImage ? (
        <Image
          src={heroImage}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}

      {/* Gradient overlay — bottom-heavy for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        {/* Location badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          {location}
        </div>

        {/* Hotel name */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          {name}
        </h1>

        {/* Star rating */}
        <div className="mb-6 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Description */}
        {description && (
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80">
            {description}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`#booking`}
            className="rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-400 hover:shadow-amber-500/30 hover:shadow-xl"
          >
            Reserve Your Stay
          </a>
          <a
            href="#rooms"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Explore Rooms
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#gallery" aria-label="Scroll down">
          <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </div>

      {/* Nav overlay */}
      <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 py-6">
        <Link href="/" className="text-sm font-semibold tracking-widest text-white/80 uppercase hover:text-white transition">
          HotelHub
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/70 sm:flex">
          <a href="#gallery" className="hover:text-white transition">Gallery</a>
          <a href="#rooms" className="hover:text-white transition">Rooms</a>
          <a href="#dining" className="hover:text-white transition">Dining</a>
          <a href="#amenities" className="hover:text-white transition">Amenities</a>
          <a
            href="#booking"
            className="rounded-full border border-white/40 px-5 py-1.5 text-white transition hover:bg-white hover:text-slate-900"
          >
            Book Now
          </a>
        </div>
      </nav>
    </section>
  )
}
