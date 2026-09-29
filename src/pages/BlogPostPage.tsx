import { Link, Navigate, useParams } from 'react-router-dom'
import { getBlogPost, getRelatedPosts } from '../data/blog'

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getBlogPost(slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const related = getRelatedPosts(post.slug)

  return (
    <>
      <article>
        <header className="bg-fog">
          <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
              {' · '}
              {post.category}
            </p>
            <h1 className="mt-3 font-sans text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold tracking-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted">
              {post.dateLabel} · {post.readingMinutes} Min. Lesezeit
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-3xl space-y-5 px-4 py-10 text-[15px] leading-relaxed text-muted md:py-12">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <div className="flex flex-wrap gap-3 border-t border-line pt-8">
            <Link
              to="/termin"
              className="inline-flex bg-brand px-5 py-3 text-[11px] font-bold tracking-[0.1em] text-white uppercase hover:bg-brand-dark"
            >
              Termin buchen
            </Link>
            <Link
              to="/blog"
              className="inline-flex border border-brand px-5 py-3 text-[11px] font-semibold tracking-[0.1em] text-brand uppercase hover:bg-fog"
            >
              Alle Beiträge
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line bg-fog" aria-labelledby="related-heading">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 id="related-heading" className="font-sans text-2xl font-extrabold tracking-tight">
              Weitere Beiträge
            </h2>
            <ul className="mt-8 m-0 grid list-none gap-6 p-0 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/blog/${item.slug}`} className="group block">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    />
                    <p className="mt-3 text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
                      {item.category}
                    </p>
                    <h3 className="mt-1 font-sans text-lg font-bold leading-snug group-hover:text-brand">
                      {item.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
