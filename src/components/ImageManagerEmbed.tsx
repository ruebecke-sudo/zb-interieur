import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CategoryLabels } from '../lib/categoryLabels'

type Categories = { category1: string[]; category2: string[]; category3: string[]; category4: string[] }
type EmbedApi = { render: (host: Element) => void }

const SCRIPT_PATH = '/image-manager-embed.js'

function loadEmbedScript(): Promise<EmbedApi | null> {
  const existing = (window as unknown as { ImageManagerEmbed?: EmbedApi }).ImageManagerEmbed
  if (existing) return Promise.resolve(existing)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = SCRIPT_PATH
    script.async = true
    script.onload = () => resolve((window as unknown as { ImageManagerEmbed?: EmbedApi }).ImageManagerEmbed || null)
    script.onerror = () => resolve(null)
    document.body.appendChild(script)
  })
}

/** Generator for the copy-paste gallery code customers put on any website. */
export function ImageManagerEmbed({ categories, labels }: { categories: Categories; labels: CategoryLabels }) {
  const [tenantId, setTenantId] = useState('')
  const [embedId, setEmbedId] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [canManage, setCanManage] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [filters, setFilters] = useState<Record<number, string>>({})
  const [columns, setColumns] = useState(3)
  const [limit, setLimit] = useState(24)
  const [captions, setCaptions] = useState(true)
  const [message, setMessage] = useState('')
  const preview = useRef<HTMLDivElement>(null)

  useEffect(() => { void (async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id,role').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    setCanManage(['owner', 'admin'].includes(membership.role))
    const { data, error } = await supabase.from('tenants').select('embed_id,embed_enabled').eq('id', membership.tenant_id).maybeSingle()
    if (error || !data) { setUnavailable(true); return }
    setEmbedId(data.embed_id)
    setEnabled(Boolean(data.embed_enabled))
  })() }, [])

  const attributes = useMemo(() => {
    const attrs: Array<[string, string]> = [['data-image-manager-gallery', embedId]]
    for (const slot of [1, 2, 3, 4]) if (filters[slot]) attrs.push([`data-category${slot}`, filters[slot]])
    attrs.push(['data-columns', String(columns)], ['data-limit', String(limit)])
    if (!captions) attrs.push(['data-captions', 'false'])
    return attrs
  }, [embedId, filters, columns, limit, captions])

  const snippet = useMemo(() => {
    const attrText = attributes.map(([name, value]) => `${name}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`).join(' ')
    return `<div ${attrText}></div>\n<script src="${window.location.origin}${SCRIPT_PATH}" async></script>`
  }, [attributes])

  // Live preview: same script and same attributes as on the customer's website.
  useEffect(() => {
    const host = preview.current
    if (!host || !enabled || !embedId) return
    for (const attr of Array.from(host.attributes)) if (attr.name.startsWith('data-')) host.removeAttribute(attr.name)
    for (const [name, value] of attributes) host.setAttribute(name, value)
    void loadEmbedScript().then((api) => {
      if (api) api.render(host)
      else setMessage('Die Vorschau ist nur auf der veröffentlichten Seite verfügbar.')
    })
  }, [attributes, enabled, embedId])

  const toggle = async () => {
    if (!supabase || !tenantId) return
    const { error } = await supabase.from('tenants').update({ embed_enabled: !enabled }).eq('id', tenantId)
    if (error) return setMessage(error.message)
    setEnabled(!enabled)
    setMessage(!enabled ? 'Galerie freigegeben. Bilder dieses Arbeitsbereichs können jetzt über den Code angezeigt werden.' : 'Galerie gesperrt. Eingebundene Galerien zeigen keine Bilder mehr.')
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(snippet); setMessage('Code kopiert. Fügen Sie ihn auf Ihrer Website an der gewünschten Stelle ein.') }
    catch { setMessage('Kopieren nicht möglich. Bitte den Code markieren und mit Strg+C kopieren.') }
  }

  const options = [categories.category1, categories.category2, categories.category3, categories.category4]

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-xl font-bold">Galerie auf Ihrer Website einbinden</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Funktioniert mit jeder Website, zum Beispiel WordPress, Wix, Jimdo, Shopify oder einer eigenen Seite. Code kopieren, auf der Website einfügen, fertig. Neue und geänderte Bilder erscheinen dort automatisch.</p>
      </div>
      {!unavailable && <button type="button" onClick={() => void toggle()} disabled={!canManage} title={canManage ? '' : 'Nur Inhaber und Administratoren'} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 ${enabled ? 'border border-slate-300 text-slate-700' : 'bg-[#0E675A] text-white'}`}>{enabled ? 'Galerie sperren' : 'Galerie freigeben'}</button>}
    </div>

    {unavailable && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Die Einbindung ist noch nicht aktiv. Bitte das Datenbank-Update 009 in Supabase ausführen.</div>}
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}

    {!unavailable && !enabled && <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Solange die Galerie nicht freigegeben ist, sind Ihre Bilder nicht öffentlich abrufbar.</div>}

    {!unavailable && enabled && <>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((slot) => <label key={slot} className="text-xs font-semibold text-slate-600">{labels[slot - 1]}
          <select value={filters[slot] || ''} onChange={(e) => setFilters({ ...filters, [slot]: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal">
            <option value="">Alle</option>
            {options[slot - 1].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>)}
        <label className="text-xs font-semibold text-slate-600">Spalten
          <select value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal">{[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </label>
        <label className="text-xs font-semibold text-slate-600">Höchstens Bilder
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal">{[6, 12, 24, 48, 100, 200].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm text-slate-700 md:col-span-2"><input type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} /> Bildnamen unter den Bildern anzeigen</label>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between"><span className="text-sm font-semibold">Ihr Code</span><button type="button" onClick={() => void copy()} className="rounded-xl bg-[#0E675A] px-4 py-2 text-sm font-semibold text-white">Code kopieren</button></div>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-slate-900 p-4 text-xs leading-5 text-emerald-200">{snippet}</pre>
        <p className="mt-2 text-xs text-slate-500">WordPress: Block „Individuelles HTML“. Wix: „Einbetten → Code einbetten“. Jimdo: Element „Widget/HTML“. Shopify: Abschnitt „Benutzerdefiniertes Liquid“.</p>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold">Vorschau</div>
        <div className="mt-2 rounded-xl border border-slate-200 p-4"><div ref={preview} /></div>
      </div>
    </>}
  </section>
}
