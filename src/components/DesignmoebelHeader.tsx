import { Link } from 'react-router-dom'

const images = {
  lounge: '/images/designmoebel-1.jpg',
  dining: '/images/designmoebel-2.jpg',
  sofa: '/images/designmoebel-3.jpg',
} as const

export function DesignmoebelHeader() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Vollflächiges Hintergrundmotiv */}
      <img
        src={images.lounge}
        alt=""
        className="animate-kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgba(66,0,27,0.94) 0%, rgba(88,0,36,0.88) 42%, rgba(88,0,36,0.55) 68%, rgba(26,0,12,0.35) 100%),
            linear-gradient(to top, rgba(26,0,12,0.55) 0%, transparent 45%)
          `,
        }}
      />

      <div className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1fr_1fr] md:gap-12 md:py-20 lg:min-h-[88vh]">
        <div className="animate-fade-up max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            ZB Interieur · Homburg
          </p>
          <h2 className="mt-5 font-sans text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.03em]">
            Design
            <span className="block text-accent">möbel</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/80 md:text-base">
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

        {/* Bildkomposition: Essbereich + Sofa */}
        <div className="animate-slide-fade relative grid grid-cols-2 gap-2 [animation-delay:120ms] md:gap-3">
          <div className="col-span-2 overflow-hidden md:col-span-1 md:row-span-2">
            <img
              src={images.dining}
              alt="Designmöbel Essbereich im Showroom"
              className="aspect-[3/4] h-full w-full object-cover transition duration-[1.2s] hover:scale-[1.03] md:min-h-[520px]"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={images.sofa}
              alt="Designer-Sofa im Showroom"
              className="aspect-square w-full object-cover transition duration-[1.2s] hover:scale-[1.03] md:aspect-[4/5]"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={images.lounge}
              alt="Lounge-Bereich mit Designmöbeln"
              className="aspect-square w-full object-cover transition duration-[1.2s] hover:scale-[1.03] md:aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
