import { Link } from 'react-router-dom'

const terraceVideos = [
  {
    src: '/videos/terrasse-abends.mp4',
    title: 'Terrasse abends',
    className: 'aspect-[3/4] w-full object-cover',
  },
  {
    src: '/videos/terrasse-meer.mp4',
    title: 'Terrasse Meer',
    className: 'mt-8 aspect-[3/4] w-full object-cover',
  },
] as const

export function OutdoorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/giellesse.jpg"
        >
          <source src="/videos/terrasse-abends.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">Outdoor</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
            Terrassenplanung & Premium-Outdoor
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Varaschin, Sifas und weitere Marken – für Außenräume mit dem gleichen Anspruch wie innen.
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
            <li>• Outdoor-Möbel von Varaschin & Sifas</li>
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
        <div className="grid grid-cols-2 gap-3">
          {terraceVideos.map((v) => (
            <video
              key={v.src}
              className={v.className}
              controls
              playsInline
              muted
              loop
              preload="metadata"
              title={v.title}
            >
              <source src={v.src} type="video/mp4" />
            </video>
          ))}
        </div>
      </section>
    </>
  )
}
