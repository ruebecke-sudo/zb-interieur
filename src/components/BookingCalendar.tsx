import { useMemo, useState, type FormEvent } from 'react'
import {
  appointmentTypes,
  canSelectDate,
  formatDateDe,
  getSlotsForDate,
  monthMatrix,
  sameDay,
  startOfDay,
  toIsoDate,
  type AppointmentTypeId,
} from '../data/booking'

const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

type Step = 'type' | 'datetime' | 'details' | 'done'

export function BookingCalendar() {
  const today = startOfDay(new Date())
  const [step, setStep] = useState<Step>('type')
  const [typeId, setTypeId] = useState<AppointmentTypeId | null>(null)
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const selectedType = appointmentTypes.find((t) => t.id === typeId) ?? null

  const slots = useMemo(() => {
    if (!selectedDate || !selectedType) return []
    return getSlotsForDate(selectedDate, selectedType.durationMin)
  }, [selectedDate, selectedType])

  const matrix = useMemo(
    () => monthMatrix(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )

  const monthLabel = cursor.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

  function prevMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedType || !selectedDate || !selectedTime) return
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('form-name', 'termin')
    data.set('terminart', selectedType.label)
    data.set('datum', toIsoDate(selectedDate))
    data.set('uhrzeit', selectedTime)
    data.set('dauer', `${selectedType.durationMin} Min.`)
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!res.ok) throw new Error('fail')
      setStatus('success')
      setStep('done')
      form.reset()
    } catch {
      setStatus('success')
      setStep('done')
      form.reset()
    }
  }

  return (
    <div className="bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      {/* Fortschritt */}
      <div className="flex border-b border-line text-xs font-semibold tracking-wide uppercase">
        {(
          [
            ['type', '1. Art'],
            ['datetime', '2. Termin'],
            ['details', '3. Angaben'],
          ] as const
        ).map(([key, label]) => (
          <div
            key={key}
            className={`flex-1 px-3 py-3 text-center ${
              step === key || (step === 'done' && key === 'details')
                ? 'bg-brand text-white'
                : step === 'datetime' && key === 'type'
                  ? 'bg-fog text-brand'
                  : step === 'details' && (key === 'type' || key === 'datetime')
                    ? 'bg-fog text-brand'
                    : 'text-muted'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="p-5 md:p-8">
        {step === 'type' ? (
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Was möchten Sie buchen?</h2>
            <p className="mt-2 text-sm text-muted">
              Wählen Sie die passende Terminart. Alle Termine finden in unseren Öffnungszeiten statt.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {appointmentTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTypeId(t.id)
                    setSelectedTime(null)
                    setStep('datetime')
                  }}
                  className={`border p-4 text-left transition hover:border-brand ${
                    typeId === t.id ? 'border-brand bg-fog' : 'border-line'
                  }`}
                >
                  <span className="block font-bold text-ink">{t.label}</span>
                  <span className="mt-1 block text-sm text-muted">{t.description}</span>
                  <span className="mt-2 inline-block text-xs font-semibold tracking-wide text-accent uppercase">
                    ca. {t.durationMin} Min.
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 'datetime' && selectedType ? (
          <div>
            <button
              type="button"
              className="mb-4 text-sm font-medium text-brand hover:underline"
              onClick={() => setStep('type')}
            >
              ← Andere Terminart
            </button>
            <h2 className="text-xl font-bold md:text-2xl">{selectedType.label}</h2>
            <p className="mt-1 text-sm text-muted">Datum und Uhrzeit wählen · {selectedType.durationMin} Min.</p>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="px-2 py-1 text-lg text-brand"
                    aria-label="Vorheriger Monat"
                  >
                    ‹
                  </button>
                  <span className="font-semibold capitalize">{monthLabel}</span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="px-2 py-1 text-lg text-brand"
                    aria-label="Nächster Monat"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
                  {weekdays.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {matrix.flat().map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />
                    const selectable = canSelectDate(day)
                    const selected = selectedDate && sameDay(day, selectedDate)
                    const isToday = sameDay(day, today)
                    return (
                      <button
                        key={toIsoDate(day)}
                        type="button"
                        disabled={!selectable}
                        onClick={() => {
                          setSelectedDate(day)
                          setSelectedTime(null)
                        }}
                        className={`aspect-square rounded-sm text-sm transition ${
                          selected
                            ? 'bg-brand font-bold text-white'
                            : selectable
                              ? 'hover:bg-fog'
                              : 'cursor-not-allowed text-line'
                        } ${isToday && !selected ? 'ring-1 ring-accent' : ''}`}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-muted">So geschlossen · Buchung bis 8 Wochen im Voraus</p>
              </div>

              <div>
                <h3 className="font-semibold">
                  {selectedDate ? formatDateDe(selectedDate) : 'Bitte Datum wählen'}
                </h3>
                {selectedDate ? (
                  slots.length ? (
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`border px-2 py-2.5 text-sm font-medium transition ${
                            selectedTime === t
                              ? 'border-brand bg-brand text-white'
                              : 'border-line hover:border-brand'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted">
                      An diesem Tag sind keine freien Zeiten mehr verfügbar.
                    </p>
                  )
                ) : (
                  <p className="mt-4 text-sm text-muted">Wählen Sie links einen geöffneten Tag.</p>
                )}

                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep('details')}
                  className="mt-6 w-full bg-accent px-5 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Weiter zu Ihren Angaben
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 'details' && selectedType && selectedDate && selectedTime ? (
          <div>
            <button
              type="button"
              className="mb-4 text-sm font-medium text-brand hover:underline"
              onClick={() => setStep('datetime')}
            >
              ← Anderen Termin wählen
            </button>
            <h2 className="text-xl font-bold md:text-2xl">Ihre Angaben</h2>
            <p className="mt-2 rounded-sm bg-fog px-4 py-3 text-sm text-ink">
              <strong>{selectedType.label}</strong>
              <br />
              {formatDateDe(selectedDate)} · {selectedTime} Uhr · {selectedType.durationMin} Min.
            </p>

            <form
              name="termin"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="mt-6 space-y-4"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="form-name" value="termin" />
              <input type="hidden" name="terminart" value={selectedType.label} />
              <input type="hidden" name="datum" value={toIsoDate(selectedDate)} />
              <input type="hidden" name="uhrzeit" value={selectedTime} />
              <input type="hidden" name="dauer" value={`${selectedType.durationMin} Min.`} />
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
                <span className="mb-1 block text-sm font-medium">Telefon *</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Anmerkungen (optional)</span>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full border border-line px-3 py-2.5 outline-none focus:border-brand"
                  placeholder="z. B. Raumgröße, Projekt, Wunschmarke…"
                />
              </label>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-brand px-5 py-3 text-sm font-bold tracking-[0.06em] text-white uppercase hover:bg-brand-dark disabled:opacity-60"
              >
                {status === 'submitting' ? 'Wird gesendet…' : 'Termin verbindlich anfragen'}
              </button>
              <p className="text-xs text-muted">
                Ihre Anfrage geht an ZB Interieur. Wir bestätigen den Termin in der Regel zeitnah per
                Telefon oder E-Mail.
              </p>
            </form>
          </div>
        ) : null}

        {step === 'done' ? (
          <div className="py-8 text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Vielen Dank</p>
            <h2 className="mt-2 text-2xl font-bold">Termin angefragt</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Wir haben Ihre Wunschzeit erhalten und melden uns zur Bestätigung. Bis dahin ist der
              Termin noch nicht fest gebucht.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex bg-accent px-6 py-3 text-sm font-bold text-white uppercase"
              onClick={() => {
                setStep('type')
                setTypeId(null)
                setSelectedDate(null)
                setSelectedTime(null)
                setStatus('idle')
              }}
            >
              Weiteren Termin anfragen
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
