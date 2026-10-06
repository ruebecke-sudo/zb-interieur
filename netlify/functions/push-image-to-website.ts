import { createClient } from '@supabase/supabase-js'

const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })

// Connector types that speak the Image Manager REST protocol (POST /api/images/upload-from-url).
const PUSH_CONNECTORS = ['rest', 'custom']

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return true
  // Plain IP addresses are not allowed as targets; websites must use a domain name.
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')
}

/**
 * Pushes one image of the caller's workspace to the website it belongs to.
 * The website's own API key comes from website_credentials. Transitional
 * fallback until ZB Interieur has stored its key: the legacy ZB key, only for
 * the workspace in ZB_SYNC_TENANT_ID and only for hosts in ZB_SYNC_ALLOWED_HOSTS.
 */
export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { ...headers, 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secret) {
    return json({ error: 'Connector server configuration missing.', missing: [!supabaseUrl ? 'SUPABASE_URL' : '', !secret ? 'SUPABASE_SECRET_KEY' : ''].filter(Boolean) }, 500)
  }

  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return json({ error: 'Authentication required.' }, 401)
  const token = auth.slice(7)
  const client = createClient(supabaseUrl, secret, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData } = await client.auth.getUser()
  if (!userData.user) return json({ error: 'Invalid session.' }, 401)

  const body = await req.json().catch(() => null) as { image_id?: string } | null
  if (!body?.image_id) return json({ error: 'image_id erforderlich.' }, 400)

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: membership } = await admin.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner','admin','member'].includes(membership.role)) return json({ error: 'Keine Berechtigung.' }, 403)

  const { data: image, error: imageError } = await admin.from('images').select('*').eq('id', body.image_id).eq('tenant_id', membership.tenant_id).single()
  if (imageError || !image) return json({ error: 'Bild nicht gefunden.' }, 404)
  if (!image.website_id || !image.url) return json({ error: 'Bild benötigt Website und URL.' }, 400)

  const { data: website } = await admin.from('websites').select('id,base_url,connector_type').eq('id', image.website_id).eq('tenant_id', membership.tenant_id).single()
  if (!website) return json({ error: 'Website nicht gefunden.' }, 404)

  const fail = async (message: string, status = 502) => {
    await admin.from('images').update({ sync_status: 'error', sync_error: message }).eq('id', image.id)
    return json({ error: message }, status)
  }

  const connectorType = String(website.connector_type || '').toLowerCase()
  if (!PUSH_CONNECTORS.includes(connectorType)) {
    return fail(`Die automatische Übertragung ist für den Connector „${website.connector_type}“ noch nicht verfügbar.`, 400)
  }

  let targetUrl: URL
  try { targetUrl = new URL(website.base_url) } catch { return fail('Die Website-Adresse ist ungültig.', 400) }
  if (targetUrl.protocol !== 'https:') return fail('Website-Connector muss HTTPS verwenden.', 400)
  if (isBlockedHost(targetUrl.hostname)) return fail('Diese Website-Adresse ist als Übertragungsziel nicht erlaubt.', 400)

  const { data: credential } = await admin.from('website_credentials').select('api_key').eq('website_id', website.id).maybeSingle()
  let apiKey = credential?.api_key as string | undefined
  if (!apiKey) {
    const legacyKey = process.env.ZB_IMAGE_MANAGER_API_KEY
    const legacyTenant = process.env.ZB_SYNC_TENANT_ID
    const legacyHosts = (process.env.ZB_SYNC_ALLOWED_HOSTS || 'zb-interieur.netlify.app').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean)
    if (legacyKey && legacyTenant && membership.tenant_id === legacyTenant && legacyHosts.includes(targetUrl.hostname.toLowerCase())) apiKey = legacyKey
  }
  if (!apiKey) return fail('Für diese Website ist noch kein API-Schlüssel hinterlegt (Websites → „API-Schlüssel“).', 400)

  try {
    const target = await fetch(targetUrl.toString().replace(/\/$/, '') + '/api/images/upload-from-url', {
      method: 'POST',
      redirect: 'error',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_url: image.url,
        filename: image.filename || image.name || 'image.jpg',
        name: image.name || '',
        text: image.text || '',
        category1: image.category1 || '',
        category2: image.category2 || '',
        category3: image.category3 || '',
        category4: image.category4 || '',
        overwrite: Boolean(image.external_id),
        id: image.external_id || undefined,
      }),
    })
    const result = await target.json().catch(() => ({}))
    if (!target.ok) throw new Error(result.error || `Website antwortet mit HTTP ${target.status}`)

    const remote = Array.isArray(result.items) ? result.items[0] : result
    await admin.from('images').update({
      external_id: String(remote?.id || image.external_id || ''),
      sync_status: 'synced',
      sync_error: null,
      last_synced_at: new Date().toISOString(),
    }).eq('id', image.id)

    return json({ ok: true, remote })
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Übertragung fehlgeschlagen.')
  }
}
