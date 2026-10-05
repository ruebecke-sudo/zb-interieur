/** Shared media library types (API + UI). */

export type MediaImage = {
  id: string
  /** Display name (defaults from original filename without path). */
  name: string
  /** Free-text description / alt / Bildtext. */
  text: string
  /** Kategorie 1 = Hersteller / Marke */
  category1: string
  /** Kategorie 2 = Produktart */
  category2: string
  /** Kategorie 3 = Bereich */
  category3: string
  /** Kategorie 4 = Stil / Thema */
  category4: string
  width: number
  height: number
  colorSpace: string
  format: string
  fileSize: number
  /** Public URL path, e.g. /media/library/{id}.jpg */
  url: string
  uploadedAt: string
  updatedAt: string
  originalFilename: string
  mimeType: string
  storageKey: string
  /** True when the file lives outside the media library folder (e.g. catalog /images/…). */
  external?: boolean
  /** Original public URL this record overrides (catalog merge). */
  sourceUrl?: string
}

export type MediaImageInput = {
  name?: string
  text?: string
  category1?: string
  category2?: string
  category3?: string
  category4?: string
}

export type MediaListQuery = {
  q?: string
  category1?: string | string[]
  category2?: string | string[]
  category3?: string | string[]
  category4?: string | string[]
}

export type MediaCategories = {
  category1: string[]
  category2: string[]
  category3: string[]
  category4: string[]
}

export const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

export const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

export function defaultMaxBytes(): number {
  const raw = process.env.IMAGE_MAX_BYTES
  const n = raw ? Number(raw) : 15 * 1024 * 1024
  return Number.isFinite(n) && n > 0 ? n : 15 * 1024 * 1024
}
