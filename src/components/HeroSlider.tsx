import { useEffect, useState } from 'react'

const slides = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
  '/images/hero-4.jpg',
  '/images/hero-5.jpg',
  '/images/ledersofa.jpg',
  '/images/showroom-1.jpg',
  '/images/showroom-2.jpg',
  '/images/showroom-3.jpg',
]

type HeroSliderProps = {
  title: string
  subtitle: string
  ctaHref: string
  ctaLabel: string
}

export function HeroSlider({ title, subtitle, ctaHref, ctaLabel }: HeroSliderProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover ${i === index ? 'animate-kenburns' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-32 md:pb-24 md:pt-36">
        <p className="animate-fade-up mb-3 font-serif text-xs tracking-[0.2em] text-white/80 uppercase sm:mb-4 sm:text-sm md:text-base">
          ZB Interieur · Homburg
        </p>
        <h1
          className="animate-fade-up max-w-3xl font-serif text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '120ms' }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg"
          style={{ animationDelay: '220ms' }}
        >
          {subtitle}
        </p>
        <div className="animate-fade-up mt-6 flex flex-wrap gap-3 sm:mt-8" style={{ animationDelay: '320ms' }}>
          <a
            href={ctaHref}
            className="inline-flex items-center rounded-sm bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-brand-dark sm:px-6 sm:text-sm"
          >
            {ctaLabel}
          </a>
          <a
            href="tel:+4968419597223"
            className="inline-flex items-center rounded-sm border border-white/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/10 sm:px-6 sm:text-sm"
          >
            Anrufen
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
