import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { ImageZoomRoot, LightboxProvider } from './ImageLightbox'
import { Seo } from './Seo'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout() {
  return (
    <LightboxProvider>
      <ImageZoomRoot>
        <div className="min-h-screen bg-white">
          <Seo />
          <a href="#main-content" className="skip-link">
            Zum Inhalt springen
          </a>
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="outline-none [&_img:not([data-no-zoom])]:cursor-zoom-in"
          >
            <Outlet />
          </main>
          <Footer />
          <WhatsAppButton />
          <ScrollRestoration />
        </div>
      </ImageZoomRoot>
    </LightboxProvider>
  )
}
