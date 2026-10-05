/** Netlify Function adapter for media API. */
import { createMediaApp } from '../../server/media/createApp'

const app = createMediaApp()

export default async function handler(request: Request): Promise<Response> {
  return app.fetch(request)
}

export const config = {
  path: ['/api/*', '/.well-known/ai-plugin.json'],
}
