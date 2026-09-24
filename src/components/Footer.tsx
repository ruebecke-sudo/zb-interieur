import { Link } from 'react-router-dom'
import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <img
            src="/images/logo.jpg"
            alt="ZB Interieur"
            className="mb-4 h-12 w-auto"
          />
          <p className="font-serif text-lg leading-snug">
            Exklusives Interieur · Designmöbel · Raumgestaltung in Homburg
          </p>
        </div>

        <div id="oeffnungszeiten">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Öffnungszeiten
          </h2>
          <ul className="space-y-1 text-sm">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-6 border-b border-white/15 py-1.5">
                <span>{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Kontakt
          </h2>
          <address className="not-italic text-sm leading-relaxed text-white/90">
            {site.name}
            <br />
            {site.street}
            <br />
            {site.zipCity}
            <br />
            <a className="mt-2 inline-block hover:text-accent" href={site.phoneHref}>
              Tel. {site.phone}
            </a>
            <br />
            <a className="hover:text-accent" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Facebook
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href={site.social.googleReview}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Google bewerten
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} | {site.name} | {site.zipCity} | {site.street} | Tel.{' '}
            {site.phone}
          </p>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
            <Link to="/agb" className="hover:text-white">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
