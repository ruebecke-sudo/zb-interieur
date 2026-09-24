import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { nav, site } from '../data/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md'
          : 'bg-gradient-to-b from-black/45 to-transparent'
      }`}
    >
      <div
        className={`hidden border-b text-center text-[12px] tracking-wide md:block ${
          scrolled || open
            ? 'border-line bg-fog text-muted'
            : 'border-white/10 bg-black/25 text-white/90'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-1.5">
          <span>
            {site.zipCity} | {site.street}
          </span>
          <span aria-hidden>|</span>
          <a href={site.phoneHref} className="hover:text-accent">
            Tel. {site.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <NavLink to="/" className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
          <img
            src="/images/logo.jpg"
            alt="ZB Interieur"
            className="h-12 w-auto object-contain md:h-14"
          />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `px-3 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition ${
                    scrolled
                      ? isActive
                        ? 'text-brand'
                        : 'text-ink/80 hover:text-brand'
                      : isActive
                        ? 'text-white'
                        : 'text-white/85 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
              {'children' in item && item.children ? (
                <div className="invisible absolute left-0 top-full min-w-[220px] translate-y-1 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) =>
                    child.href.endsWith('.pdf') ? (
                      <a
                        key={child.href}
                        href={child.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-4 py-2 text-sm text-ink/80 hover:bg-fog hover:text-brand"
                      >
                        {child.label}
                      </a>
                    ) : (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-ink/80 hover:bg-fog hover:text-brand"
                      >
                        {child.label}
                      </NavLink>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.booking}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-sm bg-brand px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-dark sm:inline-flex"
          >
            Termin
          </a>
          <button
            type="button"
            className={`relative z-10 inline-flex h-10 w-10 items-center justify-center lg:hidden ${
              scrolled || open ? 'text-ink' : 'text-white'
            }`}
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menü</span>
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-0.5 w-full bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span className={`h-0.5 w-full bg-current transition ${open ? 'opacity-0' : ''}`} />
              <span
                className={`h-0.5 w-full bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-[72px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="space-y-1 px-4 py-6">
            {nav.map((item) => (
              <div key={item.label} className="border-b border-line py-3">
                <NavLink
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-semibold uppercase tracking-[0.06em] text-ink"
                >
                  {item.label}
                </NavLink>
                {'children' in item && item.children ? (
                  <div className="mt-2 space-y-1 pl-2">
                    {item.children.map((child) =>
                      child.href.endsWith('.pdf') ? (
                        <a
                          key={child.href}
                          href={child.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block py-1 text-sm text-muted"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-1 text-sm text-muted"
                        >
                          {child.label}
                        </NavLink>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ))}
            <a
              href={site.booking}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-brand px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Beratungstermin anfragen
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
