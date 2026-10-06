import { createClient } from '@supabase/supabase-js'

const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { ...headers, 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  const zbKey = process.env.ZB_IMAGE_MANAGER_API_KEY
  // The ZB key may only ever be used by the ZB workspace and only be sent to the ZB host.
  // Without this, any self-registered workspace could push images to ZB or capture the key.
  const zbTenantId = process.env.ZB_SYNC_TENANT_ID
  const zbAllowedHosts = (process.env.ZB_SYNC_ALLOWED_HOSTS || 'zb-interieur.netlify.app').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean)
  const missing = [
    !supabaseUrl ? 'SUPABASE_URL' : '',
    !secret ? 'SUPABASE_SECRET_KEY' : '',
    !zbKey ? 'ZB_IMAGE_MANAGER_API_KEY' : '',
    !zbTenantId ? 'ZB_SYNC_TENANT_ID' : '',
  ].filter(Boolean)
  if (missing.length) {
    return new Response(JSON.stringify({
      error: 'Connector server configuration missing.',
      missing,
    }), { status: 500, headers })
  }

  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401, headers })
  const token = auth.slice(7)
  const client = createClient(supabaseUrl, secret, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData } = await client.auth.getUser()
  if (!userData.user) return new Response(JSON.stringify({ error: 'Invalid session.' }), { status: 401, headers })

  const body = await req.json().catch(() => null) as { image_id?: string } | null
  if (!body?.image_id) return new Response(JSON.stringify({ error: 'image_id erforderlich.' }), { status: 400, headers })

  const { data: membership } = await client.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner','admin','member'].includes(membership.role)) return new Response(JSON.stringify({ error: 'Keine Berechtigung.' }), { status: 403, headers })
  if (membership.tenant_id !== zbTenantId) return new Response(JSON.stringify({ error: 'Die Website-Übertragung ist für diesen Arbeitsbereich nicht freigeschaltet.' }), { status: 403, headers })

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: image, error: imageError } = await admin.from('images').select('*').eq('id', body.image_id).eq('tenant_id', membership.tenant_id).single()
  if (imageError || !image) return new Response(JSON.stringify({ error: 'Bild nicht gefunden.' }), { status: 404, headers })
  if (!image.website_id || !image.url) return new Response(JSON.stringify({ error: 'Bild benötigt Website und URL.' }), { status: 400, headers })

  const { data: website } = await admin.from('websites').select('id,base_url').eq('id', image.website_id).eq('tenant_id', membership.tenant_id).single()
  if (!website) return new Response(JSON.stringify({ error: 'Website nicht gefunden.' }), { status: 404, headers })

  try {
    const targetUrl = new URL(website.base_url)
    if (targetUrl.protocol !== 'https:') throw new Error('Website-Connector muss HTTPS verwenden.')
    if (!zbAllowedHosts.includes(targetUrl.hostname.toLowerCase())) throw new Error(`Ziel-Host ${targetUrl.hostname} ist für die Übertragung nicht freigegeben.`)
    const target = await fetch(targetUrl.toString().replace(/\/$/, '') + '/api/images/upload-from-url', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${zbKey}`,
        'Content-Type': 'application/json',
      },
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
    if (!target.ok) throw new Error(result.error || `ZB HTTP ${target.status}`)

    const remote = Array.isArray(result.items) ? result.items[0] : result
    await admin.from('images').update({
      external_id: String(remote?.id || image.external_id || ''),
      sync_status: 'synced',
      sync_error: null,
      last_synced_at: new Date().toISOString(),
    }).eq('id', image.id)

    return new Response(JSON.stringify({ ok: true, remote }), { status: 200, headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Synchronisierung fehlgeschlagen.'
    await admin.from('images').update({ sync_status: 'error', sync_error: message }).eq('id', image.id)
    return new Response(JSON.stringify({ error: message }), { status: 502, headers })
  }
}
