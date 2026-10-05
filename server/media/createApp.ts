/** Hono API for ZB Interieur media library. */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  createImage,
  deleteImage,
  getCategories,
  getImage,
  importExternalImages,
  listImages,
  readBinary,
  replaceImageFile,
  saveCategories,
  updateImageMeta,
} from './store.js'
import type { MediaCategories, MediaImageInput } from './types.js'

type Env = {
  Variables: {
    authenticated: boolean
  }
}

function expectedApiKey(): string {
  return process.env.IMAGE_MANAGER_API_KEY || 'zb-interieur-dev-key'
}

/** Human login password for the admin UI (defaults to the API key). */
function expectedPassword(): string {
  return process.env.IMAGE_MANAGER_PASSWORD || expectedApiKey()
}

function isPublicPath(path: string, method: string): boolean {
  if (path === '/api/auth/login' && method === 'POST') return true
  if (method !== 'GET') return false
  // Public read access so Markenwelt can show library images without login.
  if (path === '/api/images' || path === '/api/images/categories') return true
  if (path === '/api/health' || path === '/api/images/openapi.json') return true
  if (path === '/.well-known/ai-plugin.json') return true
  if (path.startsWith('/api/images/file/')) return true
  // GET /api/images/:id — single image metadata
  if (/^\/api\/images\/[^/]+$/.test(path) && path !== '/api/images/openapi.json') return true
  return false
}

