import { Link } from 'react-router-dom'

export function ServicePage() {
  return (
    <>
      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Service</p>
          <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">
            Tipps, Pflege & Informationen
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Praktisches Wissen rund um Einrichtung und Möbelpflege – direkt zum Download.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <a
          href="/docs/40-profitipps.pdf"
          target="_blank"
          rel="noreferrer"
          className="group border border-line p-8 transition hover:border-brand"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">PDF</p>
          <h2 className="mt-2 font-serif text-2xl font-bold group-hover:text-brand">
            40 Profitipps zur Einrichtung
          </h2>
          <p className="mt-3 text-muted">
            Kompakte Impulse für Planung, Auswahl und Wohnatmosphäre.
          </p>
        </a>
        <a
          href="/docs/pflege-tipps.pdf"
          target="_blank"
          rel="noreferrer"
          className="group border border-line p-8 transition hover:border-brand"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">PDF</p>
          <h2 className="mt-2 font-serif text-2xl font-bold group-hover:text-brand">
            Professionelle Pflegetipps für Möbel
          </h2>
          <p className="mt-3 text-muted">Damit hochwertige Materialien lange schön bleiben.</p>
        </a>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold">Persönliche Beratung statt Katalog</h2>
            <p className="mt-2 max-w-xl text-muted">
              Die besten Lösungen entstehen im Gespräch – im Showroom oder online.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase"
            >
              Termin buchen
            </Link>
            <Link
              to="/kontakt"
              className="border border-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
