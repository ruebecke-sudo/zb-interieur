import { Link } from 'react-router-dom'

const areas = [
  {
    title: 'Küchenplanung',
    text: 'Funktionale Abläufe, hochwertige Materialien und eine klare Formensprache – von der ersten Skizze bis zur Umsetzung.',
    image: '/images/kueche-render-1.jpg',
  },
  {
    title: 'Bäder',
    text: 'Ruhe, Komfort und Präzision: Badkonzepte, die Alltag und Wellness verbinden.',
    image: '/images/showroom-3.jpg',
  },
  {
    title: 'Büros',
    text: 'Arbeitswelten mit Atmosphäre – produktiv, repräsentativ und individuell.',
    image: '/images/tisch.jpg',
  },
  {
    id: 'raumgestaltung',
    title: 'Raumgestaltung',
    text: 'Farben, Stoffe, Licht und Möbel greifen ineinander – für Räume mit Charakter.',
    image: '/images/blumen.jpg',
  },
]

export function PlanungPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="/images/kueche-render-2.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">Planung</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-5xl">
            Wir planen und richten ein
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Küchen, Bäder, Büros, Terrassen und die komplette Einrichtung – abgestimmt auf Ihren Stil
            und Ihr Leben.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-14 px-4 py-16">
        {areas.map((a) => (
          <article
            key={a.title}
            id={a.id}
            className="grid scroll-mt-28 gap-8 md:grid-cols-2 md:items-center"
          >
            <img src={a.image} alt={a.title} className="aspect-[4/3] w-full object-cover" />
            <div>
              <h2 className="text-3xl font-bold">{a.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{a.text}</p>
            </div>
          </article>
        ))}

        <div>
          <h2 className="text-2xl font-bold">Küchenplanung in 3D</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Visualisierungen aus aktuellen Projekten – so sehen geplante Küchen vor der Umsetzung aus.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <img
              src="/images/kueche-render-1.jpg"
              alt="Küchenplanung mit Insel"
              className="aspect-[4/3] w-full object-cover"
            />
            <img
              src="/images/kueche-render-2.jpg"
              alt="Kücheninsel mit Barhockern"
              className="aspect-[4/3] w-full object-cover"
            />
            <img
              src="/images/kueche-render-3.jpg"
              alt="Offene Küche mit Kochinsel"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line pt-10">
          <Link
            to="/beratung"
            className="bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white"
          >
            Zur Beratung
          </Link>
          <Link
            to="/outdoor"
            className="border border-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand"
          >
            Outdoor & Terrasse
          </Link>
          <Link
            to="/termin"
            className="border border-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-accent"
          >
            Termin buchen
          </Link>
        </div>
      </section>
    </>
  )
}
