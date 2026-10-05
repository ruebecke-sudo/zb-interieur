/** Media store: filesystem locally, Netlify Blobs when available. */

import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { analyzeImageBuffer, filenameToDefaultName, sanitizeFilename } from './analyzeImage.js'
import { DEFAULT_CATEGORIES } from './categories.js'
import type { MediaCategories, MediaImage, MediaImageInput, MediaListQuery } from './types.js'
import { ALLOWED_EXT, ALLOWED_MIME, defaultMaxBytes } from './types.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const INDEX_PATH = path.join(ROOT, 'data/media-library/index.json')
const CATEGORIES_PATH = path.join(ROOT, 'data/media-library/categories.json')
const FILES_DIR = path.join(ROOT, 'public/media/library')

type BlobStore = {
  get: (key: string, opts?: { type: 'json' | 'arrayBuffer' | 'text' }) => Promise<unknown>
  set: (key: string, value: unknown) => Promise<void>
  setJSON: (key: string, value: unknown) => Promise<void>
  delete: (key: string) => Promise<void>
}

let blobsPromise: Promise<BlobStore | null> | null = null

async function getBlobs(): Promise<BlobStore | null> {
  if (!blobsPromise) {
    blobsPromise = (async () => {
      if (!process.env.NETLIFY && !process.env.USE_NETLIFY_BLOBS) return null
      try {
        const { getStore } = await import('@netlify/blobs')
        return getStore('zb-media-library') as unknown as BlobStore
      } catch {
        return null
      }
    })()
  }
  return blobsPromise
}

async function ensureDirs(): Promise<void> {
  await fs.mkdir(path.dirname(INDEX_PATH), { recursive: true })
  await fs.mkdir(FILES_DIR, { recursive: true })
}

async function readIndex(): Promise<MediaImage[]> {
  const blobs = await getBlobs()
  if (blobs) {
    const data = (await blobs.get('index', { type: 'json' })) as MediaImage[] | null
    return Array.isArray(data) ? data : []
  }
  await ensureDirs()
  try {
    const raw = await fs.readFile(INDEX_PATH, 'utf8')
    const parsed = JSON.parse(raw) as MediaImage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeIndex(items: MediaImage[]): Promise<void> {
  const blobs = await getBlobs()
  if (blobs) {
    await blobs.setJSON('index', items)
    return
  }
  await ensureDirs()
  await fs.writeFile(INDEX_PATH, JSON.stringify(items, null, 2), 'utf8')
}

export async function getCategories(): Promise<MediaCategories> {
  const blobs = await getBlobs()
  if (blobs) {
    const data = (await blobs.get('categories', { type: 'json' })) as MediaCategories | null
    if (data?.category1?.length) return data
    await blobs.setJSON('categories', DEFAULT_CATEGORIES)
    return structuredClone(DEFAULT_CATEGORIES)
  }
  await ensureDirs()
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, 'utf8')
    const parsed = JSON.parse(raw) as MediaCategories
    return {
      category1: parsed.category1?.length ? parsed.category1 : DEFAULT_CATEGORIES.category1,
      category2: parsed.category2?.length ? parsed.category2 : DEFAULT_CATEGORIES.category2,
      category3: parsed.category3?.length ? parsed.category3 : DEFAULT_CATEGORIES.category3,
      category4: parsed.category4?.length ? parsed.category4 : DEFAULT_CATEGORIES.category4,
    }
  } catch {
    await fs.writeFile(CATEGORIES_PATH, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf8')
    return structuredClone(DEFAULT_CATEGORIES)
  }
}

export async function saveCategories(next: MediaCategories): Promise<MediaCategories> {
  const normalized: MediaCategories = {
    category1: uniqueStrings(next.category1),
    category2: uniqueStrings(next.category2),
    category3: uniqueStrings(next.category3),
    category4: uniqueStrings(next.category4),
  }
  const blobs = await getBlobs()
  if (blobs) {
    await blobs.setJSON('categories', normalized)
    return normalized
  }
  await ensureDirs()
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(normalized, null, 2), 'utf8')
  return normalized
}

