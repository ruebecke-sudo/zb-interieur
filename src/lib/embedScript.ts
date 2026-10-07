export const EMBED_SCRIPT_PATH = '/image-manager-embed.js'

type EmbedApi = { render: (host: Element) => void }

let pending: Promise<EmbedApi | null> | null = null

/** Loads the same gallery script customers embed on their websites (served by a Netlify function). */
export function loadEmbedScript(): Promise<EmbedApi | null> {
  const existing = (window as unknown as { ImageManagerEmbed?: EmbedApi }).ImageManagerEmbed
  if (existing) return Promise.resolve(existing)
  if (!pending) {
    pending = new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = EMBED_SCRIPT_PATH
      script.async = true
      script.onload = () => resolve((window as unknown as { ImageManagerEmbed?: EmbedApi }).ImageManagerEmbed || null)
      script.onerror = () => { pending = null; resolve(null) }
      document.body.appendChild(script)
    })
  }
  return pending
}

/** Public address of a workspace's hosted gallery page. */
export function galleryPageUrl(slug: string): string {
  const path = import.meta.env.VITE_IMAGE_MANAGER_STANDALONE === 'true' ? `/g/${slug}` : `/image-manager/galerie/${slug}`
  return `${window.location.origin}${path}`
}
