import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204 })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } })

  const secret = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_LIFETIME
  const supabaseUrl = process.env.SUPABASE_URL
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!secret || !priceId || !supabaseUrl || !publishable) return new Response(JSON.stringify({ error: 'Stripe/Supabase server configuration missing.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const token = auth.slice(7)
  const supabase = createClient(supabaseUrl, publishable, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return new Response(JSON.stringify({ error: 'Invalid session.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const { data: membership } = await supabase.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner','admin'].includes(membership.role)) return new Response(JSON.stringify({ error: 'Nur Workspace-Inhaber oder Admins können den Tarif kaufen.' }), { status: 403, headers: { 'Content-Type': 'application/json' } })

  const { data: tenant } = await supabase.from('tenants').select('id,name,plan').eq('id', membership.tenant_id).single()
  if (!tenant) return new Response(JSON.stringify({ error: 'Workspace nicht gefunden.' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  if (tenant.plan === 'lifetime') return new Response(JSON.stringify({ error: 'Lifetime ist bereits aktiviert.' }), { status: 409, headers: { 'Content-Type': 'application/json' } })

  const stripe = new Stripe(secret)
  const origin = req.headers.get('origin') || process.env.PUBLIC_SITE_URL || 'http://localhost:5173'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: userData.user.email || undefined,
    success_url: origin.replace(/\/$/, '') + '/image-manager/app?payment=success',
    cancel_url: origin.replace(/\/$/, '') + '/image-manager/app?payment=cancelled',
    metadata: { tenant_id: tenant.id, user_id: userData.user.id, product: 'image-manager-lifetime' },
    allow_promotion_codes: true,
  })

  return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
