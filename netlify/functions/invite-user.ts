import { createClient } from '@supabase/supabase-js'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })

export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const url = process.env.SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY

  // The publishable key is not needed server-side. The authenticated user's
  // access token is verified with Supabase Auth using the server secret key.
  if (!url || !secret) {
    return json({ error: 'Supabase server configuration missing.' }, 500)
  }

  const authorization = req.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) {
    return json({ error: 'Authentication required.' }, 401)
  }

  const token = authorization.slice(7).trim()
  if (!token) return json({ error: 'Authentication required.' }, 401)

  const admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const userClient = createClient(url, secret, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) {
    return json({ error: 'Invalid session.' }, 401)
  }

  const body = await req.json().catch(() => null) as { email?: string; role?: string } | null
  const email = body?.email?.trim().toLowerCase()
  const role = body?.role || 'member'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Gültige E-Mail-Adresse erforderlich.' }, 400)
  }

  if (!['admin', 'member', 'viewer'].includes(role)) {
    return json({ error: 'Ungültige Rolle.' }, 400)
  }

  const { data: membership, error: membershipError } = await admin
    .from('memberships')
    .select('tenant_id,role')
    .eq('user_id', userData.user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    return json({ error: 'Workspace-Berechtigung konnte nicht geprüft werden: ' + membershipError.message }, 500)
  }

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return json({ error: 'Keine Berechtigung.' }, 403)
  }

  const { error: pendingError } = await admin
    .from('image_manager_invitations')
    .insert({ tenant_id: membership.tenant_id, email, role })

  if (pendingError) {
    return json({ error: 'Einladung konnte nicht vorbereitet werden: ' + pendingError.message }, 500)
  }

  const redirectTo = `${new URL(req.url).origin}/image-manager/app`
  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo })

  if (inviteError || !invite.user) {
    // Do not leave an unusable pending invitation behind when Supabase Auth
    // rejects the invitation.
    await admin
      .from('image_manager_invitations')
      .delete()
      .eq('tenant_id', membership.tenant_id)
      .eq('email', email)

    return json(
      { error: inviteError?.message || 'Einladung konnte nicht versendet werden.' },
      400,
    )
  }

  return json({ ok: true, message: `Einladung an ${email} wurde versendet.` }, 200)
}
