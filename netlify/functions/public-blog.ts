import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Published blog posts of a workspace for its website.
 * Query: id=<embed_id> (public workspace id, same as the gallery). Drafts are never returned.
 */
export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secret) return json({ error: 'Blog ist nicht konfiguriert.' }, 500)

  const embedId = new URL(req.url).searchParams.get('id') || ''
  if (!UUID.test(embedId)) return json({ error: 'Ungültige ID.' }, 400)

  const admin = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: tenant } = await admin.from('tenants').select('id').eq('embed_id', embedId).maybeSingle()
  if (!tenant) return json({ error: 'Blog nicht gefunden.' }, 404)

  const { data, error } = await admin.from('blog_posts')
    .select('slug,title,excerpt,category,image_url,image_alt,body,published_at')
    .eq('tenant_id', tenant.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(200)
  // Before migration 011 the table does not exist yet: the website then simply shows no extra posts.
  if (error) return json({ posts: [] })
  return json({ posts: data || [] })
}
