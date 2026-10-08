import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { submitNetlifyForm } from '../lib/submitNetlifyForm'
import { site, whatsappHref } from '../data/site'
import { WhatsAppIcon } from './WhatsAppButton'

/** True for a plain left click on a link to the contact page (no new tab, no anchor). */
function isContactClick(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  const link = (event.target as Element | null)?.closest?.('a')
  if (!link || (link.target && link.target !== '_self')) return false
  const url = new URL(link.href, window.location.href)
  return url.origin === window.location.origin && url.pathname.replace(/\/$/, '') === '/kontakt' && !url.hash
}

/**
 * Contact form as a glass popup. Every link to /kontakt opens it instead of navigating;
 * the /kontakt page itself stays for search engines and direct visits.
 */
export function ContactModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Capture phase: runs before React Router's Link, which then skips navigation
    // because the click is already default-prevented. Menus still close normally.
    const onClick = (event: MouseEvent) => {
      if (!isContactClick(event)) return
      event.preventDefault()
      setOpen(true)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return open ? <ContactDialog onClose={() => setOpen(false)} /> : null
}

const field =
  'w-full rounded-xl border border-white/70 bg-white/55 px-3.5 py-2.5 text-[15px] text-ink shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none backdrop-blur-sm transition placeholder:text-ink/40 focus:border-brand/50 focus:bg-white/80 focus:ring-4 focus:ring-brand/10'
const labelText = 'mb-1.5 block text-[12px] font-semibold tracking-[0.08em] text-ink/70 uppercase'

function ContactDialog({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'dev'>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (!data.get('form-name')) data.set('form-name', 'kontakt')
    setStatus('submitting')
    const result = await submitNetlifyForm(data)
    if (result === 'error') {
      setStatus('error')
      return
    }
    setStatus(result === 'dev-ok' ? 'dev' : 'success')
    form.reset()
  }

  const sent = status === 'success' || status === 'dev'

  return createPortal(
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/35 p-0 backdrop-blur-md sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-marken-reveal relative flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-white/60 bg-white/45 shadow-[0_30px_90px_rgba(26,0,12,0.35),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl backdrop-saturate-150 sm:max-h-[calc(100dvh-3rem)] sm:rounded-[28px]"
      >
        {/* Soft colour glow behind the glass */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/60 text-xl leading-none text-ink shadow-sm backdrop-blur transition hover:bg-white"
          aria-label="Kontaktformular schließen"
        >
          <span aria-hidden>×</span>
        </button>

        <div className="relative grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[0.85fr_1.15fr]">
          {/* Contact details */}
          <aside className="border-b border-white/50 bg-gradient-to-br from-brand/90 to-brand-soft/85 p-6 text-white md:border-r md:border-b-0 md:p-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase">Kontakt</p>
            <h2 id="contact-dialog-title" className="mt-2 font-serif text-2xl leading-tight font-bold md:text-3xl">
              Wir freuen uns auf Ihre Nachricht
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Designmöbel, Einrichtungsplanung oder ein Termin im Showroom – wir melden uns zeitnah.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a href={site.phoneHref} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur transition hover:bg-white/20">
                <span aria-hidden className="text-lg">☎</span>
                <span>{site.phone}</span>
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur transition hover:bg-white/20">
                <WhatsAppIcon className="h-5 w-5" />
                <span>WhatsApp schreiben</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur transition hover:bg-white/20">
                <span aria-hidden className="text-lg">✉</span>
                <span className="break-all">{site.email}</span>
              </a>
            </div>

            <div className="mt-6 hidden text-sm leading-relaxed text-white/80 md:block">
              <p className="font-semibold text-white">{site.name}</p>
              <p>{site.street}<br />{site.zipCity}</p>
              <ul className="mt-3 space-y-0.5">
                {site.hours.map((h) => (
                  <li key={h.days}>{h.days}: {h.time}</li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="p-6 md:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/70 text-3xl text-brand shadow-sm">✓</div>
                <h3 className="mt-4 font-serif text-2xl font-bold">Vielen Dank!</h3>
                <p className="mt-2 max-w-sm text-sm text-ink/70">
                  Ihre Nachricht ist bei uns angekommen. Wir melden uns zeitnah bei Ihnen.
                </p>
                {status === 'dev' ? <p className="mt-2 text-xs text-ink/50">(Lokaler Testmodus – nichts versendet.)</p> : null}
                <button type="button" onClick={onClose} className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase shadow-lg shadow-brand/25 hover:bg-brand-dark">
                  Schließen
                </button>
              </div>
            ) : (
              <form name="kontakt" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} className="space-y-4">
                <input type="hidden" name="form-name" value="kontakt" />
                <p className="hidden">
                  <label>Nicht ausfüllen: <input name="bot-field" tabIndex={-1} /></label>
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelText}>Name *</span>
                    <input required name="name" autoComplete="name" aria-required="true" className={field} placeholder="Vor- und Nachname" />
                  </label>
                  <label className="block">
                    <span className={labelText}>E-Mail *</span>
                    <input required type="email" name="email" autoComplete="email" aria-required="true" className={field} placeholder="name@beispiel.de" />
                  </label>
                  <label className="block">
                    <span className={labelText}>Telefon</span>
                    <input type="tel" name="phone" autoComplete="tel" className={field} placeholder="für Rückfragen" />
                  </label>
                  <label className="block">
                    <span className={labelText}>Wie haben Sie von uns erfahren?</span>
                    <select name="source" defaultValue="" className={field}>
                      <option value="" disabled>Bitte auswählen</option>
                      <option>Google</option>
                      <option>Empfehlung</option>
                      <option>Social Media</option>
                      <option>Vor Ort / Showroom</option>
                      <option>Sonstiges</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className={labelText}>Nachricht *</span>
                  <textarea required name="message" rows={5} aria-required="true" className={`${field} resize-y`} placeholder="Wobei dürfen wir Ihnen helfen?" />
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/70 bg-white/45 px-3.5 py-3 text-sm backdrop-blur-sm">
                  <input type="checkbox" name="callback" value="ja" className="h-4 w-4 accent-brand" />
                  Bitte rufen Sie mich zurück
                </label>

                {status === 'error' ? (
                  <p className="rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700" role="alert">
                    Das Absenden hat nicht geklappt. Bitte erneut versuchen oder an{' '}
                    <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> schreiben.
                  </p>
                ) : null}

                <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-ink/55">* Pflichtfelder</p>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="rounded-full bg-gradient-to-r from-brand to-brand-soft px-7 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase shadow-lg shadow-brand/25 transition hover:brightness-110 disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Wird gesendet …' : 'Nachricht senden'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
