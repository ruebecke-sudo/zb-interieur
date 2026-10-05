import { createClient } from '@supabase/supabase-js'

const priceMap: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  business: process.env.STRIPE_PRICE_BUSINESS,
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  const secret = process.env.STRIPE_SECRET_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!secret || !supabaseUrl || !publishable) return json({ error: 'Stripe/Supabase server configuration missing.' }, 500)

  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return json({ error: 'Authentication required.' }, 401)

  const body = await req.json().catch(() => ({})) as { plan?: string }
  const plan = String(body.plan || '').toLowerCase()
  const priceId = priceMap[plan]
  if (!priceId) return json({ error: 'Dieser Tarif ist derzeit nicht für den Online-Abschluss konfiguriert.' }, 400)

  const token = auth.slice(7)
  const userClient = createClient(supabaseUrl, publishable, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: userData } = await userClient.auth.getUser()
  if (!userData.user) return json({ error: 'Invalid session.' }, 401)

  const { data: membership } = await userClient.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner', 'admin'].includes(membership.role)) return json({ error: 'Nur Owner oder Admin können den Tarif ändern.' }, 403)

  const { data: tenant } = await userClient.from('tenants').select('id,plan').eq('id', membership.tenant_id).single()
  if (!tenant) return json({ error: 'Workspace nicht gefunden.' }, 404)
  if (tenant.plan === 'lifetime') return json({ error: 'Lifetime ist bereits aktiviert.' }, 409)

  const origin = req.headers.get('origin') || process.env.PUBLIC_SITE_URL || 'http://localhost:5173'
  const params = new URLSearchParams()
  params.set('mode', 'subscription')
  params.set('line_items[0][price]', priceId)
  params.set('line_items[0][quantity]', '1')
  params.set('customer_email', userData.user.email || '')
  params.set('success_url', origin.replace(/\/$/, '') + '/image-manager/app?payment=success')
  params.set('cancel_url', origin.replace(/\/$/, '') + '/image-manager/app?payment=cancelled')
  params.set('metadata[tenant_id]', tenant.id)
  params.set('metadata[plan]', plan)
  params.set('metadata[user_id]', userData.user.id)
  params.set('subscription_data[metadata][tenant_id]', tenant.id)
  params.set('subscription_data[metadata][plan]', plan)
  params.set('allow_promotion_codes', 'true')

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(secret + ':').toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  const session = await response.json() as { url?: string; error?: { message?: string } }
  if (!response.ok || !session.url) return json({ error: session.error?.message || 'Stripe Checkout konnte nicht erstellt werden.' }, 502)
  return json({ url: session.url }, 200)
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
