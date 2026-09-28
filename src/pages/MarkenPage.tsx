import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  marken,
  markenMitProdukten,
  markenProdukte,
  markenSource,
  type MarkenProdukt,
} from '../data/marken'

export function MarkenPage() {
  const [active, setActive] = useState<string>('alle')

  const filtered = useMemo(() => {
    if (active === 'alle') return markenProdukte
    return markenProdukte.filter((p) => p.brandSlug === active)
  }, [active])

  const activeBrand = marken.find((m) => m.slug === active)

  return (
    <>
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 90% 10%, color-mix(in srgb, var(--color-brand-soft) 50%, transparent), transparent 55%),
              linear-gradient(155deg, var(--color-brand-dark) 0%, var(--color-brand) 55%, #1a000c 100%)
            `,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            ZB Interieur · Markenwelt
          </p>
          <h1 className="mt-4 max-w-3xl font-sans text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
            Kuratierte
            <span className="mt-1 block text-accent">Designermarken</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Exklusive Möbel, Leuchten und Accessoires – ausgewählt für den Showroom in Homburg.
            Entdecken Sie Produktwelten führender Labels. Tippen Sie auf ein Bild für die
            Originalgröße.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#produkte"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Produkte entdecken
            </a>
            <Link
              to="/termin"
              className="inline-flex border border-white/35 px-7 py-3.5 text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:border-white hover:bg-white/5"
            >
              Beratungstermin
            </Link>
          </div>
        </div>
      </section>

      {/* Logo-Band */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {marken.length} Marken
              </p>
              <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
                Partnerlabels im Showroom
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Auswahl ohne Lambert und Sifas – Fokus auf die übrigen Designermarken aus dem
              STILPUNKTE-Eintrag.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {marken.map((b) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => {
                  setActive(b.slug)
                  document.getElementById('produkte')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`group flex aspect-[5/3] items-center justify-center border bg-fog px-4 transition ${
                  active === b.slug
                    ? 'border-brand bg-white'
                    : 'border-transparent hover:border-line hover:bg-white'
                }`}
                aria-label={`Produkte von ${b.name} zeigen`}
              >
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="max-h-12 w-auto max-w-full object-contain opacity-80 transition group-hover:opacity-100"
                  />
                ) : (
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    {b.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produkte */}
      <section id="produkte" className="scroll-mt-36 bg-fog md:scroll-mt-40">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                Produktauswahl
              </p>
              <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
                {active === 'alle'
                  ? 'Alle gezeigten Produkte'
                  : activeBrand?.name ?? 'Produkte'}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {filtered.length} {filtered.length === 1 ? 'Produkt' : 'Produkte'}
                {active !== 'alle' ? ` · ${activeBrand?.name}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={active === 'alle'}
                onClick={() => setActive('alle')}
                label="Alle"
              />
              {markenMitProdukten.map((m) => (
                <FilterChip
                  key={m.slug}
                  active={active === m.slug}
                  onClick={() => setActive(m.slug)}
                  label={m.name}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.stilpunkteUrl} product={p} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted">
              Für diese Marke sind in der aktuellen Auswahl keine Produktbilder hinterlegt.
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-sans text-2xl font-extrabold md:text-3xl">
              Marke erleben – im Showroom Homburg
            </h2>
            <p className="mt-2 max-w-xl text-white/75">
              Materialien, Maße und Varianten besprechen wir persönlich. Vereinbaren Sie einen
              Termin – wir ordnen die passende Markenwelt Ihrem Raum zu.
            </p>
            <p className="mt-3 text-[11px] tracking-wide text-white/40 uppercase">
              Quelle: stilpunkte.de · ZB Interieur
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Termin buchen
            </Link>
            <a
              href={markenSource}
              target="_blank"
              rel="noreferrer"
              className="inline-flex border border-white/30 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase hover:border-white"
            >
              STILPUNKTE-Eintrag
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition ${
        active ? 'bg-brand text-white' : 'bg-white text-ink/70 hover:text-brand'
      }`}
    >
      {label}
    </button>
  )
}

function ProductCard({ product }: { product: MarkenProdukt }) {
  const brand = marken.find((m) => m.slug === product.brandSlug)
  return (
    <article className="group flex h-full flex-col bg-white">
      <div className="relative overflow-hidden bg-fog">
        <img
          src={product.image}
          alt={`${product.brandName}: ${product.headline}`}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <span className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            Klicken für Originalgröße
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          {brand?.logo ? (
            <img
              src={brand.logo}
              alt=""
              data-no-zoom
              className="h-6 w-auto max-w-[88px] object-contain"
            />
          ) : null}
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {product.brandName}
          </p>
        </div>
        <h3 className="font-sans text-lg leading-snug font-bold text-ink">{product.headline}</h3>
        {product.price ? (
          <p className="mt-3 text-sm font-medium text-muted">{product.price}</p>
        ) : null}
      </div>
    </article>
  )
}
