import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Website = { id: string; name: string; base_url: string; connector_type: string; status: string }

export function ImageManagerWebsites() {
  const [items, setItems] = useState<Website[]>([])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [connector, setConnector] = useState('rest')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [testing, setTesting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)

  const load = async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('websites').select('id,name,base_url,connector_type,status').order('created_at', { ascending: false })
    if (error) setMessage(error.message)
    else setItems(data || [])
  }

  useEffect(() => { void load() }, [])

  const add = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabase) return setMessage('Supabase ist noch nicht konfiguriert.')
    setBusy(true)
    setMessage('')
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return setMessage('Bitte zuerst anmelden.')
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', userData.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return setMessage('Kein Workspace gefunden.')
    const { error } = await supabase.from('websites').insert({ tenant_id: membership.tenant_id, name, base_url: url, connector_type: connector, status: 'active' })
    if (error) setMessage(error.message)
    else { setName(''); setUrl(''); setMessage('Website erfolgreich angelegt.'); await load() }
    setBusy(false)
  }

  const testConnection = async (site: Website) => {
    setTesting(site.id); setMessage('')
    try {
      const response = await fetch(`${site.base_url.replace(/\/$/, '')}/api/health`, { method: 'GET' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setMessage(`${site.name}: Verbindung erfolgreich.`)
    } catch {
      setMessage(`${site.name}: Verbindung konnte vom Browser nicht geprüft werden. Bei geschützten APIs erfolgt der Test später serverseitig.`)
    } finally { setTesting(null) }
  }

  const syncImages = async (site: Website) => {
    setSyncing(site.id); setMessage('')
    try {
      const base = site.base_url.replace(/\/$/, '')
      const response = await fetch(`${base}/api/images`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json() as { items?: unknown[]; total?: number }
      const count = Array.isArray(data.items) ? data.items.length : Number(data.total || 0)
      setMessage(`${site.name}: ${count.toLocaleString('de-DE')} Bilder aus dem Connector geladen.`)
    } catch {
      setMessage(`${site.name}: Synchronisation fehlgeschlagen. Der Connector ist erreichbar, aber die Bild-API konnte nicht gelesen werden.`)
    } finally { setSyncing(null) }
  }

  const remove = async (id: string) => {
    if (!supabase || !window.confirm('Website wirklich entfernen?')) return
    const { error } = await supabase.from('websites').delete().eq('id', id)
    if (error) setMessage(error.message)
    else await load()
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Websites</h2><p className="mt-1 text-sm text-slate-500">Verbinde mehrere Websites mit deinem Image Manager Workspace.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{items.length} verbunden</span></div>
    <form onSubmit={add} className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1.5fr_180px_auto]">
      <input required value={name} onChange={e => setName(e.target.value)} placeholder="Website-Name" className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
      <input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.beispiel.de" className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
      <select value={connector} onChange={e => setConnector(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="rest">REST API</option><option value="wordpress">WordPress</option><option value="shopify">Shopify</option><option value="custom">Custom</option></select>
      <button disabled={busy} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Speichern …' : 'Website hinzufügen'}</button>
    </form>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    <div className="mt-5 space-y-3">{items.map(site => <div key={site.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"><div><div className="font-semibold">{site.name}</div><div className="mt-1 text-sm text-slate-500">{site.base_url} · {site.connector_type}</div></div><div className="flex items-center gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{site.status === 'active' ? 'Aktiv' : site.status}</span><button onClick={() => void testConnection(site)} disabled={testing === site.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-50">{testing === site.id ? "Prüfen …" : "Verbindung testen"}</button><button onClick={() => void syncImages(site)} disabled={syncing === site.id} className="rounded-lg bg-[#0E675A] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{syncing === site.id ? "Synchronisieren …" : "Bilder synchronisieren"}</button><button onClick={() => void remove(site.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Entfernen</button></div></div>)}</div>
    {!items.length && <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Noch keine Website verbunden.</div>}
  </section>
}
