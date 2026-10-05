import { useMemo, useState } from 'react'

type ImageItem = {
  name: string
  category: string
  format: string
  size: string
  updated: string
  status: 'Aktiv' | 'Entwurf'
}

const demoImages: ImageItem[] = [
  { name: 'FINE Aria Sofa 3-Sitzer', category: 'Fine · Sofa · Wohnen · Modern', format: 'JPG', size: '2,4 MB', updated: 'Heute', status: 'Aktiv' },
  { name: 'AL2 Catifa Lounge', category: 'AL2 · Sessel · Wohnen · Design', format: 'WEBP', size: '1,8 MB', updated: 'Heute', status: 'Aktiv' },
  { name: 'Gyform Designer Sofa', category: 'Gyform · Sofa · Wohnen · Klassisch', format: 'JPG', size: '3,1 MB', updated: 'Gestern', status: 'Aktiv' },
  { name: 'Outdoor Lounge Collection', category: 'Marke · Outdoor · Terrasse · Modern', format: 'AVIF', size: '980 KB', updated: 'Gestern', status: 'Aktiv' },
]

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">{children}</span>
}

export function ImageManagerDashboardPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Übersicht')
  const filtered = useMemo(() => demoImages.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())), [query])

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E675A] font-bold">ZB</div>
            <div><div className="text-sm font-semibold">ZB Interieur</div><div className="text-xs text-slate-400">Pilot Workspace</div></div>
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
            <button className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#09564b]">+ Bild hochladen</button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['1.248', 'Bilder', 'Gesamtbestand', '▧'],
              ['1.183', 'Aktive Bilder', 'Auf Websites verfügbar', '✓'],
              ['4', 'Kategorien', 'Konfigurierbare Felder', '≡'],
              ['1', 'Website', 'Verbunden', '⌘'],
            ].map(([value,label,sub,icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><div className="text-3xl font-bold">{value}</div><div className="mt-1 font-semibold">{label}</div><div className="mt-1 text-xs text-slate-500">{sub}</div></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</div></div></div>)}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
              <div><h2 className="text-lg font-bold">Bildbibliothek</h2><p className="text-sm text-slate-500">Bilder zentral verwalten, kategorisieren und an Websites ausspielen.</p></div>
              <div className="relative"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bilder suchen …" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none md:w-72" /></div>
            </div>
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => <div key={item.name} className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300" />
                <div className="min-w-0 flex-1"><div className="font-semibold">{item.name}</div><div className="mt-1 text-sm text-slate-500">{item.category}</div></div>
                <div className="grid grid-cols-3 gap-5 text-xs text-slate-500 md:text-right"><div><div className="font-semibold text-slate-700">{item.format}</div><div>Format</div></div><div><div className="font-semibold text-slate-700">{item.size}</div><div>Größe</div></div><div><div className="font-semibold text-slate-700">{item.updated}</div><div>Aktualisiert</div></div></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
              </div>)}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#111318] p-6 text-white"><div className="flex items-center gap-3"><Icon>⌘</Icon><div><div className="font-bold">Website-Verbindungen</div><div className="text-sm text-slate-400">Zentrale Verwaltung deiner angeschlossenen Websites</div></div></div><div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"><div><div className="font-semibold">ZB Interieur</div><div className="mt-1 text-xs text-slate-400">REST Connector · API verbunden</div></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Online</span></div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="font-bold">Nächster Schritt</div><p className="mt-2 text-sm leading-6 text-slate-500">Supabase Auth, echte Kundenkonten und Tenant-Isolation ergänzen. Danach kann derselbe Image Manager für weitere Kunden verwendet werden.</p><button className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">Projektstatus ansehen</button></div>
          </section>
        </div>
      </main>
    </div>
  )
}
