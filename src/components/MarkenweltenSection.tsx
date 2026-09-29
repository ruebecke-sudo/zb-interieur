import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { markenwelten, type MarkenweltCategory } from '../data/markenwelten'
import { useFocusTrap } from '../hooks/useFocusTrap'

export function MarkenweltenSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = markenwelten.find((c) => c.id === activeId) ?? null

  return (
    <section className="bg-fog" aria-labelledby="markenwelten-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
            Markenwelten
          </p>
          <h2
            id="markenwelten-heading"
            className="mt-2 font-sans text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold tracking-tight"
          >
            Inspiration nach Raum
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Wählen Sie eine Kategorie – im Overlay sehen Sie Motive aus unseren Galerien und dem
            Möbel-Sortiment mit Kurzbezeichnungen. Tippen Sie auf ein Bild für die Originalgröße.
          </p>
        </div>

        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {markenwelten.map((cat, i) => {
            const span =
              i === 0
                ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-[540px]'
                : 'min-h-[220px] lg:min-h-[260px]'
            return (
              <li key={cat.id} className={span}>
                <button
                  type="button"
                  onClick={() => setActiveId(cat.id)}
                  className="group relative h-full min-h-[inherit] w-full overflow-hidden text-left"
                  aria-haspopup="dialog"
                  aria-label={`Markenwelt ${cat.label} öffnen: ${cat.teaser}`}
                >
                <img
                  src={cat.cover}
                  alt=""
                  data-no-zoom
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent transition group-hover:from-ink/90"
                />
                <div className="relative flex h-full flex-col justify-end p-5 md:p-7">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase">
                    {cat.teaser}
                  </p>
                  <h3 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                    {cat.label}
                  </h3>
                  <span className="mt-3 inline-flex text-[11px] font-semibold tracking-[0.14em] text-accent uppercase opacity-90 transition group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                    Mehr entdecken →
                  </span>
                </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {active ? <CategoryOverlay category={active} onClose={() => setActiveId(null)} /> : null}
    </section>
  )
}

function CategoryOverlay({
  category,
  onClose,
}: {
  category: MarkenweltCategory
  onClose: () => void
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-stretch justify-center bg-ink/90 p-3 backdrop-blur-sm md:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="animate-marken-reveal relative flex w-full max-w-6xl flex-col overflow-hidden bg-[#0f0b0d] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-8 md:py-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase">
              Markenwelt
            </p>
            <h2 id={titleId} className="mt-1 font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
              {category.label}
            </h2>
            <p className="mt-1 text-sm text-white/75">{category.teaser}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-white/10 text-2xl leading-none transition hover:bg-white/20"
            aria-label={`${category.label} schließen`}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <li key={`${item.brand}-${item.title}-${item.image}`}>
                <article className="group flex flex-col">
                  <div className="relative overflow-hidden bg-white/5">
                    <img
                      src={item.image}
                      alt={`${item.brand}: ${item.title}`}
                      tabIndex={0}
                      className="aspect-[4/5] w-full cursor-zoom-in object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
                        Enter für Originalgröße
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
                      {item.brand}
                    </p>
                    <h3 className="mt-1 font-sans text-lg font-bold leading-snug">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">{item.caption}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:px-8">
          <p className="text-sm text-white/70">
            Alle Marken und Produkte im Überblick auf der Markenseite.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/marken"
              className="inline-flex bg-accent px-5 py-2.5 text-[11px] font-bold tracking-[0.1em] text-white uppercase hover:brightness-95"
              onClick={onClose}
            >
              Zur Markenwelt
            </Link>
            <Link
              to="/termin"
              className="inline-flex border border-white/40 px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-white uppercase hover:border-white"
              onClick={onClose}
            >
              Termin
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
