import { galleries } from '../data/site'

export function GalerienPage() {
  return (
    <>
      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Galerien</p>
          <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">
            Möbel, Marken & Showroom
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Einblicke in unsere Galerien – von Sofas und Küchen bis Outdoor und Accessoires.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-4 py-16">
        {galleries.map((g) => (
          <article
            key={g.id}
            id={g.id}
            className="grid scroll-mt-28 gap-8 md:grid-cols-2 md:items-center"
          >
            <img src={g.image} alt={g.title} className="aspect-[4/3] w-full object-cover" />
            <div>
              <h2 className="font-serif text-3xl font-bold">{g.title}</h2>
              <p className="mt-3 text-muted leading-relaxed">{g.blurb}</p>
              <p className="mt-4 text-sm text-muted">
                Gerne zeigen wir Ihnen passende Stücke im Showroom und planen die Integration in Ihr
                Gesamtkonzept.
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
