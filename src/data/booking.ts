/** Öffnungszeiten & buchbare Termine */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // So=0 … Sa=6

export const openingHoursNav = 'Mo–Fr 09–18 · Sa 10–16'

export const appointmentTypes = [
  {
    id: 'showroom',
    label: 'Showroom-Besuch / Erstgespräch',
    durationMin: 45,
    description: 'Unverbindliches Kennenlernen im Showroom Homburg.',
  },
  {
    id: 'einrichtung',
    label: 'Einrichtungsberatung',
    durationMin: 60,
    description: 'Persönliche Beratung zu Wohnkonzept und Möbelauswahl.',
  },
  {
    id: 'kueche',
    label: 'Küchenplanung',
    durationMin: 60,
    description: 'Termin für Küchenkonzept und Planung.',
  },
  {
    id: 'outdoor',
    label: 'Terrasse & Outdoor',
    durationMin: 45,
    description: 'Beratung zu Outdoor-Möbeln und Terrassengestaltung.',
  },
  {
    id: 'rueckruf',
    label: 'Telefonischer Rückruf',
    durationMin: 15,
    description: 'Kurzer Rückruf – wir melden uns zum gewählten Zeitpunkt.',
  },
] as const

export type AppointmentTypeId = (typeof appointmentTypes)[number]['id']

/** Buchungsfenster pro Wochentag (Start inklusive, Ende exklusiv für letzte Slot-Startzeit) */
const dayWindows: Partial<Record<Weekday, { start: string; end: string }>> = {
  1: { start: '09:00', end: '18:00' }, // Mo
  2: { start: '09:00', end: '18:00' },
  3: { start: '09:00', end: '18:00' },
  4: { start: '09:00', end: '18:00' },
  5: { start: '09:00', end: '18:00' },
  6: { start: '10:00', end: '16:00' }, // Sa
}

const SLOT_STEP_MIN = 30

export function isOpenDay(date: Date): boolean {
  return dayWindows[date.getDay() as Weekday] != null
}

export function parseHm(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

export function formatHm(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function getSlotsForDate(date: Date, durationMin: number): string[] {
  const win = dayWindows[date.getDay() as Weekday]
  if (!win) return []

  const start = parseHm(win.start)
  const end = parseHm(win.end)
  const slots: string[] = []

  for (let t = start; t + durationMin <= end; t += SLOT_STEP_MIN) {
    slots.push(formatHm(t))
  }

  // Heute: nur zukünftige Slots (Puffer 60 Min)
  const now = new Date()
  if (sameDay(date, now)) {
    const cutoff = now.getHours() * 60 + now.getMinutes() + 60
    return slots.filter((s) => parseHm(s) >= cutoff)
  }

  return slots
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function formatDateDe(d: Date): string {
  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthMatrix(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // Mo=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const rows: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
}

export function canSelectDate(date: Date): boolean {
  const today = startOfDay(new Date())
  const d = startOfDay(date)
  if (d < today) return false
  // max 8 Wochen voraus
  if (d > addDays(today, 56)) return false
  return isOpenDay(d)
}
