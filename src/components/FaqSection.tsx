import { useId, useState } from 'react'
import { faqs } from '../data/site'

export function FaqSection({ id = 'faq' }: { id?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section id={id} className="scroll-mt-28 bg-white" aria-labelledby={`${baseId}-heading`}>
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <p className="text-center text-xs font-semibold tracking-[0.16em] text-brand uppercase">
          FAQ
        </p>
        <h2 id={`${baseId}-heading`} className="mt-2 text-center font-serif text-3xl font-bold md:text-4xl">
          Kurze Antworten auf häufige Fragen
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`
            return (
              <div key={item.q}>
                <h3 className="m-0 text-base font-normal">
                  <button
                    type="button"
                    id={buttonId}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-serif text-lg font-bold text-ink md:text-xl">{item.q}</span>
                    <span
                      className={`mt-1 shrink-0 text-xl text-brand transition ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  {isOpen ? (
                    <p className="pb-5 text-[15px] leading-relaxed text-muted">{item.a}</p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
