const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })

// Fingerprints in the page HTML, checked in this order.
const SIGNATURES: Array<{ platform: 'wordpress' | 'wix' | 'jimdo' | 'shopify'; patterns: RegExp[] }> = [
  { platform: 'shopify', patterns: [/cdn\.shopify\.com/i, /Shopify\.theme/i, /myshopify\.com/i] },
  { platform: 'wix', patterns: [/static\.wixstatic\.com/i, /wix\.com Website Builder/i, /_wixCssImports|wix-bolt|parastorage\.com/i] },
  { platform: 'jimdo', patterns: [/jimdo/i, /jimcdn\.com/i, /jimstatic\.com/i] },
  { platform: 'wordpress', patterns: [/wp-content\//i, /wp-includes\//i, /<meta[^>]+generator[^>]+WordPress/i] },
]

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return true
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')
}

/** Guesses which website builder a customer's site uses, so the app can show the matching steps. */
export default async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { ...headers, 'Access-Control-Allow-Headers': 'content-type' } })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const body = await req.json().catch(() => null) as { url?: string } | null
  let input = String(body?.url || '').trim()
  if (!input) return json({ error: 'Bitte die Adresse Ihrer Website eingeben.' }, 400)
  if (!/^https?:\/\//i.test(input)) input = 'https://' + input

  let target: URL
  try { target = new URL(input) } catch { return json({ error: 'Das sieht nicht wie eine Website-Adresse aus.' }, 400) }
  if (!['http:', 'https:'].includes(target.protocol) || isBlockedHost(target.hostname) || !target.hostname.includes('.')) {
    return json({ error: 'Das sieht nicht wie eine Website-Adresse aus.' }, 400)
  }

  try {
    const response = await fetch(target.toString(), {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageManagerPro/1.0; +website-check)' },
    })
    const finalHost = new URL(response.url).hostname
    if (isBlockedHost(finalHost)) return json({ platform: 'unknown' })
    const html = (await response.text()).slice(0, 400_000)
    const headerText = [...response.headers.entries()].map(([key, value]) => `${key}: ${value}`).join('\n')
    const haystack = headerText + '\n' + html
    const match = SIGNATURES.find((signature) => signature.patterns.some((pattern) => pattern.test(haystack)))
    return json({ platform: match?.platform || 'unknown', host: finalHost })
  } catch {
    return json({ error: 'Die Website konnte nicht geöffnet werden. Bitte die Adresse prüfen.' }, 502)
  }
}
