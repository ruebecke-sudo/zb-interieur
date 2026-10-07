import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

// VITE_IMAGE_MANAGER_STANDALONE=true builds the neutral Image Manager Pro SaaS site.
// The condition is fixed at build time, so the other app is not part of that bundle.
const loadApp = import.meta.env.VITE_IMAGE_MANAGER_STANDALONE === 'true'
  ? () => import('./ImageManagerApp')
  : () => import('./App')

// The ZB index.html carries static SEO tags for crawlers that do not run JavaScript
// (link previews). The app renders its own per page, so drop the static ones first
// to avoid duplicate titles, descriptions and canonicals.
if (import.meta.env.VITE_IMAGE_MANAGER_STANDALONE !== 'true') {
  document.head.querySelectorAll(
    'title, meta[name="description"], meta[name="keywords"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]',
  ).forEach((tag) => tag.remove())
}

void loadApp().then(({ default: App }) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
})
