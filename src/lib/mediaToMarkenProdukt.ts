/** Map media-library images to Marken Produktauswahl entries. */

import { marken, type MarkenProdukt } from '../data/marken'
import type { MediaImage } from './mediaApi'
import { matchBrand, parseProductFilename } from './productNameFromFilename'

const brandLookup = marken.map((m) => ({ name: m.name, slug: m.slug }))

/**
 * Convert a library image to a Marken product when a known brand can be resolved
 * from Kategorie 1 or the filename/name prefix.
 */
export function mediaImageToMarkenProdukt(img: MediaImage): MarkenProdukt | null {
  if (!img?.url) return null

  const fromCategory = matchBrand(img.category1 || '', brandLookup)
  const fromFile = parseProductFilename(img.originalFilename || img.name || '', brandLookup)
  const brandSlug = fromCategory?.slug || fromFile.brandSlug
  const brandName = fromCategory?.name || fromFile.brandName
  if (!brandSlug || !brandName) return null

  const headline = (img.name || '').trim() || fromFile.productName
  if (!headline) return null

  return {
    brandSlug,
    brandName,
    headline,
    image: img.url,
    price: 'Preis auf Anfrage',
    stilpunkteUrl: `/marken#media-${img.id}`,
    altText: (img.text || headline).trim(),
  }
}

export function mediaOverrideKey(img: MediaImage): string {
  return img.sourceUrl || img.url
}

export function mediaImagesToMarkenProdukte(items: MediaImage[]): {
  products: MarkenProdukt[]
  overridesByCatalogImage: Map<string, MarkenProdukt>
} {
  const products: MarkenProdukt[] = []
  const overridesByCatalogImage = new Map<string, MarkenProdukt>()
  for (const item of items) {
    const mapped = mediaImageToMarkenProdukt(item)
    if (!mapped) continue
    products.push(mapped)
    overridesByCatalogImage.set(mediaOverrideKey(item), mapped)
  }
  return { products, overridesByCatalogImage }
}
