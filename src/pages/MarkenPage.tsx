import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  marken,
  markenMitProduktenFrom,
  markenSource,
  mergeMarkenProdukte,
  type MarkenProdukt,
} from '../data/marken'
import { listMediaPublic, type MediaImage } from '../lib/mediaApi'
import { galleryItemToMediaImage, loadImageManagerItems, withoutLibraryDuplicates } from '../lib/imageManagerFeed'
import { mediaImagesToMarkenProdukte } from '../lib/mediaToMarkenProdukt'
import {
  getUploadedAltText,
  hydrateUploadedProducts,
} from '../lib/uploadedProductsStore'

export function MarkenPage() {
  const [active, setActive] = useState<string>('alle')
  const [uploaded, setUploaded] = useState<MarkenProdukt[]>([])
  const [library, setLibrary] = useState<MarkenProdukt[]>([])
  const [catalogOverrides, setCatalogOverrides] = useState<Map<string, MarkenProdukt>>(
    () => new Map(),
  )
  // True once the former catalog lives in Image Manager Pro: then it is the only source.
  const [managerOnly, setManagerOnly] = useState(false)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      hydrateUploadedProducts().catch(() => [] as MarkenProdukt[]),
      listMediaPublic()
        .then((res) => res.items)
        .catch(() => [] as MediaImage[]),
      // Image Manager Pro: new images appear here automatically (brand = Kategorie 1).
      loadImageManagerItems(),
    ]).then(([localUploads, libraryItems, managerItems]) => {
      if (cancelled) return
      setUploaded(localUploads)
      // Imported catalog rows carry external_id "zb-catalog:…" / "zb-library:…".
      if (managerItems.some((item) => item.external_id?.startsWith('zb-'))) {
        setManagerOnly(true)
        setLibrary(mediaImagesToMarkenProdukte(managerItems.map(galleryItemToMediaImage)).products)
        setCatalogOverrides(new Map())
        return
      }
      const libraryIds = new Set(libraryItems.map((item) => item.id))
      const libraryResult = mediaImagesToMarkenProdukte([
        ...withoutLibraryDuplicates(managerItems, libraryIds).map(galleryItemToMediaImage),
        ...libraryItems,
      ])
      setUploaded(localUploads)
      setLibrary(libraryResult.products)
      setCatalogOverrides(libraryResult.overridesByCatalogImage)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const allProdukte = useMemo(
    () => (managerOnly ? [...library, ...uploaded] : mergeMarkenProdukte([...library, ...uploaded], catalogOverrides)),
    [managerOnly, library, uploaded, catalogOverrides],
  )
  const brandsWithProducts = useMemo(
    () => markenMitProduktenFrom(allProdukte),
    [allProdukte],
  )

  // Remembers for which filter "Mehr anzeigen" was clicked; another filter starts collapsed again.
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const showAll = expandedFor === active

  const brandFiltered = useMemo(() => {
    if (active === 'alle') return allProdukte
    return allProdukte.filter((p) => p.brandSlug === active)
  }, [active, allProdukte])

  // "Alle": at most two pieces per brand until the visitor asks for more.
  const filtered = useMemo(() => {
    if (active !== 'alle' || showAll) return brandFiltered
    const perBrand = new Map<string, number>()
    return brandFiltered.filter((p) => {
      const count = perBrand.get(p.brandSlug) ?? 0
      perBrand.set(p.brandSlug, count + 1)
      return count < 2
    })
  }, [active, showAll, brandFiltered])
  const hiddenCount = brandFiltered.length - filtered.length

  const activeBrand = marken.find((m) => m.slug === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)
  const heroImage = allProdukte[4]?.image ?? allProdukte[0]?.image

  return (
    <>
      {/* Full-bleed editorial hero */}
      <section className="relative min-h-[58vh] overflow-hidden bg-brand text-white md:min-h-[64vh]">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            data-no-zoom
            className="animate-kenburns absolute inset-0 h-full w-full object-cover opacity-45"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(105deg, rgba(26,0,12,0.94) 0%, rgba(66,0,27,0.82) 42%, rgba(88,0,36,0.35) 72%, rgba(26,0,12,0.55) 100%),
              radial-gradient(ellipse 55% 45% at 85% 20%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 60%)
            `,
          }}
        />
        <div className="relative mx-auto flex min-h-[58vh] max-w-6xl flex-col justify-center px-4 py-14 md:min-h-[64vh] md:py-16">
          <p className="animate-fade-up text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-[-0.03em] text-white">
            Designmöbel Homburg
          </p>
          <h1 className="animate-fade-up mt-3 max-w-3xl font-sans text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] font-extrabold tracking-[-0.04em] [animation-delay:80ms]">
            Markenwelt
            <span className="mt-2 block text-accent">kuratiert.</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base [animation-delay:140ms]">
            {marken.length} Designermarken und ausgewählte Produktwelten im Möbelhaus und
            Einrichtungshaus Homburg – Designmöbel für Saarbrücken und das Saarland.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3 [animation-delay:200ms]">
            <a
              href="#produkte"
              className="inline-flex bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
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

      {/* Logo marquee */}
      <section className="overflow-hidden border-b border-line bg-white py-10 md:py-12" data-no-zoom-root>
        <div className="mx-auto mb-6 max-w-6xl px-4">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
            Partnerlabels
          </p>
          <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
            {marken.length} Marken im Showroom Homburg
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
            Unter anderem {marken.slice(0, 8).map((m) => m.name).join(', ')}
            {marken.length > 8 ? ' und weitere Designermarken' : ''} – erhältlich im
            Einrichtungshaus ZB Interieur.
          </p>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24"
          />
          <div className="marken-marquee-track gap-10 px-6 md:gap-14">
            {[...marken, ...marken].map((b, i) => (
              <button
                key={`${b.slug}-${i}`}
                type="button"
                onClick={() => {
                  setActive(b.slug)
                  document.getElementById('produkte')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex h-16 w-[140px] shrink-0 items-center justify-center opacity-70 transition hover:opacity-100"
                aria-label={`Produkte von ${b.name} zeigen`}
              >
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    data-no-zoom
                    className="max-h-10 w-auto max-w-full object-contain"
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

      {/* Produkte – editorial */}
      <section id="produkte" className="scroll-mt-36 bg-fog md:scroll-mt-40">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                Produktauswahl
              </p>
              <h2 className="mt-2 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight">
                {active === 'alle'
                  ? 'Kuratierte Stücke'
                  : activeBrand?.name ?? 'Produkte'}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {brandFiltered.length} {brandFiltered.length === 1 ? 'Produkt' : 'Produkte'}
                {active !== 'alle'
                  ? ` · ${activeBrand?.name}`
                  : ` · ${brandsWithProducts.length} Marken mit Exponaten`}
              </p>
            </div>
            <div className="flex max-w-3xl flex-wrap gap-1.5">
              <FilterChip active={active === 'alle'} onClick={() => setActive('alle')} label="Alle" />
              {brandsWithProducts.map((m) => (
                <FilterChip
                  key={m.slug}
                  active={active === m.slug}
                  onClick={() => setActive(m.slug)}
                  label={m.name}
                />
              ))}
            </div>
          </div>

          {featured ? (
            <article className="animate-marken-reveal group mb-8 grid overflow-hidden bg-white lg:grid-cols-12">
              <div className="relative overflow-hidden bg-fog lg:col-span-7">
                <img
                  src={featured.image}
                  alt={
                    featured.altText ||
                    getUploadedAltText(featured.stilpunkteUrl) ||
                    `${featured.brandName}: ${featured.headline}`
                  }
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03] lg:aspect-[5/4] lg:min-h-[420px]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
                    Klicken für Originalgröße
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-5">
                <BrandMark product={featured} />
                <h3 className="mt-5 font-sans text-2xl leading-snug font-extrabold tracking-tight text-ink md:text-3xl">
                  {featured.headline}
                </h3>
                {(featured.altText || getUploadedAltText(featured.stilpunkteUrl)) &&
                (featured.altText || getUploadedAltText(featured.stilpunkteUrl)) !== featured.headline ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                    {featured.altText || getUploadedAltText(featured.stilpunkteUrl)}
                  </p>
                ) : null}
              </div>
            </article>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <ProductCard key={p.stilpunkteUrl} product={p} index={i} />
            ))}
          </div>

          {hiddenCount > 0 ? (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setExpandedFor(active)}
                className="inline-flex items-center bg-brand px-6 py-3 text-[12px] font-bold tracking-[0.12em] text-white uppercase transition hover:brightness-110"
              >
                Mehr anzeigen ({hiddenCount} weitere)
              </button>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted">
              Für diese Marke sind in der aktuellen Auswahl keine Produktbilder hinterlegt.
            </p>
          ) : null}
        </div>
      </section>

      {/* Brand index */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
              Markenverzeichnis
            </p>
            <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
              Alle Labels auf einen Blick
            </h2>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {marken.map((b) => {
              const count = allProdukte.filter((p) => p.brandSlug === b.slug).length
              return (
                <li key={b.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(b.slug)
                      document.getElementById('produkte')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="group flex w-full items-center gap-3 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-fog p-1.5">
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt=""
                          data-no-zoom
                          className="max-h-full max-w-full object-contain opacity-80 transition group-hover:opacity-100"
                        />
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink transition group-hover:text-brand">
                        {b.name}
                      </span>
                      <span className="text-[11px] text-muted">
                        {count > 0 ? `${count} Produkte` : 'Showroom'}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
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
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex bg-accent px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
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

function BrandMark({ product }: { product: MarkenProdukt }) {
  const brand = marken.find((m) => m.slug === product.brandSlug)
  return (
    <div className="flex items-center gap-3">
      {brand?.logo ? (
        <img
          src={brand.logo}
          alt=""
          data-no-zoom
          className="h-7 w-auto max-w-[100px] object-contain"
        />
      ) : null}
      <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
        {product.brandName}
      </p>
    </div>
  )
}

function ProductCard({ product, index }: { product: MarkenProdukt; index: number }) {
  const alt =
    product.altText ||
    getUploadedAltText(product.stilpunkteUrl) ||
    `${product.brandName}: ${product.headline}`
  return (
    <article
      className="animate-marken-reveal group flex h-full flex-col bg-white"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="relative overflow-hidden bg-fog">
        <img
          src={product.image}
          alt={alt}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <span className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            Klicken für Originalgröße
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <BrandMark product={product} />
        <h3 className="mt-3 font-sans text-lg leading-snug font-bold text-ink">{product.headline}</h3>
        {product.altText && product.altText !== product.headline ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{product.altText}</p>
        ) : null}
      </div>
    </article>
  )
}
