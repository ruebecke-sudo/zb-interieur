import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  const secret = process.env.STRIPE_SECRET_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!secret || !supabaseUrl || !publishable) return json({ error: 'Stripe/Supabase server configuration missing.' }, 500)
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return json({ error: 'Authentication required.' }, 401)
  const client = createClient(supabaseUrl, publishable, { global: { headers: { Authorization: `Bearer ${auth.slice(7)}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData } = await client.auth.getUser()
  if (!userData.user) return json({ error: 'Invalid session.' }, 401)
  const { data: membership } = await client.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner','admin'].includes(membership.role)) return json({ error: 'Nur Owner oder Admin können die Abrechnung verwalten.' }, 403)
  const { data: tenant } = await client.from('tenants').select('stripe_customer_id').eq('id', membership.tenant_id).single()
  if (!tenant?.stripe_customer_id) return json({ error: 'Für diesen Workspace gibt es noch kein Stripe-Kundenkonto.' }, 404)
  const origin = req.headers.get('origin') || process.env.PUBLIC_SITE_URL || 'http://localhost:5173'
  const params = new URLSearchParams({ customer: tenant.stripe_customer_id, return_url: origin.replace(/\/$/, '') + '/image-manager/app' })
  const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(secret + ':').toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  const data = await response.json() as { url?: string; error?: { message?: string } }
  if (!response.ok || !data.url) return json({ error: data.error?.message || 'Billing Portal konnte nicht geöffnet werden.' }, 502)
  return json({ url: data.url }, 200)
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
