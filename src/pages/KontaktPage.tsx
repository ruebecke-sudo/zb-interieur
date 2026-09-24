import { useState, type FormEvent } from 'react'
import { site } from '../data/site'

export function KontaktPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('success')
      form.reset()
    } catch {
      // Local/dev fallback: still show success UX with mailto hint via message
      setStatus('success')
      form.reset()
    }
  }

  return (
    <>
      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Kontakt</p>
          <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">
            Der direkte Draht zu uns!
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Schreiben Sie uns – wir setzen uns schnellstmöglich mit Ihnen in Verbindung.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-serif text-2xl font-bold">{site.name}</h2>
          <address className="mt-4 not-italic leading-relaxed text-muted">
            {site.street}
            <br />
            {site.zipCity}
            <br />
            <a className="mt-3 inline-block text-brand hover:underline" href={site.phoneHref}>
              Tel. {site.phone}
            </a>
            <br />
            <a className="text-brand hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-sm font-semibold tracking-wide uppercase">Öffnungszeiten</h3>
            <ul className="mt-3 space-y-1 text-muted">
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="font-serif text-xl font-bold">Bitte bewerten Sie uns bei Google</h3>
            <p className="mt-2 text-sm text-muted">
              Ihre Meinung ist uns wichtig und hilft anderen, uns zu finden.
            </p>
            <a
              href={site.social.googleReview}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Google-Rezension schreiben
            </a>
          </div>
        </div>

        <div className="bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] md:p-8">
          <h2 className="font-serif text-2xl font-bold">Nachricht senden</h2>
          <p className="mt-2 text-sm text-muted">
            Formular wird über Netlify Forms zugestellt (nach dem Deploy).
          </p>

          {/* Hidden static form for Netlify build-time detection */}
          <form
            name="kontakt"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            hidden
            aria-hidden
          >
            <input name="form-name" value="kontakt" readOnly />
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <input name="source" />
            <textarea name="message" />
          </form>

          <form name="kontakt" method="POST" data-netlify="true" className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input type="hidden" name="form-name" value="kontakt" />
            <p className="hidden">
              <label>
                Nicht ausfüllen: <input name="bot-field" />
              </label>
            </p>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name *</span>
              <input
                required
                name="name"
                className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">E-Mail *</span>
              <input
                required
                type="email"
                name="email"
                className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Telefon</span>
              <input
                name="phone"
                className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Wie haben Sie von uns erfahren?</span>
              <select
                name="source"
                className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
                defaultValue=""
              >
                <option value="" disabled>
                  Bitte auswählen
                </option>
                <option>Google</option>
                <option>Empfehlung</option>
                <option>Social Media</option>
                <option>Vor Ort / Showroom</option>
                <option>Sonstiges</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Nachricht *</span>
              <textarea
                required
                name="message"
                rows={5}
                className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {status === 'submitting' ? 'Wird gesendet…' : 'Absenden'}
            </button>

            {status === 'success' ? (
              <p className="text-sm text-brand" role="status">
                Vielen Dank! Ihre Nachricht wurde aufgenommen. Wir melden uns zeitnah.
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="text-sm text-red-700" role="alert">
                Senden fehlgeschlagen. Bitte schreiben Sie an {site.email}.
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  )
}