export function createMediaApp() {
  const app = new Hono<Env>()

  app.use(
    '*',
    cors({
      origin: (origin) => origin || '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Authorization', 'Content-Type', 'X-Api-Key'],
    }),
  )

  app.use('/api/*', async (c, next) => {
    if (c.req.method === 'OPTIONS') return next()
    const path = new URL(c.req.url).pathname
    if (isPublicPath(path, c.req.method)) {
      c.set('authenticated', false)
      return next()
    }

    const header = c.req.header('authorization') || ''
    const apiKeyHeader = c.req.header('x-api-key') || ''
    const bearer = header.toLowerCase().startsWith('bearer ')
      ? header.slice(7).trim()
      : ''
    const key = bearer || apiKeyHeader
    if (!key || key !== expectedApiKey()) {
      return c.json({ error: 'Nicht authentifiziert. Bearer-Token oder X-Api-Key erforderlich.' }, 401)
    }
    c.set('authenticated', true)
    return next()
  })

  app.post('/api/auth/login', async (c) => {
    let password = ''
    const contentType = c.req.header('content-type') || ''
    try {
      if (contentType.includes('application/json')) {
        const body = (await c.req.json()) as { password?: string }
        password = String(body.password || '')
      } else {
        const body = await c.req.parseBody()
        password = String(body.password || '')
      }
    } catch {
      return c.json({ error: 'Ungültige Anfrage.' }, 400)
    }

    const ok = password === expectedPassword() || password === expectedApiKey()
    if (!ok) {
      return c.json({ error: 'Passwort falsch.' }, 401)
    }
    // Session token for the browser = API bearer key (not shown as “API key” in the UI).
    return c.json({ ok: true, token: expectedApiKey() })
  })

  app.get('/api/health', (c) =>
    c.json({
      ok: true,
      service: 'zb-interieur-media',
      maxBytes: Number(process.env.IMAGE_MAX_BYTES || 15 * 1024 * 1024),
    }),
  )

  app.get('/api/images/categories', async (c) => {
    return c.json(await getCategories())
  })

  app.put('/api/images/categories', async (c) => {
    const body = (await c.req.json()) as MediaCategories
    return c.json(await saveCategories(body))
  })

  app.get('/api/images', async (c) => {
    const url = new URL(c.req.url)
    const items = await listImages({
      q: url.searchParams.get('q') || undefined,
      category1: url.searchParams.getAll('category1').length
        ? url.searchParams.getAll('category1')
        : url.searchParams.get('category1') || undefined,
      category2: url.searchParams.getAll('category2').length
        ? url.searchParams.getAll('category2')
        : url.searchParams.get('category2') || undefined,
      category3: url.searchParams.getAll('category3').length
        ? url.searchParams.getAll('category3')
        : url.searchParams.get('category3') || undefined,
      category4: url.searchParams.getAll('category4').length
        ? url.searchParams.getAll('category4')
        : url.searchParams.get('category4') || undefined,
    })
    return c.json({ items, total: items.length })
  })

  app.get('/api/images/openapi.json', (c) => c.json(openApiSpec()))

  app.get('/api/images/file/:key', async (c) => {
    const key = c.req.param('key')
    if (!key || key.includes('..') || key.includes('/') || key.includes('\\')) {
      return c.json({ error: 'Ungültiger Dateiname.' }, 400)
    }
    const file = await readBinary(key)
    if (!file) return c.json({ error: 'Datei nicht gefunden.' }, 404)
    return new Response(new Uint8Array(file.buffer), {
      headers: {
        'Content-Type': file.mimeType,
        'Cache-Control': 'public, max-age=604800',
      },
    })
  })

  app.get('/api/images/:id', async (c) => {
    const item = await getImage(c.req.param('id'))
    if (!item) return c.json({ error: 'Bild nicht gefunden.' }, 404)
    return c.json(item)
  })

  app.post('/api/images/import', async (c) => {
    try {
      const body = (await c.req.json()) as {
        items?: Array<{
          name: string
          text?: string
          category1?: string
          category2?: string
          category3?: string
          category4?: string
          url: string
          originalFilename?: string
        }>
      }
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return c.json({ error: 'Keine Einträge zum Importieren.' }, 400)
      }
      const result = await importExternalImages(body.items)
      return c.json({
        items: result.imported,
        imported: result.imported.length,
        skipped: result.skipped,
        total: result.imported.length,
      }, 201)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import fehlgeschlagen.'
      return c.json({ error: message }, 400)
    }
  })

  app.post('/api/images/upload', async (c) => {
    try {
      const body = await c.req.parseBody({ all: true })
      const overwrite =
        String(body.overwrite || body.replace || '').toLowerCase() === 'true' ||
        body.overwrite === '1'

      const filesRaw = body.file ?? body.files ?? body.image
      const files = (Array.isArray(filesRaw) ? filesRaw : filesRaw ? [filesRaw] : []).filter(
        (f): f is File => typeof File !== 'undefined' && f instanceof File,
      )

      if (files.length === 0) {
        return c.json({ error: 'Keine Bilddatei im Feld „file“ (multipart/form-data).' }, 400)
      }

      const created = []
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const meta: MediaImageInput = {
          name: str(body.name) || str(body.bildname),
          text: str(body.text) || str(body.bildtext),
          category1: str(body.category1) || str(body.kategorie1),
          category2: str(body.category2) || str(body.kategorie2),
          category3: str(body.category3) || str(body.kategorie3),
          category4: str(body.category4) || str(body.kategorie4),
        }
        const overwriteId = overwrite ? str(body.id) || undefined : undefined
        const record = await createImage({
          buffer,
          filename: file.name || 'upload.jpg',
          mimeType: file.type || '',
          meta,
          overwriteId,
        })
        created.push(record)
      }

      return c.json({ items: created, total: created.length }, 201)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen.'
      const status = /nicht erlaubt|zu groß|Ungültig/i.test(message) ? 400 : 500
      return c.json({ error: message }, status)
    }
  })

  app.put('/api/images/:id', async (c) => {
    const id = c.req.param('id')
    const existing = await getImage(id)
    if (!existing) return c.json({ error: 'Bild nicht gefunden.' }, 404)

    const contentType = c.req.header('content-type') || ''
    try {
      if (contentType.includes('multipart/form-data')) {
        const body = await c.req.parseBody()
        const file = body.file
        let record = existing
        if (typeof File !== 'undefined' && file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer())
          record = await replaceImageFile(id, buffer, file.name || existing.originalFilename, file.type || '')
        }
        const meta: MediaImageInput = {
          name: str(body.name) ?? str(body.bildname),
          text: str(body.text) ?? str(body.bildtext),
          category1: str(body.category1) ?? str(body.kategorie1),
          category2: str(body.category2) ?? str(body.kategorie2),
          category3: str(body.category3) ?? str(body.kategorie3),
          category4: str(body.category4) ?? str(body.kategorie4),
        }
        // Only update meta fields that were actually provided
        const patch: MediaImageInput = {}
        for (const key of Object.keys(meta) as (keyof MediaImageInput)[]) {
          if (meta[key] !== undefined) patch[key] = meta[key]
        }
        if (Object.keys(patch).length) {
          record = await updateImageMeta(id, patch)
        }
        return c.json(record)
      }

      const body = (await c.req.json()) as MediaImageInput & { file?: undefined }
      const record = await updateImageMeta(id, body)
      return c.json(record)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Aktualisierung fehlgeschlagen.'
      return c.json({ error: message }, 400)
    }
  })

  app.delete('/api/images/:id', async (c) => {
    try {
      await deleteImage(c.req.param('id'))
      return c.json({ ok: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Löschen fehlgeschlagen.'
      return c.json({ error: message }, message.includes('nicht gefunden') ? 404 : 400)
    }
  })

  app.get('/.well-known/ai-plugin.json', (c) => {
    const host = process.env.PUBLIC_SITE_URL || 'http://127.0.0.1:43127'
    return c.json({
      schema_version: 'v1',
      name_for_human: 'ZB Interieur Web Image Manager',
      name_for_model: 'zb_interieur_image_manager',
      description_for_human: 'Bilder für ZB Interieur hochladen und verwalten.',
      description_for_model:
        'Upload and manage product images for ZB Interieur with categories (brand, product type, room, style) and metadata.',
      auth: {
        type: 'service_http',
        authorization_type: 'bearer',
      },
      api: {
        type: 'openapi',
        url: `${host}/api/images/openapi.json`,
      },
      logo_url: `${host}/images/logo.jpg`,
      contact_email: 'info@zb-interieur.de',
      legal_info_url: `${host}/datenschutz`,
    })
  })

  return app
}

function str(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

function openApiSpec() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'ZB Interieur Image Manager API',
      version: '1.0.0',
      description:
        'Multipart image upload and metadata CRUD for the ZB Interieur Web Image Manager ChatGPT plugin.',
    },
    servers: [{ url: process.env.PUBLIC_SITE_URL || 'http://127.0.0.1:43127' }],
    paths: {
      '/api/images/upload': {
        post: {
          operationId: 'uploadImages',
          summary: 'Upload one or more images (multipart/form-data)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file'],
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    name: { type: 'string' },
                    text: { type: 'string' },
                    category1: { type: 'string', description: 'Hersteller / Marke' },
                    category2: { type: 'string', description: 'Produktart' },
                    category3: { type: 'string', description: 'Bereich' },
                    category4: { type: 'string', description: 'Stil / Thema' },
                    overwrite: { type: 'string', description: 'Set true with id to replace' },
                    id: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
        },
      },
      '/api/images': {
        get: {
          operationId: 'listImages',
          summary: 'List/search images',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' } },
            { name: 'category1', in: 'query', schema: { type: 'string' } },
            { name: 'category2', in: 'query', schema: { type: 'string' } },
            { name: 'category3', in: 'query', schema: { type: 'string' } },
            { name: 'category4', in: 'query', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'OK' } },
        },
      },
      '/api/images/{id}': {
        get: {
          operationId: 'getImage',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } },
        },
        put: {
          operationId: 'updateImage',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' } },
        },
        delete: {
          operationId: 'deleteImage',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' } },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
  }
}
