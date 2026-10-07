/** ZB Interieur website reads its images directly from Image Manager Pro (public gallery). */

import type { MediaImage } from './mediaApi'

/**
 * Public gallery ID of the Image Manager Pro workspace that maintains the ZB website
 * (currently "Digitale Medien"). Not a secret: it only works while that workspace has
 * its gallery switched on. Change it when ZB gets its own workspace.
 */
export const ZB_GALLERY_ID = '28bd9fd9-4350-4174-a288-b097f3ff03f0'

export type GalleryItem = {
  id: string
  name: string | null
  text: string | null
  category1: string | null
  category2: string | null
  category3: string | null
  category4: string | null
  url: string
  width: number | null
  height: number | null
  external_id: string | null
}

let cache: Promise<GalleryItem[]> | null = null

/** All gallery images of the ZB workspace (newest first). Empty list if unavailable. */
export function loadImageManagerItems(): Promise<GalleryItem[]> {
  if (!cache) {
    cache = fetch(`/.netlify/functions/public-gallery?id=${ZB_GALLERY_ID}&limit=200`)
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((body: { items?: GalleryItem[] }) => body.items || [])
      .catch(() => [])
  }
  return cache
}

/** Same shape as the old ZB media library, so the existing mapping code can be reused. */
export function galleryItemToMediaImage(item: GalleryItem): MediaImage {
  return {
    id: `imp-${item.id}`,
    name: item.name || '',
    text: item.text || '',
    category1: item.category1 || '',
    category2: item.category2 || '',
    category3: item.category3 || '',
    category4: item.category4 || '',
    width: item.width || 0,
    height: item.height || 0,
    colorSpace: '',
    format: '',
    fileSize: 0,
    url: item.url,
    uploadedAt: '',
    updatedAt: '',
    originalFilename: item.name || '',
    mimeType: '',
    storageKey: '',
    external: true,
  }
}

/**
 * Image Manager Pro items that are not already in the old ZB media library.
 * Images pushed to ZB keep the library id in external_id.
 */
export function withoutLibraryDuplicates(items: GalleryItem[], libraryIds: Set<string>): GalleryItem[] {
  return items.filter((item) => !item.external_id || !libraryIds.has(item.external_id))
}
