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

/** Merge static catalog with optional runtime uploads (uploads appended, catalog untouched). */
export function mergeMarkenProdukte(uploaded: MarkenProdukt[] = []): MarkenProdukt[] {
  if (uploaded.length === 0) return markenProdukte
  return [...markenProdukte, ...uploaded]
}

export function markenMitProduktenFrom(produkte: MarkenProdukt[]) {
  return marken.filter((m) => produkte.some((p) => p.brandSlug === m.slug))
}

export const markenMitProdukten = markenMitProduktenFrom(markenProdukte)
