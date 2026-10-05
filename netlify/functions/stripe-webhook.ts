import { createClient } from '@supabase/supabase-js'

export default async (req: Request) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!webhookSecret || !supabaseUrl || !serviceKey) return new Response('Server configuration missing.', { status: 500 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing Stripe signature.', { status: 400 })
  const payload = await req.text()
  const event = await verifyStripeEvent(payload, signature, webhookSecret)
  if (!event) return new Response('Invalid signature.', { status: 400 })

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string
      mode?: string
      payment_status?: string
      metadata?: { tenant_id?: string; plan?: string; product?: string }
      subscription?: string
      customer?: string
    }
    if (session.mode === 'payment' && session.payment_status !== 'paid') return new Response('Payment not completed.', { status: 200 })

    const tenantId = session.metadata?.tenant_id
    if (!tenantId) return new Response('Missing tenant metadata.', { status: 400 })

    const plan = session.metadata?.plan || (session.metadata?.product === 'image-manager-lifetime' ? 'lifetime' : '')
    if (!['starter', 'professional', 'business', 'lifetime'].includes(plan)) return new Response('Unknown plan.', { status: 400 })

    const patch: Record<string, unknown> = {
      plan,
      status: 'active',
      lifetime_purchased_at: plan === 'lifetime' ? new Date().toISOString() : null,
      lifetime_order_id: plan === 'lifetime' ? session.id : null,
    }
    if (session.subscription) patch.subscription_id = session.subscription
    if (session.customer) patch.stripe_customer_id = session.customer

    const { error } = await supabase.from('tenants').update(patch).eq('id', tenantId)
    if (error) return new Response('Database update failed.', { status: 500 })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as { id: string; metadata?: { tenant_id?: string }; customer?: string }
    const tenantId = subscription.metadata?.tenant_id
    if (tenantId) {
      const { error } = await supabase.from('tenants').update({ plan: 'starter', status: 'active', subscription_id: null }).eq('id', tenantId).neq('plan', 'lifetime')
      if (error) return new Response('Database update failed.', { status: 500 })
    }
  }

  return new Response('ok', { status: 200 })
}

async function verifyStripeEvent(payload: string, header: string, secret: string): Promise<{ type: string; data: { object: any } } | null> {
  const timestampMatch = header.split(',').find((p) => p.startsWith('t='))
  if (!timestampMatch) return null
  const timestamp = Number(timestampMatch.slice(2))
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) return null

  const expectedInput = timestamp + '.' + payload
  const key = new TextEncoder().encode(secret)
  const data = new TextEncoder().encode(expectedInput)
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, data)
  const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')

  const signatures = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3))
  const valid = signatures.some((supplied) => supplied.length === expected.length && supplied.split('').every((char, i) => char === expected[i]))
  if (!valid) return null

  try { return JSON.parse(payload) } catch { return null }
}
