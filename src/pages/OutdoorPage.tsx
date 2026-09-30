import { Link } from 'react-router-dom'

const varaschinSelection = [
  {
    src: '/images/varaschin/01.jpg',
    alt: 'Varaschin Outdoor-Lounge mit Seilgeflecht und petrolfarbenen Polstern',
    title: 'Lounge Seilgeflecht',
  },
  {
    src: '/images/varaschin/02.jpg',
    alt: 'Varaschin modulare Outdoor-Lounges aus Holz am Glasbau',
    title: 'Modulare Holz-Lounge',
  },
  {
    src: '/images/varaschin/03.jpg',
    alt: 'Varaschin modulare Sitzmodule in Orange und Lavendel',
    title: 'Modulare Sitzskulpturen',
  },
  {
    src: '/images/varaschin/04.jpg',
    alt: 'Varaschin geflochtene Outdoor-Sessel mit Fußhocker',
    title: 'Geflochtene Sessel',
  },
  {
    src: '/images/varaschin/05.jpg',
    alt: 'Varaschin Outdoor-Sofa in Blau mit geflochtener Rückenlehne',
    title: 'Sofa mit Flechtwerk',
  },
  {
    src: '/images/varaschin/06.jpg',
    alt: 'Varaschin Daybed mit Meerblick und Seildetail',
    title: 'Daybed Coast',
  },
  {
    src: '/images/varaschin/07.jpg',
    alt: 'Varaschin Daybeds im Garten mit Palmendekor',
    title: 'Daybeds im Garten',
  },
  {
    src: '/images/varaschin/08.jpg',
    alt: 'Varaschin Outdoor-Sofas und Lounges auf Holzterrasse',
    title: 'Terrassen-Ensemble',
  },
] as const

export function OutdoorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="/images/varaschin/08.jpg"
          alt=""
          data-no-zoom
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Outdoormöbel Homburg · Saarland
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
            Terrassenplanung & Premium-Outdoormöbel
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Varaschin, Unopiu und weitere Outdoor-Designmöbel – Terrassenplanung im
            Einrichtungshaus Homburg für Kundinnen und Kunden aus Saarbrücken und dem Saarland.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Leben unter freiem Himmel</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Wir planen Terrassen und Outdoor-Bereiche so, dass Sitzplätze, Wege und Materialien
            zusammenwirken – wetterfest, elegant und einladend.
          </p>
          <ul className="mt-6 space-y-2 text-muted">
            <li>• Outdoor-Möbel von Varaschin & Unopiu</li>
            <li>• Ganzheitliche Terrassenkonzepte</li>
            <li>• Abstimmung mit Innenraum und Architektur</li>
          </ul>
          <Link
            to="/termin"
            className="mt-8 inline-flex bg-brand px-5 py-3 text-sm font-semibold tracking-[0.1em] text-white uppercase"
          >
            Beratung Outdoor
          </Link>
        </div>
        <div className="overflow-hidden">
          <img
            src="/images/varaschin/02.jpg"
            alt="Varaschin Outdoor-Lounge auf moderner Terrasse"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section id="produktauswahl-varaschin" className="scroll-mt-28 border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
            Produktauswahl
          </p>
          <h2 className="mt-2 font-sans text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold tracking-tight">
            Varaschin
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Italienische Outdoor-Designmöbel für Terrasse und Garten – Lounges, Daybeds und
            Ensembles aus dem Sortiment von ZB Interieur in Homburg.
          </p>

          <ul className="mt-10 m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {varaschinSelection.map((item) => (
              <li key={item.src}>
                <figure className="group flex h-full flex-col">
                  <div className="overflow-hidden bg-fog">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
                      Varaschin
                    </p>
                    <p className="mt-1 font-sans text-lg font-bold leading-snug">{item.title}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
            >
              Beratungstermin
            </Link>
            <Link
              to="/marken"
              className="inline-flex border border-brand px-6 py-3 text-sm font-semibold tracking-[0.1em] text-brand uppercase hover:bg-fog"
            >
              Zur Markenwelt
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold">Terrasse in Bewegung</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Eindrücke aus der Terrassenplanung – Abendstimmung und Meerblick.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <video
              className="aspect-video w-full bg-ink object-cover"
              controls
              playsInline
              muted
              loop
              preload="metadata"
              poster="/images/varaschin/06.jpg"
              title="Terrasse abends"
            >
              <source src="/videos/terrasse-abends.mp4" type="video/mp4" />
            </video>
            <video
              className="aspect-video w-full bg-ink object-cover"
              controls
              playsInline
              muted
              loop
              preload="metadata"
              poster="/images/varaschin/07.jpg"
              title="Terrasse Meer"
            >
              <source src="/videos/terrasse-meer.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </>
  )
}
