import { Link } from 'react-router-dom'

export function OutdoorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="/images/terrasse-1.jpg"
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
            src="/images/terrasse-1.jpg"
            alt="Terrassenplanung mit Outdoor-Möbeln"
            className="aspect-[4/3] w-full object-cover"
          />
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
              poster="/images/terrasse-1.jpg"
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
              poster="/images/terrasse-1.jpg"
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
