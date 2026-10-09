/**
 * Cookieless visitor statistics with Pirsch (pirsch.io, servers in Germany).
 * No cookies and no personal data, so no consent banner is needed.
 *
 * Reusable for other websites: only PIRSCH_CODE changes (Pirsch → domain settings →
 * "Identification Code"). The code is public; it ends up in the page source anyway.
 */
// Dashboard "zb-interieur.netlify.app". When the site moves to zb-interieur.de, use that dashboard's code.
export const PIRSCH_CODE = 'MHvZY7xEg8xVjDDYIPFZTLTIjsKbno3J'

/** Internal pages that should not appear in the statistics. */
const EXCLUDED_PATHS = ['/image-manager.*', '/verwaltung.*']

type Pirsch = (name: string, options?: { meta?: Record<string, string | number> }) => void

declare global {
  interface Window {
    pirsch?: Pirsch
  }
}

/** Adds the Pirsch script once. Page views, including in-app navigation, are counted automatically. */
export function loadAnalytics() {
  if (!PIRSCH_CODE || typeof document === 'undefined' || document.getElementById('pianjs')) return
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://api.pirsch.io/pa.js'
  script.id = 'pianjs'
  script.dataset.code = PIRSCH_CODE
  script.dataset.exclude = EXCLUDED_PATHS.join(',')
  document.head.appendChild(script)
}

/** Records a goal such as "Anruf" or "Formular gesendet". Does nothing if Pirsch is not loaded. */
export function trackEvent(name: string, meta?: Record<string, string | number>) {
  try {
    window.pirsch?.(name, meta ? { meta } : undefined)
  } catch {
    // Statistics must never break the website.
  }
}
