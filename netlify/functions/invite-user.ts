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
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  // The publishable key is not needed server-side. The authenticated user's
  // access token is verified with Supabase Auth using the server secret key.
  if (!url || !secret) {
    return json({ error: 'Supabase server configuration missing.' }, 500)
  }
  if (!resendApiKey || !fromEmail) {
    return json({ error: 'E-Mail-Versand ist noch nicht vollständig konfiguriert (RESEND_API_KEY / RESEND_FROM_EMAIL).' }, 500)
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

  const { data: userList, error: userListError } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (userListError) {
    return json({ error: 'Benutzer konnte nicht geprüft werden: ' + userListError.message }, 500)
  }

  const existingUser = userList.users.find((user) => user.email?.toLowerCase() === email)

  if (existingUser?.id) {
    const { data: existingMembership, error: existingMembershipError } = await admin
      .from('memberships')
      .select('tenant_id,role')
      .eq('user_id', existingUser.id)
      .eq('tenant_id', membership.tenant_id)
      .maybeSingle()

    if (existingMembershipError) {
      return json({ error: 'Bestehende Mitgliedschaft konnte nicht geprüft werden: ' + existingMembershipError.message }, 500)
    }

    if (existingMembership) {
      return json({ error: 'Dieser Benutzer ist bereits Mitglied dieses Arbeitsbereichs.' }, 409)
    }
  }

  const { data: pendingInvitation } = await admin
    .from('image_manager_invitations')
    .select('id')
    .eq('tenant_id', membership.tenant_id)
    .eq('email', email)
    .is('accepted_at', null)
    .limit(1)
    .maybeSingle()

  if (pendingInvitation) {
    return json({ error: 'Für diese E-Mail-Adresse besteht bereits eine offene Einladung.' }, 409)
  }

  const { error: pendingError } = await admin
    .from('image_manager_invitations')
    .insert({ tenant_id: membership.tenant_id, email, role })

  if (pendingError) {
    return json({ error: 'Einladung konnte nicht vorbereitet werden: ' + pendingError.message }, 500)
  }

  const { data: tenant, error: tenantError } = await admin
    .from('tenants')
    .select('name,brand_name')
    .eq('id', membership.tenant_id)
    .single()

  if (tenantError) {
    await admin
      .from('image_manager_invitations')
      .delete()
      .eq('tenant_id', membership.tenant_id)
      .eq('email', email)
    return json({ error: 'Workspace-Daten konnten nicht geladen werden: ' + tenantError.message }, 500)
  }

  const redirectTo = `${new URL(req.url).origin}/image-manager/app`
  const { data: invite, error: inviteError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo, data: { workspace_name: tenant.brand_name || tenant.name, invited_role: role } },
  })

  if (inviteError || !invite?.properties?.action_link || !invite.user) {
    await admin.from('image_manager_invitations').delete().eq('tenant_id', membership.tenant_id).eq('email', email)
    return json({ error: inviteError?.message || 'Einladungslink konnte nicht erstellt werden.' }, 400)
  }

  const invitedUserId = invite.user.id
  const { error: membershipInsertError } = await admin
    .from('memberships')
    .upsert({ tenant_id: membership.tenant_id, user_id: invitedUserId, role }, { onConflict: 'tenant_id,user_id' })

  if (membershipInsertError) {
    await admin.from('image_manager_invitations').delete().eq('tenant_id', membership.tenant_id).eq('email', email)
    return json({ error: 'Benutzer konnte dem Arbeitsbereich nicht zugeordnet werden: ' + membershipInsertError.message }, 500)
  }

  await admin
    .from('image_manager_invitations')
    .update({ invited_user_id: invitedUserId, accepted_at: null })
    .eq('tenant_id', membership.tenant_id)
    .eq('email', email)
    .is('accepted_at', null)

  await admin.from('audit_logs').insert({
    tenant_id: membership.tenant_id,
    user_id: invitedUserId,
    action: 'member.invited',
    entity_type: 'membership',
    metadata: { source: 'resend_invitation', role },
  })

  const workspaceName = tenant.brand_name || tenant.name || 'Image Manager Pro'
  const roleLabels: Record<string, string> = { admin: 'Administrator', member: 'Mitarbeiter', viewer: 'Betrachter' }
  const roleLabel = roleLabels[role] || role
  const actionLink = invite.properties.action_link
  const emailHtml = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17202a"><div style="max-width:620px;margin:0 auto;padding:40px 20px"><div style="background:#fff;border-radius:16px;padding:40px"><div style="font-size:22px;font-weight:700;margin-bottom:28px">Image Manager <span style="font-weight:400">PRO</span></div><h1 style="font-size:28px;margin:0 0 18px">Einladung zu Image Manager Pro</h1><p>Hallo,</p><p>Sie wurden eingeladen, einen Benutzerzugang für <strong>${workspaceName}</strong> in Image Manager Pro zu erstellen.</p><p>Vorgesehene Rolle: <strong>${roleLabel}</strong></p><p>Über den folgenden Button können Sie die Einladung annehmen und Ihr persönliches Passwort festlegen.</p><p style="margin:30px 0"><a href="${actionLink}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:14px 24px;border-radius:9px;font-weight:700">Einladung annehmen</a></p><p style="color:#667085">Wenn Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.</p><p>Viele Grüße<br><strong>Image Manager Pro</strong></p></div></div></body></html>`

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: fromEmail, to: [email], subject: 'Einladung zu Image Manager Pro', html: emailHtml }),
  })

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text()
    await admin.from('image_manager_invitations').delete().eq('tenant_id', membership.tenant_id).eq('email', email)
    return json({ error: 'Die Einladung konnte nicht per E-Mail versendet werden: ' + resendError }, 502)
  }

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
