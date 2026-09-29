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
          data-no-zoom
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Einrichtungsberatung Homburg · Saarland
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
            Einrichtungsplanung & Küchenplanung in Homburg
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Fachkundige Einrichtungsberatung für Küche, Bad, Büro und Terrasse – im
            Einrichtungshaus Homburg, für Kundinnen und Kunden aus Saarbrücken und dem gesamten
            Saarland.
          </p>
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
              to="/termin"
              className="mt-6 inline-flex bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-brand-dark"
            >
              Beratungstermin
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
              Ein exklusives Wohnkonzept zu entwickeln bedeutet nicht eine Kulisse zu erschaffen. Die
              perfekte Raumgestaltung wird zum Teil des Lebens und spiegelt die Persönlichkeit des
              Bewohners wieder.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Wir verwirklichen Wohnwelten, in denen sich alle Bewohner mit ihren unterschiedlichen
              Bedürfnissen, Ansprüchen und Vorlieben wohlfühlen. Möbeldesigner und Innenarchitekt
              Joerg Zenz setzt auch Ihre Ideen mit viel Leidenschaft und Kompetenz um.
            </p>
            <Link
              to="/kontakt"
              className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase"
            >
              Jetzt anfragen
            </Link>
          </div>
          <div className="relative mx-auto max-w-sm overflow-hidden bg-ink md:mx-0 md:justify-self-end">
            <video
              className="aspect-[9/16] w-full object-cover"
              controls
              playsInline
              poster="/images/kueche-render-1.jpg"
              preload="metadata"
            >
              <source src="/videos/einrichter.mp4" type="video/mp4" />
            </video>
          </div>
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
