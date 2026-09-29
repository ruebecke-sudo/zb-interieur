import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'

export function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            Blog · Einrichtungshaus Homburg
          </p>
          <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
            Impulse für
            <span className="mt-1 block text-accent">Wohnen & Planung</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Tipps zu Designmöbeln, Einrichtungsplanung und Küchenplanung – aus dem Showroom ZB
            Interieur für Homburg, Saarbrücken und das Saarland.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="border-b border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
            <Link to={`/blog/${featured.slug}`} className="group block overflow-hidden">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              />
            </Link>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                {featured.category} · {featured.dateLabel}
              </p>
              <h2 className="mt-3 font-sans text-3xl font-extrabold tracking-tight md:text-4xl">
                <Link to={`/blog/${featured.slug}`} className="hover:text-brand">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 text-muted leading-relaxed">{featured.excerpt}</p>
              <p className="mt-3 text-sm text-muted">{featured.readingMinutes} Min. Lesezeit</p>
              <Link
                to={`/blog/${featured.slug}`}
                className="mt-6 inline-flex bg-brand px-5 py-3 text-[11px] font-bold tracking-[0.1em] text-white uppercase hover:bg-brand-dark"
              >
                Beitrag lesen
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
            Alle Beiträge
          </h2>
          <ul className="mt-8 m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <article className="flex h-full flex-col bg-white">
                  <Link to={`/blog/${post.slug}`} className="group block overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
                      {post.category}
                    </p>
                    <h3 className="mt-2 font-sans text-xl font-bold leading-snug">
                      <Link to={`/blog/${post.slug}`} className="hover:text-brand">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-muted">
                      {post.dateLabel} · {post.readingMinutes} Min.
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold">Persönlich beraten lassen</h2>
            <p className="mt-1 text-muted">
              Vom Blog in den Showroom – Termin für Einrichtungsplanung in Homburg.
            </p>
          </div>
          <Link
            to="/termin"
            className="inline-flex bg-accent px-6 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
          >
            Termin buchen
          </Link>
        </div>
      </section>
    </>
  )
}
