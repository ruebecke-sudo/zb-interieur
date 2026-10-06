import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

// VITE_IMAGE_MANAGER_STANDALONE=true builds the neutral Image Manager Pro SaaS site.
// The condition is fixed at build time, so the other app is not part of that bundle.
const loadApp = import.meta.env.VITE_IMAGE_MANAGER_STANDALONE === 'true'
  ? () => import('./ImageManagerApp')
  : () => import('./App')

void loadApp().then(({ default: App }) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
})