function uniqueStrings(values: string[] = []): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const v of values) {
    const t = String(v || '').trim()
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

function asList(value?: string | string[]): string[] {
  if (!value) return []
  const arr = Array.isArray(value) ? value : String(value).split(',')
  return arr.map((s) => s.trim()).filter(Boolean)
}

export function filterImages(items: MediaImage[], query: MediaListQuery): MediaImage[] {
  const q = (query.q || '').trim().toLowerCase()
  const c1 = asList(query.category1).map((s) => s.toLowerCase())
  const c2 = asList(query.category2).map((s) => s.toLowerCase())
  const c3 = asList(query.category3).map((s) => s.toLowerCase())
  const c4 = asList(query.category4).map((s) => s.toLowerCase())

  return items.filter((item) => {
    if (q) {
      const hay = [item.name, item.text, item.originalFilename, item.category1, item.category2, item.category3, item.category4]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (c1.length && !c1.includes(item.category1.toLowerCase())) return false
    if (c2.length && !c2.includes(item.category2.toLowerCase())) return false
    if (c3.length && !c3.includes(item.category3.toLowerCase())) return false
    if (c4.length && !c4.includes(item.category4.toLowerCase())) return false
    return true
  })
}

export async function listImages(query: MediaListQuery = {}): Promise<MediaImage[]> {
  const items = await readIndex()
  return filterImages(items, query).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}

export async function getImage(id: string): Promise<MediaImage | null> {
  const items = await readIndex()
  return items.find((i) => i.id === id) ?? null
}

function extFromMimeOrName(mime: string, filename: string, analyzedExt: string): string {
  const fromName = path.extname(filename).toLowerCase()
  if (ALLOWED_EXT.has(fromName)) return fromName === '.jpeg' ? '.jpg' : fromName
  if (analyzedExt) return analyzedExt
  if (mime.includes('png')) return '.png'
  if (mime.includes('webp')) return '.webp'
  if (mime.includes('gif')) return '.gif'
  if (mime.includes('avif')) return '.avif'
  return '.jpg'
}

async function writeBinary(storageKey: string, buffer: Buffer, _mimeType: string): Promise<string> {
  const blobs = await getBlobs()
  if (blobs) {
    await blobs.set(`file:${storageKey}`, buffer)
    // Served via API binary endpoint when using blobs
    return `/api/images/file/${storageKey}`
  }
  await ensureDirs()
  await fs.writeFile(path.join(FILES_DIR, storageKey), buffer)
  return `/media/library/${storageKey}`
}

async function deleteBinary(storageKey: string): Promise<void> {
  if (!storageKey || storageKey.startsWith('external:')) return
  const blobs = await getBlobs()
  if (blobs) {
    try {
      await blobs.delete(`file:${storageKey}`)
    } catch {
      // ignore
    }
    return
  }
  try {
    await fs.unlink(path.join(FILES_DIR, storageKey))
  } catch {
    // ignore
  }
}

export async function readBinary(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const blobs = await getBlobs()
  if (blobs) {
    const data = (await blobs.get(`file:${storageKey}`, { type: 'arrayBuffer' })) as ArrayBuffer | null
    if (!data) return null
    const ext = path.extname(storageKey).toLowerCase()
    const mime =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.gif'
            ? 'image/gif'
            : ext === '.avif'
              ? 'image/avif'
              : 'image/jpeg'
    return { buffer: Buffer.from(data), mimeType: mime }
  }
  try {
    const buffer = await fs.readFile(path.join(FILES_DIR, storageKey))
    const ext = path.extname(storageKey).toLowerCase()
    const mime =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.gif'
            ? 'image/gif'
            : ext === '.avif'
              ? 'image/avif'
              : 'image/jpeg'
    return { buffer, mimeType: mime }
  } catch {
    return null
  }
}

export async function createImage(params: {
  buffer: Buffer
  filename: string
  mimeType: string
  meta?: MediaImageInput
  overwriteId?: string
}): Promise<MediaImage> {
  const max = defaultMaxBytes()
  if (params.buffer.length > max) {
    throw new Error(`Datei zu groß (max. ${Math.round(max / (1024 * 1024))} MB).`)
  }

  const mime = (params.mimeType || '').toLowerCase()
  const safeName = sanitizeFilename(params.filename)
  const extName = path.extname(safeName).toLowerCase()
  if (mime && !ALLOWED_MIME.has(mime) && !ALLOWED_EXT.has(extName)) {
    throw new Error(`Dateityp nicht erlaubt: ${mime || extName || 'unbekannt'}`)
  }

  let analysis
  try {
    analysis = analyzeImageBuffer(params.buffer)
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Bildanalyse fehlgeschlagen.')
  }

  if (mime && !ALLOWED_MIME.has(mime) && !ALLOWED_MIME.has(analysis.mimeType)) {
    throw new Error(`Dateityp nicht erlaubt: ${mime}`)
  }

  const items = await readIndex()
  const now = new Date().toISOString()
  const id =
    params.overwriteId && items.some((i) => i.id === params.overwriteId)
      ? params.overwriteId
      : randomUUID()

  const ext = extFromMimeOrName(mime || analysis.mimeType, safeName, analysis.extension)
  const storageKey = `${id}${ext}`

  if (params.overwriteId) {
    const existing = items.find((i) => i.id === id)
    if (existing?.storageKey && existing.storageKey !== storageKey) {
      await deleteBinary(existing.storageKey)
    }
  }

  const url = await writeBinary(storageKey, params.buffer, analysis.mimeType)
  const meta = params.meta || {}
  const previous = params.overwriteId ? items.find((i) => i.id === id) : undefined
  const record: MediaImage = {
    id,
    name: (meta.name || '').trim() || filenameToDefaultName(safeName),
    text: (meta.text || '').trim() || filenameToDefaultName(safeName),
    category1: (meta.category1 || '').trim(),
    category2: (meta.category2 || '').trim(),
    category3: (meta.category3 || '').trim(),
    category4: (meta.category4 || '').trim(),
    width: analysis.width,
    height: analysis.height,
    colorSpace: analysis.colorSpace,
    format: analysis.format,
    fileSize: params.buffer.length,
    url,
    uploadedAt: previous?.uploadedAt || now,
    updatedAt: now,
    originalFilename: safeName,
    mimeType: analysis.mimeType,
    storageKey,
    external: false,
    sourceUrl: previous?.sourceUrl || previous?.url,
  }

  let next: MediaImage[]
  if (params.overwriteId) {
    if (items.some((i) => i.id === id)) next = items.map((i) => (i.id === id ? record : i))
    else next = [record, ...items]
  } else {
    next = [record, ...items]
  }
  await writeIndex(next)
  return record
}

export async function updateImageMeta(id: string, meta: MediaImageInput): Promise<MediaImage> {
  const items = await readIndex()
  const idx = items.findIndex((i) => i.id === id)
  if (idx < 0) throw new Error('Bild nicht gefunden.')
  const current = items[idx]
  const updated: MediaImage = {
    ...current,
    name: meta.name !== undefined ? String(meta.name).trim() || current.name : current.name,
    text: meta.text !== undefined ? String(meta.text).trim() : current.text,
    category1: meta.category1 !== undefined ? String(meta.category1).trim() : current.category1,
    category2: meta.category2 !== undefined ? String(meta.category2).trim() : current.category2,
    category3: meta.category3 !== undefined ? String(meta.category3).trim() : current.category3,
    category4: meta.category4 !== undefined ? String(meta.category4).trim() : current.category4,
    updatedAt: new Date().toISOString(),
  }
  items[idx] = updated
  await writeIndex(items)
  return updated
}

export async function replaceImageFile(
  id: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<MediaImage> {
  const existing = await getImage(id)
  if (!existing) throw new Error('Bild nicht gefunden.')
  return createImage({
    buffer,
    filename,
    mimeType,
    overwriteId: id,
    meta: {
      name: existing.name,
      text: existing.text,
      category1: existing.category1,
      category2: existing.category2,
      category3: existing.category3,
      category4: existing.category4,
    },
  })
}

/** Register existing site images (e.g. Marken catalog) so they can be edited in the library. */
export async function importExternalImages(
  entries: Array<{
    name: string
    text?: string
    category1?: string
    category2?: string
    category3?: string
    category4?: string
    url: string
    originalFilename?: string
  }>,
): Promise<{ imported: MediaImage[]; skipped: number }> {
  const items = await readIndex()
  const existingUrls = new Set(items.map((i) => i.url))
  const imported: MediaImage[] = []
  let skipped = 0
  const now = new Date().toISOString()

  for (const entry of entries) {
    const url = String(entry.url || '').trim()
    if (!url || !url.startsWith('/')) {
      skipped += 1
      continue
    }
    if (existingUrls.has(url)) {
      skipped += 1
      continue
    }
    const name = String(entry.name || '').trim() || filenameToDefaultName(url)
    const id = randomUUID()
    const record: MediaImage = {
      id,
      name,
      text: String(entry.text || '').trim() || name,
      category1: String(entry.category1 || '').trim(),
      category2: String(entry.category2 || '').trim(),
      category3: String(entry.category3 || '').trim(),
      category4: String(entry.category4 || '').trim(),
      width: 0,
      height: 0,
      colorSpace: 'unbekannt',
      format: (path.extname(url).replace('.', '') || 'jpeg').toUpperCase(),
      fileSize: 0,
      url,
      uploadedAt: now,
      updatedAt: now,
      originalFilename: entry.originalFilename || path.basename(url),
      mimeType: 'image/jpeg',
      storageKey: `external:${url}`,
      external: true,
      sourceUrl: url,
    }
    imported.push(record)
    existingUrls.add(url)
  }

  if (imported.length) {
    await writeIndex([...imported, ...items])
  }
  return { imported, skipped }
}

export async function deleteImage(id: string): Promise<void> {
  const items = await readIndex()
  const found = items.find((i) => i.id === id)
  if (!found) throw new Error('Bild nicht gefunden.')
  await writeIndex(items.filter((i) => i.id !== id))
  await deleteBinary(found.storageKey)
}
