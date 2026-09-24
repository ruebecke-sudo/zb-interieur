import { Link } from 'react-router-dom'
import { BookingCalendar } from '../components/BookingCalendar'
import { openingHoursNav } from '../data/booking'
import { site, whatsappHref } from '../data/site'
import { WhatsAppIcon } from '../components/WhatsAppButton'

export function TerminPage() {
  return (
    <>
      <section className="bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Terminbuchung</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Beratungstermin vereinbaren</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Wählen Sie Terminart, Tag und Uhrzeit im Kalender. Öffnungszeiten: {openingHoursNav}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={site.phoneHref} className="font-medium text-brand hover:underline">
              Tel. {site.phone}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#128C7E] hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <Link to="/kontakt" className="font-medium text-muted hover:text-brand">
              Kontaktformular
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <BookingCalendar />
      </section>
    </>
  )
}
