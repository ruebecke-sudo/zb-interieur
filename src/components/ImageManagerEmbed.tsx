import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { CategoryLabels } from '../lib/categoryLabels'
import { buildWordPressPluginZip } from '../lib/wordpressPlugin'

type Categories = { category1: string[]; category2: string[]; category3: string[]; category4: string[] }
type EmbedApi = { render: (host: Element) => void }

const SCRIPT_PATH = '/image-manager-embed.js'

type Platform = 'wordpress' | 'wix' | 'jimdo' | 'shopify' | 'other' | 'unknown'
const PLATFORMS: Array<{ id: Platform; label: string }> = [
  { id: 'wordpress', label: 'WordPress' },
  { id: 'wix', label: 'Wix' },
  { id: 'jimdo', label: 'Jimdo' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'other', label: 'Etwas anderes' },
  { id: 'unknown', label: 'Weiß ich nicht' },
]

function Steps({ steps }: { steps: ReactNode[] }) {
  return <ol className="mt-5 space-y-3">
    {steps.map((step, index) => <li key={index} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0E675A] text-sm font-bold text-white">{index + 1}</span>
      <div className="min-w-0 flex-1">{step}</div>
    </li>)}
  </ol>
}

function CopyLine({ text, onCopy }: { text: string; onCopy: () => void }) {
  return <div className="my-3 flex flex-col gap-2 sm:flex-row">
    <code className="flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 font-mono text-sm ring-1 ring-slate-200">{text}</code>
    <button type="button" onClick={onCopy} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold">Kopieren</button>
  </div>
}

