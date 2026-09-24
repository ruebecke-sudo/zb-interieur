import { Link } from 'react-router-dom'
import { reasons, showroomImages } from '../data/site'

export function HomeHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16 lg:gap-14">
        <div className="animate-fade-up">
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            ZB Interieur · Homburg
          </p>
          <h1 className="font-serif text-3xl leading-[1.15] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Wir planen Küchen | Bäder | Büros | Terrassen und Ihre komplette Einrichtung
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted md:text-base">
            Eine durchdachte Einrichtungsplanung ist der Schlüssel zu Räumen, die nicht nur schön
            aussehen, sondern auch funktional sind und Ihr Wohlbefinden steigern. Bei ZB Interieur in
            Homburg verstehen wir, dass jeder Raum einzigartig ist – genau wie Sie.
          </p>
          <h2 className="mt-8 font-serif text-xl font-bold md:text-2xl">
            Warum professionelle Einrichtungsplanung
          </h2>
          <ul className="mt-4 space-y-2">
            {reasons.map((r) => (
              <li key={r.title} className="flex gap-2 text-[15px] text-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong>{r.title}</strong>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] text-muted">
            Hier erhalten Sie alles Wissenswerte zu den Themen{' '}
            <Link to="/planung" className="font-semibold text-accent hover:underline">
              Einrichtung & Planung
            </Link>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
            >
              Beratungstermin
            </Link>
            <Link
              to="/beratung"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white"
              aria-label="Zur Beratung"
            >
              →
            </Link>
          </div>
        </div>

        <div className="animate-fade-up relative" style={{ animationDelay: '120ms' }}>
          <div className="overflow-hidden rounded-md shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <img
              src="/images/kueche-render-1.jpg"
              alt="3D-Küchenplanung von ZB Interieur"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <img
            src="/images/kueche-render-2.jpg"
            alt="Moderne Kücheninsel"
            className="absolute -bottom-6 -left-4 hidden w-[42%] rounded-md border-4 border-white shadow-xl md:block"
          />
          <img
            src="/images/kueche-render-3.jpg"
            alt="Offene Küchenplanung"
            className="absolute -right-3 -bottom-8 hidden w-[38%] rounded-md border-4 border-white shadow-xl lg:block"
          />
        </div>
      </div>

      {/* Showroom-Streifen wie Galerie-Slider auf der Originalseite */}
      <div className="border-t border-line bg-fog">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-5 [scrollbar-width:none]">
          {showroomImages.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-28 w-44 shrink-0 rounded-sm object-cover md:h-36 md:w-56"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
