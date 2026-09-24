import { Link } from 'react-router-dom'
import { FaqSection } from '../components/FaqSection'
import { HomeHero } from '../components/HomeHero'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { WhatsAppIcon } from '../components/WhatsAppButton'
import { services, showroomImages, whatsappHref } from '../data/site'

export function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Unverbindlich & persönlich
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Beratungstermin in Homburg
            </h2>
            <p className="mt-4 text-muted">
              Vereinbaren Sie einen Termin im Showroom oder schreiben Sie uns kurz per WhatsApp –
              wir melden uns gerne.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/termin"
                className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
              >
                Termin buchen
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <Link
                to="/kontakt"
                className="inline-flex border border-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand hover:bg-fog"
              >
                Rückruf
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Leistungen</p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Wir planen und richten ein
            </h2>
            <p className="mt-3 text-muted">
              Von der Einrichtungsberatung bis zur Terrasse – ein Ansprechpartner für Ihr gesamtes
              Wohnkonzept.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <Link key={s.href} to={s.href} className="group block bg-white">
                <div className="overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold group-hover:text-brand">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-accent">
                    Mehr erfahren →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
              Award 2025/2026
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              Ausgezeichnete Adresse für Interieur & Design
            </h2>
            <p className="mt-4 leading-relaxed text-white/85">
              Die stetige Suche nach Qualität, gepaart mit außergewöhnlichem Design, wurde durch die
              Verleihung des STILPUNKTE Award 25/26 gewürdigt. ZB Interieur in Homburg gehört zu den
              besten Adressen im Saarland und im DACH-Raum.
            </p>
          </div>
          <img
            src="/images/award.jpg"
            alt="STILPUNKTE Award 2025/2026"
            className="mx-auto max-h-56 w-auto bg-white object-contain p-4"
          />
        </div>
      </section>

      <TestimonialsSection />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Showroom</p>
              <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                Einblicke aus Homburg
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Designmöbel und Raumstimmungen – am besten live im Showroom erleben.
              </p>
            </div>
            <Link
              to="/termin"
              className="text-sm font-semibold tracking-wide text-accent uppercase"
            >
              Besuchstermin →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {showroomImages.map((src) => (
              <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.72),rgba(255,255,255,0.72)), url('/images/couch-titel.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Wieso wir?</p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              „Für die meisten Menschen ist das Zuhause weit mehr als ein Ort zum Wohnen. Es ist ein
              Ausdruck der Persönlichkeit.“
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Anspruchsvolle Konzepte für individuelle Einrichtungen schaffen Wohnwelten, die einen
              hohen Wohlfühlfaktor mit repräsentativer Gestaltung verbinden.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/images/sofa-aria.jpg" alt="" className="aspect-[3/4] object-cover" />
            <img
              src="/images/sofa-papadatos.jpg"
              alt=""
              className="mt-8 aspect-[3/4] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-fog">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <img
            src="/images/joerg-zenz.jpg"
            alt="Joerg Zenz, Einrichtungsberater"
            className="aspect-[3/4] w-full max-w-md object-cover justify-self-center"
          />
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Der Einrichtungsberater
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Lebensträume individuell gestalten
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Professionelle Einrichtungsberatung geht über das Anordnen von Möbeln hinaus: Sie
              berücksichtigt Vorlieben, Lebensstil und Funktionalität – für eine harmonische
              Atmosphäre.
            </p>
            <p className="mt-4 font-serif text-xl text-brand">Joerg Zenz</p>
            <Link
              to="/beratung"
              className="mt-6 inline-flex bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-brand-dark"
            >
              Mehr zur Beratung
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Konzept und Design
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Wir planen Ihr perfektes Zuhause
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Die perfekte Raumgestaltung wird zum Teil des Lebens und spiegelt die Persönlichkeit
              der Bewohner wider. Möbeldesigner und Innenarchitekt Joerg Zenz setzt Ihre Ideen mit
              Leidenschaft und Kompetenz um.
            </p>
            <Link
              to="/kontakt"
              className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase"
            >
              Jetzt anfragen
            </Link>
          </div>
          <div className="relative overflow-hidden bg-ink">
            <video
              className="aspect-video w-full object-cover"
              controls
              playsInline
              poster="/images/hero-1.jpg"
              preload="metadata"
            >
              <source src="/videos/einrichter.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="border-t border-line bg-fog">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold">Downloads & Tipps</h2>
            <p className="mt-1 text-muted">Praxisnahe PDFs für Pflege und Einrichtung.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/docs/40-profitipps.pdf"
              target="_blank"
              rel="noreferrer"
              className="border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-white"
            >
              40 Profitipps (PDF)
            </a>
            <a
              href="/docs/pflege-tipps.pdf"
              target="_blank"
              rel="noreferrer"
              className="border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-white"
            >
              Pflegetipps (PDF)
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
