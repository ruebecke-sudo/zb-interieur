import { Link } from 'react-router-dom'

const FLIPBOOK_SRC = '/magazin/Broschuere_2026_Flipbook.html'
const PDF_SRC = '/magazin/Broschuere_2026.pdf'

export function MagazinPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 90% 0%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 55%),
              linear-gradient(155deg, var(--color-brand-dark) 0%, var(--color-brand) 55%, #1a000c 100%)
            `,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            ZB Interieur · Magazin
          </p>
          <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
            Broschüre
            <span className="mt-1 block text-accent">2026</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Blättern Sie durch unsere aktuelle Showroom-Broschüre – Inspiration, Marken und
            Raumstimmungen aus Homburg.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={FLIPBOOK_SRC}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Vollbild öffnen
              <span className="sr-only"> (öffnet in neuem Fenster)</span>
            </a>
            <a
              href={PDF_SRC}
              download="ZB-Interieur-Broschuere-2026.pdf"
              className="inline-flex border border-white/35 px-7 py-3.5 text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:border-white hover:bg-white/5"
            >
              PDF speichern
              <span className="sr-only"> – Broschüre 2026 als PDF herunterladen</span>
            </a>
            <Link
              to="/termin"
              className="inline-flex border border-white/35 px-7 py-3.5 text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:border-white hover:bg-white/5"
            >
              Beratungstermin
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="overflow-hidden border border-white/10 bg-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <iframe
              title="ZB Interieur Broschüre 2026 – Blättermagazin"
              src={FLIPBOOK_SRC}
              className="h-[min(84vh,980px)] w-full bg-[#111]"
              loading="lazy"
              allow="fullscreen"
            />
          </div>
          <p className="mt-4 text-center text-sm text-white/55">
            Seiten umblättern mit den Pfeilen oder per Klick. Als Datei:{' '}
            <a href={PDF_SRC} className="font-semibold text-accent hover:underline">
              PDF herunterladen
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
