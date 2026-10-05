import { createClient } from '@supabase/supabase-js'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: cors })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } })

  const url = process.env.SUPABASE_URL
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!url || !publishable || !secret) return new Response(JSON.stringify({ error: 'Supabase server configuration missing.' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })

  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })
  const token = auth.slice(7)

  const userClient = createClient(url, publishable, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData } = await userClient.auth.getUser()
  if (!userData.user) return new Response(JSON.stringify({ error: 'Invalid session.' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })

  const body = await req.json().catch(() => null) as { email?: string; role?: string } | null
  const email = body?.email?.trim().toLowerCase()
  const role = body?.role || 'member'
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return new Response(JSON.stringify({ error: 'Gültige E-Mail-Adresse erforderlich.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
  if (!['admin','member','viewer'].includes(role)) return new Response(JSON.stringify({ error: 'Ungültige Rolle.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })

  const { data: membership } = await userClient.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
  if (!membership || !['owner','admin'].includes(membership.role)) return new Response(JSON.stringify({ error: 'Keine Berechtigung.' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })

  const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error: pendingError } = await admin.from('image_manager_invitations').insert({ tenant_id: membership.tenant_id, email, role })
  if (pendingError) return new Response(JSON.stringify({ error: 'Einladung konnte nicht vorbereitet werden: ' + pendingError.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })

  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${new URL(req.url).origin}/image-manager/app` })
  if (inviteError || !invite.user) return new Response(JSON.stringify({ error: inviteError?.message || 'Einladung konnte nicht versendet werden.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })



  return new Response(JSON.stringify({ ok: true, message: `Einladung an ${email} wurde versendet.` }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } })
}
