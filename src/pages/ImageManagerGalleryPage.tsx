import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadEmbedScript } from '../lib/embedScript'

type GalleryMeta = {
  embedId: string
  name: string
  logoUrl: string
  primaryColor: string
  categoryLabels: string[] | null
  categoryValues: string[][]
}

/** Hosted public gallery of a workspace: /g/<slug> (SaaS site) or /image-manager/galerie/<slug>. */
export function ImageManagerGalleryPage() {
  const { slug = '' } = useParams()
  const [meta, setMeta] = useState<GalleryMeta | null>(null)
  const [style, setStyle] = useState<'grid' | 'catalog'>('grid')
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<Record<number, string>>({})
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [logoBroken, setLogoBroken] = useState(false)
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void fetch(`/.netlify/functions/public-gallery?slug=${encodeURIComponent(slug)}&meta=1&limit=1`)
      .then(async (response) => {
        const data = await response.json() as { meta?: GalleryMeta; settings?: { style?: string }; error?: string }
        if (!response.ok || !data.meta) throw new Error(data.error || 'Galerie nicht gefunden.')
        setMeta(data.meta)
        if (data.settings?.style === 'catalog') setStyle('catalog')
        document.title = data.meta.name
      })
      .catch((err: Error) => setError(err.message))
  }, [slug])

  useEffect(() => {
    const element = host.current
    if (!element || !meta) return
    for (const attr of Array.from(element.attributes)) if (attr.name.startsWith('data-')) element.removeAttribute(attr.name)
    element.setAttribute('data-image-manager-gallery', meta.embedId)
    element.setAttribute('data-columns', style === 'catalog' ? '3' : '4')
    element.setAttribute('data-style', style)
    element.setAttribute('data-limit', '200')
    for (const slot of [1, 2, 3, 4]) if (filters[slot]) element.setAttribute(`data-category${slot}`, filters[slot])
    if (appliedSearch) element.setAttribute('data-search', appliedSearch)
    void loadEmbedScript().then((api) => api?.render(element))
  }, [meta, filters, appliedSearch, style])

  if (error) return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center text-slate-600">
    <div><div className="text-5xl">🖼️</div><p className="mt-4 text-lg font-semibold">Diese Galerie ist nicht verfügbar.</p><p className="mt-1 text-sm">{error}</p></div>
  </div>

  if (!meta) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Galerie wird geladen …</div>

  const color = meta.primaryColor
  const labels = meta.categoryLabels || []
  const filterSlots = [0, 1, 2, 3].filter((index) => (meta.categoryValues[index] || []).length > 1)

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="text-white" style={{ backgroundColor: color }}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-6">
        {meta.logoUrl && !logoBroken
          ? <div className="rounded-xl bg-white px-3 py-2"><img src={meta.logoUrl} alt={meta.name} onError={() => setLogoBroken(true)} className="h-10 max-w-[180px] object-contain" /></div>
          : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-xl font-bold">{meta.name.slice(0, 1).toUpperCase()}</div>}
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{meta.name}</h1>
      </div>
    </header>

    <main className="mx-auto max-w-6xl px-5 py-6">
      <form onSubmit={(e) => { e.preventDefault(); setAppliedSearch(search.trim()) }} className="flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Bilder suchen …" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none" />
        <button className="rounded-xl px-5 py-3 font-semibold text-white" style={{ backgroundColor: color }}>Suchen</button>
      </form>

      {filterSlots.map((index) => <div key={index} className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{labels[index] || `Kategorie ${index + 1}`}</div>
        <div className="flex flex-wrap gap-2">
          {['', ...meta.categoryValues[index]].map((value) => {
            const active = (filters[index + 1] || '') === value
            return <button key={value || 'alle'} type="button" onClick={() => setFilters({ ...filters, [index + 1]: value })} className={`rounded-full border px-4 py-2 text-sm font-medium ${active ? 'text-white' : 'border-slate-300 bg-white text-slate-700'}`} style={active ? { backgroundColor: color, borderColor: color } : undefined}>{value || 'Alle'}</button>
          })}
        </div>
      </div>)}

      <div className="mt-6"><div ref={host} /></div>
    </main>
  </div>
}
