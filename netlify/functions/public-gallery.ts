import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Public, read-only image list for the embed script (image-manager-embed.js).
 * Only serves workspaces that switched the gallery on (tenants.embed_enabled).
 * Query: id=<embed_id>, optional c1..c4 (exact category values), q (search), limit (max 200).
 */
export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secret) return json({ error: 'Galerie ist nicht konfiguriert.' }, 500)

  const params = new URL(req.url).searchParams
  const embedId = params.get('id') || ''
  if (!UUID.test(embedId)) return json({ error: 'Ungültige Galerie-ID.' }, 400)

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: tenant } = await admin.from('tenants').select('id').eq('embed_id', embedId).eq('embed_enabled', true).maybeSingle()
  if (!tenant) return json({ error: 'Galerie nicht gefunden oder nicht freigegeben.' }, 404)

  const limit = Math.min(Math.max(Number(params.get('limit')) || 60, 1), 200)
  let query = admin.from('images')
    .select('id,name,text,category1,category2,category3,category4,url,width,height')
    .eq('tenant_id', tenant.id)
    .not('url', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(limit)
  for (const slot of [1, 2, 3, 4]) {
    const value = params.get(`c${slot}`)
    if (value) query = query.eq(`category${slot}`, value)
  }
  const search = (params.get('q') || '').trim().replace(/[%,()]/g, ' ').slice(0, 80)
  if (search) query = query.or(`name.ilike.%${search}%,text.ilike.%${search}%`)

  const { data, error } = await query
  if (error) return json({ error: 'Bilder konnten nicht geladen werden.' }, 500)
  return json({ items: data || [] })
}
