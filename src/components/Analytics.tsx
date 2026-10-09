import { useEffect } from 'react'
import { loadAnalytics, trackEvent } from '../lib/analytics'

/** Which link clicks count as a goal in the statistics. */
function goalFor(href: string): string | null {
  if (href.startsWith('tel:')) return 'Anruf'
  if (href.startsWith('mailto:')) return 'E-Mail'
  if (/(^|\/\/)(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'WhatsApp'
  return null
}

/** Loads the statistics script and counts clicks on phone, e-mail and WhatsApp links. */
export function Analytics() {
  useEffect(() => {
    loadAnalytics()
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a')
      const goal = link ? goalFor(link.getAttribute('href') || '') : null
      if (goal) trackEvent(goal, { seite: window.location.pathname })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
