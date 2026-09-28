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
}

export { markenSource }

export const marken: Marke[] = markenBrands.map((b) => ({ ...b }))

export const markenProdukte: MarkenProdukt[] = markenProducts
  .filter((p) => p.image && p.headline)
  .map((p) => ({ ...p }))

export const markenMitProdukten = marken.filter((m) =>
  markenProdukte.some((p) => p.brandSlug === m.slug),
)
