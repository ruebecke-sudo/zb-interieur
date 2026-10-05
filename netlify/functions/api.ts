/** Netlify Function adapter for media API. */
import { createMediaApp } from '../../server/media/createApp'

// Netlify Functions have a read-only deployment filesystem.
// Force the media store to use the persistent Netlify Blobs store.
process.env.USE_NETLIFY_BLOBS = 'true'

const app = createMediaApp()

export default async function handler(request: Request): Promise<Response> {
  return app.fetch(request)
}

export const config = {
  path: ['/api/*', '/.well-known/ai-plugin.json'],
}
