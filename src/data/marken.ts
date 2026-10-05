import { markenBrands, markenProducts, markenSource } from './marken-data'

export type Marke = {
  name: string
  slug: string
  stilpunkteUrl: string
  logo: string
}

export type MarkenProdukt = {
  brandSlug: string
  brandName: string
  headline: string
  image: string
  price: string
  stilpunkteUrl: string
  /** Optional alt text (e.g. from uploads). Falls back to brand + headline in UI. */
  altText?: string
}

export { markenSource }

export const marken: Marke[] = markenBrands.map((b) => ({ ...b }))

/** Static catalog only — never mutated by uploads. */
export const markenProdukte: MarkenProdukt[] = markenProducts
  .filter((p) => p.image && p.headline)
  .map((p) => ({ ...p, price: 'Preis auf Anfrage' }))

/** Merge static catalog with runtime library/uploads.
 * `overridesByCatalogImage` maps original catalog image paths → edited library products.
 */
export function mergeMarkenProdukte(
  runtime: MarkenProdukt[] = [],
  overridesByCatalogImage: Map<string, MarkenProdukt> = new Map(),
): MarkenProdukt[] {
  if (runtime.length === 0 && overridesByCatalogImage.size === 0) return markenProdukte

  const covered = new Set<string>()
  const merged = markenProdukte.map((p) => {
    const override = overridesByCatalogImage.get(p.image)
    if (!override) return p
    covered.add(override.stilpunkteUrl)
    return {
      ...p,
      headline: override.headline || p.headline,
      altText: override.altText || p.altText,
      brandName: override.brandName || p.brandName,
      brandSlug: override.brandSlug || p.brandSlug,
      image: override.image || p.image,
      stilpunkteUrl: override.stilpunkteUrl || p.stilpunkteUrl,
    }
  })

  const extras = runtime.filter((p) => !covered.has(p.stilpunkteUrl))
  return [...merged, ...extras]
}

export function markenMitProduktenFrom(produkte: MarkenProdukt[]) {
  return marken.filter((m) => produkte.some((p) => p.brandSlug === m.slug))
}

export const markenMitProdukten = markenMitProduktenFrom(markenProdukte)
