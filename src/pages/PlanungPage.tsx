import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { planungProcess, planungTopics } from '../data/planung'
import { site } from '../data/site'

export function PlanungPage() {
  const location = useLocation()
  const [activeId, setActiveId] = useState(
    () => location.hash.replace('#', '') || planungTopics[0]?.id || '',
  )

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.hash])

  useEffect(() => {
    const sections = planungTopics
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveId(visible.target.id)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.15, 0.35, 0.55] },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <img
          src="/images/planung/kueche-3.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, rgba(66,0,27,0.96) 0%, rgba(88,0,36,0.88) 48%, rgba(26,0,12,0.55) 100%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="animate-fade-up text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            ZB Interieur · Planung
          </p>
          <h1 className="animate-fade-up mt-4 max-w-3xl font-sans text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.98] font-extrabold tracking-[-0.03em] [animation-delay:60ms]">
            Inneneinrichtungen
            <span className="mt-1 block text-accent">nach Maß</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-base [animation-delay:120ms]">
            Möchten Sie eine individuelle, moderne Inneneinrichtung, in der man sich wohlfühlt und
            entspannt – mit zeitlosem Design? Fachkundige Beratung sowie Planung nach Ihren Wünschen
            garantieren eine Einrichtung nach Ihren Vorstellungen.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3 [animation-delay:180ms]">
            <Link
              to="/termin"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Planungstermin
            </Link>
            <a
              href="#themen"
              className="inline-flex border border-white/35 px-7 py-3.5 text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:border-white hover:bg-white/5"
            >
              Themen wählen
            </a>
          </div>
        </div>
      </section>

      {/* Themen-Navigation */}
      <nav
        id="themen"
        className="sticky top-[7.5rem] z-30 border-b border-line bg-white/95 backdrop-blur-md md:top-[8.25rem]"
        aria-label="Planungsthemen"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
          {planungTopics.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              onClick={() => setActiveId(t.id)}
              className={`shrink-0 px-4 py-2 text-[12px] font-semibold tracking-[0.08em] uppercase transition ${
                activeId === t.id
                  ? 'bg-brand text-white'
                  : 'bg-fog text-ink/75 hover:bg-brand/10 hover:text-brand'
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Themen-Abschnitte */}
      <div className="bg-white">
        {planungTopics.map((topic, index) => (
          <section
            key={topic.id}
            id={topic.id}
            className={`scroll-mt-44 border-b border-line md:scroll-mt-48 ${
              index % 2 === 1 ? 'bg-fog' : 'bg-white'
            }`}
          >
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-14 md:py-20">
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                  {topic.eyebrow}
                </p>
                <h2 className="mt-3 font-sans text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
                  {topic.headline}
                </h2>

                <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                  Das bekommen Sie von uns
                </p>
                <ul className="mt-4 space-y-3">
                  {topic.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[15px] leading-snug text-ink">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-line pt-8">
                  <h3 className="font-sans text-xl font-bold text-ink md:text-2xl">
                    {topic.bodyTitle}
                  </h3>
                  {topic.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/termin"
                    className="inline-flex bg-brand px-5 py-3 text-sm font-semibold tracking-[0.1em] text-white uppercase hover:bg-brand-dark"
                  >
                    Termin anfragen
                  </Link>
                  {topic.ctaHref ? (
                    <Link
                      to={topic.ctaHref}
                      className="inline-flex border border-brand px-5 py-3 text-sm font-semibold tracking-[0.1em] text-brand uppercase hover:bg-white"
                    >
                      {topic.ctaLabel}
                    </Link>
                  ) : (
                    <a
                      href={site.phoneHref}
                      className="inline-flex border border-line px-5 py-3 text-sm font-semibold tracking-[0.08em] text-ink uppercase hover:border-brand"
                    >
                      Anrufen
                    </a>
                  )}
                </div>
              </div>

              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="col-span-2 overflow-hidden">
                    <img
                      src={topic.images[0].src}
                      alt={topic.images[0].alt}
                      className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-[1.02]"
                    />
                  </div>
                  {topic.images.slice(1, 3).map((img) => (
                    <div key={img.src} className="overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="aspect-square w-full object-cover transition duration-700 hover:scale-[1.03]"
                      />
                    </div>
                  ))}
                </div>
                {topic.images[3] ? (
                  <div className="mt-2 overflow-hidden md:mt-3">
                    <img
                      src={topic.images[3].src}
                      alt={topic.images[3].alt}
                      className="aspect-[21/9] w-full object-cover transition duration-700 hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Ablauf */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white/50 uppercase">
            Unser Prozess
          </p>
          <h2 className="mt-3 max-w-xl font-sans text-3xl font-extrabold md:text-4xl">
            Von der Idee bis zur fertigen Umsetzung
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {planungProcess.map((item) => (
              <div key={item.step} className="border-t border-white/20 pt-5">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  {item.step}
                </p>
                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fog">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-sans text-2xl font-extrabold text-ink md:text-3xl">
              Bereit für Ihre Planung?
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Vereinbaren Sie einen unverbindlichen Termin im Showroom Homburg – wir klären gemeinsam
              das passende Thema und den nächsten Schritt.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Termin buchen
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex border border-brand px-6 py-3 text-sm font-semibold tracking-[0.1em] text-brand uppercase hover:bg-white"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
