import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Member = { id: string; user_id: string; role: 'owner' | 'admin' | 'member' | 'viewer'; created_at: string }

export function ImageManagerMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [tenantId, setTenantId] = useState('')
  const [role, setRole] = useState<'owner' | 'admin' | 'member' | 'viewer'>('member')
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    if (!supabase) return
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const { data, error } = await supabase.from('memberships').select('id,user_id,role,created_at').eq('tenant_id', membership.tenant_id).order('created_at')
    if (error) setMessage(error.message)
    else setMembers(data || [])
  }

  useEffect(() => { void load() }, [])

  const changeRole = async (id: string, nextRole: Member['role']) => {
    if (!supabase) return
    const { error } = await supabase.from('memberships').update({ role: nextRole }).eq('id', id)
    setMessage(error ? error.message : 'Rolle aktualisiert.')
    if (!error) await load()
  }

  const addExistingUser = async () => {
    if (!supabase || !tenantId || !userId.trim()) return
    const { error } = await supabase.from('memberships').insert({ tenant_id: tenantId, user_id: userId.trim(), role })
    setMessage(error ? error.message : 'Mitarbeiter hinzugefügt.')
    if (!error) { setUserId(''); await load() }
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div><h2 className="text-xl font-bold">Benutzer & Rollen</h2><p className="mt-1 text-sm text-slate-500">Workspace-Mitglieder verwalten und Zugriffsrollen vergeben.</p></div>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
      <div className="text-sm font-semibold">Benutzer zu Workspace hinzufügen</div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Supabase User-ID" className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
        <select value={role} onChange={e => setRole(e.target.value as Member['role'])} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="member">Mitarbeiter</option><option value="viewer">Nur Lesen</option><option value="admin">Admin</option></select>
        <button onClick={() => void addExistingUser()} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">Hinzufügen</button>
      </div>
      <p className="mt-2 text-xs text-slate-500">Die eigentliche E-Mail-Einladung wird im nächsten Auth-Schritt über Supabase verschickt; hier wird bewusst keine Passwortverwaltung eingebaut.</p>
    </div>
    <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
      {members.map(member => <div key={member.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div><div className="font-semibold">{member.user_id}</div><div className="mt-1 text-xs text-slate-500">Mitglied seit {new Date(member.created_at).toLocaleDateString('de-DE')}</div></div>
        <select value={member.role} onChange={e => void changeRole(member.id, e.target.value as Member['role'])} disabled={member.role === 'owner'} className="rounded-xl border border-slate-300 px-3 py-2 text-sm"><option value="owner">Owner</option><option value="admin">Admin</option><option value="member">Mitarbeiter</option><option value="viewer">Nur Lesen</option></select>
      </div>)}
      {!members.length && <div className="p-6 text-center text-sm text-slate-500">Noch keine Mitglieder vorhanden.</div>}
    </div>
  </section>
