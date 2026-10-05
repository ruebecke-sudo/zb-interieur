import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function ImageManagerBranding() {
  const [tenantId, setTenantId] = useState('')
  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0E675A')
  const [message, setMessage] = useState('')

  useEffect(() => { void (async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const { data } = await supabase.from('tenants').select('name,brand_name,logo_url,primary_color').eq('id', membership.tenant_id).single()
    if (data) { setName(data.name || ''); setBrandName(data.brand_name || ''); setLogoUrl(data.logo_url || ''); setPrimaryColor(data.primary_color || '#0E675A') }
  })() }, [])

  const save = async () => {
    if (!supabase || !tenantId) return
    const { error } = await supabase.from('tenants').update({ name, brand_name: brandName || null, logo_url: logoUrl || null, primary_color: primaryColor }).eq('id', tenantId)
    setMessage(error ? error.message : 'Einstellungen zum Markenauftritt gespeichert.')
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">Eigener Markenauftritt</h2>
    <p className="mt-1 text-sm text-slate-500">Der Arbeitsbereich kann mit eigenem Namen, Logo und Markenfarbe dargestellt werden.</p>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold">Firmenname<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="text-sm font-semibold">Markenname<input value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="text-sm font-semibold md:col-span-2">Logo-URL<input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="text-sm font-semibold">Hauptfarbe<div className="mt-2 flex gap-3"><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="h-11 w-14 rounded-lg border border-slate-300" /><input value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 font-mono font-normal" /></div></label>
      <div className="rounded-2xl p-5 text-white" style={{backgroundColor: primaryColor}}><div className="text-xs uppercase tracking-wider opacity-70">Vorschau</div><div className="mt-2 text-xl font-bold">{brandName || name || 'Deine Marke'}</div><div className="mt-1 text-sm opacity-80">Image Manager Pro</div></div>
    </div>
    {message && <div className="mt-4 text-sm">{message}</div>}
    <button onClick={()=>void save()} className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{backgroundColor: primaryColor}}>Einstellungen speichern</button>
  </section>
}