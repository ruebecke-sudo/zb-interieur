import { site, testimonials } from '../data/site'

export function TestimonialsSection() {
  return (
    <section className="bg-fog">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            Kundenstimmen
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            Was unsere Kunden sagen
          </h2>
          <p className="mt-3 text-muted">
            Echte Erfahrungen aus Beratung und Planung – und weitere Bewertungen bei Google.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              <div className="mb-3 text-accent" aria-label="5 von 5 Sternen">
                ★★★★★
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-muted">
                „{t.quote}“
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="text-muted"> · {t.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={site.social.googleReview}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-semibold text-accent hover:underline"
          >
            Alle Bewertungen bei Google →
          </a>
        </div>
      </div>
    </section>
  )
}
