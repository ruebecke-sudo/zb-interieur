import { trackEvent } from './analytics'

/** Encode FormData for Netlify Forms (application/x-www-form-urlencoded). */
export function encodeFormData(data: FormData): string {
  const params = new URLSearchParams()
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') params.append(key, value)
  }
  // Always send empty honeypot if missing – required for some Netlify setups
  if (!params.has('bot-field')) params.set('bot-field', '')
  return params.toString()
}

/**
 * Submit to Netlify Forms via AJAX.
 * Forms must be registered at deploy time (see index.html + public/netlify-forms.html).
 */
export async function submitNetlifyForm(data: FormData): Promise<'ok' | 'dev-ok' | 'error'> {
  if (!data.get('form-name')) {
    console.error('[form] form-name fehlt')
    return 'error'
  }

  const body = encodeFormData(data)
  const host = window.location.hostname
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (isLocal) {
      if (import.meta.env.DEV) {
        console.info('[form] Lokaler Dev-Modus – Anfrage simuliert:', Object.fromEntries(data))
      }
      return 'dev-ok'
    }

    // Netlify returns 404 when the form-name is not registered for the site.
    if (res.status === 404) {
      console.error(
        '[form] Netlify Forms 404 – Formular nicht registriert. Neues Deploy nötig, Forms in HTML prüfen.',
      )
      return 'error'
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    trackEvent('Formular gesendet', { formular: String(data.get('form-name')) })
    return 'ok'
  } catch (err) {
    console.error('[form] Absenden fehlgeschlagen', err)
    return 'error'
  }
}
