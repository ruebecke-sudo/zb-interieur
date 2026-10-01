import type { MarkenProdukt } from '../data/marken'

const META_KEY = 'zb-interieur.uploaded-products.v1'
const DB_NAME = 'zb-interieur-uploads'
const DB_STORE = 'images'
const DB_VERSION = 1

export type UploadedProductRecord = MarkenProdukt & {
  id: string
  altText: string
  createdAt: string
  /** IndexedDB image key */
  imageId: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB konnte nicht geöffnet werden.'))
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
  })
}

async function idbPut(id: string, blob: Blob): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Bild speichern fehlgeschlagen.'))
    tx.objectStore(DB_STORE).put(blob, id)
  })
  db.close()
}

async function idbGet(id: string): Promise<Blob | undefined> {
  const db = await openDb()
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly')
    const req = tx.objectStore(DB_STORE).get(id)
    req.onsuccess = () => resolve(req.result as Blob | undefined)
    req.onerror = () => reject(req.error ?? new Error('Bild laden fehlgeschlagen.'))
  })
  db.close()
  return blob
}

async function idbDelete(id: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Bild löschen fehlgeschlagen.'))
    tx.objectStore(DB_STORE).delete(id)
  })
  db.close()
}

export function listUploadedProductMeta(): UploadedProductRecord[] {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UploadedProductRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUploadedProductMeta(records: UploadedProductRecord[]): void {
  localStorage.setItem(META_KEY, JSON.stringify(records))
}

/** Compress image for local persistence (keeps original filename-derived names intact). */
export async function compressImageFile(file: File, maxEdge = 1600, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Ungültige Datei: ${file.name}`)
  }

  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Bildverarbeitung nicht verfügbar.')
    ctx.drawImage(bitmap, 0, 0, w, h)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) throw new Error(`Bild konnte nicht verarbeitet werden: ${file.name}`)
    return blob
  } finally {
    bitmap.close()
  }
}

export async function saveUploadedProducts(
  drafts: Array<{
    id: string
    productName: string
    altText: string
    brandSlug: string
    brandName: string
    file: File
  }>,
): Promise<UploadedProductRecord[]> {
  const existing = listUploadedProductMeta()
  const created: UploadedProductRecord[] = []

  for (const draft of drafts) {
    const imageId = `img-${draft.id}`
    const blob = await compressImageFile(draft.file)
    await idbPut(imageId, blob)

    const record: UploadedProductRecord = {
      id: draft.id,
      imageId,
      brandSlug: draft.brandSlug,
      brandName: draft.brandName,
      headline: draft.productName,
      altText: draft.altText || draft.productName,
      price: 'Preis auf Anfrage',
      stilpunkteUrl: `/marken#upload-${draft.id}`,
      image: '', // hydrated at runtime from IndexedDB
      createdAt: new Date().toISOString(),
    }
    created.push(record)
  }

  saveUploadedProductMeta([...existing, ...created])
  return created
}

export async function hydrateUploadedProducts(): Promise<MarkenProdukt[]> {
  const meta = listUploadedProductMeta()
  const out: MarkenProdukt[] = []

  for (const item of meta) {
    try {
      const blob = await idbGet(item.imageId)
      if (!blob) continue
      const url = URL.createObjectURL(blob)
      out.push({
        brandSlug: item.brandSlug,
        brandName: item.brandName,
        headline: item.headline,
        price: item.price,
        stilpunkteUrl: item.stilpunkteUrl,
        image: url,
        altText: item.altText || item.headline,
      })
    } catch {
      // skip broken records
    }
  }
  return out
}

export async function clearUploadedProducts(): Promise<void> {
  const meta = listUploadedProductMeta()
  for (const item of meta) {
    try {
      await idbDelete(item.imageId)
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(META_KEY)
}

export function getUploadedAltText(stilpunkteUrl: string): string | undefined {
  return listUploadedProductMeta().find((p) => p.stilpunkteUrl === stilpunkteUrl)?.altText
}
