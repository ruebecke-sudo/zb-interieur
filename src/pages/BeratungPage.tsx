import { Link } from 'react-router-dom'
import { FaqSection } from '../components/FaqSection'
import { WhatsAppIcon } from '../components/WhatsAppButton'
import { whatsappHref } from '../data/site'

const benefits = [
  'Individuelle Beratung – maßgeschneiderte Lösungen für Ihre Bedürfnisse',
  'Maßgeschneiderte Wohnkonzepte nach Ihrem Budget',
  'Kreative Wohnideen zur Inspiration',
  'Bei Bedarf: 3D-Modell zur besseren Visualisierung größerer Projekte',
]

export function BeratungPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="/images/kueche-render-1.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Einrichtungsberatung Homburg
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
            Küchenplanung, Büroplanung, Terrassenplanung, Badplanung
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Fachkundige Beratung sowie Planung nach Ihren Wünschen – für eine Einrichtung, in der man
            sich wohlfühlt und entspannt.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl font-bold">Das bekommen Sie von uns</h2>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 text-muted">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 leading-relaxed text-muted">
            Möchten Sie eine individuelle, moderne Inneneinrichtung, in der man sich wohl fühlt?
            Und legen Sie Wert auf modernes, zeitloses Design? Dann sind wir Ihr Ansprechpartner.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-brand-dark"
            >
              Termin buchen
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <Link
              to="/kontakt"
              className="border border-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand"
            >
              Kontaktformular
            </Link>
          </div>
        </div>
        <img src="/images/kueche-render-2.jpg" alt="3D-Einrichtungsplanung" className="w-full object-cover" />
      </section>

      <FaqSection />
    </>
  )
}
