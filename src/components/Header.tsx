import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { openingHoursNav } from '../data/booking'
import { nav, site } from '../data/site'

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {/* Tier 1 – Kontakt + Öffnungszeiten sofort sichtbar */}
      <div className="border-b border-line bg-white text-[12px] text-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <NavLink to="/" className="hidden font-medium text-ink hover:text-brand md:inline">
              {site.name}
            </NavLink>
            <span className="hidden text-line md:inline" aria-hidden>
              |
            </span>
            <span className="font-semibold text-brand">{openingHoursNav}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="hidden sm:inline">
              {site.zipCity} | {site.street}
            </span>
            <span className="hidden text-line sm:inline" aria-hidden>
              |
            </span>
            <a href={site.phoneHref} className="hover:text-accent">
              Tel. {site.phone}
            </a>
            <span className="hidden items-center gap-2 md:flex">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center bg-[#e8e8e8] text-[10px] font-bold text-muted hover:bg-brand hover:text-white"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center bg-[#e8e8e8] text-[10px] font-bold text-muted hover:bg-brand hover:text-white"
                aria-label="LinkedIn"
              >
                in
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-brand">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <img src="/images/logo.jpg" alt="ZB Interieur" className="h-14 w-auto object-contain md:h-16" />
          </NavLink>
          <div className="hidden text-right text-sm text-white/95 md:block">
            <p className="font-semibold tracking-wide">Öffnungszeiten</p>
            <p className="text-white/85">{openingHoursNav}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-white lg:hidden"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span className={`h-0.5 w-full bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition ${open ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div className="hidden border-b border-line bg-white lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
          <nav className="flex items-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-block px-3 py-3.5 text-[13px] font-medium tracking-[0.04em] transition ${
                  isActive ? 'text-brand' : 'text-ink/80 hover:text-brand'
                }`
              }
            >
              Start
            </NavLink>
            {nav.map((item) => (
              <div key={item.label} className="group relative">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `inline-block px-3 py-3.5 text-[13px] font-medium tracking-[0.04em] transition ${
                      isActive ? 'text-brand' : 'text-ink/80 hover:text-brand'
                    }`
                  }
                >
                  {item.label}
                  {'children' in item && item.children ? ' ▾' : ''}
                </NavLink>
                {'children' in item && item.children ? (
                  <div className="invisible absolute left-0 top-full z-20 min-w-[220px] bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-ink/80 hover:bg-fog hover:text-brand"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <NavLink
              to="/termin"
              className={({ isActive }) =>
                `inline-block px-3 py-3.5 text-[13px] font-medium tracking-[0.04em] transition ${
                  isActive ? 'text-brand' : 'text-ink/80 hover:text-brand'
                }`
              }
            >
              Termin
            </NavLink>
          </nav>
          <NavLink
            to="/termin"
            className="rounded-full bg-accent px-4 py-1.5 text-[12px] font-bold tracking-[0.06em] text-white uppercase hover:brightness-95"
          >
            Termin buchen
          </NavLink>
        </div>
      </div>

      {open ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-line bg-white lg:hidden">
          <div className="space-y-1 px-4 py-4">
            <div className="mb-3 rounded-sm bg-fog px-3 py-3 text-sm">
              <p className="font-semibold text-brand">Öffnungszeiten</p>
              <p className="text-ink">{openingHoursNav}</p>
            </div>
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3 text-base font-semibold text-ink"
            >
              Start
            </NavLink>
            {nav.map((item) => (
              <div key={item.label} className="border-b border-line py-3">
                <NavLink
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-semibold text-ink"
                >
                  {item.label}
                </NavLink>
                {'children' in item && item.children ? (
                  <div className="mt-2 space-y-1 pl-2">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        onClick={() => setOpen(false)}
                        className="block py-1 text-sm text-muted"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <NavLink
              to="/termin"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-bold text-white uppercase"
            >
              Termin buchen
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  )
}
