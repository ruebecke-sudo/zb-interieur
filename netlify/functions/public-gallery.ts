import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLUG = /^[a-z0-9][a-z0-9-]{1,80}$/

const TENANT_BASE = 'id,name,brand_name,logo_url,primary_color,category_labels,embed_id'
const TENANT_EXTRA = ',gallery_style,inquiry_mode,inquiry_label,inquiry_email,inquiry_url'
const IMAGE_BASE = 'id,name,text,category1,category2,category3,category4,url,width,height,external_id'

type Tenant = {
  id: string; name: string; brand_name: string | null; logo_url: string | null; primary_color: string | null
  category_labels: string[] | null; embed_id: string
  gallery_style?: string; inquiry_mode?: string; inquiry_label?: string; inquiry_email?: string | null; inquiry_url?: string | null
}

/**
 * Public, read-only image list for the embed script (image-manager-embed.js) and the
 * hosted gallery page. Only serves workspaces that switched the gallery on (embed_enabled).
 * Query: id=<embed_id> or slug=<tenant slug>, optional c1..c4 (exact category values),
 * q (search), limit (max 200), meta=1 (adds branding and category values for /g/<slug>).
 * Works before and after migration 010 (note, gallery style, inquiry button).
 */
export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secret) return json({ error: 'Galerie ist nicht konfiguriert.' }, 500)

  const params = new URL(req.url).searchParams
  const embedId = params.get('id') || ''
  const slug = params.get('slug') || ''
  if (!UUID.test(embedId) && !SLUG.test(slug)) return json({ error: 'Ungültige Galerie-ID.' }, 400)

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const findTenant = (columns: string) => {
    const query = admin.from('tenants').select(columns).eq('embed_enabled', true)
    return (UUID.test(embedId) ? query.eq('embed_id', embedId) : query.eq('slug', slug)).maybeSingle()
  }
  let { data: tenant, error: tenantError } = await findTenant(TENANT_BASE + TENANT_EXTRA) as { data: Tenant | null; error: unknown }
  const hasExtras = !tenantError
  if (tenantError) ({ data: tenant } = await findTenant(TENANT_BASE) as { data: Tenant | null; error: unknown })
  if (!tenant) return json({ error: 'Galerie nicht gefunden oder nicht freigegeben.' }, 404)

  const inquiryMode = tenant.inquiry_mode === 'email' && tenant.inquiry_email ? 'email'
    : tenant.inquiry_mode === 'link' && tenant.inquiry_url ? 'link' : 'off'
  const settings = {
    style: tenant.gallery_style === 'catalog' ? 'catalog' : 'grid',
    primaryColor: tenant.primary_color || '#0E675A',
    categoryLabels: tenant.category_labels,
    inquiry: inquiryMode === 'off' ? null : {
      mode: inquiryMode,
      label: tenant.inquiry_label || 'Jetzt anfragen',
      email: inquiryMode === 'email' ? tenant.inquiry_email : undefined,
      url: inquiryMode === 'link' ? tenant.inquiry_url : undefined,
    },
  }

  let meta: Record<string, unknown> | undefined
  if (params.get('meta') === '1') {
    // Category values that actually occur, for the filter buttons on the gallery page.
    const { data: rows } = await admin.from('images').select('category1,category2,category3,category4').eq('tenant_id', tenant.id).limit(2000)
    const values = [1, 2, 3, 4].map((slot) => [...new Set((rows || []).map((row) => String((row as Record<string, unknown>)[`category${slot}`] || '')).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'de')))
    meta = {
      embedId: tenant.embed_id,
      name: tenant.brand_name || tenant.name,
      logoUrl: tenant.logo_url || '',
      primaryColor: settings.primaryColor,
      categoryLabels: tenant.category_labels,
      categoryValues: values,
    }
  }

  const limit = Math.min(Math.max(Number(params.get('limit')) || 60, 1), 200)
  const buildQuery = (columns: string) => {
    let query = admin.from('images')
      .select(columns)
      .eq('tenant_id', tenant!.id)
      .not('url', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(limit)
    for (const slot of [1, 2, 3, 4]) {
      const value = params.get(`c${slot}`)
      if (value) query = query.eq(`category${slot}`, value)
    }
    const search = (params.get('q') || '').trim().replace(/[%,()]/g, ' ').slice(0, 80)
    if (search) query = query.or(`name.ilike.%${search}%,text.ilike.%${search}%`)
    return query
  }

  // external_id: id of the copy on a connected website, lets that site skip duplicates.
  let { data, error } = await buildQuery(hasExtras ? IMAGE_BASE + ',note' : IMAGE_BASE)
  if (error && hasExtras) ({ data, error } = await buildQuery(IMAGE_BASE))
  if (error) return json({ error: 'Bilder konnten nicht geladen werden.' }, 500)
  return json({ items: data || [], settings, ...(meta ? { meta } : {}) })
}