function CopyBlock({ text, onCopy }: { text: string; onCopy: () => void }) {
  return <div className="mt-3">
    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-slate-900 p-4 text-xs leading-5 text-emerald-200">{text}</pre>
    <button type="button" onClick={onCopy} className="mt-2 rounded-xl bg-[#0E675A] px-4 py-2 text-sm font-semibold text-white">Code kopieren</button>
  </div>
}

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
  const [workspaceName, setWorkspaceName] = useState('')
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [siteUrl, setSiteUrl] = useState('')
  const [detecting, setDetecting] = useState(false)
  const preview = useRef<HTMLDivElement>(null)

  useEffect(() => { void (async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id,role').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    setCanManage(['owner', 'admin'].includes(membership.role))
    const { data, error } = await supabase.from('tenants').select('embed_id,embed_enabled,name').eq('id', membership.tenant_id).maybeSingle()
    if (error || !data) { setUnavailable(true); return }
    setEmbedId(data.embed_id)
    setEnabled(Boolean(data.embed_enabled))
    setWorkspaceName(data.name || '')
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

  const copyText = async (text: string, done: string) => {
    try { await navigator.clipboard.writeText(text); setMessage(done) }
    catch { setMessage('Kopieren nicht möglich. Bitte den Text markieren und mit Strg+C kopieren.') }
  }

  // WordPress shortcode with the same filters as the generator above.
  const shortcode = useMemo(() => {
    const parts = ['image_manager_galerie']
    for (const slot of [1, 2, 3, 4]) if (filters[slot]) parts.push(`kategorie${slot}="${filters[slot].replace(/"/g, '')}"`)
    if (columns !== 3) parts.push(`spalten="${columns}"`)
    if (limit !== 24) parts.push(`anzahl="${limit}"`)
    if (!captions) parts.push('bildnamen="nein"')
    return `[${parts.join(' ')}]`
  }, [filters, columns, limit, captions])

  const downloadPlugin = () => {
    const zip = buildWordPressPluginZip({
      embedId,
      scriptUrl: `${window.location.origin}${SCRIPT_PATH}`,
      labels,
      workspaceName,
      exampleValue: categories.category1[0],
    })
    const url = URL.createObjectURL(new Blob([zip as BlobPart], { type: 'application/zip' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'image-manager-pro-galerie.zip'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Plugin heruntergeladen. Die Datei liegt in Ihrem Download-Ordner. Weiter mit Schritt 2.')
  }

  const PLATFORM_NAMES: Record<string, string> = { wordpress: 'WordPress', wix: 'Wix', jimdo: 'Jimdo', shopify: 'Shopify' }

  // Customer only types the website address; the matching steps are picked automatically.
  const detect = async () => {
    setDetecting(true)
    setMessage('')
    try {
      const response = await fetch('/.netlify/functions/detect-website-platform', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: siteUrl }) })
      const data = await response.json() as { platform?: string; error?: string }
      if (!response.ok || !data.platform) { setMessage(data.error || 'Die Website konnte nicht geprüft werden.'); return }
      if (data.platform === 'unknown') {
        setPlatform('other')
        setMessage('Wir konnten das System nicht eindeutig erkennen. Die Schritte unten funktionieren mit fast jedem Website-Baukasten.')
      } else {
        setPlatform(data.platform as Platform)
        setMessage(`Erkannt: Ihre Website ist mit ${PLATFORM_NAMES[data.platform]} gebaut. Folgen Sie einfach den Schritten unten.`)
      }
    } catch {
      setMessage('Die Website konnte nicht geprüft werden. Bitte die Adresse prüfen.')
    } finally {
      setDetecting(false)
    }
  }

  const options = [categories.category1, categories.category2, categories.category3, categories.category4]

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-xl font-bold">Galerie auf Ihrer Website einbinden</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Funktioniert mit jeder Website, zum Beispiel WordPress, Wix, Jimdo oder Shopify. Auswählen, was gezeigt werden soll, dann Ihr System wählen und den Schritten folgen. Neue und geänderte Bilder erscheinen danach automatisch.</p>
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

      <div className="mt-6">
        <div className="text-sm font-semibold">Vorschau</div>
        <div className="mt-2 rounded-xl border border-slate-200 p-4"><div ref={preview} /></div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="text-base font-bold">Womit ist Ihre Website gebaut?</div>
        <p className="mt-1 text-sm text-slate-500">Wählen Sie aus, Sie bekommen dann genau die passenden Schritte.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORMS.map((option) => <button key={option.id} type="button" onClick={() => setPlatform(option.id)} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${platform === option.id ? 'border-[#0E675A] bg-emerald-50 text-[#0E675A]' : 'border-slate-300 text-slate-700'}`}>{option.label}</button>)}
        </div>

        {platform === 'wordpress' && <Steps steps={[
          <>Ihr persönliches Plugin herunterladen. Ihre Galerie ist darin schon eingerichtet.<div className="mt-3"><button type="button" onClick={downloadPlugin} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">WordPress-Plugin herunterladen</button></div></>,
          <>In WordPress links auf <b>Plugins → Neues Plugin hinzufügen</b> (ältere Versionen: „Installieren“), oben auf <b>Plugin hochladen</b>, die Datei <b>image-manager-pro-galerie.zip</b> auswählen, <b>Jetzt installieren</b> und danach <b>Aktivieren</b>.</>,
          <>Die Seite öffnen, auf der die Bilder erscheinen sollen, einen Block <b>„Shortcode“</b> einfügen und diesen Text hineinschreiben:<CopyLine text={shortcode} onCopy={() => void copyText(shortcode, 'Shortcode kopiert. In WordPress in den Block „Shortcode“ einfügen.')} />Speichern, fertig.</>,
        ]} />}

        {platform === 'wix' && <Steps steps={[
          <>Den Code kopieren:<CopyBlock text={snippet} onCopy={() => void copyText(snippet, 'Code kopiert. Jetzt in Wix einfügen.')} /></>,
          <>Im Wix-Editor links auf <b>Hinzufügen (+) → Einbetten &amp; Code → Code einbetten</b> (je nach Version „HTML iFrame“) und das Element auf die Seite ziehen.</>,
          <>Auf das Element klicken, <b>Code eingeben</b> wählen, den Code einfügen und <b>Aktualisieren</b>. Das Element groß genug ziehen und die Website <b>veröffentlichen</b>.</>,
        ]} />}

        {platform === 'jimdo' && <Steps steps={[
          <>Den Code kopieren:<CopyBlock text={snippet} onCopy={() => void copyText(snippet, 'Code kopiert. Jetzt in Jimdo einfügen.')} /></>,
          <>In Jimdo (Creator) an der gewünschten Stelle auf <b>Element hinzufügen → Mehr Elemente → Widget/HTML</b> klicken.</>,
          <>Den Code einfügen und <b>Speichern</b>. Hinweis: Eigener Code ist bei Jimdo je nach Tarif nur im Jimdo Creator möglich.</>,
        ]} />}

        {platform === 'shopify' && <Steps steps={[
          <>Den Code kopieren:<CopyBlock text={snippet} onCopy={() => void copyText(snippet, 'Code kopiert. Jetzt in Shopify einfügen.')} /></>,
          <>In Shopify auf <b>Onlineshop → Themes → Anpassen</b>, die gewünschte Seite wählen und <b>Abschnitt hinzufügen → Benutzerdefiniertes Liquid</b>.</>,
          <>Den Code in das Feld einfügen und oben rechts <b>Speichern</b>.</>,
        ]} />}

        {platform === 'other' && <Steps steps={[
          <>Den Code kopieren:<CopyBlock text={snippet} onCopy={() => void copyText(snippet, 'Code kopiert.')} /></>,
          <>In Ihrem Website-Baukasten ein Element für <b>HTML</b>, <b>eigenen Code</b> oder <b>Einbetten</b> an der gewünschten Stelle einfügen.</>,
          <>Den Code einfügen, speichern und veröffentlichen. Die Bilder erscheinen dort, wo der Code steht.</>,
        ]} />}

        {platform === 'unknown' && <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <div className="text-sm font-semibold">Kein Problem. Geben Sie einfach die Adresse Ihrer Website ein, wir finden es heraus.</div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void detect() }} placeholder="z. B. www.meine-firma.de" inputMode="url" className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
            <button type="button" onClick={() => void detect()} disabled={detecting || !siteUrl.trim()} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{detecting ? 'Wird geprüft …' : 'Herausfinden'}</button>
          </div>
        </div>}
      </div>
    </>}
  </section>
}
