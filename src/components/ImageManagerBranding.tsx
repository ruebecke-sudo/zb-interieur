import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '../lib/supabase'

export type BrandingSettings = { name: string; brandName: string; logoUrl: string; primaryColor: string }

const LOGO_TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
const LOGO_MAX_BYTES = 2 * 1024 * 1024

export function ImageManagerBranding({ onSaved }: { onSaved?: (settings: BrandingSettings) => void }) {
  const [tenantId, setTenantId] = useState('')
  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0E675A')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [brokenLogoUrl, setBrokenLogoUrl] = useState('')
  const logoBroken = Boolean(logoUrl) && logoUrl === brokenLogoUrl

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

  const persist = async (nextLogoUrl: string, successMessage: string) => {
    if (!supabase || !tenantId) return false
    const { error } = await supabase.from('tenants').update({ name, brand_name: brandName || null, logo_url: nextLogoUrl || null, primary_color: primaryColor }).eq('id', tenantId)
    setMessage(error ? error.message : successMessage)
    if (!error) onSaved?.({ name, brandName, logoUrl: nextLogoUrl, primaryColor })
    return !error
  }

  const save = () => persist(logoUrl, 'Einstellungen zum Markenauftritt gespeichert.')

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !supabase || !tenantId) return
    const ext = LOGO_TYPES[file.type]
    if (!ext) return setMessage('Bitte ein Logo als PNG, JPG oder WebP auswählen.')
    if (file.size > LOGO_MAX_BYTES) return setMessage('Das Logo darf höchstens 2 MB groß sein.')
    setUploading(true)
    setMessage('')
    // Storage policies only allow paths inside the tenant's own folder.
    const path = `${tenantId}/branding/logo-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('image-manager-media').upload(path, file, { contentType: file.type, upsert: false })
    if (uploadError) {
      setMessage(uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('image-manager-media').getPublicUrl(path)
    setLogoUrl(data.publicUrl)
    await persist(data.publicUrl, 'Logo hochgeladen und gespeichert.')
    setUploading(false)
  }

  const removeLogo = async () => {
    setLogoUrl('')
    await persist('', 'Logo entfernt.')
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">Eigener Markenauftritt</h2>
    <p className="mt-1 text-sm text-slate-500">Der Arbeitsbereich kann mit eigenem Namen, Logo und Markenfarbe dargestellt werden.</p>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold">Firmenname<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="text-sm font-semibold">Markenname<input value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <div className="text-sm font-semibold md:col-span-2">Logo
        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-slate-300 p-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-full items-center justify-center rounded-lg bg-slate-50 sm:w-48">
            {logoUrl && !logoBroken
              ? <img src={logoUrl} alt="Logo-Vorschau" onError={()=>setBrokenLogoUrl(logoUrl)} className="max-h-16 max-w-[11rem] object-contain" />
              : <span className="text-xs font-normal text-slate-400">{logoBroken ? 'Logo nicht erreichbar' : 'Kein Logo'}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${uploading || !tenantId ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:brightness-90'}`} style={{backgroundColor: primaryColor}}>
              {uploading ? 'Wird hochgeladen …' : 'Logo hochladen'}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>void uploadLogo(e)} disabled={uploading || !tenantId} className="sr-only" />
            </label>
            {logoUrl && <button type="button" onClick={()=>void removeLogo()} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Entfernen</button>}
            <span className="w-full text-xs font-normal text-slate-500">PNG, JPG oder WebP, höchstens 2 MB. Am besten mit transparentem oder weißem Hintergrund.</span>
          </div>
        </div>
        <details className="mt-3 font-normal">
          <summary className="cursor-pointer text-xs text-slate-500">oder Logo per Link angeben</summary>
          <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
        </details>
      </div>
      <label className="text-sm font-semibold">Hauptfarbe<div className="mt-2 flex gap-3"><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="h-11 w-14 rounded-lg border border-slate-300" /><input value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 font-mono font-normal" /></div></label>
      <div className="rounded-2xl p-5 text-white" style={{backgroundColor: primaryColor}}><div className="text-xs uppercase tracking-wider opacity-70">Vorschau</div><div className="mt-2 text-xl font-bold">{brandName || name || 'Deine Marke'}</div><div className="mt-1 text-sm opacity-80">Image Manager Pro</div></div>
    </div>
    {message && <div className="mt-4 text-sm">{message}</div>}
    <button onClick={()=>void save()} className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{backgroundColor: primaryColor}}>Einstellungen speichern</button>
  </section>
}
