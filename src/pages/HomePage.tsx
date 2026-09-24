import { Link } from 'react-router-dom'
import { HeroSlider } from '../components/HeroSlider'
import { galleries, reasons, site } from '../data/site'

export function HomePage() {
  return (
    <>
      <HeroSlider
        title="Wir planen Küchen | Bäder | Büros | Terrassen und Ihre komplette Einrichtung"
        subtitle="Eine durchdachte Einrichtungsplanung ist der Schlüssel zu Räumen, die nicht nur schön aussehen, sondern auch funktional sind und Ihr Wohlbefinden steigern."
        ctaHref="/kontakt"
        ctaLabel="Beratungstermin"
      />

      <section className="relative overflow-hidden bg-fog">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "url('/images/blumen.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div className="animate-fade-up">
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-brand uppercase">
              Einrichtung & Planung
            </p>
            <h2 className="font-serif text-3xl leading-tight font-bold md:text-4xl">
              Warum professionelle Einrichtungsplanung
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Bei ZB Interieur in Homburg verstehen wir, dass jeder Raum einzigartig ist – genau wie
              Sie. Hier erhalten Sie alles Wissenswerte zu den Themen Einrichtung & Planung.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title} className="border-l-2 border-brand pl-4">
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/planung-side.jpg"
              alt="Raumplanung bei ZB Interieur"
              className="aspect-[4/5] w-full object-cover"
            />
            <img
              src="/images/planung-3d.jpg"
              alt="3D-Planung"
              className="absolute -bottom-6 -left-4 hidden w-2/5 border-4 border-white shadow-xl md:block"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold md:text-4xl">
              Hier gibt’s die besten Antworten zu Ihren Fragen
            </h2>
            <p className="mt-4 text-muted">
              Vereinbaren Sie einen unverbindlichen Beratungstermin bei ZB Interieur oder hinterlassen
              Sie Ihre Telefonnummer. Wir rufen gerne zurück.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/kontakt"
                className="inline-flex bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-brand-dark"
              >
                Rückruf anfordern
              </Link>
              <a
                href={site.booking}
                target="_blank"
                rel="noreferrer"
                className="inline-flex border border-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand hover:bg-fog"
              >
                Online Termin
              </a>
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
              Eine der besten Adressen für Interieur & Design in Deutschland, Österreich und der
              Schweiz
            </h2>
            <p className="mt-4 leading-relaxed text-white/85">
              Die stetige Suche nach Qualität, gepaart mit außergewöhnlichem Design, wurde durch die
              Verleihung des STILPUNKTE Award 25/26 gewürdigt. ZB Interieur in Homburg gehört nun zu
              den besten Adressen im Bereich Interieur & Design im Saarland und im DACH-Raum.
            </p>
          </div>
          <img
            src="/images/award.jpg"
            alt="STILPUNKTE Award 2025/2026"
            className="mx-auto max-h-56 w-auto bg-white object-contain p-4"
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                Wir planen und richten ein
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                Exklusives Interieur
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Designer-Möbel, einzigartig und außergewöhnlich – ausgewählt und geplant von ZB
                Interieur.
              </p>
            </div>
            <Link to="/galerien" className="text-sm font-semibold tracking-wide text-brand uppercase">
              Alle Galerien →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.slice(0, 6).map((g, i) => (
              <Link
                key={g.id}
                to={`/galerien#${g.id}`}
                className="group relative aspect-[4/3] overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img
                  src={g.image}
                  alt={g.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-serif text-xl font-bold">{g.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{g.blurb}</p>
                </div>
              </Link>
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
              Damit ist der Anspruch an die Ausstattung der eigenen Wohnung oder des Hauses klar
              definiert: Es muss individuell sein. Anspruchsvolle Konzepte für individuelle
              Einrichtungen schaffen Wohnwelten, die einen hohen Wohlfühlfaktor mit repräsentativer
              Gestaltung verbinden.
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
              In dieser Suche nach Individualität und Stil spielt die Einrichtungsberatung eine
              entscheidende Rolle. Eine professionelle Einrichtungsberatung geht über das bloße
              Anordnen von Möbeln hinaus. Sie ist eine Kunst, die die persönlichen Vorlieben, den
              Lebensstil und die Funktionalität des Raumes berücksichtigt, um eine harmonische und
              ansprechende Atmosphäre zu schaffen.
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
              Ein exklusives Wohnkonzept zu entwickeln bedeutet nicht, eine Kulisse zu erschaffen.
              Die perfekte Raumgestaltung wird zum Teil des Lebens und spiegelt die Persönlichkeit
              des Bewohners wider.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Wir verwirklichen Wohnwelten, in denen sich alle Bewohner mit ihren unterschiedlichen
              Bedürfnissen, Ansprüchen und Vorlieben wohlfühlen. Möbeldesigner und Innenarchitekt
              Joerg Zenz setzt auch Ihre Ideen mit viel Leidenschaft und Kompetenz um.
            </p>
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
