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
  const [pushing, setPushing] = useState<string | null>(null)
  const [keyStatus, setKeyStatus] = useState<Record<string, boolean>>({})
  const [keyEditor, setKeyEditor] = useState<string | null>(null)
  const [keyValue, setKeyValue] = useState('')
  const [savingKey, setSavingKey] = useState(false)

  const load = async () => {
    const db = supabase
    if (!db) return
    const { data, error } = await db.from('websites').select('id,name,base_url,connector_type,status').order('created_at', { ascending: false })
    if (error) setMessage(error.message)
    else setItems(data || [])
    // Only tells whether a key is stored – the key itself is never readable in the browser.
    const { data: userData } = await db.auth.getUser()
    if (!userData.user) return
    const { data: membership } = await db.from('memberships').select('tenant_id').eq('user_id', userData.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    const { data: statusRows } = await db.rpc('get_website_credential_status', { target_tenant: membership.tenant_id })
    setKeyStatus(Object.fromEntries(((statusRows || []) as Array<{ website_id: string; has_key: boolean }>).map((row) => [row.website_id, row.has_key])))
  }

  const saveKey = async (site: Website) => {
    if (!supabase) return
    setSavingKey(true); setMessage('')
    const { error } = await supabase.rpc('set_website_credential', { target_website: site.id, new_api_key: keyValue })
    if (error) setMessage(`${site.name}: ${error.message}`)
    else { setMessage(keyValue.trim() ? `${site.name}: API-Schlüssel gespeichert.` : `${site.name}: API-Schlüssel entfernt.`); setKeyEditor(null); setKeyValue(''); await load() }
    setSavingKey(false)
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
    if (!membership?.tenant_id) return setMessage('Kein Arbeitsbereich gefunden.')
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
      const data = await response.json() as { items?: Array<Record<string, unknown>>; total?: number }
      const remoteItems = Array.isArray(data.items) ? data.items : []
      const { data: userData } = await supabase!.auth.getUser()
      if (!userData.user) throw new Error('Bitte zuerst anmelden.')
      const { data: membership } = await supabase!.from('memberships').select('tenant_id').eq('user_id', userData.user.id).limit(1).maybeSingle()
      if (!membership?.tenant_id) throw new Error('Kein Arbeitsbereich gefunden.')
      const rows = remoteItems.map((item) => ({
        tenant_id: membership.tenant_id,
        website_id: site.id,
        external_id: String(item.id ?? item.externalId ?? item.external_id ?? item.url ?? ''),
        filename: String(item.originalFilename ?? item.filename ?? ''),
        name: String(item.name ?? ''),
        text: String(item.text ?? ''),
        category1: String(item.category1 ?? ''),
        category2: String(item.category2 ?? ''),
        category3: String(item.category3 ?? ''),
        category4: String(item.category4 ?? ''),
        width: Number(item.width ?? 0) || null,
        height: Number(item.height ?? 0) || null,
        color_space: String(item.colorSpace ?? item.color_space ?? ''),
        format: String(item.format ?? ''),
        file_size: Number(item.fileSize ?? item.file_size ?? 0) || null,
        url: String(item.url ?? ''),
        status: 'active',
      })).filter((row) => row.external_id)
      if (rows.length) {
        const { error: upsertError } = await supabase!.from('images').upsert(rows, { onConflict: 'website_id,external_id' })
        if (upsertError) throw new Error(upsertError.message)
      }
      setMessage(`${site.name}: ${rows.length.toLocaleString('de-DE')} Bilder synchronisiert und im Arbeitsbereich gespeichert.`)
    } catch {
      setMessage(`${site.name}: Synchronisation fehlgeschlagen. Der Connector ist erreichbar, aber die Bild-API konnte nicht gelesen werden.`)
    } finally { setSyncing(null) }
  }

  const pushPending = async (site: Website) => {
    setPushing(site.id); setMessage('')
    try {
      if (!supabase) throw new Error('Supabase ist noch nicht konfiguriert.')
      const { data: rows, error: readError } = await supabase.from('images').select('id,external_id,name,text,category1,category2,category3,category4,website_id,sync_status,url').eq('website_id', site.id).in('sync_status', ['pending','error'])
      if (readError) throw new Error(readError.message)
      const pending = rows || []
      let pushed = 0
      for (const row of pending) {
        const session = await supabase.auth.getSession()
        const token = session.data.session?.access_token
        if (!token) throw new Error('Sitzung abgelaufen.')
        const response = await fetch('/.netlify/functions/push-image-to-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image_id: row.id }),
        })
        if (!response.ok) continue
        pushed += 1
      }
      setMessage(`${site.name}: ${pushed.toLocaleString('de-DE')} Änderungen übertragen.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Übertragung fehlgeschlagen.')
    } finally { setPushing(null) }
  }

  const remove = async (id: string) => {
    if (!supabase || !window.confirm('Website wirklich entfernen?')) return
    const { error } = await supabase.from('websites').delete().eq('id', id)
    if (error) setMessage(error.message)
    else await load()
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Websites</h2><p className="mt-1 text-sm text-slate-500">Verbinde mehrere Websites mit deinem Image Manager Arbeitsbereich.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{items.length} verbunden</span></div>
    <form onSubmit={add} className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1.5fr_180px_auto]">
      <input required value={name} onChange={e => setName(e.target.value)} placeholder="Website-Name" className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
      <input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.beispiel.de" className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
      <select value={connector} onChange={e => setConnector(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="rest">REST-Schnittstelle</option><option value="wordpress">WordPress (nur Import)</option><option value="shopify">Shopify (nur Import)</option><option value="custom">Individuell (REST)</option></select>
      <button disabled={busy} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Speichern …' : 'Website hinzufügen'}</button>
    </form>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    <div className="mt-5 space-y-3">{items.map(site => <div key={site.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="font-semibold">{site.name}</div><div className="mt-1 text-sm text-slate-500">{site.base_url} · {site.connector_type}</div></div><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{site.status === 'active' ? 'Aktiv' : site.status}</span><button onClick={() => { setKeyEditor(keyEditor === site.id ? null : site.id); setKeyValue('') }} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${keyStatus[site.id] ? 'border-emerald-200 text-emerald-700' : 'border-amber-300 text-amber-700'}`}>{keyStatus[site.id] ? 'API-Schlüssel ✓' : 'API-Schlüssel fehlt'}</button><button onClick={() => void testConnection(site)} disabled={testing === site.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-50">{testing === site.id ? "Prüfen …" : "Verbindung testen"}</button><button onClick={() => void syncImages(site)} disabled={syncing === site.id} className="rounded-lg bg-[#0E675A] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{syncing === site.id ? "Synchronisieren …" : "Bilder synchronisieren"}</button><button onClick={() => void pushPending(site)} disabled={pushing === site.id} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-50">{pushing === site.id ? "Übertragen …" : "Änderungen übertragen"}</button><button onClick={() => void remove(site.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Entfernen</button></div></div>
      {keyEditor === site.id && <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <div className="text-sm font-semibold">API-Schlüssel der Website</div>
        <p className="mt-1 text-xs text-slate-500">Den Schlüssel erhältst du vom Betreiber der Website. Er wird verschlüsselt übertragen, nur vom Server verwendet und ist danach hier nicht mehr lesbar. {keyStatus[site.id] ? 'Ein neuer Wert ersetzt den gespeicherten; ein leeres Feld entfernt ihn.' : ''}</p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row">
          <input type="password" autoComplete="off" value={keyValue} onChange={e => setKeyValue(e.target.value)} placeholder={keyStatus[site.id] ? 'Neuen Schlüssel eingeben' : 'Schlüssel eingeben (mind. 16 Zeichen)'} className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
          <button onClick={() => void saveKey(site)} disabled={savingKey || (!keyValue.trim() && !keyStatus[site.id])} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{savingKey ? 'Speichern …' : keyValue.trim() || !keyStatus[site.id] ? 'Schlüssel speichern' : 'Schlüssel entfernen'}</button>
        </div>
      </div>}
    </div>)}</div>
    {!items.length && <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Noch keine Website verbunden.</div>}
  </section>
}
