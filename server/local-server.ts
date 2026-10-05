/** Local media API server (dev + Netlify-compatible route surface). */
import { serve } from '@hono/node-server'
import { createMediaApp } from './media/createApp.js'

const port = Number(process.env.MEDIA_API_PORT || 43128)
const app = createMediaApp()

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`[media-api] listening on http://127.0.0.1:${info.port}`)
  console.log(`[media-api] auth key: ${process.env.IMAGE_MANAGER_API_KEY || 'zb-interieur-dev-key'}`)
})
