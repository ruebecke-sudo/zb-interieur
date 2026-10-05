import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ImageManagerActions } from '../components/ImageManagerActions'
import { ImageManagerWebsites } from '../components/ImageManagerWebsites'
import { ImageManagerCategories } from '../components/ImageManagerCategories'
import { ImageManagerMembers } from '../components/ImageManagerMembers'
import { ImageManagerBranding } from '../components/ImageManagerBranding'
import { ImageManagerPlans } from '../components/ImageManagerPlans'
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
  status?: 'Aktiv' | 'Entwurf' | 'Fehler' | 'Synchronisiert' | 'Ausstehend'
  storagePath?: string
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
  const [brandName, setBrandName] = useState('Image Manager PRO')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0E675A')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | 'viewer'>('member')
  const [filterCategory1, setFilterCategory1] = useState('')
  const [filterCategory2, setFilterCategory2] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkCategory1, setBulkCategory1] = useState('')
  const [bulkCategory2, setBulkCategory2] = useState('')
  const [bulkBusy, setBulkBusy] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      if (supabase) {
        const db = supabase
        const { data: userData } = await db.auth.getUser()
        if (!userData.user) throw new Error('Bitte zuerst anmelden.')
        const { data: membership, error: membershipError } = await db.from('memberships').select('tenant_id').eq('user_id', userData.user.id).limit(1).maybeSingle()
        if (membershipError) throw new Error(membershipError.message)
        if (!membership?.tenant_id) throw new Error('Kein Workspace gefunden.')
        const [{ data: imageRows, error: imageError }, { data: categoryRows, error: categoryError }] = await Promise.all([
          db.from('images').select('*').eq('tenant_id', membership.tenant_id).order('updated_at', { ascending: false }),
          db.from('categories').select('slot,name').eq('tenant_id', membership.tenant_id).eq('active', true).order('sort_order'),
        ])
        if (imageError) throw new Error(imageError.message)
        if (categoryError) throw new Error(categoryError.message)
        const mapped: ImageItem[] = (imageRows || []).map((row) => ({
          id: row.id, name: row.name || row.filename || 'Ohne Namen', text: row.text || '',
          category1: row.category1 || '', category2: row.category2 || '', category3: row.category3 || '', category4: row.category4 || '',
          format: row.format || '–', fileSize: Number(row.file_size || 0), url: row.url || '', updatedAt: row.updated_at,
          width: Number(row.width || 0), height: Number(row.height || 0), storagePath: row.storage_path || undefined, status: row.sync_status === 'error' ? 'Fehler' : row.sync_status === 'synced' ? 'Synchronisiert' : row.status === 'active' ? 'Ausstehend' : 'Entwurf',
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
      const db = supabase
      void db.auth.getUser().then(async ({ data }) => {
        if (!data.user) return
        setUserEmail(data.user.email || '')
        const { data: membership } = await db.from('memberships').select('tenant_id,role').eq('user_id', data.user.id).limit(1).maybeSingle()
        if (membership?.tenant_id) {
          setUserRole((membership as { role?: 'owner' | 'admin' | 'member' | 'viewer' }).role || 'member')
          const { data: tenant } = await db.from('tenants').select('name,brand_name,logo_url,primary_color').eq('id', membership.tenant_id).single()
          if (tenant?.name) setWorkspaceName(tenant.name)
          if (tenant?.brand_name) setBrandName(tenant.brand_name)
          if (tenant?.logo_url) setLogoUrl(tenant.logo_url)
          if (tenant?.primary_color) setPrimaryColor(tenant.primary_color)
        }
      })
    }
  }, [])
  const [active, setActive] = useState('Übersicht')
  const filtered = useMemo(() => images.filter((item) => {
    const haystack = [item.name, item.text, item.category1, item.category2, item.category3, item.category4].join(' ').toLowerCase()
    return haystack.includes(query.toLowerCase()) && (!filterCategory1 || item.category1 === filterCategory1) && (!filterCategory2 || item.category2 === filterCategory2)
  }), [images, query, filterCategory1, filterCategory2])

  const toggleSelected = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const selectAllFiltered = () => setSelectedIds((current) => current.length === filtered.length ? [] : filtered.map((item) => item.id))

  const bulkDelete = async () => {
    if (!supabase || !selectedIds.length || !window.confirm(`${selectedIds.length} Bilder wirklich löschen?`)) return
    setBulkBusy(true)
    const selected = images.filter((item) => selectedIds.includes(item.id))
    const { error: deleteError } = await supabase.from('images').delete().in('id', selectedIds)
    if (deleteError) setError(deleteError.message)
    else {
      const paths = selected.map((item) => item.storagePath).filter(Boolean) as string[]
      if (paths.length) await supabase.storage.from('image-manager-media').remove(paths)
      setSelectedIds([])
      await loadData()
    }
    setBulkBusy(false)
  }

  const bulkUpdateCategories = async () => {
    if (!supabase || !selectedIds.length || (!bulkCategory1 && !bulkCategory2)) return
    setBulkBusy(true)
    const patch: Record<string, string> = {}
    if (bulkCategory1) patch.category1 = bulkCategory1
    if (bulkCategory2) patch.category2 = bulkCategory2
    const { error: updateError } = await supabase.from('images').update({ ...patch, sync_status: 'pending', sync_error: null }).in('id', selectedIds)
    if (updateError) setError(updateError.message)
    else { setSelectedIds([]); setBulkCategory1(''); setBulkCategory2(''); await loadData() }
    setBulkBusy(false)
  }
  const categoryCount = new Set(images.flatMap((item) => [item.category1, item.category2, item.category3, item.category4].filter(Boolean))).size
  const activeCount = images.length
  const isWebsites = active === 'Websites'
  const isCategories = active === 'Kategorien'
  const isSettings = active === 'Einstellungen'
  const isPlans = active === 'Tarif'

  const nav = [
    ['Übersicht', '▦'],
    ['Bildverwaltung', '▣'],
    ['Websites', '⌘'],
    ['Kategorien', '≡'],
    ['Einstellungen', '⚙'],
    ['Tarif', '€'],
  ]

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#111318] text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">{logoUrl ? <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-xl bg-white object-contain" /> : <div className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white" style={{ backgroundColor: primaryColor }}>{workspaceName.slice(0, 1).toUpperCase()}</div>}<div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{brandName}</div><div className="mt-1 text-lg font-bold tracking-tight">Media Manager</div></div></div>
        </div>
        <div className="px-4 py-5">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</div>
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl font-bold" style={{ backgroundColor: primaryColor }}>{workspaceName.slice(0, 2).toUpperCase()}</div>
            <div><div className="text-sm font-semibold">{workspaceName}</div><div className="text-xs text-slate-400">{userEmail || "Pilot Workspace"}</div></div>
          </div>
          <nav className="space-y-1">
            {nav.map(([label, icon]) => <button key={label} onClick={() => setActive(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === label ? 'bg-white text-slate-900 font-semibold' : 'text-slate-300 hover:bg-white/10'}`}><span className="w-6 text-center">{icon}</span>{label}</button>)}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/10 p-5 text-xs text-slate-500">Image Manager Pro · SaaS Workspace</div>
      </aside>

      <main className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-sm text-slate-500">{workspaceName} / Image Manager</div><h1 className="mt-1 text-2xl font-bold tracking-tight">{active}</h1></div>
            {userRole !== 'viewer' && <ImageManagerActions primary categories={categories} onChanged={loadData} />}
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">
          {isWebsites ? <ImageManagerWebsites /> : isCategories ? <ImageManagerCategories /> : isPlans ? <ImageManagerPlans /> : isSettings ? (
            <>
              <ImageManagerMembers />
              <div className="mt-6"><ImageManagerBranding /></div>
            </>
          ) : (
            <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [`${images.length.toLocaleString('de-DE')}`, 'Bilder', loading ? 'Lade Bestand …' : 'Live aus ZB-Media-API', '▧'],
              [`${activeCount.toLocaleString('de-DE')}`, 'Aktive Bilder', 'Auf Websites verfügbar', '✓'],
              [`${categoryCount}`, 'Kategorien', 'Aktuell belegte Werte', '≡'],
              [`${images.length ? '1' : '0'}`, 'Website', 'Verbunden', '⌘'],
            ].map(([value,label,sub,icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-3xl font-bold">{value}</div><div className="mt-1 font-semibold">{label}</div><div className="mt-1 text-xs text-slate-500">{sub}</div></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</div></div></div>)}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div><h2 className="text-lg font-bold">Bildbibliothek</h2><p className="text-sm text-slate-500">Bilder zentral verwalten, kategorisieren und an Websites ausspielen.</p></div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bilder suchen …" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none md:w-64" />
                <select value={filterCategory1} onChange={(e) => setFilterCategory1(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Alle Marken</option>{categories.category1.map((value) => <option key={value}>{value}</option>)}</select>
                <select value={filterCategory2} onChange={(e) => setFilterCategory2(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Alle Produktarten</option>{categories.category2.map((value) => <option key={value}>{value}</option>)}</select>
                <button type="button" onClick={() => setViewMode('list')} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold ${viewMode === 'list' ? 'border-[#0E675A] bg-emerald-50 text-[#0E675A]' : 'border-slate-300'}`}>Liste</button>
                <button type="button" onClick={() => setViewMode('grid')} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold ${viewMode === 'grid' ? 'border-[#0E675A] bg-emerald-50 text-[#0E675A]' : 'border-slate-300'}`}>Raster</button>
              </div>
            </div>
            {userRole !== 'viewer' && <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={selectAllFiltered} /> {selectedIds.length ? `${selectedIds.length} ausgewählt` : 'Auswahl'}</label>
              <select value={bulkCategory1} onChange={(e) => setBulkCategory1(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"><option value="">Marke auf Auswahl …</option>{categories.category1.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={bulkCategory2} onChange={(e) => setBulkCategory2(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"><option value="">Produktart auf Auswahl …</option>{categories.category2.map((value) => <option key={value}>{value}</option>)}</select>
              <button type="button" onClick={() => void bulkUpdateCategories()} disabled={bulkBusy || !selectedIds.length || (!bulkCategory1 && !bulkCategory2)} className="rounded-xl bg-[#0E675A] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Kategorien anwenden</button>
              <button type="button" onClick={() => void bulkDelete()} disabled={bulkBusy || !selectedIds.length} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-40">Auswahl löschen</button>
            </div>}
            <div className={viewMode === 'grid' ? 'grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'divide-y divide-slate-100'}>
              {loading && <div className="p-8 text-center text-sm text-slate-500">Bildbibliothek wird geladen …</div>}
              {!loading && error && <div className="p-8 text-center text-sm text-red-600">{error}</div>}
              {!loading && !error && filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Keine Bilder gefunden.</div>}
              {filtered.map((item) => <div key={item.id} className={viewMode === 'grid' ? 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm' : 'flex flex-col gap-4 p-5 md:flex-row md:items-center'}><div className="flex items-start gap-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} className="mt-2" /><img src={item.url} alt={item.name} className={viewMode === 'grid' ? 'h-44 w-full rounded-xl bg-slate-100 object-contain' : 'h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover'} /></div>
                <div className="min-w-0 flex-1"><div className="font-semibold">{item.name}</div><div className="mt-1 text-sm text-slate-500">{[item.category1, item.category2, item.category3, item.category4].filter(Boolean).join(" · ") || "Keine Kategorien"}</div></div>
                <div className="grid grid-cols-3 gap-5 text-xs text-slate-500 md:text-right"><div><div className="font-semibold text-slate-700">{item.format}</div><div>{item.width && item.height ? `${item.width} × ${item.height}` : "Format"}</div></div><div><div className="font-semibold text-slate-700">{formatBytes(item.fileSize)}</div><div>Größe</div></div><div><div className="font-semibold text-slate-700">{formatDate(item.updatedAt)}</div><div>Aktualisiert</div></div></div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Fehler" ? "bg-red-50 text-red-700" : item.status === "Synchronisiert" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.status || "Ausstehend"}</span>
                <ImageManagerActions item={item} categories={categories} onChanged={loadData} />
              </div>)}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#111318] p-6 text-white"><div className="flex items-center gap-3"><Icon>⌘</Icon><div><div className="font-bold">Website-Verbindungen</div><div className="text-sm text-slate-400">Zentrale Verwaltung deiner angeschlossenen Websites</div></div></div><div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"><div><div className="font-semibold">Website-Verbindung</div><div className="mt-1 text-xs text-slate-400">REST Connector · zentral verwaltet</div></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Online</span></div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="font-bold">Nächster Schritt</div><p className="mt-2 text-sm leading-6 text-slate-500">Supabase Auth, echte Kundenkonten und Tenant-Isolation ergänzen. Danach kann derselbe Image Manager für weitere Kunden verwendet werden.</p><button className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">Projektstatus ansehen</button></div>
          </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
