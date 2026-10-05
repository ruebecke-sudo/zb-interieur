/** Browser client for ZB Interieur media library API. */

export type MediaImage = {
  id: string
  name: string
  text: string
  category1: string
  category2: string
  category3: string
  category4: string
  width: number
  height: number
  colorSpace: string
  format: string
  fileSize: number
  url: string
  uploadedAt: string
  updatedAt: string
  originalFilename: string
  mimeType: string
  storageKey: string
}

export type MediaCategories = {
  category1: string[]
  category2: string[]
  category3: string[]
  category4: string[]
}

const KEY_STORAGE = 'zb-interieur.media-api-key'

export function getMediaApiKey(): string {
  return sessionStorage.getItem(KEY_STORAGE) || ''
}

export function setMediaApiKey(key: string): void {
  sessionStorage.setItem(KEY_STORAGE, key)
}

export function clearMediaApiKey(): void {
  sessionStorage.removeItem(KEY_STORAGE)
}

/** Login with site password; stores bearer token for subsequent API calls. */
export async function loginWithPassword(password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    throw new Error(await errorMessage(res))
  }
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('Login fehlgeschlagen.')
  setMediaApiKey(data.token)
}

async function mediaFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const key = getMediaApiKey()
  const headers = new Headers(init.headers || {})
  if (key) headers.set('Authorization', `Bearer ${key}`)
  const res = await fetch(path, { ...init, headers })
  return res
}

export async function fetchCategories(): Promise<MediaCategories> {
  const res = await mediaFetch('/api/images/categories')
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

export async function saveCategories(categories: MediaCategories): Promise<MediaCategories> {
  const res = await mediaFetch('/api/images/categories', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categories),
  })
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

export async function listMedia(params: {
  q?: string
  category1?: string[]
  category2?: string[]
  category3?: string[]
  category4?: string[]
} = {}): Promise<{ items: MediaImage[]; total: number }> {
  const url = new URL('/api/images', window.location.origin)
  if (params.q) url.searchParams.set('q', params.q)
  for (const c of params.category1 || []) url.searchParams.append('category1', c)
  for (const c of params.category2 || []) url.searchParams.append('category2', c)
  for (const c of params.category3 || []) url.searchParams.append('category3', c)
  for (const c of params.category4 || []) url.searchParams.append('category4', c)
  const res = await mediaFetch(url.pathname + url.search)
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

/** Public catalog read — no auth required (Markenwelt). */
export async function listMediaPublic(params: {
  q?: string
  category1?: string[]
  category2?: string[]
  category3?: string[]
  category4?: string[]
} = {}): Promise<{ items: MediaImage[]; total: number }> {
  const url = new URL('/api/images', window.location.origin)
  if (params.q) url.searchParams.set('q', params.q)
  for (const c of params.category1 || []) url.searchParams.append('category1', c)
  for (const c of params.category2 || []) url.searchParams.append('category2', c)
  for (const c of params.category3 || []) url.searchParams.append('category3', c)
  for (const c of params.category4 || []) url.searchParams.append('category4', c)
  const res = await fetch(url.pathname + url.search)
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

export async function uploadMedia(
  files: File[],
  metaByIndex?: Array<{
    name?: string
    text?: string
    category1?: string
    category2?: string
    category3?: string
    category4?: string
  }>,
): Promise<MediaImage[]> {
  const uploaded: MediaImage[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const meta = metaByIndex?.[i] || {}
    const body = new FormData()
    body.append('file', file)
    if (meta.name) body.append('name', meta.name)
    if (meta.text) body.append('text', meta.text)
    if (meta.category1) body.append('category1', meta.category1)
    if (meta.category2) body.append('category2', meta.category2)
    if (meta.category3) body.append('category3', meta.category3)
    if (meta.category4) body.append('category4', meta.category4)
    const res = await mediaFetch('/api/images/upload', { method: 'POST', body })
    if (!res.ok) throw new Error(await errorMessage(res))
    const data = (await res.json()) as { items: MediaImage[] }
    uploaded.push(...data.items)
  }
  return uploaded
}

export async function updateMediaMeta(
  id: string,
  meta: {
    name?: string
    text?: string
    category1?: string
    category2?: string
    category3?: string
    category4?: string
  },
): Promise<MediaImage> {
  const res = await mediaFetch(`/api/images/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meta),
  })
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

export async function replaceMediaFile(id: string, file: File): Promise<MediaImage> {
  const body = new FormData()
  body.append('file', file)
  const res = await mediaFetch(`/api/images/${id}`, { method: 'PUT', body })
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json()
}

export async function deleteMedia(id: string): Promise<void> {
  const res = await mediaFetch(`/api/images/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await errorMessage(res))
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    if (data.error) return data.error
  } catch {
    // ignore
  }
  return `Anfrage fehlgeschlagen (${res.status})`
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

export function defaultNameFromFile(file: File): string {
  return file.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
}
