import { Link } from 'react-router-dom'

/**
 * Exklusiver Header für den Designmöbel-Bereich.
 * Bildflächen sind Platzhalter – später durch echte Fotos ersetzen
 * (data-image="designmoebel-hero" / "designmoebel-detail").
 */
export function DesignmoebelHeader() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      {/* Atmosphäre: weiche Lichtverläufe in Markenfarben */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 85% 20%, color-mix(in srgb, var(--color-brand-soft) 55%, transparent), transparent 55%),
            radial-gradient(ellipse 50% 40% at 10% 90%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 50%),
            linear-gradient(160deg, var(--color-brand-dark) 0%, var(--color-brand) 48%, #2a0012 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-12deg, transparent, transparent 22px, rgba(255,255,255,0.35) 22px, rgba(255,255,255,0.35) 23px)',
        }}
      />

      <div className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-20 lg:min-h-[85vh]">
        <div className="animate-fade-up max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            ZB Interieur · Homburg
          </p>
          <h2 className="mt-5 font-sans text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.03em]">
            Design
            <span className="block text-accent">möbel</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/78 md:text-base">
            Kuratierte Stücke, präzise ausgewählt – für Räume mit Haltung. Weniger Katalog, mehr
            Charakter: Interieur, das bleibt.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
            <span>Showroom only</span>
            <span className="h-px w-8 bg-white/25" aria-hidden />
            <span>Persönliche Beratung</span>
            <span className="h-px w-8 bg-white/25" aria-hidden />
            <span>STILPUNKTE 25/26</span>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/termin"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
            >
              Beratungstermin
            </Link>
            <Link
              to="/planung"
              className="inline-flex border border-white/35 px-7 py-3.5 text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:border-white hover:bg-white/5"
            >
              Konzept ansehen
            </Link>
          </div>
        </div>

        {/* Bildplatzhalter – später ersetzen (data-image="designmoebel-hero") */}
        <div className="relative animate-slide-fade [animation-delay:120ms]">
          <div
            data-image="designmoebel-hero"
            className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]"
            style={{
              background:
                'linear-gradient(155deg, color-mix(in srgb, var(--color-brand-soft) 45%, #1a000c) 0%, #1a000c 100%)',
            }}
          >
            <div
              aria-hidden
              className="animate-kenburns absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 55%)',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-8 md:p-10">
              <span className="text-[10px] font-semibold tracking-[0.24em] text-white/40 uppercase">
                Bild folgt
              </span>
              <span className="max-w-[14rem] text-sm leading-snug text-white/70">
                Hero-Motiv Designmöbel
                <span className="mt-1 block text-white/40">(Hochformat · vollflächig)</span>
              </span>
            </div>
            <div aria-hidden className="absolute inset-5 border border-white/12" />
          </div>
        </div>
      </div>
    </section>
  )
}
