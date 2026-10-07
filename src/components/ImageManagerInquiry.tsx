import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'off' | 'email' | 'link'

const MODES: Array<{ id: Mode; icon: string; title: string; text: string }> = [
  { id: 'off', icon: '⛔', title: 'Kein Knopf', text: 'Nur Bilder und Texte zeigen.' },
  { id: 'email', icon: '✉️', title: 'Per E-Mail', text: 'Besucher schreiben Ihnen eine fertige E-Mail.' },
  { id: 'link', icon: '🔗', title: 'Per Link', text: 'Zum Beispiel zu Ihrer Kontaktseite oder Ihrem Shop.' },
]

/** Inquiry button under each image in gallery and catalog (workspace setting, migration 010). */
export function ImageManagerInquiry() {
  const [tenantId, setTenantId] = useState('')
  const [mode, setMode] = useState<Mode>('off')
  const [label, setLabel] = useState('Jetzt anfragen')
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => { void (async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const { data, error } = await supabase.from('tenants').select('inquiry_mode,inquiry_label,inquiry_email,inquiry_url').eq('id', membership.tenant_id).maybeSingle()
    if (error || !data) { setUnavailable(true); return }
    setMode((data.inquiry_mode as Mode) || 'off')
    setLabel(data.inquiry_label || 'Jetzt anfragen')
    setEmail(data.inquiry_email || user.user.email || '')
    setUrl(data.inquiry_url || '')
  })() }, [])

  const save = async () => {
    if (!supabase || !tenantId) return
    const cleanUrl = url.trim() && !/^https?:\/\//i.test(url.trim()) ? `https://${url.trim()}` : url.trim()
    if (mode === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setMessage('Bitte eine gültige E-Mail-Adresse eintragen.')
    if (mode === 'link' && !cleanUrl) return setMessage('Bitte die Adresse eintragen, zu der der Knopf führen soll.')
    const { error } = await supabase.from('tenants').update({
      inquiry_mode: mode,
      inquiry_label: label.trim() || 'Jetzt anfragen',
      inquiry_email: email.trim() || null,
      inquiry_url: cleanUrl || null,
    }).eq('id', tenantId)
    if (error) return setMessage(error.message.includes('inquiry') ? 'Bitte zuerst das Datenbank-Update 010 in Supabase ausführen.' : error.message)
    setUrl(cleanUrl)
    setMessage(mode === 'off' ? 'Gespeichert. Es wird kein Anfrage-Knopf angezeigt.' : 'Gespeichert. Der Knopf erscheint ab sofort in Galerie und Katalog.')
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">💬 Anfrage-Knopf</h2>
    <p className="mt-1 text-sm text-slate-500">Unter jedem Bild in Galerie und Katalog kann ein Knopf erscheinen, mit dem Besucher Sie direkt zu diesem Bild anfragen.</p>
    {unavailable && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Noch nicht verfügbar. Bitte das Datenbank-Update 010 in Supabase ausführen.</div>}
    {!unavailable && <>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {MODES.map((option) => <button key={option.id} type="button" onClick={() => setMode(option.id)} className={`rounded-2xl border-2 p-4 text-left ${mode === option.id ? 'border-[#0E675A] bg-emerald-50' : 'border-slate-200 bg-white'}`}>
          <div className="text-3xl" aria-hidden="true">{option.icon}</div>
          <div className="mt-2 font-bold">{option.title}</div>
          <div className="mt-1 text-sm text-slate-600">{option.text}</div>
        </button>)}
      </div>

      {mode !== 'off' && <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">Beschriftung des Knopfs
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} placeholder="Jetzt anfragen" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
          <span className="mt-1 block text-xs font-normal text-slate-500">Zum Beispiel „Jetzt anfragen“, „Angebot anfordern“ oder „Termin vereinbaren“.</span>
        </label>
        {mode === 'email' && <label className="text-sm font-semibold">Ihre E-Mail-Adresse
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@ihre-firma.de" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
          <span className="mt-1 block text-xs font-normal text-slate-500">Die E-Mail enthält automatisch den Namen des Bildes.</span>
        </label>}
        {mode === 'link' && <label className="text-sm font-semibold">Adresse, zu der der Knopf führt
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="www.ihre-firma.de/kontakt" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
        </label>}
        <div className="md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">So sieht der Knopf aus</div>
          <span className="mt-2 inline-block rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">{label.trim() || 'Jetzt anfragen'}</span>
        </div>
      </div>}

      {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
      <button type="button" onClick={() => void save()} className="mt-5 rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white">Speichern</button>
    </>}
  </section>
}
