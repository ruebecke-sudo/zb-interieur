/** Map media-library images to Marken Produktauswahl entries. */

import { marken, type MarkenProdukt } from '../data/marken'
import { matchBrand, parseProductFilename } from './productNameFromFilename'
import type { MediaImage } from './mediaApi'

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

export function mediaImagesToMarkenProdukte(items: MediaImage[]): MarkenProdukt[] {
  const out: MarkenProdukt[] = []
  for (const item of items) {
    const mapped = mediaImageToMarkenProdukt(item)
    if (mapped) out.push(mapped)
  }
  return out
}
