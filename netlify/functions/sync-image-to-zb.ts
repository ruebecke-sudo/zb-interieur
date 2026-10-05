import { createClient } from '@supabase/supabase-js'

const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { ...headers, 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  const zbKey = process.env.ZB_IMAGE_MANAGER_API_KEY
  const missing = [
    !supabaseUrl ? 'SUPABASE_URL' : '',
    !secret ? 'SUPABASE_SECRET_KEY' : '',
    !zbKey ? 'ZB_IMAGE_MANAGER_API_KEY' : '',
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

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: image, error: imageError } = await admin.from('images').select('*').eq('id', body.image_id).eq('tenant_id', membership.tenant_id).single()
  if (imageError || !image) return new Response(JSON.stringify({ error: 'Bild nicht gefunden.' }), { status: 404, headers })
  if (!image.website_id || !image.url) return new Response(JSON.stringify({ error: 'Bild benötigt Website und URL.' }), { status: 400, headers })

  const { data: website } = await admin.from('websites').select('id,base_url').eq('id', image.website_id).eq('tenant_id', membership.tenant_id).single()
  if (!website) return new Response(JSON.stringify({ error: 'Website nicht gefunden.' }), { status: 404, headers })

  try {
    const source = await fetch(image.url)
    if (!source.ok) throw new Error(`Quellbild HTTP ${source.status}`)
    const bytes = await source.arrayBuffer()
    const filename = image.filename || image.name || 'image.jpg'
    const form = new FormData()
    form.append('file', new Blob([bytes], { type: source.headers.get('content-type') || 'image/jpeg' }), filename)
    form.append('name', image.name || filename)
    form.append('text', image.text || '')
    form.append('category1', image.category1 || '')
    form.append('category2', image.category2 || '')
    form.append('category3', image.category3 || '')
    form.append('category4', image.category4 || '')
    if (image.external_id) form.append('overwrite', 'true'), form.append('id', image.external_id)

    const target = await fetch(website.base_url.replace(/\/$/, '') + '/api/images/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${zbKey}` },
      body: form,
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
