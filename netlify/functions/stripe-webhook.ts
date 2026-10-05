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
  const event = verifyStripeEvent(payload, signature, webhookSecret)
  if (!event) return new Response('Invalid signature.', { status: 400 })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { payment_status?: string; metadata?: { tenant_id?: string }; id: string }
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


function verifyStripeEvent(payload: string, header: string, secret: string): { type: string; data: { object: any } } | null {
  const crypto = globalThis.crypto
  const parts = header.split(',')
  const timestampPart = parts.find((p) => p.startsWith('t='))
  const signaturePart = parts.find((p) => p.startsWith('v1='))
  if (!timestampPart || !signaturePart) return null
  const timestamp = timestampPart.slice(2)
  const expectedInput = timestamp + '.' + payload
  const key = new TextEncoder().encode(secret)
  const data = new TextEncoder().encode(expectedInput)
  return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']).then(async (cryptoKey) => {
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, data)
    const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')
    const supplied = signaturePart.slice(3)
    if (expected.length !== supplied.length) return null
    let diff = 0
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i)
    if (diff !== 0 || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return null
    return JSON.parse(payload)
  }) as any
}
