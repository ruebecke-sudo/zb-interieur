import { Link } from 'react-router-dom'
import { DesignmoebelHeader } from '../components/DesignmoebelHeader'
import { FaqSection } from '../components/FaqSection'
import { MarkenweltenSection } from '../components/MarkenweltenSection'
import { StilpunkteRichSnippet } from '../components/StilpunkteRichSnippet'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { WhatsAppIcon } from '../components/WhatsAppButton'
import { showroomImages, whatsappHref } from '../data/site'

export function HomePage() {
  return (
    <>
      <DesignmoebelHeader />

      <MarkenweltenSection />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Unverbindlich & persönlich · Homburg & Saarland
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Beratungstermin im Einrichtungshaus Homburg
            </h2>
            <p className="mt-4 text-muted">
              Vereinbaren Sie einen Termin im Möbelhaus und Showroom in Homburg – für
              Designmöbel, Einrichtungsplanung und Küchenplanung. Auch für Saarbrücken und das
              Saarland gerne persönlich oder per WhatsApp.
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
          <div className="flex flex-wrap items-center justify-center gap-6">
            <img
              src="/images/stilpunkte-siegel.png"
              alt="STILPUNKTE Lifestyle Guide Siegel"
              className="h-28 w-28 bg-black object-contain p-2 md:h-32 md:w-32"
            />
            <img
              src="/images/award.jpg"
              alt="STILPUNKTE Award 2025/2026"
              className="mx-auto max-h-56 w-auto bg-white object-contain p-4"
            />
          </div>
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
              className="text-sm font-semibold tracking-wide text-brand uppercase hover:underline"
            >
              Besuchstermin →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {showroomImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Showroom ZB Interieur Homburg, Motiv ${i + 1}`}
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.72),rgba(255,255,255,0.72)), url('/images/kueche-render-2.jpg')",
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
            <img
              src="/images/kueche-render-1.jpg"
              alt="3D-Visualisierung einer modernen Küche"
              className="aspect-[3/4] object-cover"
            />
            <img
              src="/images/kueche-render-3.jpg"
              alt="3D-Visualisierung eines Wohn- und Essbereichs"
              className="mt-8 aspect-[3/4] object-cover"
            />
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
