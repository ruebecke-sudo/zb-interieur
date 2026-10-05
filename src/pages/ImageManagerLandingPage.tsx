import { Link } from 'react-router-dom'

const features=['Zentrale Bildbibliothek','Automatische Bild-Metadaten','Kategorien & Filter','Mehrere Websites verwalten','Benutzer & Rollen','White-Label Branding','API & Website-Connectoren','Sichere Tenant-Isolation']

export function ImageManagerLandingPage(){
  return <div className="min-h-screen bg-[#080a0d] text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><div><div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">IMAGE MANAGER</div><div className="text-xl font-bold">PRO</div></div><Link to="/image-manager/login" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Anmelden</Link></div></header>
    <main>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 text-center md:pt-28">
        <div className="mx-auto inline-flex rounded-full border border-[#0E675A]/60 bg-[#0E675A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">Professionelles Medienmanagement für Unternehmen</div>
        <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black tracking-tight md:text-7xl">Bilder verwalten.<br/><span className="text-[#48b8a6]">Websites einfacher pflegen.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">Image Manager Pro verbindet deine Bildbibliothek mit deinen Websites – zentral, strukturiert und bereit für wachsende Teams.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/image-manager/login" className="rounded-xl bg-[#0E675A] px-6 py-3.5 font-bold hover:opacity-90">Kostenlos starten</Link><a href="#preise" className="rounded-xl border border-white/15 px-6 py-3.5 font-bold hover:bg-white/5">Preise ansehen</a></div>
      </section>
      <section className="border-y border-white/10 bg-white/[0.02]"><div className="mx-auto grid max-w-7xl gap-4 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">{features.map((f)=><div key={f} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="mb-3 text-[#48b8a6]">✓</div><div className="font-semibold">{f}</div></div>)}</div></section>
      <section id="preise" className="mx-auto max-w-7xl px-6 py-20"><div className="text-center"><div className="text-sm font-semibold uppercase tracking-wider text-[#48b8a6]">Preise</div><h2 className="mt-3 text-4xl font-black">Einfach. Transparent. Skalierbar.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Starter','19 € / Monat','500 Bilder · 2 Benutzer · 1 Website'],
            ['Professional','39 € / Monat','5.000 Bilder · 10 Benutzer · 5 Websites'],
            ['Business','79 € / Monat','25.000 Bilder · 50 Benutzer · 20 Websites'],
            ['Lifetime','499 € einmalig','100.000 Bilder · 200 Benutzer · 100 Websites']
          ].map(([name,price,desc])=><div key={name} className={`relative rounded-3xl border p-7 ${name==='Lifetime'?'border-[#48b8a6] bg-[#0E675A]/15 shadow-2xl shadow-[#0E675A]/10':'border-white/10 bg-white/[0.03]'}`}>{name==='Lifetime'&&<div className="absolute -top-3 left-6 rounded-full bg-[#48b8a6] px-3 py-1 text-xs font-black uppercase text-[#07110f]">Einmal zahlen</div>}<h3 className="text-xl font-bold">{name}</h3><div className="mt-4 text-3xl font-black">{price}</div><p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">{desc}</p><Link to="/image-manager/login" className={`mt-7 block rounded-xl px-4 py-3 text-center text-sm font-bold ${name==='Lifetime'?'bg-[#48b8a6] text-[#07110f]':'bg-white text-slate-900'}`}>{name==='Lifetime'?'Lifetime sichern':'Jetzt starten'}</Link></div>)}
        </div>
      </section>
      <section className="bg-[#0E675A] px-6 py-20 text-center"><h2 className="text-4xl font-black">Deine Bilder. Deine Marke. Deine Kontrolle.</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Starte mit deinem Workspace und erweitere ihn, wenn dein Unternehmen wächst.</p><Link to="/image-manager/login" className="mt-7 inline-block rounded-xl bg-white px-6 py-3.5 font-bold text-slate-900">Image Manager Pro starten</Link></section>
    </main>
    <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-slate-500">Image Manager Pro · © 2026</footer>
  </div>
}