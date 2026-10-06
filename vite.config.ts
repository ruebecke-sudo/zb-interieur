import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const STANDALONE_HEAD = `<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Image Manager Pro: Bilder zentral verwalten, kategorisieren und auf Websites übertragen." />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#111318" />
    <title>Image Manager Pro</title>
  </head>`

/** Neutral SaaS build: replaces the ZB Interieur head and drops the ZB Netlify forms. */
function imageManagerStandaloneHtml(): Plugin {
  return {
    name: 'image-manager-standalone-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html
        .replace(/<head>[\s\S]*?<\/head>/, STANDALONE_HEAD)
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<form[\s\S]*?<\/form>/g, ''),
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const standalone = (process.env.VITE_IMAGE_MANAGER_STANDALONE ?? env.VITE_IMAGE_MANAGER_STANDALONE) === 'true'

  return {
    plugins: [react(), tailwindcss(), ...(standalone ? [imageManagerStandaloneHtml()] : [])],
    // The ZB public folder (images, sitemap, robots, redirects) must not ship with the SaaS site.
    publicDir: standalone ? 'public-image-manager' : 'public',
    server: {
      host: '0.0.0.0',
      port: 43127,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:43128',
          changeOrigin: true,
        },
        '/.well-known/ai-plugin.json': {
          target: 'http://127.0.0.1:43128',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 43127,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:43128',
          changeOrigin: true,
        },
      },
    },
  }
})
