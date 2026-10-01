/** Parse product display names from image filenames. No AI rewriting. */

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i

export type ParsedProductFilename = {
  /** Full product title from filename (extension removed, `_` → space). */
  productName: string
  /** First token when it matches a known brand (original casing from filename). */
  brandToken: string | null
  /** Matched catalog brand slug, if any. */
  brandSlug: string | null
  /** Matched catalog brand display name, if any. */
  brandName: string | null
}

export type BrandLookup = {
  name: string
  slug: string
}

/** Normalize a raw filename into a product title (rules from Produktverwaltung). */
export function filenameToProductName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? filename
  const withoutExt = base.replace(IMAGE_EXT, '')
  const spaced = withoutExt.replace(/_/g, ' ')
  // Collapse whitespace only; keep -, /, ., °, Ø, x, etc.
  return spaced.replace(/\s+/g, ' ').trim()
}

function normalizeBrandKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

/**
 * Derive product name + brand from a filename.
 * Brand is taken only from the filename prefix matching known brands — never from image content.
 */
export function parseProductFilename(
  filename: string,
  brands: readonly BrandLookup[] = [],
): ParsedProductFilename {
  const productName = filenameToProductName(filename)
  if (!productName) {
    return { productName: '', brandToken: null, brandSlug: null, brandName: null }
  }

  const firstToken = productName.split(' ')[0] ?? ''
  if (!firstToken || brands.length === 0) {
    return { productName, brandToken: null, brandSlug: null, brandName: null }
  }

  const key = normalizeBrandKey(firstToken)
  const match = brands.find(
    (b) => normalizeBrandKey(b.name) === key || normalizeBrandKey(b.slug) === key,
  )

  if (!match) {
    return { productName, brandToken: null, brandSlug: null, brandName: null }
  }

  return {
    productName,
    brandToken: firstToken,
    brandSlug: match.slug,
    brandName: match.name,
  }
}
