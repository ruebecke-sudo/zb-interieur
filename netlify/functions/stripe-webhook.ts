import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!secret || !webhookSecret || !supabaseUrl || !serviceKey) return new Response('Server configuration missing.', { status: 500 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing Stripe signature.', { status: 400 })
  const payload = await req.text()
  const stripe = new Stripe(secret)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch {
    return new Response('Invalid signature.', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid') return new Response('Payment not completed.', { status: 200 })
    const tenantId = session.metadata?.tenant_id
    if (!tenantId) return new Response('Missing tenant metadata.', { status: 400 })

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { error } = await supabase.from('tenants').update({
      plan: 'lifetime',
      lifetime_purchased_at: new Date().toISOString(),
      lifetime_order_id: session.id,
      status: 'active',
    }).eq('id', tenantId)

    if (error) return new Response('Database update failed.', { status: 500 })
  }

  return new Response('ok', { status: 200 })
}
