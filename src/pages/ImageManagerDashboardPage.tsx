import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ImageManagerActions } from '../components/ImageManagerActions'
import { ImageManagerWebsites } from '../components/ImageManagerWebsites'
import { ImageManagerCategories } from '../components/ImageManagerCategories'
import { supabase } from '../lib/supabase'

type ImageItem = {
  id: string
  name: string
  text: string
  category1: string
  category2: string
  category3: string
  category4: string
  format: string
  fileSize: number
  url: string
  updatedAt: string
  width: number
  height: number
  status?: 'Aktiv' | 'Entwurf'
}

function formatBytes(bytes: number) {
  if (!bytes) return '–'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value: string) {
  if (!value) return '–'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '–'
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function Icon({ children }: { children: ReactNode }) {
  return <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">{children}</span>
}

export function ImageManagerDashboardPage() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState({ category1: [] as string[], category2: [] as string[], category3: [] as string[], category4: [] as string[] })
  const [workspaceName, setWorkspaceName] = useState('ZB Interieur')
  const [userEmail, setUserEmail] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      if (supabase) {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error('Bitte zuerst anmelden.')
        const { data: membership, error: membershipError } = await supabase.from('memberships').select('tenant_id').eq('user_id', userData.user.id).limit(1).maybeSingle()
        if (membershipError) throw new Error(membershipError.message)
        if (!membership?.tenant_id) throw new Error('Kein Workspace gefunden.')
        const [{ data: imageRows, error: imageError }, { data: categoryRows, error: categoryError }] = await Promise.all([
          supabase.from('images').select('*').eq('tenant_id', membership.tenant_id).order('updated_at', { ascending: false }),
          supabase.from('categories').select('slot,name').eq('tenant_id', membership.tenant_id).eq('active', true).order('sort_order'),
        ])
        if (imageError) throw new Error(imageError.message)
        if (categoryError) throw new Error(categoryError.message)
        const mapped: ImageItem[] = (imageRows || []).map((row) => ({
          id: row.id, name: row.name || row.filename || 'Ohne Namen', text: row.text || '',
          category1: row.category1 || '', category2: row.category2 || '', category3: row.category3 || '', category4: row.category4 || '',
          format: row.format || '–', fileSize: Number(row.file_size || 0), url: row.url || '', updatedAt: row.updated_at,
          width: Number(row.width || 0), height: Number(row.height || 0), status: row.status === 'active' ? 'Aktiv' : 'Entwurf',
        }))
        setImages(mapped)
        setCategories({
          category1: (categoryRows || []).filter((r) => r.slot === 1).map((r) => r.name),
          category2: (categoryRows || []).filter((r) => r.slot === 2).map((r) => r.name),
          category3: (categoryRows || []).filter((r) => r.slot === 3).map((r) => r.name),
          category4: (categoryRows || []).filter((r) => r.slot === 4).map((r) => r.name),
        })
        return
      }
      const [imageResponse, categoryResponse] = await Promise.all([fetch('/api/images'), fetch('/api/images/categories')])
      if (!imageResponse.ok) throw new Error('Bilddaten konnten nicht geladen werden.')
      const imageData = await imageResponse.json() as { items?: ImageItem[] }
      const categoryData = categoryResponse.ok ? await categoryResponse.json() : categories
      setImages(Array.isArray(imageData.items) ? imageData.items : [])
      setCategories({ category1: categoryData.category1 || [], category2: categoryData.category2 || [], category3: categoryData.category3 || [], category4: categoryData.category4 || [] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    void loadData()
    if (supabase) {
      void supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return
        setUserEmail(data.user.email || '')
        const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', data.user.id).limit(1).maybeSingle()
        if (membership?.tenant_id) {
          const { data: tenant } = await supabase.from('tenants').select('name').eq('id', membership.tenant_id).single()
          if (tenant?.name) setWorkspaceName(tenant.name)
        }
      })
    }
  }, [])
  const [active, setActive] = useState('Übersicht')
  const filtered = useMemo(() => images.filter((item) => {
    const haystack = [item.name, item.text, item.category1, item.category2, item.category3, item.category4].join(' ').toLowerCase()
    return haystack.includes(query.toLowerCase())
  }), [images, query])
  const categoryCount = new Set(images.flatMap((item) => [item.category1, item.category2, item.category3, item.category4].filter(Boolean))).size
  const activeCount = images.length
  const isWebsites = active === 'Websites'
  const isCategories = active === 'Kategorien'

  const nav = [
    ['Übersicht', '▦'],
    ['Bildverwaltung', '▣'],
    ['Websites', '⌘'],
    ['Kategorien', '≡'],
    ['Einstellungen', '⚙'],
  ]

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#111318] text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Image Manager</div>
          <div className="mt-1 text-xl font-bold tracking-tight">PRO</div>
        </div>
        <div className="px-4 py-5">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</div>
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E675A] font-bold">{workspaceName.slice(0, 2).toUpperCase()}</div>
            <div><div className="text-sm font-semibold">{workspaceName}</div><div className="text-xs text-slate-400">{userEmail || "Pilot Workspace"}</div></div>
          </div>
          <nav className="space-y-1">
            {nav.map(([label, icon]) => <button key={label} onClick={() => setActive(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === label ? 'bg-white text-slate-900 font-semibold' : 'text-slate-300 hover:bg-white/10'}`}><span className="w-6 text-center">{icon}</span>{label}</button>)}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/10 p-5 text-xs text-slate-500">Image Manager Pro · Foundation MVP</div>
      </aside>

      <main className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-sm text-slate-500">ZB Interieur / Image Manager</div><h1 className="mt-1 text-2xl font-bold tracking-tight">{active}</h1></div>
            <ImageManagerActions primary categories={categories} onChanged={loadData} />
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">{isWebsites ? <ImageManagerWebsites /> : isCategories ? <ImageManagerCategories /> : <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [`${images.length.toLocaleString('de-DE')}`, 'Bilder', loading ? 'Lade Bestand …' : 'Live aus ZB-Media-API', '▧'],
              [`${activeCount.toLocaleString('de-DE')}`, 'Aktive Bilder', 'Auf Websites verfügbar', '✓'],
              [`${categoryCount}`, 'Kategorien', 'Aktuell belegte Werte', '≡'],
              ['1', 'Website', 'Verbunden', '⌘'],
            ].map(([value,label,sub,icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-3xl font-bold">{value}</div><div className="mt-1 font-semibold">{label}</div><div className="mt-1 text-xs text-slate-500">{sub}</div></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</div></div></div>)}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div><h2 className="text-lg font-bold">Bildbibliothek</h2><p className="text-sm text-slate-500">Bilder zentral verwalten, kategorisieren und an Websites ausspielen.</p></div>
              <div className="relative"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bilder suchen …" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none md:w-72" /></div>
            </div>
            <div className="divide-y divide-slate-100">
              {loading && <div className="p-8 text-center text-sm text-slate-500">Bildbibliothek wird geladen …</div>}
              {!loading && error && <div className="p-8 text-center text-sm text-red-600">{error}</div>}
              {!loading && !error && filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Keine Bilder gefunden.</div>}
              {filtered.map((item) => <div key={item.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <img src={item.url} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover" />
                <div className="min-w-0 flex-1"><div className="font-semibold">{item.name}</div><div className="mt-1 text-sm text-slate-500">{[item.category1, item.category2, item.category3, item.category4].filter(Boolean).join(" · ") || "Keine Kategorien"}</div></div>
                <div className="grid grid-cols-3 gap-5 text-xs text-slate-500 md:text-right"><div><div className="font-semibold text-slate-700">{item.format}</div><div>{item.width && item.height ? `${item.width} × ${item.height}` : "Format"}</div></div><div><div className="font-semibold text-slate-700">{formatBytes(item.fileSize)}</div><div>Größe</div></div><div><div className="font-semibold text-slate-700">{formatDate(item.updatedAt)}</div><div>Aktualisiert</div></div></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status || "Aktiv"}</span>
                <ImageManagerActions item={item} categories={categories} onChanged={loadData} />
              </div>)}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#111318] p-6 text-white"><div className="flex items-center gap-3"><Icon>⌘</Icon><div><div className="font-bold">Website-Verbindungen</div><div className="text-sm text-slate-400">Zentrale Verwaltung deiner angeschlossenen Websites</div></div></div><div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"><div><div className="font-semibold">ZB Interieur</div><div className="mt-1 text-xs text-slate-400">REST Connector · API verbunden</div></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Online</span></div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="font-bold">Nächster Schritt</div><p className="mt-2 text-sm leading-6 text-slate-500">Supabase Auth, echte Kundenkonten und Tenant-Isolation ergänzen. Danach kann derselbe Image Manager für weitere Kunden verwendet werden.</p><button className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">Projektstatus ansehen</button></div>
          </section>
        </div>
        </>}
      </main>
    </div>
  )
}
