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
          <p className="mt-3 text-muted">
            Damit hochwertige Materialien lange schön bleiben.
          </p>
        </a>
      </section>
    </>
  )
}
