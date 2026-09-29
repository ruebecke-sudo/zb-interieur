import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type LightboxState = {
  src: string
  alt: string
} | null

type LightboxContextValue = {
  open: (src: string, alt?: string) => void
  close: () => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider')
  return ctx
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxState>(null)

  const open = useCallback((src: string, alt = '') => {
    setItem({ src, alt })
  }, [])

  const close = useCallback(() => setItem(null), [])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [item, close])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {item
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm md:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={item.alt || 'Bild in Originalgröße'}
              data-lightbox-root
              onClick={close}
            >
              <button
                type="button"
                onClick={close}
                className="absolute top-4 right-4 z-[101] inline-flex h-11 w-11 items-center justify-center bg-white/10 text-2xl text-white transition hover:bg-white/20"
                aria-label="Schließen"
              >
                ×
              </button>
              <img
                src={item.src}
                alt={item.alt}
                className="max-h-[min(92vh,1200px)] max-w-full object-contain shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
                onClick={(e) => e.stopPropagation()}
              />
              {item.alt ? (
                <p className="pointer-events-none absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 truncate text-center text-sm text-white/75">
                  {item.alt}
                </p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </LightboxContext.Provider>
  )
}

/** Click-to-zoom for content images inside main (logos/decorative excluded via data-no-zoom). */
export function ImageZoomRoot({ children }: { children: ReactNode }) {
  const { open } = useLightbox()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target
      if (!(target instanceof Element)) return
      const img = target.closest('img')
      if (!img) return
      if (img.closest('header, footer, [data-no-zoom-root]')) return
      if (img.hasAttribute('data-no-zoom')) return
      // Allow zoom inside gallery overlays; skip only the lightbox dialog itself
      if (img.closest('[role="dialog"][aria-label*="Originalgröße"], [data-lightbox-root]')) return
      const src = img.currentSrc || img.src
      if (!src) return
      e.preventDefault()
      e.stopPropagation()
      open(src, img.alt || '')
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [open])

  return <>{children}</>
}
