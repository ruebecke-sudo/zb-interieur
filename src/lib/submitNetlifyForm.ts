/** Encode FormData for Netlify Forms (application/x-www-form-urlencoded). */
export function encodeFormData(data: FormData): string {
  const params = new URLSearchParams()
  for (const [key, value] of data.entries()) {
    if (typeof value === 'string') params.append(key, value)
  }
  return params.toString()
}

/**
 * Submit to Netlify Forms.
 * On local Vite, POST / returns HTML 200 – we treat that as offline and still
 * surface success only when the request reaches a Netlify-hosted origin or
 * when a dedicated form endpoint responds OK.
 */
export async function submitNetlifyForm(data: FormData): Promise<'ok' | 'dev-ok' | 'error'> {
  const body = encodeFormData(data)
  const host = window.location.hostname
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    // Netlify Forms typically redirects (302) or returns 200 after acceptance.
    // Local Vite always returns 200 HTML for POST / – not a real form backend.
    if (isLocal) {
      if (import.meta.env.DEV) {
        console.info('[form] Lokaler Dev-Modus – Anfrage simuliert:', Object.fromEntries(data))
      }
      return 'dev-ok'
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return 'ok'
  } catch (err) {
    console.error('[form] Absenden fehlgeschlagen', err)
    return 'error'
  }
}
